package com.chua.hotspot.core.support.plugin.impl;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.utils.NetAddress;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * RSocket 服务插件
 * 用于检测和追踪 RSocket 服务的连接
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class RSocketPlugin extends BytebuddyPlugin {

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        BytebuddyPlugin.interceptEnter();
        try {
            sendInstance(objects);
            return callable.call();
        } catch (Exception e) {
            BytebuddyPlugin.interceptError();
            throw e;
        } finally {
            BytebuddyPlugin.interceptExit();
        }
    }

    /**
     * 发送 RSocket 服务实例
     *
     * @param objects 方法参数
     */
    private static void sendInstance(Object[] objects) {
        try {
            if (objects == null || objects.length == 0) {
                return;
            }

            // 获取连接地址信息
            String addressString = objects[0].toString().toLowerCase();
            NetAddress netAddress = NetAddress.of(addressString);
            
            ServiceInstance ss = new ServiceInstance();
            ss.setName("RSOCKET");
            ss.setSourceName("HOST");
            ss.setSourceHost(ReportFactory.APP_HOST);
            ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            ss.setTargetHost(netAddress.getHost());
            ss.setTargetPort(netAddress.getPort());
            
            ReportFactory.sendServiceInstance(ss);
            System.out.println("[INFO] 检测到 RSocket 服务连接: " + addressString);
        } catch (Exception e) {
            System.err.println("[DEBUG] RSocket 服务检测失败: " + e.getMessage());
        }
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(
            DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("connect"))
                .intercept(MethodDelegation.to(RSocketPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("io.rsocket.RSocketConnector");
    }

    @Override
    public String name() {
        return "RSocket";
    }
}
