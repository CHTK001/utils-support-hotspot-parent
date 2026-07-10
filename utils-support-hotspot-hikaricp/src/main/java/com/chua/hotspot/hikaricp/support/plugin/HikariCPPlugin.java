package com.chua.hotspot.hikaricp.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

/**
 * HikariCP 连接池拦截插件
 * <p>
 * 拦截 HikariPool.getConnection 和 HikariPool.evictConnection，
 * 监控连接获取耗时、连接池状态和数据库实例上报。
 * </p>
 * <p>
 * 使用 Advice + Spy 模式替代 MethodDelegation 模式，解决 ClassLoader 可见性问题。
 * </p>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.40
 */
public class HikariCPPlugin extends BytebuddyPlugin {

    @Override
    public boolean useLegacyMethodDelegation() {
        return false;
    }

    @Override
    public ElementMatcher<? super MethodDescription> methodMatcher() {
        return ElementMatchers.named("getConnection")
                .or(ElementMatchers.named("evictConnection"));
    }

    @Override
    public String name() {
        return "HikariCP";
    }

    @Override
    public boolean matches(String className) {
        return className.contains("HikariPool") || className.contains("HikariDataSource");
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.zaxxer.hikari.pool.HikariPool")
                .or(ElementMatchers.named("com.zaxxer.hikari.HikariDataSource"));
    }

    @Override
    public void spyBefore(String className, String methodName, Object target, Object[] args) {
        super.spyBefore(className, methodName, target, args);
        try {
            Span span = NewTrackManager.createEntrySpan(args);
            if (span != null) {
                span.setTypeName(className);
                span.setMethod(methodName);
                span.setCategory("DATABASE");
                span.setProtocol("JDBC");

                // 提取连接池配置信息
                String poolName = getPoolName(target);
                String jdbcUrl = getJdbcUrl(target);
                span.setDescription("HikariCP." + methodName + ": pool=" + poolName + ", url=" + jdbcUrl);

                getSpyContext().userData = new Object[]{span, poolName, jdbcUrl};
            }
        } catch (Exception e) {
            logFactory.debug("HikariCPPlugin spyBefore 异常: {}", e.getMessage());
        }
    }

    @Override
    public void spyAfter(String className, String methodName, Object target, Object[] args, Object result) {
        try {
            SpyContext ctx = getSpyContext();
            if (ctx != null && ctx.userData instanceof Object[]) {
                Object[] data = (Object[]) ctx.userData;
                Span span = (Span) data[0];
                String poolName = (String) data[1];
                String jdbcUrl = (String) data[2];

                // 上报数据库服务实例
                if (jdbcUrl != null && !jdbcUrl.isEmpty()) {
                    reportDatabaseInstance(jdbcUrl, poolName);
                }
                NewTrackManager.costTime(span);
            }
        } catch (Exception e) {
            logFactory.debug("HikariCPPlugin spyAfter 异常: {}", e.getMessage());
        }
        super.spyAfter(className, methodName, target, args, result);
    }

    @Override
    public void spyError(String className, String methodName, Object target, Object[] args, Throwable error) {
        try {
            SpyContext ctx = getSpyContext();
            if (ctx != null && ctx.userData instanceof Object[]) {
                Span span = (Span) ((Object[]) ctx.userData)[0];
                span.setError(error.getMessage());
                NewTrackManager.costTime(span);
            }
        } catch (Exception e) {
            logFactory.debug("HikariCPPlugin spyError 异常: {}", e.getMessage());
        }
        super.spyError(className, methodName, target, args, error);
    }

    /**
     * 获取连接池名称
     */
    private String getPoolName(Object target) {
        try {
            Object poolName = ClassUtils.getObject("poolName", target);
            return poolName != null ? poolName.toString() : "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * 获取JDBC URL
     */
    private String getJdbcUrl(Object target) {
        try {
            // HikariPool -> poolConfig -> jdbcUrl
            Object poolConfig = ClassUtils.getObject("poolConfig", target);
            if (poolConfig != null) {
                Object jdbcUrl = ClassUtils.getObject("jdbcUrl", poolConfig);
                if (jdbcUrl != null) {
                    return jdbcUrl.toString();
                }
            }
            // HikariDataSource -> jdbcUrl
            Object jdbcUrl = ClassUtils.getObject("jdbcUrl", target);
            return jdbcUrl != null ? jdbcUrl.toString() : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 上报数据库服务实例
     */
    private void reportDatabaseInstance(String jdbcUrl, String poolName) {
        try {
            // 从JDBC URL提取主机和端口
            // 格式: jdbc:mysql://host:port/db 或 jdbc:postgresql://host:port/db
            String host = null;
            int port = 0;

            int hostStart = jdbcUrl.indexOf("://");
            if (hostStart > 0) {
                String afterProto = jdbcUrl.substring(hostStart + 3);
                int slashIdx = afterProto.indexOf('/');
                int qIdx = afterProto.indexOf('?');
                int endIdx = slashIdx > 0 ? slashIdx : (qIdx > 0 ? qIdx : afterProto.length());
                String hostPort = afterProto.substring(0, endIdx);
                int colonIdx = hostPort.indexOf(':');
                if (colonIdx > 0) {
                    host = hostPort.substring(0, colonIdx);
                    port = Integer.parseInt(hostPort.substring(colonIdx + 1));
                } else {
                    host = hostPort;
                }
            }

            if (host != null) {
                ServiceInstance instance = new ServiceInstance();
                instance.setName("DATABASE-" + poolName);
                instance.setSourceHost(ReportFactory.APP_HOST);
                instance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                instance.setTargetHost(host);
                instance.setTargetPort(port);
                ReportFactory.sendServiceInstance(instance);
            }
        } catch (Exception e) {
            logFactory.debug("HikariCP 上报数据库实例失败: {}", e.getMessage());
        }
    }
}