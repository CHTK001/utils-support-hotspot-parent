package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.hotswap.Hotswap;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.monitor.AgentSelfMonitor;
import com.chua.hotspot.core.support.version.Version;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import static com.chua.hotspot.core.support.version.JarVersionScanner.VERSION_CACHE;

/**
 * 插件工厂
 * 管理所有 Hotspot 插件的加载和生命周期
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class PluginFactory {

    /** \u5355\u4f8b\u5b9e\u4f8b */
    static final PluginFactory INSTANCE = new PluginFactory();

    /** \u65e5\u5fd7\u5de5\u5382 */
    final LogFactory logFactory = LogFactory.getInstance();
    /** \u73af\u5883\u53d8\u91cf\u5de5\u5382 */
    final EnvironmentFactory environmentFactory = EnvironmentFactory.getInstance();
    /** \u7981\u7528\u63d2\u4ef6\u5217\u8868 */
    final List<String> denyPlugin = new LinkedList<>();

    /** \u63d2\u4ef6\u540d\u79f0\u5230\u5b9e\u4f8b\u7684\u6620\u5c04 */
    final Map<String, Plugin> pluginMap = new ConcurrentHashMap<>();
    /** \u63d2\u4ef6\u5217\u8868\uff08\u6309\u52a0\u8f7d\u987a\u5e8f\uff09 */
    final List<Plugin> pluginList = new LinkedList<>();
    /** \u70ed\u90e8\u7f72\u63d2\u4ef6\uff0c\u6309\u76ee\u6807\u7c7b\u578b\u5206\u7ec4 */
    final Map<Class<?>, List<Hotswap>> hotswaps = new ConcurrentHashMap<>();

    /** \u662f\u5426\u5df2\u521d\u59cb\u5316\uff08\u5e42\u7b49\u4fdd\u62a4\uff09 */
    private volatile boolean initialized = false;

    private PluginFactory() {

    }

    /**
     * 获取实例
     *
     * @return {@link PluginFactory}
     */
    public static PluginFactory getInstance() {
        return INSTANCE;
    }

    public void init() {
        if (initialized) {
            logFactory.warn("PluginFactory 已初始化，跳过重复初始化");
            return;
        }
        logEnvironment();
        logFactory.info("============================="+"插件"+"========================");
        logFactory.info("初始化插件");
        initialDenyList();
        
        // 初始化插件注册表（使用自定义类加载器）
        PluginRegistry.initialize();
        
        // 使用 PluginRegistry 注册的插件（不再使用反射扫描备用方案）
        List<Plugin> registeredPlugins = PluginRegistry.createAllPlugins();
        logFactory.info("从 PluginRegistry 获取到 {} 个插件", registeredPlugins.size());
        
        for (Plugin plugin : registeredPlugins) {
            try {
                plugin.init();
                pluginMap.put(plugin.name(), plugin);
                pluginList.add(plugin);
                logFactory.debug("插件加载成功: {}", plugin.name());
                
                // 记录插件注册到自监控
                AgentSelfMonitor.getInstance().recordPluginRegister(plugin.name());
                
                // 注册热部署插件 - 优先使用 targetType() 显式声明，避免泛型反射提取
                if (plugin instanceof Hotswap) {
                    Class<?> targetType = resolveHotswapTargetType((Hotswap<?>) plugin);
                    if (targetType != null) {
                        hotswaps.computeIfAbsent(targetType, it -> new ArrayList<>()).add((Hotswap) plugin);
                        logFactory.debug("热部署插件注册成功: {}, 目标类型: {}", plugin.name(), targetType.getName());
                    }
                }
            } catch (Exception e) {
                logFactory.error("加载插件 {} 失败: {}", plugin.name(), e.getMessage(), e);
            }
        }
        
        if (registeredPlugins.isEmpty()) {
            logFactory.warn("未发现任何插件，请检查插件模块是否正确加载");
        }

        Set<String> collect = pluginMap.keySet().stream().limit(5).collect(Collectors.toSet());
        logFactory.info("共发现: {} ({})", collect, pluginMap.size());
        initialized = true;
    }

    /**
     * 解析 Hotswap 插件的目标类型
     * 优先使用 targetType() 显式声明，避免运行时泛型反射提取
     *
     * @param hotswap 热部署插件
     * @return 目标类型，无法解析时返回 null
     */
    private Class<?> resolveHotswapTargetType(Hotswap<?> hotswap) {
        // 优先使用 targetType() 显式声明
        Class<?> targetType = hotswap.targetType();
        if (targetType != null) {
            return targetType;
        }
        
        // 降级方案：通过泛型反射提取（仅当 targetType() 未实现时使用）
        try {
            java.lang.reflect.Type genericSuperclass = hotswap.getClass().getGenericSuperclass();
            if (genericSuperclass instanceof java.lang.reflect.ParameterizedType) {
                java.lang.reflect.Type[] typeArgs = ((java.lang.reflect.ParameterizedType) genericSuperclass).getActualTypeArguments();
                if (typeArgs.length > 0 && typeArgs[0] instanceof Class<?>) {
                    return (Class<?>) typeArgs[0];
                }
            }
        } catch (Exception e) {
            logFactory.debug("解析 Hotswap 泛型类型失败: {}", e.getMessage());
        }
        return null;
    }

    private void logEnvironment() {
        Version version = Version.getVersion();
        logFactory.info("=============================环境========================");
        logFactory.info("当前字节码处理包@version  {}", version);
        logFactory.info("当前Java@version  {}", System.getProperty("java.version"));
        logFactory.info("当前操作系统: {}", System.getProperty("os.name"));
        logFactory.info("当前JVM@version  {}", System.getProperty("java.vm.version"));
    }

    private void initialDenyList() {
        String denyPlugin1 = environmentFactory.getString("denyPlugin", "");
        String[] split = denyPlugin1.split(",");
        for (String s : split) {
            denyPlugin.add(s.trim());
        }
    }

    /**
     * 列表
     *
     * @return {@link Collection}<{@link Plugin}>
     */
    public Collection<Plugin> toList() {
        return pluginList;
    }

    /**
     * 是否通过
     *
     * @param name 名称
     * @return boolean
     */
    public boolean isPass(String name) {
        return !denyPlugin.contains(name);
    }

    /**
     * 完成
     */
    public void finish() {
        for (Plugin plugin : pluginList) {
            plugin.finish();
        }
    }


    public void rebase(Object bean) {
        List<Hotswap> hotswaps1 = hotswaps.get(bean.getClass());
        if (null == hotswaps1) {
            return;
        }
        for (Hotswap hotswap : hotswaps1) {
            hotswap.reload(bean);
        }
    }
}
