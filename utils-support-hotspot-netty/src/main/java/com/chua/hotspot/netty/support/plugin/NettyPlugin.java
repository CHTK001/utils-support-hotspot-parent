package com.chua.hotspot.netty.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.utils.NetUtils;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.concurrent.Callable;

/**
 * Netty 服务绑定拦截插件
 * 拦截 AbstractBootstrap.bind 方法，用于服务发现
 *
 * @author CH
 * @since 2024/11/12
 * @version 4.0.0.34
 */
public class NettyPlugin extends BytebuddyPlugin {

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

        try {
            return callable.call();
        } finally {
            try {
                InetSocketAddress inetSocketAddress = (InetSocketAddress) objects[0];
                com.chua.hotspot.core.support.server.ServiceInstance serviceInstance = new ServiceInstance();
                serviceInstance.setName("NETTY");
                serviceInstance.setSourceHost(ReportFactory.APP_HOST);
                serviceInstance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                serviceInstance.setTargetHost(NetUtils.isLocalHost(inetSocketAddress.getHostString()) ? "127.0.0.1" : inetSocketAddress.getHostString());
                serviceInstance.setTargetPort(inetSocketAddress.getPort());
                ReportFactory.sendServiceInstance(serviceInstance);
            } catch (Throwable ignored) {
            }
        }
    }

    @Override
    public String name() {
        return "Netty";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("bind")
                        .and(ElementMatchers.takesArgument(0, ElementMatchers.named(SocketAddress.class.getTypeName())))
                )
                .intercept(MethodDelegation.to(NettyPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("io.netty.bootstrap.AbstractBootstrap"));
    }

}
