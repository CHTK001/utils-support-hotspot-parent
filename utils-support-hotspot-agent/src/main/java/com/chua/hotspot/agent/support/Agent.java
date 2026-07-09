package com.chua.hotspot.agent.support;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.lang.instrument.Instrumentation;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Enumeration;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Agent 薄壳入口 - 只做3件事
 * <p>
 * 1. 注入 spy.jar 到 Bootstrap ClassLoader
 * 2. 创建 HotspotClassLoader 加载 core.jar + libs/ + plugins/
 * 3. 反射调用 core 的 AgentBootstrap.main()
 * </p>
 *
 * <h3>架构设计：</h3>
 * <pre>
 * Agent (薄壳, System CL)
 *     │
 *     ├─ 1. injectSpyToBootstrap()        ← 注入 Spy 到 Bootstrap CL
 *     │
 *     ├─ 2. new HotspotClassLoader()       ← 加载 core + libs + plugins
 *     │
 *     └─ 3. AgentBootstrap.main()          ← 反射调用, 在 HotspotClassLoader 中
 *         │                                    所有核心逻辑都在 core 中执行
 *         ├─ Spy.setHandler(spyHandler)
 *         ├─ AgentFactory.init()
 *         └─ ServerFactory.init()
 * </pre>
 *
 * <h3>为什么 agent 必须是薄壳：</h3>
 * <ul>
 *   <li>agent JAR 由 System CL 加载，直接依赖 core 会导致类冲突</li>
 *   <li>Netty/Spring/Tomcat 等框架类在应用 CL 中，agent CL 无法向下可见</li>
 *   <li>通过 HotspotClassLoader 隔离，core 和插件可以独立加载和版本选择</li>
 *   <li>agent 只需要 spy.jar (provided) 和 JDK 核心类</li>
 * </ul>
 *
 * @author CH
 * @since 4.0.0.37
 */
public class Agent {

    /** Agent 是否已初始化（幂等保护） */
    private static volatile boolean initialized = false;

    /** 是否为 attach 模式 */
    private static volatile boolean attachMode = false;

    /** AgentBootstrap 入口类全限定名 */
    private static final String BOOTSTRAP_CLASS = "com.chua.hotspot.core.support.agent.AgentBootstrap";

    /** core JAR 文件名关键字 */
    private static final String CORE_JAR_KEYWORD = "hotspot-core";

    /** Agent JAR 文件名关键字 */
    private static final String HOTSPOT_AGENT_KEYWORD = "hotspot-agent";

    /**
     * premain 入口（-javaagent 方式加载）
     */
    public static void premain(String args, Instrumentation instrumentation) {
        initialize(args, instrumentation, false);
    }

    /**
     * agentmain 入口（运行时 attach 方式加载）
     */
    public static void agentmain(String args, Instrumentation instrumentation) {
        initialize(args, instrumentation, true);
    }

    /**
     * 统一初始化入口
     */
    private static synchronized void initialize(String args, Instrumentation instrumentation, boolean isAttachMode) {
        if (initialized) {
            System.out.println("[WARN] Hotspot Agent 已初始化，跳过重复初始化");
            return;
        }

        attachMode = isAttachMode;
        String modeLabel = isAttachMode ? "attach" : "premain";
        System.out.println("[INFO] Hotspot Agent 启动模式: " + modeLabel);

        try {
            // ========== 第1步：注入 Spy 到 Bootstrap ClassLoader ==========
            injectSpyToBootstrap(instrumentation, isAttachMode);

            // ========== 第2步：创建 HotspotClassLoader ==========
            HotspotClassLoader classLoader = createClassLoader(isAttachMode);
            if (classLoader == null) {
                System.err.println("[ERROR] 无法创建 HotspotClassLoader，Agent 启动失败");
                if (!isAttachMode) {
                    throw new RuntimeException("无法创建 HotspotClassLoader");
                }
                return;
            }

            // ========== 第3步：反射调用 AgentBootstrap.main() ==========
            invokeBootstrap(args, instrumentation, isAttachMode, classLoader);

            initialized = true;
            System.out.println("[INFO] Hotspot Agent 薄壳启动完成（" + modeLabel + "模式）");
        } catch (Exception e) {
            System.err.println("[ERROR] Hotspot Agent 启动失败: " + e.getMessage());
            e.printStackTrace();
            if (!isAttachMode) {
                throw new RuntimeException("Agent 启动失败", e);
            }
        }
    }

    /**
     * 注入 Spy 桥接类到 Bootstrap ClassLoader
     */
    private static void injectSpyToBootstrap(Instrumentation instrumentation, boolean isAttachMode) {
        try {
            // 1. 定位 spy.jar
            File spyJar = locateSpyJar();
            if (spyJar == null || !spyJar.exists()) {
                System.err.println("[WARN] 未找到 spy.jar，Spy 桥接模式可能无法正常工作");
                return;
            }

            // 2. 追加到 Bootstrap ClassLoader 搜索路径
            instrumentation.appendToBootstrapClassLoaderSearch(new java.util.jar.JarFile(spyJar));
            System.out.println("[INFO] Spy 桥接类已注入 Bootstrap ClassLoader: " + spyJar.getAbsolutePath());

            // 3. 验证
            try {
                Class<?> spyClass = Class.forName("com.chua.hotspot.spy.Spy", false, null);
                System.out.println("[INFO] Spy 类验证成功，ClassLoader: " + spyClass.getClassLoader());
            } catch (ClassNotFoundException e) {
                System.err.println("[ERROR] Spy 类注入后仍无法从 Bootstrap CL 加载: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("[ERROR] 注入 Spy 到 Bootstrap CL 失败: " + e.getMessage());
            if (!isAttachMode) {
                throw new RuntimeException("Spy 注入失败", e);
            }
        }
    }

    /**
     * 创建 HotspotClassLoader
     */
    private static HotspotClassLoader createClassLoader(boolean isAttachMode) {
        try {
            String agentJarPath = getAgentJarPath();
            System.out.println("[INFO] Agent JAR 路径: " + agentJarPath);

            return new HotspotClassLoader(agentJarPath, Agent.class.getClassLoader());
        } catch (Exception e) {
            System.err.println("[ERROR] 创建 HotspotClassLoader 失败: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 反射调用 AgentBootstrap.main()
     */
    private static void invokeBootstrap(String args, Instrumentation instrumentation, boolean isAttachMode,
                                         HotspotClassLoader classLoader) {
        try {
            Class<?> bootstrapClass = classLoader.loadClass(BOOTSTRAP_CLASS);
            java.lang.reflect.Method mainMethod = bootstrapClass.getMethod(
                    "main", String.class, Instrumentation.class, boolean.class);
            mainMethod.invoke(null, args, instrumentation, isAttachMode);
        } catch (Exception e) {
            System.err.println("[ERROR] 调用 AgentBootstrap.main() 失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("AgentBootstrap 调用失败", e);
        }
    }

    /**
     * 定位 spy.jar 文件
     */
    private static File locateSpyJar() {
        try {
            String agentJarPath = getAgentJarPath();
            if (agentJarPath != null) {
                File agentJar = new File(agentJarPath);
                File agentDir = agentJar.getParentFile();

                // 1. Agent JAR 同级目录
                if (agentDir != null) {
                    File spyJar = new File(agentDir, "spy.jar");
                    if (spyJar.exists()) {
                        return spyJar;
                    }
                }

                // 2. libs 目录
                if (agentDir != null) {
                    File libsDir = new File(agentDir, "libs");
                    if (libsDir.exists()) {
                        File spyJar = new File(libsDir, "spy.jar");
                        if (spyJar.exists()) {
                            return spyJar;
                        }
                    }
                    // 父级目录
                    File parentDir = agentDir.getParentFile();
                    if (parentDir != null) {
                        File spyJar = new File(parentDir, "spy.jar");
                        if (spyJar.exists()) {
                            return spyJar;
                        }
                        File parentLibs = new File(parentDir, "libs");
                        if (parentLibs.exists()) {
                            spyJar = new File(parentLibs, "spy.jar");
                            if (spyJar.exists()) {
                                return spyJar;
                            }
                        }
                    }
                }

                // 3. 从 Agent JAR 内部提取
                File extractedSpyJar = extractSpyJarFromAgentJar(agentJar);
                if (extractedSpyJar != null) {
                    return extractedSpyJar;
                }
            }

            // 4. 从系统属性查找
            String spyJarPath = System.getProperty("hotspot.spy.jar.path");
            if (spyJarPath != null && !spyJarPath.isEmpty()) {
                File spyJar = new File(spyJarPath);
                if (spyJar.exists()) {
                    return spyJar;
                }
            }
        } catch (Exception e) {
            System.err.println("[WARN] 定位 spy.jar 失败: " + e.getMessage());
        }
        return null;
    }

    /**
     * 从 Agent JAR 中提取 spy.jar
     */
    private static File extractSpyJarFromAgentJar(File agentJar) {
        try (ZipFile zipFile = new ZipFile(agentJar)) {
            String[] possiblePaths = {"spy.jar", "BOOT-INF/lib/spy.jar", "lib/spy.jar"};
            for (String path : possiblePaths) {
                ZipEntry entry = zipFile.getEntry(path);
                if (entry != null) {
                    File tempDir = new File(System.getProperty("java.io.tmpdir"), "hotspot-spy");
                    if (!tempDir.exists()) {
                        tempDir.mkdirs();
                    }
                    File spyJar = new File(tempDir, "spy.jar");
                    try (InputStream is = zipFile.getInputStream(entry);
                         FileOutputStream fos = new FileOutputStream(spyJar)) {
                        byte[] buffer = new byte[4096];
                        int bytesRead;
                        while ((bytesRead = is.read(buffer)) != -1) {
                            fos.write(buffer, 0, bytesRead);
                        }
                    }
                    System.out.println("[INFO] 从 Agent JAR 提取 spy.jar 到: " + spyJar.getAbsolutePath());
                    return spyJar;
                }
            }
        } catch (Exception e) {
            System.err.println("[WARN] 从 Agent JAR 提取 spy.jar 失败: " + e.getMessage());
        }
        return null;
    }

    /**
     * 获取 Agent JAR 路径
     */
    private static String getAgentJarPath() {
        try {
            RuntimeMXBean runtimeMxBean = ManagementFactory.getRuntimeMXBean();
            List<String> inputArguments = runtimeMxBean.getInputArguments();
            for (String arg : inputArguments) {
                if (arg.startsWith("-javaagent:")) {
                    String agentPath = arg.substring("-javaagent:".length());
                    int equalsIndex = agentPath.indexOf('=');
                    if (equalsIndex > 0) {
                        agentPath = agentPath.substring(0, equalsIndex);
                    }
                    File agentFile = new File(agentPath);
                    if (agentFile.exists() && agentFile.getName().contains(HOTSPOT_AGENT_KEYWORD)) {
                        return agentFile.getAbsolutePath();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[WARN] 获取 Agent JAR 路径失败: " + e.getMessage());
        }
        return null;
    }

    /**
     * 查询 Agent 是否已初始化
     */
    public static boolean isInitialized() {
        return initialized;
    }

    /**
     * 查询是否为 attach 模式
     */
    public static boolean isAttachMode() {
        return attachMode;
    }
}