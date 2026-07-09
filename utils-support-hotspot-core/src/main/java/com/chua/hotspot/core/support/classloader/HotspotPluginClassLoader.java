package com.chua.hotspot.core.support.classloader;

import com.chua.hotspot.core.support.version.DefaultVersionSelector;
import com.chua.hotspot.core.support.version.VersionSelector;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Hotspot 插件自定义类加载器
 * 用于加载外部 lib 目录下的所有插件 JAR 文件
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class HotspotPluginClassLoader extends URLClassLoader {

    private static volatile HotspotPluginClassLoader instance;

    /**
     * 构造函数
     *
     * @param urls 要加载的 JAR 文件 URL 数组
     * @param parent 父类加载器
     */
    private HotspotPluginClassLoader(URL[] urls, ClassLoader parent) {
        super(urls, parent);
    }
    
    /**
     * 重写类加载方法
     * <p>
     * 对于 hotspot 插件类（com.chua.hotspot.*）使用子类优先模式，
     * 对于其他类使用父类优先模式避免与应用冲突
     * </p>
     *
     * @param name 类名
     * @return 加载的类
     * @throws ClassNotFoundException 类未找到时抛出
     */
    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            // 1. 检查是否已经加载过
            Class<?> loadedClass = findLoadedClass(name);
            if (loadedClass != null) {
                return loadedClass;
            }
            
            // 2. hotspot 插件类：子类优先（先用自己的类加载器）
            if (isHotspotPluginClass(name)) {
                try {
                    loadedClass = findClass(name);
                    if (resolve) {
                        resolveClass(loadedClass);
                    }
                    return loadedClass;
                } catch (ClassNotFoundException ignored) {
                    // 自己加载不了，尝试父类
                }
            }
            
            // 3. 其他类：父类优先（避免与应用冲突）
            try {
                loadedClass = getParent().loadClass(name);
                if (loadedClass != null) {
                    if (resolve) {
                        resolveClass(loadedClass);
                    }
                    return loadedClass;
                }
            } catch (ClassNotFoundException ignored) {
                // 父类加载器找不到，继续用自己加载
            }
            
            // 4. 最后尝试自己加载
            loadedClass = findClass(name);
            if (resolve) {
                resolveClass(loadedClass);
            }
            return loadedClass;
        }
    }
    
    /**
     * 判断是否为 hotspot 插件类（非 core 模块）
     * <p>
     * core 模块的类必须由父类加载器加载，以保证 PluginRegistry 等类的单例性
     * 只有插件模块的类（如 jedis、mysql 等）才使用子类优先加载
     * </p>
     *
     * @param className 类名
     * @return 是否为插件类
     */
    private boolean isHotspotPluginClass(String className) {
        // core 模块必须由父类加载器加载（HotspotClassLoader）
        if (className.startsWith("com.chua.hotspot.core.")) {
            return false;
        }
        // agent 模块必须由父类加载器加载（System CL）
        if (className.startsWith("com.chua.hotspot.agent.")) {
            return false;
        }
        // spy 桥接类必须由 Bootstrap CL 加载
        if (className.startsWith("com.chua.hotspot.spy.")) {
            return false;
        }
        // 其他 hotspot 插件模块使用子类优先
        return className.startsWith("com.chua.hotspot.") || 
               className.startsWith("com.chua.hotsport.");
    }

    /**
     * 获取单例实例
     *
     * @return HotspotPluginClassLoader 实例
     */
    public static HotspotPluginClassLoader getInstance() {
        return instance;
    }
    
    /**
     * 打印当前类加载器加载的所有 URLs（用于调试）
     */
    public void printLoadedUrls() {
        System.out.println("[DEBUG] HotspotPluginClassLoader 已加载的 URLs:");
        for (URL url : getURLs()) {
            System.out.println("[DEBUG]   - " + url);
        }
    }

    /**
     * 初始化类加载器
     *
     * @param libPath lib 目录路径
     * @return HotspotPluginClassLoader 实例
     * @throws RuntimeException 初始化失败时抛出
     */
    public static synchronized HotspotPluginClassLoader initialize(String libPath) {
        if (instance != null) {
            return instance;
        }

        try {
            File libDir = new File(libPath);
            if (!libDir.exists() || !libDir.isDirectory()) {
                throw new IllegalArgumentException("lib 目录不存在或不是目录: " + libPath);
            }

            List<URL> urls = scanJarFiles(libDir);
            if (urls.isEmpty()) {
                System.out.println("[WARN] lib 目录下未找到任何 JAR 文件: " + libPath);
            }

            // 使用加载本类的 ClassLoader 作为父类加载器（即 HotspotClassLoader）
            // 这样插件类可以访问 core 模块的类（如 BytebuddyPlugin）
            // HotspotPluginClassLoader 由 HotspotClassLoader 加载，所以 getClassLoader() 返回 HotspotClassLoader
            ClassLoader parentClassLoader = HotspotPluginClassLoader.class.getClassLoader();
            if (parentClassLoader == null) {
                // 如果由 Bootstrap CL 加载（不应该发生），回退到线程上下文 CL
                parentClassLoader = Thread.currentThread().getContextClassLoader();
            }
            if (parentClassLoader == null) {
                parentClassLoader = ClassLoader.getSystemClassLoader();
            }

            instance = new HotspotPluginClassLoader(
                urls.toArray(new URL[0]),
                parentClassLoader
            );

            System.out.println("[INFO] ClassLoader 初始化成功，加载了 " + urls.size() + " 个 JAR 文件，parent: " + parentClassLoader.getClass().getName());
            return instance;
        } catch (Exception e) {
            throw new RuntimeException("初始化 HotspotPluginClassLoader 失败: " + e.getMessage(), e);
        }
    }

    /**
     * 根据版本选择性初始化类加载器
     *
     * @param libPath lib 目录路径
     * @param detectedVersions 检测到的框架版本
     * @return HotspotPluginClassLoader 实例
     * @throws RuntimeException 初始化失败时抛出
     */
    public static synchronized HotspotPluginClassLoader initializeWithVersionSelection(
            String libPath, java.util.Map<String, String> detectedVersions) {
        if (instance != null) {
            return instance;
        }

        try {
            List<URL> urls = new ArrayList<>();
            File libDir = new File(libPath);
            File baseDir = libDir.getParentFile();
            
            System.out.println("[DEBUG] libPath: " + libPath);
            System.out.println("[DEBUG] baseDir: " + (baseDir != null ? baseDir.getAbsolutePath() : "null"));
            
            // 1. 加载 libs 目录
            if (libDir.exists() && libDir.isDirectory()) {
                VersionSelector selector = new DefaultVersionSelector();
                List<File> selectedJars = selector.selectJarFiles(libDir, detectedVersions);
                for (File jarFile : selectedJars) {
                    try {
                        urls.add(jarFile.toURI().toURL());
                    } catch (java.net.MalformedURLException e) {
                        System.out.println("[WARN] 无法转换 JAR 文件为 URL: " + jarFile.getAbsolutePath());
                    }
                }
                System.out.println("[INFO] 从 libs 目录加载了 " + selectedJars.size() + " 个 JAR 文件");
            } else {
                System.out.println("[WARN] libs 目录不存在: " + libPath);
            }
            
            // 2. 加载 plugins 目录（包含插件 JAR，排除 deny 的插件）
            if (baseDir != null) {
                File pluginsDir = new File(baseDir, "plugins");
                System.out.println("[DEBUG] pluginsDir: " + pluginsDir.getAbsolutePath());
                if (pluginsDir.exists() && pluginsDir.isDirectory()) {
                    List<URL> pluginUrls = scanPluginJarFiles(pluginsDir);
                    urls.addAll(pluginUrls);
                    System.out.println("[INFO] 从 plugins 目录加载了 " + pluginUrls.size() + " 个 JAR 文件");
                    // 打印加载的插件 JAR 文件
                    for (URL url : pluginUrls) {
                        System.out.println("[DEBUG] 加载插件: " + url);
                    }
                } else {
                    System.out.println("[WARN] plugins 目录不存在: " + pluginsDir.getAbsolutePath());
                }
            }

            if (urls.isEmpty()) {
                System.out.println("[WARN] 未找到任何 JAR 文件");
            }

            // 使用加载本类的 ClassLoader 作为父类加载器（即 HotspotClassLoader）
            // 这样插件类可以访问 core 模块的类（如 BytebuddyPlugin）
            // HotspotPluginClassLoader 由 HotspotClassLoader 加载，所以 getClassLoader() 返回 HotspotClassLoader
            ClassLoader parentClassLoader = HotspotPluginClassLoader.class.getClassLoader();
            if (parentClassLoader == null) {
                // 如果由 Bootstrap CL 加载（不应该发生），回退到线程上下文 CL
                parentClassLoader = Thread.currentThread().getContextClassLoader();
            }
            if (parentClassLoader == null) {
                parentClassLoader = ClassLoader.getSystemClassLoader();
            }

            instance = new HotspotPluginClassLoader(
                urls.toArray(new URL[0]),
                parentClassLoader
            );

            return instance;
        } catch (Exception e) {
            throw new RuntimeException("初始化 HotspotPluginClassLoader 失败: " + e.getMessage(), e);
        }
    }

    /**
     * 扫描目录下的所有 JAR 文件
     *
     * @param dir 要扫描的目录
     * @return JAR 文件的 URL 列表
     */
    private static List<URL> scanJarFiles(File dir) {
        List<URL> urls = new ArrayList<>();
        scanJarFilesRecursive(dir, urls);
        return urls;
    }

    /**
     * 递归扫描目录下的所有 JAR 文件
     *
     * @param dir 要扫描的目录
     * @param urls URL 列表（输出参数）
     */
    private static void scanJarFilesRecursive(File dir, List<URL> urls) {
        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }

        for (File file : files) {
            if (file.isDirectory()) {
                // 递归扫描子目录
                scanJarFilesRecursive(file, urls);
            } else if (file.isFile() && file.getName().toLowerCase().endsWith(".jar")) {
                try {
                    urls.add(file.toURI().toURL());
                } catch (MalformedURLException e) {
                    // 忽略无法转换的 JAR 文件
                }
            }
        }
    }
    
    /**
     * 扫描 plugins 目录下的 JAR 文件，排除被 deny 的插件
     *
     * @param pluginsDir plugins 目录
     * @return JAR 文件的 URL 列表
     */
    private static List<URL> scanPluginJarFiles(File pluginsDir) {
        List<URL> urls = new ArrayList<>();
        
        // 获取 denyPlugin 配置
        Set<String> denyPlugins = getDenyPlugins();
        
        File[] files = pluginsDir.listFiles();
        if (files == null) {
            return urls;
        }
        
        for (File file : files) {
            if (file.isFile() && file.getName().toLowerCase().endsWith(".jar")) {
                String jarName = file.getName().toLowerCase();
                
                // 检查是否被 deny
                boolean denied = false;
                for (String denyPlugin : denyPlugins) {
                    if (!denyPlugin.isEmpty() && jarName.contains(denyPlugin.toLowerCase())) {
                        System.out.println("[INFO] 跳过被禁用的插件: " + file.getName());
                        denied = true;
                        break;
                    }
                }
                
                if (!denied) {
                    try {
                        urls.add(file.toURI().toURL());
                    } catch (MalformedURLException e) {
                        // 忽略无法转换的 JAR 文件
                    }
                }
            }
        }
        
        return urls;
    }
    
    /**
     * 获取被禁用的插件列表
     *
     * @return 被禁用的插件名称集合
     */
    private static Set<String> getDenyPlugins() {
        Set<String> denyPlugins = new HashSet<>();
        
        // 从系统属性获取
        String denyPlugin = System.getProperty("hotspot.denyPlugin", "");
        if (!denyPlugin.isEmpty()) {
            for (String s : denyPlugin.split(",")) {
                denyPlugins.add(s.trim());
            }
        }
        
        // 从环境变量获取
        String envDenyPlugin = System.getenv("HOTSPOT_DENY_PLUGIN");
        if (envDenyPlugin != null && !envDenyPlugin.isEmpty()) {
            for (String s : envDenyPlugin.split(",")) {
                denyPlugins.add(s.trim());
            }
        }
        
        return denyPlugins;
    }

    /**
     * 获取 lib 目录路径
     * <p>
     * 优先级：系统属性 > 环境变量 > Agent JAR 父目录的 libs
     * </p>
     * <p>
     * 目录结构：
     * <pre>
     * output/
     *   ├── libs/           # 共用的三方依赖
     *   ├── plugins/        # 共用的插件
     *   ├── java8/          # Java 8 agent jar
     *   ├── java17/         # Java 17 agent jar
     *   └── java21/         # Java 21 agent jar
     * </pre>
     * </p>
     *
     * @param agentJarPath Agent JAR 文件路径
     * @return lib 目录路径
     */
    public static String getLibPath(String agentJarPath) {
        // 1. 从系统属性获取
        String libPath = System.getProperty("hotspot.lib.path");
        if (libPath != null && !libPath.isEmpty()) {
            return libPath;
        }

        // 2. 从环境变量获取
        libPath = System.getenv("HOTSPOT_LIB_PATH");
        if (libPath != null && !libPath.isEmpty()) {
            return libPath;
        }

        // 3. 新结构：Agent JAR 在 java8/java17/java21 目录，libs 在父目录
        if (agentJarPath != null && !agentJarPath.isEmpty()) {
            File agentJar = new File(agentJarPath);
            File versionDir = agentJar.getParentFile(); // java8/, java17/, java21/
            if (versionDir != null) {
                File baseDir = versionDir.getParentFile(); // output/
                if (baseDir != null) {
                    // 优先在父目录查找（新结构）
                    File libDir = new File(baseDir, "libs");
                    if (libDir.exists() && libDir.isDirectory()) {
                        return libDir.getAbsolutePath();
                    }
                }
                // 回退到同级目录（旧结构兼容）
                File libDir = new File(versionDir, "libs");
                if (libDir.exists() && libDir.isDirectory()) {
                    return libDir.getAbsolutePath();
                }
            }
        }

        // 4. 最后尝试当前目录下的 libs
        return new File("libs").getAbsolutePath();
    }

}
