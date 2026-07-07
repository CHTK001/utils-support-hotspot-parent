package com.chua.hotspot.mysql.support.plugin;

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
 * @author CH
 */
public class MysqlPlugin extends BytebuddyPlugin {
    private static final Map<Object, String> cacheAddress = new ConcurrentHashMap<>();

    /**
     * 将返回值转换成具体的方法返回值类型,加了这个注解 intercept 方法才会被执行
     *
     * @param target   目标
     * @param method   方法
     * @param objects  参数
     * @param delegate 目标对象的一个代理
     * @param callable 方法的调用者对象
     * @return 结果
     * @throws Exception ex
     */
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
            // 获取 SQL 信息
            sql = getSql(target);
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
            
            // 推送 SQL 记录到 WebSocket
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
            ss.setName("MYSQL");
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
            Object session = ClassUtils.getObject("session", target);
            Object hostinfo = ClassUtils.getObject("hostInfo", session);
            Object host = ClassUtils.getObject("host", hostinfo);
            Object port = ClassUtils.getObject("port", hostinfo);

            cacheAddress.put(session, host + ":" + port);
            return host + ":" + port;
        } catch (Exception ignored) {
        }
        return null;
    }

    /**
     * 创建跨度
     * 发送到链路
     *
     * @param method    method
     * @param sql       sql
     * @param target    目标
     * @param currentDb 电流db
     * @param address   住址
     * @param objects   对象
     * @return {@link Span}
     */
    private static Span createSpan(Object target, String currentDb, Method method, String sql, String address, Object[] objects) {
        // 使用 NewTrackManager 创建 Span，确保写入 SPAN_STACK
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
        entrySpan.setProtocol("MYSQL");

        return entrySpan;
    }

    /**
     * 当前数据库
     *
     * @param cls 连接
     * @return 数据库
     */
    private static String getCurrentDb(Object cls) {
        try {
            Method method = cls.getClass().getMethod("getCurrentDatabase");
            if (!method.isAccessible()) {
                method.setAccessible(true);
            }
            return method.invoke(cls).toString();
        } catch (Exception ignored) {
        }
        return "";
    }

    /**
     * 获取sql
     *
     * @param cls 对象
     * @return sql
     */
    public static String getSql(Object cls) {
        try {
            Method method = cls.getClass().getMethod("asSql");
            if (!method.isAccessible()) {
                method.setAccessible(true);
            }
            return method.invoke(cls).toString();
        } catch (Exception ignored) {
        }
        return "";
    }

    @Override
    public String name() {
        return "Mysql";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("fillSendPacket")
                        .and(ElementMatchers.takesArgument(0, ElementMatchers.named("com.mysql.cj.QueryBindings"))))
                .intercept(MethodDelegation.to(MysqlPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.mysql.cj.AbstractPreparedQuery");
    }
}
