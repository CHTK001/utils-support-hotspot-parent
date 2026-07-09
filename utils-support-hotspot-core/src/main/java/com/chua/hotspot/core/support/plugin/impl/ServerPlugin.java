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
import java.sql.Driver;
import java.util.concurrent.Callable;

/**
 * 服务端插件
 *
 * @author CH
 */
public class ServerPlugin extends BytebuddyPlugin {

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
     * 发送服务
     *
     * @param objects
     */
    private static void sendInstance(Object[] objects) {
        try {
            String string = objects[0].toString().toLowerCase();
            NetAddress netAddress = NetAddress.of(string);
            ServiceInstance ss = new ServiceInstance();
            ss.setName(getName(string).toUpperCase());
            ss.setSourceName("HOST");
            ss.setSourceHost(ReportFactory.APP_HOST);
            ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            ss.setTargetHost(netAddress.getHost());
            ss.setTargetPort(netAddress.getPort());
            ReportFactory.sendServiceInstance(ss);
        } catch (Exception ignored) {
        }
    }

    private static String getName(String string) {
        if (string.contains("mysql")) {
            return "mysql";
        }
        if (string.contains("oracle")) {
            return "oracle";
        }
        return "jdbc";
    }


    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("connect")).intercept(MethodDelegation.to(ServerPlugin.class));
    }


    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named(Driver.class.getName()));
    }

    @Override
    public String name() {
        return "Driver";
    }


}
