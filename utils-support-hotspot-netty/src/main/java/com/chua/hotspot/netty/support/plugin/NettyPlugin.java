package com.chua.hotspot.netty.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.utils.NetUtils;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.net.InetSocketAddress;
import java.net.SocketAddress;

/**
 * Netty 服务绑定拦截插件（Spy 模式）
 * 拦截 AbstractBootstrap.bind 方法，用于服务发现
 *
 * @author CH
 * @since 2024/11/12
 * @version 4.0.0.37
 */
public class NettyPlugin extends BytebuddyPlugin {

    @Override
    public boolean useLegacyMethodDelegation() {
        return false;
    }

    @Override
    public String name() {
        return "Netty";
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("io.netty.bootstrap.AbstractBootstrap"));
    }

    @Override
    public ElementMatcher<? super MethodDescription> methodMatcher() {
        return ElementMatchers.named("bind")
                .and(ElementMatchers.takesArgument(0, ElementMatchers.named(SocketAddress.class.getTypeName())));
    }

    /**
     * Spy 后置回调 - 在 bind 方法正常返回后捕获服务信息
     */
    @Override
    public void spyAfter(String className, String methodName, Object target, Object[] args, Object result) {
        try {
            if (args != null && args.length > 0 && args[0] instanceof InetSocketAddress) {
                InetSocketAddress inetSocketAddress = (InetSocketAddress) args[0];
                ServiceInstance serviceInstance = new ServiceInstance();
                serviceInstance.setName("NETTY");
                serviceInstance.setSourceHost(ReportFactory.APP_HOST);
                serviceInstance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                serviceInstance.setTargetHost(NetUtils.isLocalHost(inetSocketAddress.getHostString()) ? "127.0.0.1" : inetSocketAddress.getHostString());
                serviceInstance.setTargetPort(inetSocketAddress.getPort());
                ReportFactory.sendServiceInstance(serviceInstance);
            }
        } catch (Throwable ignored) {
        }
        super.spyAfter(className, methodName, target, args, result);
    }
}