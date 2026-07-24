package com.chua.hotspot.core.support.spy;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.plugin.Plugin;
import com.chua.hotspot.core.support.plugin.PluginFactory;
import com.chua.hotspot.spy.SpyHandler;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Spy 回调处理器实现
 * <p>
 * 路由 Spy 回调到实际的 BytebuddyPlugin 实例。
 * 此类在 HotspotPluginClassLoader 中加载，实现了 Bootstrap CL 中的 SpyHandler 接口。
 * </p>
 *
 * <h3>路由策略：</h3>
 * <ul>
 *   <li>优先按插件名精确匹配（className → pluginName 映射）</li>
 *   <li>未匹配时遍历所有插件，调用每个插件的回调方法</li>
 * </ul>
 *
 * <h3>ClassLoader 隔离：</h3>
 * <pre>
 * Bootstrap CL:  Spy.class + SpyHandler.class（接口）
 *                    ↑ Spy.HANDLER 引用
 * HotspotPluginClassLoader: SpyHandlerImpl.class（实现）+ 所有插件
 * </pre>
 * SpyHandler 接口在 Bootstrap CL 中，SpyHandlerImpl 实现在 HotspotPluginClassLoader 中。
 * 因为接口由父 CL 加载，子 CL 中的实现类可以赋值给接口引用，这是 ClassLoader 委派机制保证的。
 *
 * @author CH
 * @since 4.0.0.37
 */
public class SpyHandlerImpl implements SpyHandler {

    private final LogFactory logFactory = LogFactory.getInstance();

    /**
     * 插件名 → 插件实例 映射
     */
    private final Map<String, BytebuddyPlugin> pluginMap = new ConcurrentHashMap<>();

    /**
     * 目标类名 → 插件名 映射（用于快速路由）
     */
    private final Map<String, String> classPluginMap = new ConcurrentHashMap<>();

    /**
     * 是否已初始化
     */
    private volatile boolean initialized = false;

    /**
     * 初始化：注册所有 BytebuddyPlugin 实例
     */
    public void init() {
        if (initialized) {
            return;
        }

        Collection<Plugin> plugins = PluginFactory.getInstance().toList();
        for (Plugin plugin : plugins) {
            if (plugin instanceof BytebuddyPlugin) {
                BytebuddyPlugin bp = (BytebuddyPlugin) plugin;
                pluginMap.put(bp.name(), bp);
                logFactory.debug("SpyHandler 注册插件: {}", bp.name());
            }
        }

        logFactory.info("SpyHandler 初始化完成，注册了 {} 个插件", pluginMap.size());
        initialized = true;
    }

    /**
     * 注册目标类到插件的映射
     * <p>
     * 在 AgentFactory 构建 AgentBuilder 时调用，
     * 将每个插件拦截的目标类名注册到映射表中，
     * 以便在 Spy 回调时快速路由到正确的插件。
     * </p>
     *
     * @param className  目标类全限定名
     * @param pluginName 插件名
     */
    public void registerClassMapping(String className, String pluginName) {
        classPluginMap.put(className, pluginName);
    }

    @Override
    public void onBefore(String className, String methodName, Object target, Object[] args) {
        BytebuddyPlugin plugin = findPlugin(className);
        if (plugin != null) {
            try {
                plugin.spyBefore(className, methodName, target, args);
            } catch (Throwable e) {
                logFactory.debug("Spy onBefore 回调异常: plugin={}, class={}, method={}, error={}",
                        plugin.name(), className, methodName, e.getMessage());
            }
        }
    }

    @Override
    public void onAfter(String className, String methodName, Object target, Object[] args, Object result) {
        BytebuddyPlugin plugin = findPlugin(className);
        if (plugin != null) {
            try {
                plugin.spyAfter(className, methodName, target, args, result);
            } catch (Throwable e) {
                logFactory.debug("Spy onAfter 回调异常: plugin={}, class={}, method={}, error={}",
                        plugin.name(), className, methodName, e.getMessage());
            }
        }
    }

    @Override
    public void onError(String className, String methodName, Object target, Object[] args, Throwable throwable) {
        BytebuddyPlugin plugin = findPlugin(className);
        if (plugin != null) {
            try {
                plugin.spyError(className, methodName, target, args, throwable);
            } catch (Throwable e) {
                logFactory.debug("Spy onError 回调异常: plugin={}, class={}, method={}, error={}",
                        plugin.name(), className, methodName, e.getMessage());
            }
        }
    }

    /**
     * 根据目标类名查找对应的插件
     * <p>
     * 查找策略：
     * 1. 优先按 classPluginMap 精确匹配
     * 2. 未匹配时遍历所有插件，按类名关键字匹配
     * </p>
     *
     * @param className 目标类全限定名
     * @return 匹配的插件，未找到时返回 null
     */
    private BytebuddyPlugin findPlugin(String className) {
        // 1. 精确匹配
        String pluginName = classPluginMap.get(className);
        if (pluginName != null) {
            return pluginMap.get(pluginName);
        }

        // 2. 遍历匹配（按插件名关键字匹配，匹配后缓存）
        // 注意：遍历匹配较慢，但只在首次调用时发生
        for (Map.Entry<String, BytebuddyPlugin> entry : pluginMap.entrySet()) {
            BytebuddyPlugin plugin = entry.getValue();
            // 使用插件名作为类名关键字匹配
            // 例如: "HttpClient4x" 插件匹配包含 "CloseableHttpClient" 的类
            if (matchPlugin(plugin, className)) {
                // 缓存匹配结果，后续直接查表
                classPluginMap.put(className, plugin.name());
                return plugin;
            }
        }

        return null;
    }

    /**
     * 按插件名和类名进行关键字匹配
     * <p>
     * 匹配规则基于插件名到目标类名的映射：
     * <ul>
     *   <li>HttpClient4x → CloseableHttpClient, InternalHttpClient, MinimalHttpClient</li>
     *   <li>HttpClient3x → commons httpclient HttpClient</li>
     *   <li>Tomcat9x/10x → CoyoteAdapter</li>
     *   <li>Jetty → HttpChannel</li>
     *   <li>Undertow → ServerConnection</li>
     *   <li>Mysql → MySQL Connection</li>
     *   <li>RedisTemplate → RedisTemplate</li>
     *   <li>Logger → PrintStream</li>
     *   <li>... 其他插件类似</li>
     * </ul>
     * </p>
     *
     * @param plugin    插件实例
     * @param className 目标类全限定名
     * @return 是否匹配
     */
    private boolean matchPlugin(BytebuddyPlugin plugin, String className) {
        String name = plugin.name();
        // 基于插件名的关键字匹配
        switch (name) {
            case "HttpClient4x":
                return className.contains("CloseableHttpClient")
                        || className.contains("InternalHttpClient")
                        || className.contains("MinimalHttpClient");
            case "HttpClient3x":
                return className.contains("org.apache.commons.httpclient.HttpClient");
            case "HttpClient5x":
                return className.contains("CloseableHttpClient") && className.contains("hc.client5");
            case "OkHttp3x":
                return className.contains("RealCall");
            case "Tomcat9x":
            case "Tomcat10x":
            case "Tomcat":
                return className.contains("CoyoteAdapter") || className.contains("StandardHostValve");
            case "Jetty":
                return className.contains("HttpChannel");
            case "Undertow":
                return className.contains("ServerConnection");
            case "Mysql":
                return className.contains("mysql") && className.contains("Connection");
            case "Oracle":
                return className.contains("oracle") && className.contains("Connection");
            case "Pgsql":
                return className.contains("postgresql") && className.contains("Connection");
            case "SqlServer":
                return className.contains("sqlserver") && className.contains("Connection");
            case "RedisTemplate":
                return className.contains("RedisTemplate");
            case "Jedis":
                return className.contains("Jedis");
            case "Lettuce":
                return className.contains("Lettuce");
            case "Kafka":
                return className.contains("KafkaConsumer") || className.contains("KafkaProducer");
            case "Rabbit":
                return className.contains("AMQP") && className.contains("Connection");
            case "Dubbo2xContext":
            case "Dubbo2xResponse":
                return className.contains("dubbo") && className.contains("Filter");
            case "Dubbo3xContext":
            case "Dubbo3xRequest":
            case "Dubbo3xResponse":
                return className.contains("dubbo") && className.contains("Filter");
            case "NacosNaming":
                return className.contains("nacos") && className.contains("Naming");
            case "Zookeeper":
                return className.contains("ZooKeeper");
            case "MybatisConfiguration":
            case "MybatisPluginConfiguration":
            case "MybatisSimpleExecutor":
            case "MybatisSqlMonitor":
            case "MybatisSqlSessionTemplate":
                return className.contains("mybatis");
            case "SpringApplication":
                return className.contains("SpringApplication") || className.contains("ApplicationContext");
            case "SpringEnvironment":
                return className.contains("Environment");
            case "SpringClassPathBeanDefinitionScanner":
                return className.contains("ClassPathBeanDefinitionScanner");
            case "SpringRequestMappingHandlerMapping":
                return className.contains("RequestMappingHandlerMapping");
            case "Jackson":
                return className.contains("ObjectMapper");
            case "FastJson":
            case "FastJson2":
            case "FastJsonParser":
                return className.contains("fastjson");
            case "LogPlugin":
                return className.contains("PrintStream");
            case "MicrometerMetrics":
                return className.contains("micrometer");
            case "P6Spy":
                return className.contains("P6Spy");
            case "Dragonfly":
                return className.contains("Dragonfly");
            case "RSocket":
                return className.contains("RSocket");
            case "ServerPlugin":
                return className.contains("ServerSocket");
            case "BytebuddyFileHandle":
                return className.contains("FileInputStream")
                        || className.contains("FileOutputStream")
                        || className.contains("RandomAccessFile")
                        || className.contains("FileChannel")
                        || className.contains("ZipFile");
            default:
                return false;
        }
    }
}