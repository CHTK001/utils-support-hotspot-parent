package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.classloader.HotspotPluginClassLoader;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

/**
 * 插件注册表
 * 用于注册所有插件类，替代反射扫描
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class PluginRegistry {

    private static final List<Supplier<Plugin>> PLUGIN_SUPPLIERS = new ArrayList<>();
    
    /**
     * 插件类名列表
     */
    private static final String[] PLUGIN_CLASS_NAMES = {
        // 核心插件（Exception、FileHandle、RSocket、Server）
        "com.chua.hotspot.core.support.plugin.PluginRegistration",
        // Redis 相关（jedis、lettuce）
        "com.chua.hotspot.jedis.support.PluginRegistration",
        "com.chua.hotspot.lettuce.support.PluginRegistration",
        // 数据库相关
        "com.chua.hotspot.mysql.support.PluginRegistration",
        "com.chua.hotspot.mybatis.support.PluginRegistration",
        "com.chua.hotspot.p6spy.support.PluginRegistration",
        // Spring 相关
        "com.chua.hotspot.spring.support.PluginRegistration",
        // Web 容器相关
        "com.chua.hotspot.tomcat9x.support.PluginRegistration",
        "com.chua.hotspot.tomcat10x.support.PluginRegistration",
        "com.chua.hotspot.undertow.support.PluginRegistration",
        "com.chua.hotspot.jetty.support.PluginRegistration",
        // HTTP 客户端相关
        "com.chua.hotspot.httpclient3x.support.PluginRegistration",
        "com.chua.hotspot.httpclient4x.support.PluginRegistration",
        "com.chua.hotspot.httpclient5x.support.PluginRegistration",
        // 消息队列相关
        "com.chua.hotspot.kafka.support.PluginRegistration",
        "com.chua.hotspot.rabbit.support.PluginRegistration",
        // 网络相关
        "com.chua.hotspot.netty.support.PluginRegistration",
        // 日志相关
        "com.chua.hotspot.logger.support.PluginRegistration",
        // 序列化相关
        "com.chua.hotspot.fastjson.support.PluginRegistration",
        // RPC 相关
        "com.chua.hotspot.dubbo3x.support.PluginRegistration",
        "com.chua.hotspot.dubbo2x.support.PluginRegistration"
    };
    
    /**
     * 初始化插件注册表
     * <p>
     * 使用自定义类加载器加载插件
     * </p>
     */
    public static void initialize() {
        ClassLoader classLoader = getPluginClassLoader();
        for (String className : PLUGIN_CLASS_NAMES) {
            tryLoadPlugin(className, classLoader);
        }
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
