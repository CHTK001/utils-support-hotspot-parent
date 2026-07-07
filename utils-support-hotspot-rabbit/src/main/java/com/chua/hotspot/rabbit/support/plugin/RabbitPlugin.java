package com.chua.hotspot.rabbit.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
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
 * RabbitMQ 连接拦截插件
 * 拦截 ConnectionFactory 的 setHost/setPort 方法，用于服务发现
 *
 * @author CH
 * @since 2024/11/12
 * @version 4.0.0.34
 */
public class RabbitPlugin extends BytebuddyPlugin {

    private static String globalHost;
    private static Integer globalPort;

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
            // 被拦截的目标对象 （动态生成的目标对象）
            @This Object target,
            // 正在执行的方法Method 对象（目标对象父类的Method）
            @Origin Method method,
            // 正在执行的方法的全部参数
            @AllArguments Object[] objects,
            // 目标对象的一个代理
            @Super Object delegate,
            // 方法的调用者对象 对原始方法的调用依靠它
            @SuperCall Callable<?> callable) throws Exception {

        Object call = callable.call();
        try {
            String name = method.getName();
            if ("setHost".equals(name)) {
                globalHost = String.valueOf(objects[0]);
            }

            if ("setPort".equals(name)) {
                globalPort = (Integer) objects[0];
            }

            if (null != globalHost && null != globalPort) {
                ServiceInstance serviceInstance = new ServiceInstance();
                serviceInstance.setName("RABBIT");
                serviceInstance.setSourceHost(ReportFactory.APP_HOST);
                serviceInstance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                serviceInstance.setTargetHost(globalHost);
                serviceInstance.setTargetPort(globalPort);
                ReportFactory.sendServiceInstance(serviceInstance);
            }
        } catch (Exception ignored) {
        }
        return call;
    }

    @Override
    public String name() {
        return "Rabbit";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("setPort").or(ElementMatchers.named("setHost"))).intercept(MethodDelegation.to(RabbitPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.rabbitmq.client.ConnectionFactory");
    }

}
