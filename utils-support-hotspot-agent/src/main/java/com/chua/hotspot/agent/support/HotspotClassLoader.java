package com.chua.hotspot.agent.support;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;

/**
 * Agent 专用的类加载器 - 加载 core.jar + libs/ + plugins/
 * <p>
 * agent 薄壳通过此类加载器加载 core 和所有依赖，实现 agent 与 core 的 ClassLoader 隔离。
 * core 和插件在同一个 ClassLoader 中，可以直接调用，不需要反射。
 * </p>
 *
 * <h3>类加载策略：</h3>
 * <ul>
 *   <li>com.chua.hotspot.core.* → 子类优先（先自己加载）</li>
 *   <li>com.chua.hotspot.spy.* → 父类优先（Bootstrap CL 中的 Spy 类）</li>
 *   <li>其他类 → 父类优先（避免与应用冲突）</li>
 * </ul>
 *
 * <h3>目录结构：</h3>
 * <pre>
 * output/
 *   ├── libs/           # 三方依赖 (byte-buddy, javassist 等)
 *   ├── plugins/        # 插件 JAR
 *   ├── java8/          # agent jar
 *   │     └── hotspot-agent.jar
 *   └── spy.jar         # Spy 桥接 JAR (注入 Bootstrap CL)
 * </pre>
 *
 * @author CH
 * @since 4.0.0.37
 */
public class HotspotClassLoader extends URLClassLoader {

    /** core JAR 文件名关键字 */
    private static final String CORE_JAR_KEYWORD = "hotspot-core";

    /**
     * 构造函数
     *
     * @param agentJarPath Agent JAR 路径（用于定位 libs/plugins 目录）
     * @param parent       父类加载器（agent 的 ClassLoader）
     */
    public HotspotClassLoader(String agentJarPath, ClassLoader parent) {
        super(scanJarUrls(agentJarPath), parent);
        System.out.println("[INFO] HotspotClassLoader 初始化完成，加载了 " + getURLs().length + " 个 URL");
    }

    /**
     * 重写类加载方法
     * <p>
     * core 模块的类使用子类优先模式，确保 agent 薄壳不会干扰 core 的类加载。
     * Spy 类必须由 Bootstrap CL 加载（父类优先）。
     * </p>
     */
    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            // 1. 检查是否已加载
            Class<?> loadedClass = findLoadedClass(name);
            if (loadedClass != null) {
                return loadedClass;
            }

            // 2. Spy 类必须由 Bootstrap CL 加载
            if (name.startsWith("com.chua.hotspot.spy.")) {
                return getParent().loadClass(name);
            }

            // 3. core 模块类：子类优先
            if (isCoreClass(name)) {
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

            // 4. 其他类：父类优先
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

            // 5. 最后尝试自己加载
            loadedClass = findClass(name);
            if (resolve) {
                resolveClass(loadedClass);
            }
            return loadedClass;
        }
    }

    /**
     * 判断是否为 core 模块类（子类优先加载）
     */
    private boolean isCoreClass(String name) {
        // core 模块和插件模块使用子类优先
        if (name.startsWith("com.chua.hotspot.core.")) {
            return true;
        }
        // 插件模块也使用子类优先
        if (name.startsWith("com.chua.hotspot.") && !name.startsWith("com.chua.hotspot.agent.")) {
            return true;
        }
        return false;
    }

    /**
     * 扫描 JAR 文件 URL
     * <p>
     * 查找策略：
     * 1. 从 Agent JAR 同级目录的 libs/ 加载三方依赖
     * 2. 从 Agent JAR 同级目录的 plugins/ 加载插件
     * 3. 从 Agent JAR 父级目录的 libs/ 和 plugins/ 加载（新目录结构）
     * </p>
     */
    private static URL[] scanJarUrls(String agentJarPath) {
        List<URL> urls = new ArrayList<>();

        if (agentJarPath != null) {
            File agentJar = new File(agentJarPath);
            File agentDir = agentJar.getParentFile();

            if (agentDir != null) {
                // 新目录结构：output/java8/agent.jar → output/libs/ + output/plugins/
                File baseDir = agentDir.getParentFile();
                if (baseDir != null) {
                    scanDir(urls, new File(baseDir, "libs"));
                    scanDir(urls, new File(baseDir, "plugins"));
                }

                // 旧目录结构：agent.jar 同级的 libs/ + plugins/
                scanDir(urls, new File(agentDir, "libs"));
                scanDir(urls, new File(agentDir, "plugins"));
            }
        }

        // 从系统属性获取额外路径
        String libPath = System.getProperty("hotspot.lib.path");
        if (libPath != null && !libPath.isEmpty()) {
            scanDir(urls, new File(libPath));
        }

        return urls.toArray(new URL[0]);
    }

    /**
     * 扫描目录下的所有 JAR 文件
     */
    private static void scanDir(List<URL> urls, File dir) {
        if (dir == null || !dir.exists() || !dir.isDirectory()) {
            return;
        }
        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }
        for (File file : files) {
            if (file.isDirectory()) {
                scanDir(urls, file);
            } else if (file.isFile() && file.getName().toLowerCase().endsWith(".jar")) {
                try {
                    urls.add(file.toURI().toURL());
                } catch (MalformedURLException e) {
                    System.err.println("[WARN] 无法转换 JAR 文件为 URL: " + file.getAbsolutePath());
                }
            }
        }
    }
}