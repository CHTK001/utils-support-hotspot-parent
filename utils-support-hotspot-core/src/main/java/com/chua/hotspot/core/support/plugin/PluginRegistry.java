package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.classloader.HotspotPluginClassLoader;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Supplier;

/**
 * 插件注册表
 * <p>
 * 支持两种插件发现机制：
 * </p>
 * <ol>
 *   <li><b>SPI 自动发现</b>（优先）：扫描 classpath 下所有
 *       {@code META-INF/hotspot-plugins/com.chua.hotspot.core.support.plugin.PluginRegistration} 文件，
 *       每行一个 PluginRegistration 全限定类名。新增模块只需在 jar 中放置配置文件，无需修改此类。</li>
 *   <li><b>硬编码兜底</b>：当 SPI 文件不存在时，使用 {@link #FALLBACK_PLUGIN_CLASS_NAMES} 兜底加载。</li>
 * </ol>
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.40
 */
public class PluginRegistry {

    private static final List<Supplier<Plugin>> PLUGIN_SUPPLIERS = new ArrayList<>();

    /**
     * SPI 配置文件路径
     */
    private static final String SPI_RESOURCE_PATH =
            "META-INF/hotspot-plugins/com.chua.hotspot.core.support.plugin.PluginRegistration";

    /**
     * 硬编码兜底插件类名列表
     * <p>
     * 仅在 SPI 自动发现未找到任何配置文件时使用。
     * 新增模块应优先使用 SPI 机制，而非修改此列表。
     * </p>
     */
    private static final String[] FALLBACK_PLUGIN_CLASS_NAMES = {
        // 核心插件（Exception、FileHandle、RSocket、Server）
        "com.chua.hotspot.core.support.plugin.PluginRegistration",
        // Redis 相关（jedis、lettuce、dragonfly）
        "com.chua.hotspot.jedis.support.PluginRegistration",
        "com.chua.hotspot.lettuce.support.PluginRegistration",
        "com.chua.hotspot.dragonfly.support.PluginRegistration",
        // 数据库相关（mysql、oracle、pgsql、sqlserver、mybatis、p6spy、hikaricp）
        "com.chua.hotspot.mysql.support.PluginRegistration",
        "com.chua.hotspot.oracle.support.PluginRegistration",
        "com.chua.hotspot.pgsql.support.PluginRegistration",
        "com.chua.hotspot.sqlserver.support.PluginRegistration",
        "com.chua.hotspot.mybatis.support.PluginRegistration",
        "com.chua.hotspot.p6spy.support.PluginRegistration",
        "com.chua.hotspot.hikaricp.support.PluginRegistration",
        // Spring 相关（spring5x、spring6x）
        "com.chua.hotspot.spring.support.PluginRegistration",
        "com.chua.hotspot.spring6x.support.PluginRegistration",
        // Web 容器相关（tomcat9x、tomcat10x、undertow、jetty）
        "com.chua.hotspot.tomcat9x.support.PluginRegistration",
        "com.chua.hotspot.tomcat10x.support.PluginRegistration",
        "com.chua.hotspot.undertow.support.PluginRegistration",
        "com.chua.hotspot.jetty.support.PluginRegistration",
        // HTTP 客户端相关（httpclient3x/4x/5x、okhttp）
        "com.chua.hotspot.httpclient3x.support.PluginRegistration",
        "com.chua.hotspot.httpclient4x.support.PluginRegistration",
        "com.chua.hotspot.httpclient5x.support.PluginRegistration",
        "com.chua.hotspot.okhttp.support.PluginRegistration",
        // 消息队列相关（kafka、rabbit、rocketmq）
        "com.chua.hotspot.kafka.support.PluginRegistration",
        "com.chua.hotspot.rabbit.support.PluginRegistration",
        "com.chua.hotspot.rocketmq.support.PluginRegistration",
        // 序列化相关（fastjson、jackson）
        "com.chua.hotspot.fastjson.support.PluginRegistration",
        "com.chua.hotspot.jackson.support.PluginRegistration",
        // RPC 相关（dubbo3x、dubbo2x）
        "com.chua.hotspot.dubbo3x.support.PluginRegistration",
        "com.chua.hotspot.dubbo2x.support.PluginRegistration",
        // 服务发现与协调（nacos、zookeeper）
        "com.chua.hotspot.nacos.support.PluginRegistration",
        "com.chua.hotspot.zookeeper.support.PluginRegistration",
        // 网络相关（netty）
        "com.chua.hotspot.netty.support.PluginRegistration",
        // 日志相关（logback、system-out）
        "com.chua.hotspot.logger.support.PluginRegistration",
        // 指标监控（micrometer）
        "com.chua.hotspot.micrometer.support.PluginRegistration"
    };

    /**
     * 初始化插件注册表
     * <p>
     * 优先使用 SPI 自动发现，兜底使用硬编码列表。
     * </p>
     */
    public static void initialize() {
        ClassLoader classLoader = getPluginClassLoader();

        // 1. 尝试 SPI 自动发现
        Set<String> discoveredClasses = discoverPluginsViaSpi(classLoader);

        if (!discoveredClasses.isEmpty()) {
            // SPI 发现成功
            for (String className : discoveredClasses) {
                tryLoadPlugin(className, classLoader);
            }
        } else {
            // 2. 兜底：使用硬编码列表
            for (String className : FALLBACK_PLUGIN_CLASS_NAMES) {
                tryLoadPlugin(className, classLoader);
            }
        }
    }

    /**
     * 通过 SPI 机制自动发现插件注册类
     * <p>
     * 扫描 classpath 下所有 META-INF/hotspot-plugins/com.chua.hotspot.core.support.plugin.PluginRegistration 文件，
     * 每行一个 PluginRegistration 全限定类名（支持 # 注释和空行）。
     * </p>
     *
     * @param classLoader 类加载器
     * @return 发现的 PluginRegistration 类名集合（有序、去重）
     */
    private static Set<String> discoverPluginsViaSpi(ClassLoader classLoader) {
        Set<String> classes = new LinkedHashSet<>();

        try {
            Enumeration<URL> resources = classLoader.getResources(SPI_RESOURCE_PATH);
            while (resources.hasMoreElements()) {
                URL url = resources.nextElement();
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(url.openStream(), java.nio.charset.StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        // 跳过空行和注释
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        classes.add(line);
                    }
                } catch (Exception e) {
                    System.err.println("[WARN] 读取 SPI 配置文件失败: " + url + ", " + e.getMessage());
                }
            }
        } catch (Exception e) {
            // SPI 发现失败，不影响兜底加载
        }

        return classes;
    }
    
    /**
     * 获取插件类加载器
     *
     * @return 类加载器
     */
    private static ClassLoader getPluginClassLoader() {
        // 优先使用自定义类加载器
        HotspotPluginClassLoader pluginClassLoader = HotspotPluginClassLoader.getInstance();
        if (pluginClassLoader != null) {
            return pluginClassLoader;
        }
        // 回退到线程上下文类加载器
        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        if (contextClassLoader != null) {
            return contextClassLoader;
        }
        // 最后使用系统类加载器
        return ClassLoader.getSystemClassLoader();
    }
    
    /**
     * 尝试加载插件注册类
     *
     * @param className 类名
     * @param classLoader 类加载器
     */
    private static void tryLoadPlugin(String className, ClassLoader classLoader) {
        try {
            Class.forName(className, true, classLoader);
        } catch (ClassNotFoundException e) {
            // 插件模块不存在，忽略
        } catch (Exception e) {
            System.err.println("[ERROR] 加载插件注册类失败: " + className + ", " + e.getMessage());
        }
    }

    /**
     * 注册插件供应商
     *
     * @param supplier 插件供应商
     */
    public static void registerPlugin(Supplier<Plugin> supplier) {
        if (supplier != null) {
            PLUGIN_SUPPLIERS.add(supplier);
        }
    }

    /**
     * 获取所有已注册的插件供应商
     *
     * @return 插件供应商列表
     */
    public static List<Supplier<Plugin>> getPluginSuppliers() {
        return new ArrayList<>(PLUGIN_SUPPLIERS);
    }

    /**
     * 创建所有插件实例
     *
     * @return 插件实例列表
     */
    public static List<Plugin> createAllPlugins() {
        List<Plugin> plugins = new ArrayList<>();
        for (Supplier<Plugin> supplier : PLUGIN_SUPPLIERS) {
            try {
                Plugin plugin = supplier.get();
                if (plugin != null) {
                    plugins.add(plugin);
                }
            } catch (Exception e) {
                System.err.println("[ERROR] 创建插件失败: " + e.getMessage());
                e.printStackTrace();
            }
        }
        return plugins;
    }

    /**
     * 获取已注册插件数量
     *
     * @return 插件数量
     */
    public static int getPluginCount() {
        return PLUGIN_SUPPLIERS.size();
    }
}
