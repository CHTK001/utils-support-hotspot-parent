package com.chua.hotspot.mysql.support.plugin;

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
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * MySQL PreparedStatement 拦截插件
 * <p>
 * 拦截 com.mysql.cj.AbstractPreparedQuery.fillSendPacket 方法，
 * 实现 SQL 执行的链路追踪和性能监控。
 * 使用 Advice + Spy 模式，避免 MethodDelegation 的 ClassLoader 可见性问题。
 * </p>
 *
 * @author CH
 * @version 4.0.0.40
 */
public class MysqlPlugin extends BytebuddyPlugin {
    private static final Map<Object, String> cacheAddress = new ConcurrentHashMap<>();

    // ==================== Advice + Spy 模式配置 ====================

    @Override
    public String name() {
        return "Mysql";
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.mysql.cj.AbstractPreparedQuery");
    }

    @Override
    public ElementMatcher<? super MethodDescription> methodMatcher() {
        return ElementMatchers.named("fillSendPacket")
                .and(ElementMatchers.takesArgument(0, ElementMatchers.named("com.mysql.cj.QueryBindings")));
    }

    @Override
    public boolean useLegacyMethodDelegation() {
        return false;
    }

    // ==================== Spy 回调实现 ====================

    @Override
    public void spyBefore(String className, String methodName, Object target, Object[] args) {
        super.spyBefore(className, methodName, target, args);
        try {
            String sql = getSql(target);
            String address = getAddress(target);
            String database = getCurrentDb(target);

            Span span = createBefore(target, methodName, args, sql, address, database);
            SpyContext spyCtx = getSpyContext();
            if (spyCtx != null) {
                spyCtx.span = span;
            }
        } catch (Exception e) {
            // 忽略，非关键异常
        }
    }

    @Override
    public void spyAfter(String className, String methodName, Object target, Object[] args, Object result) {
        try {
            SpyContext spyCtx = getSpyContext();
            if (spyCtx != null) {
                Span span = spyCtx.span;
                long duration = System.currentTimeMillis() - (spyCtx.startNanos / 1_000_000);
                NewTrackManager.costTime(span);

                // 推送 SQL 记录到 WebSocket
                String sql = getSql(target);
                String address = getAddress(target);
                String database = getCurrentDb(target);
                if (sql != null && !sql.isEmpty()) {
                    String fullAddress = address != null ? address + "/" + database : database;
                    SqlMonitorApi.addSqlRecord(sql, duration, null, fullAddress, database);
                }
            }
        } catch (Exception e) {
            // 忽略，非关键异常
        }
        super.spyAfter(className, methodName, target, args, result);
    }

    @Override
    public void spyError(String className, String methodName, Object target, Object[] args, Throwable throwable) {
        try {
            SpyContext spyCtx = getSpyContext();
            if (spyCtx != null) {
                Span span = spyCtx.span;
                long duration = System.currentTimeMillis() - (spyCtx.startNanos / 1_000_000);
                NewTrackManager.costTime(span);

                // 推送 SQL 记录到 WebSocket（带错误信息）
                String sql = getSql(target);
                String address = getAddress(target);
                String database = getCurrentDb(target);
                if (sql != null && !sql.isEmpty()) {
                    String fullAddress = address != null ? address + "/" + database : database;
                    String error = throwable != null ? throwable.getMessage() : null;
                    SqlMonitorApi.addSqlRecord(sql, duration, error, fullAddress, database);
                }
            }
        } catch (Exception e) {
            // 忽略，非关键异常
        }
        super.spyError(className, methodName, target, args, throwable);
    }

    // ==================== 辅助方法 ====================

    private Span createBefore(Object target, String methodName, Object[] objects, String sql, String address, String database) {
        try {
            publishServer(address);
            String fullAddress = address + "/" + database;
            Method method = findMethod(target, methodName, objects);
            return createSpan(target, database, method, sql, fullAddress, objects);
        } catch (Exception e) {
            // 忽略，非关键异常
        }
        return null;
    }

    private void publishServer(String address) {
        try {
            NetAddress netAddress = NetAddress.of(address);
            ServiceInstance ss = new ServiceInstance();
            ss.setName("MYSQL");
            ss.setSourceHost(ReportFactory.APP_HOST);
            ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            ss.setTargetHost(netAddress.getHost());
            ss.setTargetPort(netAddress.getPort());
            ReportFactory.sendServiceInstance(ss);
        } catch (Exception e) {
            // 忽略，非关键异常
        }
    }

    private String getAddress(Object target) {
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
        } catch (Exception e) {
            // 忽略，非关键异常
        }
        return null;
    }

    /**
     * 创建跨度
     *
     * @param target    目标
     * @param currentDb 当前数据库
     * @param method    方法
     * @param sql       SQL语句
     * @param address   地址
     * @param objects   参数
     * @return Span
     */
    private Span createSpan(Object target, String currentDb, Method method, String sql, String address, Object[] objects) {
        Span entrySpan = NewTrackManager.createEntrySpan(objects);
        NewTrackManager.doRefreshSpan(target, method, objects, entrySpan);

        String format = new DmlFormatter().format(sql);
        List<String> stack = new LinkedList<>();
        stack.add(format);

        entrySpan.setFrom(currentDb);
        entrySpan.setDescription(sql);
        entrySpan.setTips(stack);
        entrySpan.setMethod(method != null ? method.getName() : "fillSendPacket");
        entrySpan.setCategory("SQL");
        entrySpan.setProtocol("MYSQL");

        return entrySpan;
    }

    /**
     * 当前数据库
     */
    private static String getCurrentDb(Object cls) {
        String result = FastMethodHelper.invokeString(cls, "getCurrentDatabase");
        return result != null ? result : "";
    }

    /**
     * 获取SQL
     */
    public static String getSql(Object cls) {
        String result = FastMethodHelper.invokeString(cls, "asSql");
        return result != null ? result : "";
    }

    /**
     * 从目标对象查找方法
     */
    private Method findMethod(Object target, String methodName, Object[] args) {
        if (target == null) return null;
        for (Method m : target.getClass().getMethods()) {
            if (m.getName().equals(methodName)) {
                return m;
            }
        }
        return null;
    }
}