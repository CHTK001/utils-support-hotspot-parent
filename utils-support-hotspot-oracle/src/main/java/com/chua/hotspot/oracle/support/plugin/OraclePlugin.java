package com.chua.hotspot.oracle.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.server.api.SqlMonitorApi;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.sql.DmlFormatter;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.FastMethodHelper;
import com.chua.hotspot.core.support.utils.NetAddress;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Oracle 拦截插件
 * 拦截 oracle.jdbc.driver.OraclePreparedStatement.executeInternal 方法
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.33
 */
public class OraclePlugin extends BytebuddyPlugin {
    private static final Map<Object, String> cacheAddress = new ConcurrentHashMap<>();

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        
        BytebuddyPlugin.interceptEnter();
        long startTime = System.currentTimeMillis();
        String sql = null;
        String address = null;
        String database = null;
        String error = null;
        
        Span span = null;
        Object call = null;
        try {
            sql = getSql(target);
            address = getAddress(target);
            database = getCurrentDb(target);
            
            span = createBefore(target, method, objects, sql, address, database);
            call = NewTrackManager.invoke(callable);
        } catch (Exception e) {
            error = e.getMessage();
            BytebuddyPlugin.interceptError();
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            NewTrackManager.costTime(span);
            
            if (sql != null && !sql.isEmpty()) {
                String fullAddress = address != null ? address + "/" + database : database;
                SqlMonitorApi.addSqlRecord(sql, duration, error, fullAddress, database);
            }
            BytebuddyPlugin.interceptExit();
        }
        return call;
    }

    private static Span createBefore(Object target, Method method, Object[] objects, String sql, String address, String database) {
        try {
            publishServer(address);
            String fullAddress = address + "/" + database;
            return createSpan(target, database, method, sql, fullAddress, objects);
        } catch (Exception ignored) {
        }
        return null;
    }

    private static void publishServer(String address) {
        try {
            NetAddress netAddress = NetAddress.of(address);
            ServiceInstance ss = new ServiceInstance();
            ss.setName("ORACLE");
            ss.setSourceHost(ReportFactory.APP_HOST);
            ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            ss.setTargetHost(netAddress.getHost());
            ss.setTargetPort(netAddress.getPort());
            ReportFactory.sendServiceInstance(ss);
        } catch (Exception ignored) {
        }
    }

    private static String getAddress(Object target) {
        if (cacheAddress.size() > 100) {
            cacheAddress.clear();
        }

        if (null == target) {
            return null;
        }

        if (cacheAddress.containsKey(target)) {
            return cacheAddress.get(target);
        }

        try {
            // OraclePreparedStatement -> connection -> OracleConnection
            Object connection = ClassUtils.getObject("connection", target);
            if (connection != null) {
                // 获取 URL 解析地址
                String url = FastMethodHelper.invokeString(connection, "getURL");
                // jdbc:oracle:thin:@//host:port/service 或 jdbc:oracle:thin:@host:port:sid
                if (url != null) {
                    String addr = parseOracleUrl(url);
                    if (addr != null) {
                        cacheAddress.put(target, addr);
                        return addr;
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    /**
     * 解析 Oracle JDBC URL 获取主机和端口
     */
    private static String parseOracleUrl(String url) {
        try {
            // jdbc:oracle:thin:@//host:port/service
            if (url.contains("@//")) {
                String part = url.substring(url.indexOf("@//") + 3);
                int slashIndex = part.indexOf("/");
                if (slashIndex > 0) {
                    return part.substring(0, slashIndex);
                }
                return part;
            }
            // jdbc:oracle:thin:@host:port:sid
            if (url.contains("@")) {
                String part = url.substring(url.indexOf("@") + 1);
                String[] parts = part.split(":");
                if (parts.length >= 2) {
                    return parts[0] + ":" + parts[1];
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private static Span createSpan(Object target, String currentDb, Method method, String sql, String address, Object[] objects) {
        Span entrySpan = NewTrackManager.createEntrySpan(objects);
        NewTrackManager.doRefreshSpan(target, method, objects, entrySpan);
        
        String format = new DmlFormatter().format(sql);
        List<String> stack = new LinkedList<>();
        stack.add(format);
        
        entrySpan.setFrom(currentDb);
        entrySpan.setDescription(sql);
        entrySpan.setTips(stack);
        entrySpan.setMethod(method.getName());
        entrySpan.setCategory("SQL");
        entrySpan.setProtocol("ORACLE");

        return entrySpan;
    }

    private static String getCurrentDb(Object target) {
        try {
            Object connection = ClassUtils.getObject("connection", target);
            if (connection != null) {
                // Oracle 使用 schema 作为数据库
                String result = FastMethodHelper.invokeString(connection, "getCurrentSchema");
                return result != null ? result : "";
            }
        } catch (Exception ignored) {
        }
        return "";
    }

    public static String getSql(Object target) {
        try {
            // OraclePreparedStatement 的 originalSql 字段
            Object sql = ClassUtils.getObject("originalSql", target);
            if (sql != null) {
                return sql.toString();
            }
            // 备选方案：调用 getOriginalSql 方法
            String result = FastMethodHelper.invokeString(target, "getOriginalSql");
            return result != null ? result : "";
        } catch (Exception ignored) {
        }
        return "";
    }

    @Override
    public String name() {
        return "Oracle";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("executeInternal"))
                .intercept(MethodDelegation.to(OraclePlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("oracle.jdbc.driver.OraclePreparedStatement");
    }
}
