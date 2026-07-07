package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.hotswap.Hotswap;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.version.Version;

import java.lang.reflect.ParameterizedType;
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

    static final PluginFactory INSTANCE = new PluginFactory();

    final LogFactory logFactory = LogFactory.getInstance();
    final EnvironmentFactory environmentFactory = EnvironmentFactory.getInstance();
    final List<String> denyPlugin = new LinkedList<>();

    final Map<String, Plugin> pluginMap = new ConcurrentHashMap<>();
    final List<Plugin> pluginList = new LinkedList<>();
    final Map<Class<?>, List<Hotswap>> hotswaps = new ConcurrentHashMap<>();

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
        logEnvironment();
        logFactory.info("============================="+"插件"+"========================");
        logFactory.info("初始化插件");
        initialDenyList();
        
        // 初始化插件注册表（使用自定义类加载器）
        PluginRegistry.initialize();
        
        // 优先使用 PluginRegistry 注册的插件
        List<Plugin> registeredPlugins = PluginRegistry.createAllPlugins();
        logFactory.info("从 PluginRegistry 获取到 {} 个插件", registeredPlugins.size());
        
        for (Plugin plugin : registeredPlugins) {
            try {
                plugin.init();
                pluginMap.put(plugin.name(), plugin);
                pluginList.add(plugin);
                logFactory.debug("插件加载成功: {}", plugin.name());
                
                if (plugin instanceof Hotswap) {
                    Class<?> pluginClass = plugin.getClass();
                    java.lang.reflect.Type genericSuperclass = pluginClass.getGenericSuperclass();
                    // 只有当父类是泛型类型时才提取类型参数
                    if (genericSuperclass instanceof ParameterizedType) {
                        java.lang.reflect.Type[] typeArgs = ((ParameterizedType)genericSuperclass).getActualTypeArguments();
                        if (typeArgs.length > 0 && typeArgs[0] instanceof Class<?>) {
                            hotswaps.computeIfAbsent((Class<?>) typeArgs[0], it -> new ArrayList<>()).add((Hotswap) plugin);
                            logFactory.debug("热部署插件注册成功: {}, 目标类型: {}", plugin.name(), ((Class<?>)typeArgs[0]) .getName());
                        }
                    }
                }
            } catch (Exception e) {
                logFactory.error("加载插件 {} 失败: {}", plugin.name(), e.getMessage(), e);
            }
        }
        
        // 如果 PluginRegistry 没有注册插件，则使用反射扫描作为备用方案
        if (registeredPlugins.isEmpty()) {
            logFactory.info("使用反射扫描加载插件...");
            List<Class<?>> classes = ClassUtils.getClasses("com.chua.hotspot");
            logFactory.info("扫描到 {} 个类", classes.size());
            
            for (Class<?> aClass : classes) {
                if (aClass.isInterface()) {
                    continue;
                }

                try {
                    Plugin newInstance = (Plugin) aClass.getDeclaredConstructor().newInstance();
                    newInstance.init();
                    pluginMap.put(newInstance.name(), newInstance);
                    pluginList.add(newInstance);
                    logFactory.debug("插件加载成功: {}", newInstance.name());
                    
                    if (newInstance instanceof Hotswap) {
                        ParameterizedType genericSuperclass = (ParameterizedType) aClass.getGenericSuperclass();
                        hotswaps.computeIfAbsent((Class<?>) genericSuperclass.getActualTypeArguments()[0], it -> new ArrayList<>()).add((Hotswap) newInstance);
                        logFactory.debug("热部署插件注册成功: {}", newInstance.name());
                    }
                } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
                    // 跳过无法实例化的插件类
                } catch (ClassCastException e) {
                    logFactory.debug("类 {} 不是 Plugin 类型，跳过", aClass.getName());
                } catch (Exception e) {
                    logFactory.error("加载插件 {} 失败: {}", aClass.getName(), e.getMessage(), e);
                }
            }
        }

        Set<String> collect = pluginMap.keySet().stream().limit(5).collect(Collectors.toSet());
        logFactory.info("共发现: {} ({})", collect, pluginMap.size());
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
