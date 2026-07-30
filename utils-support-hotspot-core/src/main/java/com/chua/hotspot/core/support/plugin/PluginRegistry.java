package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.classloader.HotspotPluginClassLoader;
import com.chua.hotspot.core.support.log.LogFactory;

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
        // Spring 相关（spring5x、spring6x 互斥）
        // 注意：spring5x 与 spring6x 是互斥的（按运行时检测到的 spring 版本决定加载哪一个）。
        // spring6x 不加入 fallback 列表——它需要在 output/plugins/ 中显式存在 spring6x.jar 时
        // 通过 SPI 自动发现机制加载，或在 detectedVersions 包含 spring=6 时由 followUp 阶段加载。
        // 这样可避免"spring6x.jar 缺失但 fallback 仍尝试加载"导致应用启动 NoClassDefFoundError。
        "com.chua.hotspot.spring.support.PluginRegistration",
        // "com.chua.hotspot.spring6x.support.PluginRegistration",
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
        LogFactory.getInstance().info("PluginRegistry.initialize 使用 classLoader: {}",
                classLoader.getClass().getName());

        // 1. 尝试 SPI 自动发现
        Set<String> discoveredClasses = discoverPluginsViaSpi(classLoader);
        LogFactory.getInstance().info("SPI 自动发现 {} 个 plugin", discoveredClasses.size());

        if (!discoveredClasses.isEmpty()) {
            // SPI 发现成功
            for (String className : discoveredClasses) {
                tryLoadPlugin(className, classLoader);
            }
        } else {
            // 2. 兜底：使用硬编码列表
            LogFactory.getInstance().info("SPI 未发现，使用 fallback 列表（{} 个）", FALLBACK_PLUGIN_CLASS_NAMES.length);
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
        // 互斥检查：spring5x 与 spring6x 不能同时加载，否则两个 plugin 会同时增强 SpringApplicationRunListeners
        // 并在字节码中嵌入对方 plugin 类的直接引用，运行时必然 NoClassDefFoundError。
        // 仅当运行时实际使用 Spring 6 时（detectedVersions.spring 包含 6.x）才加载 spring6x；
        // 否则只加载 spring5x（或都不加载）。
        if (className.contains(".spring6x.")) {
            // 检测 Spring 6 是否在运行时的 classpath 中（通过特有类）
            // spring6 引入了 jakarta 而不是 javax；通过这个判断 spring6 是否真实存在
            boolean spring6Available;
            try {
                Class.forName("jakarta.servlet.ServletException", false,
                        Thread.currentThread().getContextClassLoader());
                spring6Available = true;
            } catch (Throwable t) {
                spring6Available = false;
            }
            LogFactory.getInstance().info("spring6x plugin 跳过检查: className={}, spring6Available={}",
                    className, spring6Available);
            if (!spring6Available) {
                LogFactory.getInstance().warn("运行时未检测到 jakarta.servlet（Spring 6 特征），跳过 spring6x plugin（避免 NoClassDefFoundError）");
                return;
            }
            LogFactory.getInstance().info("加载 spring6x plugin（运行时检测到 Spring 6 特征 jakarta.servlet）");
        }

        try {
            // initialize=true：触发 PluginRegistration 类的 static 块，调用 registerPlugin() 注册 Supplier。
            Class.forName(className, true, classLoader);
            LogFactory.getInstance().debug("插件注册类加载成功: {} (classLoader={})",
                    className, classLoader.getClass().getName());
        } catch (ClassNotFoundException e) {
            // 插件模块不存在或对应 jar 未在 output/plugins/ 中，记录 debug 日志便于诊断
            LogFactory.getInstance().warn("插件注册类找不到: {} (classLoader={})",
                    className, classLoader.getClass().getName());
        } catch (LinkageError e) {
            // 插件模块存在但其静态初始化失败（依赖缺失等，例如 spring6x 引用 Spring 6 类，
            // 但当前应用是 Spring 5），跳过该插件以避免污染后续插件加载。
            LogFactory.getInstance().warn("插件注册类加载失败（依赖缺失），跳过: {} - {}",
                    className, e.getClass().getSimpleName());
        } catch (Exception e) {
            System.err.println("[ERROR] 加载插件注册类失败: " + className + ", " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * 检测运行时 Spring 主版本号（基于 classpath 中存在的 SpringApplication 类）
     *
     * @return 主版本号字符串（如 "5"、"6"），检测不到返回 null
     */
    private static String detectedSpringMajorVersion() {
        // 优先通过 spring-core 的 SpringVersion 获取版本
        try {
            Class<?> springCoreClass = Class.forName("org.springframework.core.SpringVersion", false,
                    Thread.currentThread().getContextClassLoader());
            java.lang.reflect.Method m = springCoreClass.getMethod("getVersion");
            Object v = m.invoke(null);
            if (v != null) {
                String springVersion = v.toString();
                LogFactory.getInstance().info("通过 SpringVersion 检测到 Spring 版本: {}", springVersion);
                int dot = springVersion.indexOf('.');
                return dot > 0 ? springVersion.substring(0, dot) : springVersion;
            }
        } catch (Throwable t) {
            LogFactory.getInstance().debug("SpringVersion 检测失败: {}", t.getMessage());
        }

        // 备选方案：通过 spring-core jar manifest 的 Implementation-Version 字段读取版本
        try {
            Class<?> springCoreClass = Class.forName("org.springframework.core.SpringVersion", false,
                    Thread.currentThread().getContextClassLoader());
            java.net.URL source = springCoreClass.getProtectionDomain().getCodeSource().getLocation();
            if (source != null) {
                java.io.InputStream is = source.openStream();
                java.util.jar.Manifest mf = new java.util.jar.Manifest(is);
                is.close();
                String version = mf.getMainAttributes().getValue("Implementation-Version");
                if (version != null && !version.isEmpty()) {
                    LogFactory.getInstance().info("通过 jar manifest 检测到 Spring 版本: {}", version);
                    int dot = version.indexOf('.');
                    return dot > 0 ? version.substring(0, dot) : version;
                }
            }
        } catch (Throwable t) {
            LogFactory.getInstance().debug("Manifest 检测 Spring 版本失败: {}", t.getMessage());
        }

        // 备选方案：通过字节码指令检测（Spring 6 的 SpringVersion 类相比 Spring 5 有不同常量）
        try {
            Class<?> springCoreClass = Class.forName("org.springframework.core.SpringVersion", false,
                    Thread.currentThread().getContextClassLoader());
            java.lang.reflect.Field[] fields = springCoreClass.getDeclaredFields();
            for (java.lang.reflect.Field f : fields) {
                if (f.getName().toUpperCase().contains("VERSION")) {
                    f.setAccessible(true);
                    Object value = f.get(null);
                    if (value != null) {
                        String s = value.toString();
                        if (s.matches("^\\d+\\.\\d+.*")) {
                            LogFactory.getInstance().info("通过字段检测到 Spring 版本: {}", s);
                            int dot = s.indexOf('.');
                            return dot > 0 ? s.substring(0, dot) : s;
                        }
                    }
                }
            }
        } catch (Throwable t) {
            LogFactory.getInstance().debug("字段检测 Spring 版本失败: {}", t.getMessage());
        }

        LogFactory.getInstance().warn("无法检测 Spring 版本，spring6x plugin 兼容性检查已禁用");
        return null;
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
