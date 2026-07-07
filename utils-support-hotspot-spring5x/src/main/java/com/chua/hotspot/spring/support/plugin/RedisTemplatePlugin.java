package com.chua.hotspot.spring.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
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
 * Spring RedisTemplate 初始化拦截插件
 * 拦截 RedisTemplate.afterPropertiesSet 方法，捕获 Redis 连接信息
 *
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.34
 */
public class RedisTemplatePlugin extends BytebuddyPlugin {
    
    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        
        // 先执行原方法
        Object result = callable.call();
        
        try {
            extractAndReportRedisConnection(target);
        } catch (Exception e) {
            System.err.println("[RedisTemplate Plugin] Failed to report connection: " + e.getMessage());
            e.printStackTrace();
        }
        
        return result;
    }
    
    /**
     * 从 RedisTemplate 提取 Redis 连接信息
     */
    private static void extractAndReportRedisConnection(Object target) {
        try {
            System.out.println("[RedisTemplate Plugin] Intercepted afterPropertiesSet, target: " + target.getClass().getName());
            
            // 获取 ConnectionFactory
            Object connectionFactory = ClassUtils.getObject("connectionFactory", target);
            if (connectionFactory == null) {
                System.out.println("[RedisTemplate Plugin] connectionFactory is null");
                return;
            }
            
            System.out.println("[RedisTemplate Plugin] connectionFactory: " + connectionFactory.getClass().getName());
            
            String host = null;
            int port = 0;
            
            // 尝试从 LettuceConnectionFactory 获取配置
            if (connectionFactory.getClass().getName().contains("LettuceConnectionFactory")) {
                host = extractLettuceHost(connectionFactory);
                port = extractLettucePort(connectionFactory);
            }
            // 尝试从 JedisConnectionFactory 获取配置
            else if (connectionFactory.getClass().getName().contains("JedisConnectionFactory")) {
                host = extractJedisHost(connectionFactory);
                port = extractJedisPort(connectionFactory);
            }
            
            if (host != null && port > 0) {
                ServiceInstance ss = new ServiceInstance();
                ss.setName("REDIS");
                ss.setSourceHost(ReportFactory.LOCAL_HOST);
                ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                ss.setTargetHost(host);
                ss.setTargetPort(port);
                
                System.out.println("[RedisTemplate Plugin] Reporting Redis connection: " + host + ":" + port);
                ReportFactory.sendServiceInstance(ss);
            } else {
                System.out.println("[RedisTemplate Plugin] Could not extract host/port");
            }
            
        } catch (Exception e) {
            System.err.println("[RedisTemplate Plugin] Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * 从 LettuceConnectionFactory 提取主机
     */
    private static String extractLettuceHost(Object factory) {
        try {
            // 尝试获取 StandaloneConfiguration
            Method getStandaloneConfig = factory.getClass().getMethod("getStandaloneConfiguration");
            Object config = getStandaloneConfig.invoke(factory);
            
            if (config != null) {
                Method getHostName = config.getClass().getMethod("getHostName");
                return (String) getHostName.invoke(config);
            }
            
            // 尝试从 clientConfiguration 获取
            Object clientConfig = ClassUtils.getObject("clientConfiguration", factory);
            if (clientConfig != null) {
                Object hostAndPort = ClassUtils.getObject("hostAndPort", clientConfig);
                if (hostAndPort != null) {
                    return (String) ClassUtils.getObject("host", hostAndPort);
                }
            }
        } catch (Exception e) {
            System.err.println("[RedisTemplate Plugin] Failed to extract Lettuce host: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * 从 LettuceConnectionFactory 提取端口
     */
    private static int extractLettucePort(Object factory) {
        try {
            // 尝试获取 StandaloneConfiguration
            Method getStandaloneConfig = factory.getClass().getMethod("getStandaloneConfiguration");
            Object config = getStandaloneConfig.invoke(factory);
            
            if (config != null) {
                Method getPort = config.getClass().getMethod("getPort");
                return (int) getPort.invoke(config);
            }
            
            // 尝试从 clientConfiguration 获取
            Object clientConfig = ClassUtils.getObject("clientConfiguration", factory);
            if (clientConfig != null) {
                Object hostAndPort = ClassUtils.getObject("hostAndPort", clientConfig);
                if (hostAndPort != null) {
                    Object port = ClassUtils.getObject("port", hostAndPort);
                    if (port instanceof Integer) {
                        return (Integer) port;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[RedisTemplate Plugin] Failed to extract Lettuce port: " + e.getMessage());
        }
        return 0;
    }
    
    /**
     * 从 JedisConnectionFactory 提取主机
     */
    private static String extractJedisHost(Object factory) {
        try {
            // 尝试获取 StandaloneConfiguration
            Method getStandaloneConfig = factory.getClass().getMethod("getStandaloneConfiguration");
            Object config = getStandaloneConfig.invoke(factory);
            
            if (config != null) {
                Method getHostName = config.getClass().getMethod("getHostName");
                return (String) getHostName.invoke(config);
            }
            
            // 降级方案：从 hostName 字段获取
            Object host = ClassUtils.getObject("hostName", factory);
            if (host instanceof String) {
                return (String) host;
            }
        } catch (Exception e) {
            System.err.println("[RedisTemplate Plugin] Failed to extract Jedis host: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * 从 JedisConnectionFactory 提取端口
     */
    private static int extractJedisPort(Object factory) {
        try {
            // 尝试获取 StandaloneConfiguration
            Method getStandaloneConfig = factory.getClass().getMethod("getStandaloneConfiguration");
            Object config = getStandaloneConfig.invoke(factory);
            
            if (config != null) {
                Method getPort = config.getClass().getMethod("getPort");
                return (int) getPort.invoke(config);
            }
            
            // 降级方案：从 port 字段获取
            Object port = ClassUtils.getObject("port", factory);
            if (port instanceof Integer) {
                return (Integer) port;
            }
        } catch (Exception e) {
            System.err.println("[RedisTemplate Plugin] Failed to extract Jedis port: " + e.getMessage());
        }
        return 0;
    }

    @Override
    public String name() {
        return "RedisTemplate";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("afterPropertiesSet"))
                .intercept(MethodDelegation.to(RedisTemplatePlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.springframework.data.redis.core.RedisTemplate");
    }
}
