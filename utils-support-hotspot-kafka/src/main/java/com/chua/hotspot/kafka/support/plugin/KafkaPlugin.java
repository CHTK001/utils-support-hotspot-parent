package com.chua.hotspot.kafka.support.plugin;

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
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

/**
 * Kafka 连接拦截插件
 * 拦截 AbstractConfig 方法，用于获取 Kafka 连接信息并上报服务实例
 *
 * @author CH
 * @since 2024/11/12
 * @version 4.0.0.34
 */
public class KafkaPlugin extends BytebuddyPlugin {

    // ==================== 常量定义 ====================

    /**
     * 服务名称
     */
    private static final String SERVICE_NAME = "KAFKA";

    /**
     * Kafka 配置键
     */
    private static final String BOOTSTRAP_SERVERS_KEY = "bootstrap.servers";

    // ==================== 拦截方法 ====================

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

        Object result = callable.call();
        extractAndReportKafkaServers(objects);
        return result;
    }

    // ==================== 私有方法 ====================

    /**
     * 提取并上报 Kafka 服务器信息
     *
     * @param objects 方法参数
     */
    @SuppressWarnings("unchecked")
    private static void extractAndReportKafkaServers(Object[] objects) {
        try {
            if (objects.length != 1 || !(objects[0] instanceof Map)) {
                return;
            }
            Map<String, Object> configMap = (Map<String, Object>) objects[0];
            List<String> servers = (List<String>) configMap.get(BOOTSTRAP_SERVERS_KEY);
            if (servers == null || servers.isEmpty()) {
                return;
            }
            for (String server : servers) {
                reportServiceInstance(server);
            }
        } catch (Exception ignored) {
            // 忽略解析异常
        }
    }

    /**
     * 上报服务实例信息
     *
     * @param serverAddress Kafka 服务器地址
     */
    private static void reportServiceInstance(String serverAddress) {
        try {
            NetAddress netAddress = NetAddress.of(serverAddress);
            ServiceInstance instance = new ServiceInstance();
            instance.setName(SERVICE_NAME);
            instance.setSourceHost(ReportFactory.APP_HOST);
            instance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            instance.setTargetHost(netAddress.getHost());
            instance.setTargetPort(netAddress.getPort());
            ReportFactory.sendServiceInstance(instance);
        } catch (Exception ignored) {
            // 忽略上报异常
        }
    }

    // ==================== 插件配置 ====================

    @Override
    public String name() {
        return "Kafka";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.any()).intercept(MethodDelegation.to(KafkaPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("org.apache.kafka.common.config.AbstractConfig"));
    }

}
