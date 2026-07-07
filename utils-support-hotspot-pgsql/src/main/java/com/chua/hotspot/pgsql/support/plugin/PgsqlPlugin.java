package com.chua.hotspot.pgsql.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.server.api.SqlMonitorApi;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.sql.DmlFormatter;
import com.chua.hotspot.core.support.utils.ClassUtils;
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
 * PostgreSQL 拦截插件
 * 拦截 org.postgresql.jdbc.PgStatement.executeInternal 方法
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.33
 */
public class PgsqlPlugin extends BytebuddyPlugin {
    private static final Map<Object, String> cacheAddress = new ConcurrentHashMap<>();

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        
        long startTime = System.currentTimeMillis();
        String sql = null;
        String address = null;
        String database = null;
        String error = null;
        
        Span span = null;
        Object call = null;
        try {
            sql = getSql(target, objects);
            address = getAddress(target);
            database = getCurrentDb(target);
            
            span = createBefore(target, method, objects, sql, address, database);
            call = NewTrackManager.invoke(callable);
        } catch (Exception e) {
            error = e.getMessage();
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            NewTrackManager.costTime(span);
            
            if (sql != null && !sql.isEmpty()) {
                String fullAddress = address != null ? address + "/" + database : database;
                SqlMonitorApi.addSqlRecord(sql, duration, error, fullAddress, database);
            }
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
            ss.setName("POSTGRESQL");
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
            // PgStatement -> connection -> PgConnection
            Object connection = ClassUtils.getObject("connection", target);
            if (connection != null) {
                // PgConnection -> queryExecutor -> PGStream -> hostSpec
                Object queryExecutor = ClassUtils.getObject("queryExecutor", connection);
                if (queryExecutor != null) {
                    Object pgStream = ClassUtils.getObject("pgStream", queryExecutor);
                    if (pgStream != null) {
                        Object hostSpec = ClassUtils.getObject("hostSpec", pgStream);
                        if (hostSpec != null) {
                            Object host = ClassUtils.getObject("host", hostSpec);
                            Object port = ClassUtils.getObject("port", hostSpec);
                            String addr = host + ":" + port;
                            cacheAddress.put(target, addr);
                            return addr;
                        }
                    }
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
        entrySpan.setProtocol("POSTGRESQL");

        return entrySpan;
    }

    private static String getCurrentDb(Object target) {
        try {
            Object connection = ClassUtils.getObject("connection", target);
            if (connection != null) {
                Method method = connection.getClass().getMethod("getCatalog");
                if (!method.isAccessible()) {
                    method.setAccessible(true);
                }
                Object result = method.invoke(connection);
                return result != null ? result.toString() : "";
            }
        } catch (Exception ignored) {
        }
        return "";
    }

    public static String getSql(Object target, Object[] args) {
        try {
            // 尝试从参数获取 SQL (CachedQuery)
            if (args != null && args.length > 0 && args[0] != null) {
                Object cachedQuery = args[0];
                Object query = ClassUtils.getObject("query", cachedQuery);
                if (query != null) {
                    Method method = query.getClass().getMethod("getNativeSql");
                    if (!method.isAccessible()) {
                        method.setAccessible(true);
                    }
                    Object result = method.invoke(query);
                    if (result != null) {
                        return result.toString();
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return "";
    }

    @Override
    public String name() {
        return "PostgreSQL";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("executeInternal"))
                .intercept(MethodDelegation.to(PgsqlPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.postgresql.jdbc.PgStatement");
    }
}
