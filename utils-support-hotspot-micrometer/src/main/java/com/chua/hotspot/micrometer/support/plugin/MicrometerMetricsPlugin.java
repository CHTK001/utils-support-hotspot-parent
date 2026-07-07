package com.chua.hotspot.micrometer.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * Micrometer Metrics 监控插件
 * 监控 Micrometer MeterRegistry 的指标注册
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class MicrometerMetricsPlugin extends BytebuddyPlugin {
    
    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] args,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        
        try {
            Object result = callable.call();
            
            // Extract metrics information
            if (args.length > 0 && args[0] != null) {
                String meterType = args[0].getClass().getSimpleName();
                String metricInfo = extractMetricInfo(args[0]);
                
                logFactory.debug("Micrometer 指标注册: {} - {}", meterType, metricInfo);
                
                // Report as ServiceInstance for visualization
                reportMetricAsService(meterType, metricInfo);
            }
            
            return result;
        } catch (Exception e) {
            logFactory.error("Micrometer 指标监控失败", e);
            throw e;
        }
    }
    
    /**
     * Extract metric information from Meter object
     */
    private static String extractMetricInfo(Object meter) {
        try {
            Method getIdMethod = meter.getClass().getMethod("getId");
            Object id = getIdMethod.invoke(meter);
            
            if (id != null) {
                Method getNameMethod = id.getClass().getMethod("getName");
                return (String) getNameMethod.invoke(id);
            }
        } catch (Exception e) {
            // Ignore
        }
        return "unknown";
    }
    
    /**
     * Report metric as ServiceInstance for monitoring
     */
    private static void reportMetricAsService(String meterType, String metricName) {
        try {
            ServiceInstance serviceInstance = new ServiceInstance();
            serviceInstance.setName("Micrometer-" + meterType);
            serviceInstance.setSourceName("Micrometer");
            serviceInstance.setSourceHost(ReportFactory.APP_HOST);
            serviceInstance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            serviceInstance.setTargetHost("metrics");
            serviceInstance.setTargetPort(0);
            
            ReportFactory.sendServiceInstance(serviceInstance);
        } catch (Exception e) {
            logFactory.debug("上报 Micrometer 指标失败: {}", e.getMessage());
        }
    }
    
    @Override
    public String name() {
        return "Micrometer-Metrics";
    }
    
    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("register")
                .or(ElementMatchers.named("counter"))
                .or(ElementMatchers.named("gauge"))
                .or(ElementMatchers.named("timer")))
                .intercept(MethodDelegation.to(MicrometerMetricsPlugin.class));
    }
    
    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("io.micrometer.core.instrument.MeterRegistry"));
    }
}
