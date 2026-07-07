package com.chua.hotspot.zookeeper.plugin;

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
import java.net.InetSocketAddress;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * zookeeper连接
 *
 * @author CH
 * @since 2024/11/12
 */
public class ZookeeperPlugin extends BytebuddyPlugin {

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
        List<InetSocketAddress> addressList = (List<InetSocketAddress>) call;
        for (InetSocketAddress inetSocketAddress : addressList) {
            ServiceInstance serviceInstance = new ServiceInstance();
            serviceInstance.setName("ZOOKEEPER");
            serviceInstance.setSourceHost(ReportFactory.APP_HOST);
            try {
                serviceInstance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            } catch (Exception ignored) {
            }
            serviceInstance.setTargetHost(inetSocketAddress.getHostString());
            serviceInstance.setTargetPort(inetSocketAddress.getPort());
            ReportFactory.sendServiceInstance(serviceInstance);
        }
        return call;
    }

    @Override
    public String name() {
        return "Zookeeper";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("getServerAddresses")).intercept(MethodDelegation.to(ZookeeperPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.zookeeper.client.ConnectStringParser");
    }

}
