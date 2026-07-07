package com.chua.hotspot.dragonfly.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * Dragonfly Socket 创建拦截插件
 * 拦截 DefaultJedisSocketFactory.createSocket 方法
 * <p>
 * Dragonfly 完全兼容 Redis 协议，使用 Jedis 客户端连接
 * </p>
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.33
 */
public class DragonflyPlugin extends BytebuddyPlugin {
    
    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        
        // 提取连接信息用于链路追踪
        String host = null;
        Integer port = null;
        try {
            Object hostAndPort = ClassUtils.getObject("hostAndPort", target);
            if (hostAndPort != null) {
                host = (String) ClassUtils.getObject("host", hostAndPort);
                port = (Integer) ClassUtils.getObject("port", hostAndPort);
            }
        } catch (Exception ignored) {
        }
        
        // 创建链路追踪 Span
        Span span = NewTrackManager.createEntrySpan(objects);
        span.setTypeName(target.getClass().getName());
        span.setMethod(method.getName());
        span.setDescription("Dragonfly createSocket: " + (host != null ? host + ":" + port : "unknown"));
        span.setCategory("DRAGONFLY");
        span.setProtocol("DRAGONFLY");
        
        try {
            Object result = NewTrackManager.invoke(callable);
            
            // 提取并报告 Dragonfly 连接信息
            extractAndReportConnection(target, host, port);
            
            return result;
        } catch (Exception e) {
            span.setError(e.getMessage());
            throw e;
        } finally {
            NewTrackManager.costTime(span);
        }
    }
    
    /**
     * 提取并报告 Dragonfly 连接信息
     */
    private static void extractAndReportConnection(Object target, String host, Integer port) {
        try {
            if (host != null && port != null) {
                ServiceInstance ss = new ServiceInstance();
                ss.setName("DRAGONFLY");
                ss.setSourceHost(ReportFactory.APP_HOST);
                ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                ss.setTargetHost(host);
                ss.setTargetPort(port);
                ReportFactory.sendServiceInstance(ss);
            }
        } catch (Exception ignored) {
        }
    }

    @Override
    public String name() {
        return "Dragonfly-Socket";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("createSocket")).intercept(MethodDelegation.to(DragonflyPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("redis.clients.jedis.DefaultJedisSocketFactory");
    }
}
