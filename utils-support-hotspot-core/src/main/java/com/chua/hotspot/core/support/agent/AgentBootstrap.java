package com.chua.hotspot.core.support.agent;

import com.chua.hotspot.core.support.classloader.HotspotPluginClassLoader;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.PluginFactory;
import com.chua.hotspot.core.support.server.ServerFactory;
import com.chua.hotspot.core.support.spy.SpyHandlerImpl;
import com.chua.hotspot.spy.Spy;
import org.hotswap.agent.HotswapAgent;

import java.io.File;
import java.lang.instrument.Instrumentation;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Agent 核心启动入口
 * <p>
 * 由 agent 薄壳通过反射调用，在 HotspotPluginClassLoader 中执行所有核心初始化逻辑。
 * agent 模块只负责：1.注入spy.jar到BootstrapCL 2.创建HotspotPluginClassLoader 3.反射调用本类
 * </p>
 *
 * <h3>调用链路：</h3>
 * <pre>
 * Agent.premain/agentmain (agent薄壳, System CL)
 *     → injectSpyToBootstrap()           (注入spy.jar到Bootstrap CL)
 *     → new HotspotPluginClassLoader()    (加载core.jar + libs/ + plugins/)
 *     → AgentBootstrap.main()             (反射调用, 在HotspotPluginClassLoader中)
 *         → 初始化所有工厂
 *         → Spy.setHandler(spyHandler)    (注入SpyHandlerImpl到Spy)
 *         → AgentFactory.init()           (构建ByteBuddy AgentBuilder)
 *         → ServerFactory.init()          (启动API服务)
 * </pre>
 *
 * @author CH
 * @since 4.0.0.37
 */
public class AgentBootstrap {

    /** 是否已初始化（幂等保护） */
    private static volatile boolean initialized = false;

    /** 是否为 attach 模式 */
    private static volatile boolean attachMode = false;

    /**
     * 核心启动入口 - 由 agent 薄壳通过反射调用
     *
     * @param args           启动参数
     * @param instrumentation Instrumentation 实例
     * @param isAttachMode   是否为 attach 模式
     */
    public static void main(String args, Instrumentation instrumentation, boolean isAttachMode) {
        if (initialized) {
            LogFactory.getInstance().warn("AgentBootstrap 已初始化，跳过重复初始化（{}模式）",
                    isAttachMode ? "attach" : "premain");
            return;
        }

        attachMode = isAttachMode;
        String modeLabel = isAttachMode ? "attach" : "premain";
        System.out.println("[INFO] Hotspot Agent Bootstrap 启动模式: " + modeLabel);

        try {
            // 1. 初始化自定义 ClassLoader（attach 模式下降级处理）
            initializeClassLoader(isAttachMode);

            // 2. 初始化 HotswapAgent（attach 模式下跳过）
            if (!isAttachMode) {
                initHotswapAgent(args, instrumentation);
            } else {
                System.out.println("[INFO] attach 模式：跳过 HotswapAgent 初始化（JVM 已运行，热重载功能不可用）");
            }

            // 3. 初始化各个工厂（带幂等保护）
            InstrumentationFactory.getInstance().init(instrumentation);
            EnvironmentFactory.getInstance().init(args);
            LogFactory.getInstance().init();
            PluginFactory.getInstance().init();

            // 4. 初始化 Spy 桥接模式
            SpyHandlerImpl spyHandler = new SpyHandlerImpl();
            spyHandler.init();
            Spy.setHandler(spyHandler);
            AgentFactory.getInstance().setSpyHandler(spyHandler);
            LogFactory.getInstance().info("Spy 桥接模式已启用，SpyHandler 已注册");

            // 5. 初始化 AgentFactory（构建 ByteBuddy AgentBuilder 并安装）
            AgentFactory.getInstance().init(isAttachMode);

            // 6. API 服务接口
            ServerFactory.getInstance().init();

            initialized = true;
            LogFactory.getInstance().info("Hotspot Agent 启动成功（{}模式）", modeLabel);
        } catch (Exception e) {
            LogFactory.getInstance().error("Hotspot Agent 启动失败: {}", e.getMessage(), e);
            if (!isAttachMode) {
                // premain 模式下启动失败抛出异常，阻止 JVM 启动
                throw new RuntimeException("Agent 启动失败", e);
            }
            // attach 模式下启动失败仅记录日志，不影响运行中的应用
            System.err.println("[ERROR] Agent attach 模式启动失败: " + e.getMessage());
        }
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

    /**
     * 初始化自定义 ClassLoader
     */
    private static void initializeClassLoader(boolean isAttachMode) {
        try {
            // attach 模式下：如果 ClassLoader 已存在，跳过初始化
            if (isAttachMode && HotspotPluginClassLoader.getInstance() != null) {
                System.out.println("[INFO] attach 模式：ClassLoader 已存在，跳过初始化");
                return;
            }

            // 1. 获取 Agent JAR 文件路径
            String agentJarPath = getAgentJarPath();
            System.out.println("[INFO] Agent JAR 路径: " + agentJarPath);

            // 2. 获取 lib 目录路径
            String libPath = HotspotPluginClassLoader.getLibPath(agentJarPath);
            System.out.println("[INFO] lib 目录路径: " + libPath);

            // 3. 检测目标应用使用的框架版本
            System.out.println("[INFO] 检测目标应用框架版本...");
            Map<String, String> detectedVersions = detectApplicationVersions();

            // 4. 根据检测到的版本选择性初始化 ClassLoader
            System.out.println("[INFO] 根据应用版本选择性加载 JAR 文件...");
            HotspotPluginClassLoader classLoader =
                    HotspotPluginClassLoader.initializeWithVersionSelection(libPath, detectedVersions);

            // 5. 设置线程上下文 ClassLoader（attach 模式下不覆盖）
            if (!isAttachMode) {
                Thread.currentThread().setContextClassLoader(classLoader);
                System.out.println("[INFO] 自定义 ClassLoader 初始化完成");
            } else {
                System.out.println("[INFO] attach 模式：ClassLoader 初始化完成（未覆盖线程上下文 ClassLoader）");
            }
        } catch (Exception e) {
            System.err.println("[WARN] 初始化 ClassLoader 失败，将使用默认 ClassLoader: " + e.getMessage());
        }
    }

    /**
     * 初始化 HotswapAgent
     */
    private static void initHotswapAgent(String args, Instrumentation instrumentation) {
        try {
            HotswapAgent.premain(args, instrumentation);
            LogFactory.getInstance().info("HotswapAgent 初始化成功，热重载功能已启用");
        } catch (Throwable e) {
            LogFactory.getInstance().warn("HotswapAgent 初始化失败（可能 JVM 不支持）: {}", e.getMessage());
        }
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
                    if (agentFile.exists() && agentFile.getName().contains("hotspot-agent")) {
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
     * 检测目标应用使用的框架版本
     */
    private static Map<String, String> detectApplicationVersions() {
        Map<String, String> versions = new HashMap<>();
        String classpath = System.getProperty("java.class.path", "");
        String[] paths = classpath.split(File.pathSeparator);

        for (String path : paths) {
            String lowerPath = path.toLowerCase();

            // Undertow
            if (lowerPath.contains("undertow-core")) {
                versions.put("undertow", "2");
                versions.put("tomcat", "0");
                versions.put("jetty", "0");
            }
            // Jetty
            if (lowerPath.contains("jetty-server")) {
                if (lowerPath.contains("11.") || lowerPath.contains("-11.") ||
                    lowerPath.contains("12.") || lowerPath.contains("-12.")) {
                    versions.put("jetty", "11");
                } else if (lowerPath.contains("10.") || lowerPath.contains("-10.")) {
                    versions.put("jetty", "10");
                } else if (lowerPath.contains("9.") || lowerPath.contains("-9.")) {
                    versions.put("jetty", "9");
                } else {
                    versions.put("jetty", "11");
                }
                versions.put("tomcat", "0");
            }
            // Tomcat
            if (lowerPath.contains("tomcat-embed-core")) {
                if (lowerPath.contains("10.") || lowerPath.contains("-10.")) {
                    versions.put("tomcat", "10");
                } else if (lowerPath.contains("9.") || lowerPath.contains("-9.")) {
                    versions.put("tomcat", "9");
                }
            }
            // Spring
            if (lowerPath.contains("spring-core") || lowerPath.contains("spring-context")) {
                if (lowerPath.contains("6.") || lowerPath.contains("-6.")) {
                    versions.put("spring", "6");
                } else if (lowerPath.contains("5.") || lowerPath.contains("-5.")) {
                    versions.put("spring", "5");
                }
            }
            // Dubbo
            if (lowerPath.contains("dubbo")) {
                if (lowerPath.contains("3.") || lowerPath.contains("-3.")) {
                    versions.put("dubbo", "3");
                } else if (lowerPath.contains("2.") || lowerPath.contains("-2.")) {
                    versions.put("dubbo", "2");
                }
            }
            // Netty
            if (lowerPath.contains("netty-common") || lowerPath.contains("netty-all")) {
                versions.put("netty", "4");
            }
        }

        // 通过类存在性补充检测
        if (!versions.containsKey("tomcat") && !versions.containsKey("undertow") && !versions.containsKey("jetty")) {
            try {
                Class.forName("io.undertow.Undertow", false, ClassLoader.getSystemClassLoader());
                versions.put("undertow", "2");
                versions.put("tomcat", "0");
                versions.put("jetty", "0");
            } catch (ClassNotFoundException ignored) {
                try {
                    Class.forName("org.eclipse.jetty.server.Server", false, ClassLoader.getSystemClassLoader());
                    versions.put("jetty", "11");
                    versions.put("tomcat", "0");
                } catch (ClassNotFoundException ignored2) {
                    try {
                        Class.forName("org.apache.catalina.startup.Tomcat", false, ClassLoader.getSystemClassLoader());
                        try {
                            Class.forName("jakarta.servlet.Servlet", false, ClassLoader.getSystemClassLoader());
                            versions.put("tomcat", "10");
                        } catch (ClassNotFoundException e2) {
                            versions.put("tomcat", "9");
                        }
                    } catch (ClassNotFoundException ignored3) {
                        // 无 Web 容器
                    }
                }
            }
        }

        System.out.println("[INFO] 框架版本检测结果: " + versions);
        return versions;
    }
}