package com.chua.hotspot.nacos.support.plugin;

import com.alibaba.nacos.api.naming.pojo.Instance;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * Nacos 服务注册监控插件
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class NacosNamingPlugin extends BytebuddyPlugin {
    
    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] args,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        
        String serviceName = args.length > 0 ? String.valueOf(args[0]) : "unknown";
        
        // 创建链路追踪 Span
        Span span = NewTrackManager.createEntrySpan(args);
        span.setTypeName(target.getClass().getName());
        span.setMethod(method.getName());
        span.setDescription("Nacos registerInstance: " + serviceName);
        span.setCategory("NACOS");
        span.setProtocol("NACOS");
        
        try {
            Object result = NewTrackManager.invoke(callable);
            
            // Extract ServiceInstance information from Nacos Instance
            extractAndReportServiceInstance(args);
            
            return result;
        } catch (Exception e) {
            span.setError(e.getMessage());
            throw e;
        } finally {
            NewTrackManager.costTime(span);
        }
    }
    
    /**
     * Extract ServiceInstance from Nacos registerInstance arguments
     */
    private static void extractAndReportServiceInstance(Object[] args) {
        try {
            String serviceName = null;
            String ip = null;
            int port = -1;
            
            // Parse arguments based on different overload signatures
            if (args.length >= 3 && args[2] instanceof Instance) {
                // registerInstance(String serviceName, String groupName, Instance instance)
                serviceName = String.valueOf(args[0]);
                Instance instance = (Instance) args[2];
                ip = instance.getIp();
                port = instance.getPort();
            } else if (args.length >= 2 && args[1] instanceof Instance) {
                // registerInstance(String serviceName, Instance instance)
                serviceName = String.valueOf(args[0]);
                Instance instance = (Instance) args[1];
                ip = instance.getIp();
                port = instance.getPort();
            } else if (args.length >= 3 && args[1] instanceof String && args[2] instanceof Integer) {
                // registerInstance(String serviceName, String ip, int port)
                serviceName = String.valueOf(args[0]);
                ip = (String) args[1];
                port = (Integer) args[2];
            }
            
            if (serviceName != null && ip != null && port > 0) {
                ServiceInstance serviceInstance = new ServiceInstance();
                serviceInstance.setName("Nacos-" + serviceName);
                serviceInstance.setSourceName("Nacos");
                serviceInstance.setSourceHost(ReportFactory.APP_HOST);
                serviceInstance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                serviceInstance.setTargetHost(ip);
                serviceInstance.setTargetPort(port);
                
                ReportFactory.sendServiceInstance(serviceInstance);
                logFactory.debug("Nacos 服务实例已上报: {}:{}:{}", serviceName, ip, port);
            }
        } catch (Exception e) {
            logFactory.debug("提取 Nacos 服务实例信息失败: {}", e.getMessage());
        }
    }
    
    @Override
    public String name() {
        return "Nacos-Naming";
    }
    
    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("registerInstance"))
                .intercept(MethodDelegation.to(NacosNamingPlugin.class));
    }
    
    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.alibaba.nacos.client.naming.NacosNamingService")
                .or(ElementMatchers.hasSuperType(ElementMatchers.named("com.alibaba.nacos.api.naming.NamingService")));
    }
}
