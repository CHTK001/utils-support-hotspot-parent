package com.chua.hotspot.agent.support;

import com.chua.hotspot.agent.support.agent.AgentFactory;
import com.chua.hotspot.core.support.classloader.HotspotPluginClassLoader;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.PluginFactory;
import com.chua.hotspot.core.support.server.ServerFactory;
import org.hotswap.agent.HotswapAgent;

import java.io.File;
import java.lang.instrument.Instrumentation;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Hotspot Agent 入口类
 * <p>
 * 集成 HotswapAgent 实现热重载功能。
 * </p>
 * 
 * <h3>启动方式：</h3>
 * <pre>
 * # Java 17/21 (JetBrains Runtime)
 * java -XX:+AllowEnhancedClassRedefinition \
 *      -javaagent:utils-support-hotspot-agent.jar \
 *      -jar app.jar
 * </pre>
 * 
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.35
 */
public class Agent {

    public static void premain(String args, Instrumentation instrumentation) {
        try {
            // 1. 初始化自定义 ClassLoader（检测应用版本并选择性加载 JAR）
            initializeClassLoader();
            
            // 2. 初始化 HotswapAgent（需要 JetBrains Runtime 或 DCEVM）
            initHotswapAgent(args, instrumentation);
            
            // 3. 初始化各个工厂
            InstrumentationFactory.getInstance().init(instrumentation);
            EnvironmentFactory.getInstance().init(args);
            LogFactory.getInstance().init();
            PluginFactory.getInstance().init();
            // ReportFactory 延迟初始化，等待 Spring 启动后由插件触发
            AgentFactory.getInstance().init();
            // API 服务接口
            ServerFactory.getInstance().init();
            
            LogFactory.getInstance().info("Hotspot Agent 启动成功");
        } catch (Exception e) {
            LogFactory.getInstance().error("Hotspot Agent 启动失败: {}", e.getMessage(), e);
            throw new RuntimeException("Agent 启动失败", e);
        }
    }
    
    /**
     * 初始化 HotswapAgent
     * <p>
     * 尝试初始化 HotswapAgent，如果 JVM 不支持则跳过。
     * 需要 JetBrains Runtime 或 DCEVM 才能正常工作。
     * </p>
     *
     * @param args            启动参数
     * @param instrumentation Instrumentation 实例
     */
    private static void initHotswapAgent(String args, Instrumentation instrumentation) {
        try {
            // 调用 HotswapAgent 的 premain 方法
            HotswapAgent.premain(args, instrumentation);
            LogFactory.getInstance().info("HotswapAgent 初始化成功，热重载功能已启用");
        } catch (Throwable e) {
            // HotswapAgent 初始化失败不影响主流程
            LogFactory.getInstance().warn("HotswapAgent 初始化失败（可能 JVM 不支持）: {}", e.getMessage());
        }
    }
    
    /**
     * 初始化自定义 ClassLoader
     * 流程：先检测应用版本 -> 根据版本选择性加载 JAR -> 初始化 ClassLoader
     */
    private static void initializeClassLoader() {
        try {
            // 1. 获取 Agent JAR 文件路径
            String agentJarPath = getAgentJarPathSimple();
            System.out.println("[INFO] Agent JAR 路径: " + agentJarPath);
            
            // 2. 获取 lib 目录路径
            String libPath = HotspotPluginClassLoader.getLibPath(agentJarPath);
            System.out.println("[INFO] lib 目录路径: " + libPath);
            
            // 3. 检测目标应用使用的框架版本（通过应用 classpath）
            System.out.println("[INFO] 检测目标应用框架版本...");
            Map<String, String> detectedVersions = detectApplicationVersions();
            
            // 4. 根据检测到的版本选择性初始化 ClassLoader
            System.out.println("[INFO] 根据应用版本选择性加载 JAR 文件...");
            HotspotPluginClassLoader classLoader =
                    HotspotPluginClassLoader.initializeWithVersionSelection(libPath, detectedVersions);
            
            // 5. 设置线程上下文 ClassLoader
            Thread.currentThread().setContextClassLoader(classLoader);
            System.out.println("[INFO] 自定义 ClassLoader 初始化完成");
        } catch (Exception e) {
            System.err.println("[WARN] 初始化 ClassLoader 失败，将使用默认 ClassLoader: " + e.getMessage());
            // 不抛出异常，允许降级使用默认 ClassLoader
        }
    }
    
    /**
     * 检测目标应用使用的框架版本
     * 通过应用的 classpath 来判断，而非 Agent 的 libs 目录
     *
     * @return 框架名称 -> 主版本号映射
     */
    private static Map<String, String> detectApplicationVersions() {
        Map<String, String> versions = new HashMap<>();
        
        // 获取应用 classpath
        String classpath = System.getProperty("java.class.path", "");
        String[] paths = classpath.split(File.pathSeparator);
        
        for (String path : paths) {
            String lowerPath = path.toLowerCase();
            
            // =============== 检测 Undertow（优先检测，因为 Undertow 和 Tomcat 互斥） ===============
            if (lowerPath.contains("undertow-core")) {
                versions.put("undertow", "2");
                System.out.println("[INFO] 检测到应用使用 Undertow");
                // 如果使用 Undertow，明确标记不使用 Tomcat 和 Jetty
                versions.put("tomcat", "0");
                versions.put("jetty", "0");
            }
            
            // =============== 检测 Jetty（与 Tomcat 互斥） ===============
            if (lowerPath.contains("jetty-server")) {
                // Jetty 9.x 使用 javax.servlet, Jetty 10+/11+ 使用 jakarta.servlet
                if (lowerPath.contains("11.") || lowerPath.contains("-11.") ||
                    lowerPath.contains("12.") || lowerPath.contains("-12.")) {
                    versions.put("jetty", "11");
                    System.out.println("[INFO] 检测到应用使用 Jetty 11.x/12.x");
                } else if (lowerPath.contains("10.") || lowerPath.contains("-10.")) {
                    versions.put("jetty", "10");
                    System.out.println("[INFO] 检测到应用使用 Jetty 10.x");
                } else if (lowerPath.contains("9.") || lowerPath.contains("-9.")) {
                    versions.put("jetty", "9");
                    System.out.println("[INFO] 检测到应用使用 Jetty 9.x");
                } else {
                    versions.put("jetty", "11"); // 默认新版本
                    System.out.println("[INFO] 检测到应用使用 Jetty");
                }
                // 如果使用 Jetty，明确标记不使用 Tomcat
                versions.put("tomcat", "0");
            }
            
            // =============== 检测 Tomcat 版本 ===============
            if (lowerPath.contains("tomcat-embed-core")) {
                if (lowerPath.contains("10.") || lowerPath.contains("-10.")) {
                    versions.put("tomcat", "10");
                    System.out.println("[INFO] 检测到应用使用 Tomcat 10.x");
                } else if (lowerPath.contains("9.") || lowerPath.contains("-9.")) {
                    versions.put("tomcat", "9");
                    System.out.println("[INFO] 检测到应用使用 Tomcat 9.x");
                }
            }
            
            // =============== 检测 Spring 版本 ===============
            if (lowerPath.contains("spring-core") || lowerPath.contains("spring-context")) {
                if (lowerPath.contains("6.") || lowerPath.contains("-6.")) {
                    versions.put("spring", "6");
                    System.out.println("[INFO] 检测到应用使用 Spring 6.x");
                } else if (lowerPath.contains("5.") || lowerPath.contains("-5.")) {
                    versions.put("spring", "5");
                    System.out.println("[INFO] 检测到应用使用 Spring 5.x");
                }
            }
            
            // =============== 检测 Dubbo 版本 ===============
            if (lowerPath.contains("dubbo")) {
                if (lowerPath.contains("3.") || lowerPath.contains("-3.")) {
                    versions.put("dubbo", "3");
                    System.out.println("[INFO] 检测到应用使用 Dubbo 3.x");
                } else if (lowerPath.contains("2.") || lowerPath.contains("-2.")) {
                    versions.put("dubbo", "2");
                    System.out.println("[INFO] 检测到应用使用 Dubbo 2.x");
                }
            }
            
            // =============== 检测 Netty 版本 ===============
            if (lowerPath.contains("netty-common") || lowerPath.contains("netty-all")) {
                versions.put("netty", "4");
                System.out.println("[INFO] 检测到应用使用 Netty");
            }
        }
        
        // =============== 通过类存在性补充检测 ===============
        // 注意：只有在 classpath 检测不到时才进行
        if (!versions.containsKey("tomcat") && !versions.containsKey("undertow") && !versions.containsKey("jetty")) {
            // 先检测 Undertow
            try {
                Class.forName("io.undertow.Undertow", false, ClassLoader.getSystemClassLoader());
                versions.put("undertow", "2");
                versions.put("tomcat", "0");
                versions.put("jetty", "0");
                System.out.println("[INFO] 通过类检测到应用使用 Undertow");
            } catch (ClassNotFoundException ignored) {
                // 检测 Jetty
                try {
                    Class.forName("org.eclipse.jetty.server.Server", false, ClassLoader.getSystemClassLoader());
                    versions.put("jetty", "11");
                    versions.put("tomcat", "0");
                    System.out.println("[INFO] 通过类检测到应用使用 Jetty");
                } catch (ClassNotFoundException ignored2) {
                    // 检测 Tomcat
                    try {
                        Class.forName("org.apache.catalina.startup.Tomcat", false, ClassLoader.getSystemClassLoader());
                        try {
                            Class.forName("jakarta.servlet.Servlet", false, ClassLoader.getSystemClassLoader());
                            versions.put("tomcat", "10");
                            System.out.println("[INFO] 通过类检测到 Tomcat 10.x");
                        } catch (ClassNotFoundException e2) {
                            versions.put("tomcat", "9");
                            System.out.println("[INFO] 通过类检测到 Tomcat 9.x");
                        }
                    } catch (ClassNotFoundException e) {
                        System.out.println("[INFO] 应用未使用 Tomcat/Jetty/Undertow");
                    }
                }
            }
        }
        
        // 打印检测结果汇总
        System.out.println("[INFO] 框架版本检测结果: " + versions);
        
        return versions;
    }
    
    /**
     * Hotspot Agent JAR 文件名关键字
     */
    private static final String HOTSPOT_AGENT_KEYWORD = "hotspot-agent";
    
    /**
     * 简单获取 Agent JAR 路径（不使用 LogFactory，因为此时可能还未初始化）
     *
     * @return Agent JAR 文件路径
     */
    private static String getAgentJarPathSimple() {
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
     * 获取 Agent JAR 文件路径
     * <p>
     * 从 JVM 启动参数中获取 -javaagent 指定的路径，
     * 支持多个 agent 场景，通过文件名匹配 hotspot-agent
     * </p>
     * 
     * @return Agent JAR 文件路径
     */
    private static String getAgentJarPath() {
        try {
            RuntimeMXBean runtimeMxBean = ManagementFactory.getRuntimeMXBean();
            List<String> inputArguments = runtimeMxBean.getInputArguments();
            
            for (String arg : inputArguments) {
                // 匹配 -javaagent:/path/to/agent.jar 或 -javaagent:/path/to/agent.jar=options
                if (arg.startsWith("-javaagent:")) {
                    String agentPath = arg.substring("-javaagent:".length());
                    // 处理可能存在的参数（如 -javaagent:xxx.jar=options）
                    int equalsIndex = agentPath.indexOf('=');
                    if (equalsIndex > 0) {
                        agentPath = agentPath.substring(0, equalsIndex);
                    }
                    
                    File agentFile = new File(agentPath);
                    // 检查文件名是否包含 hotspot-agent 关键字
                    if (agentFile.exists() && agentFile.getName().contains(HOTSPOT_AGENT_KEYWORD)) {
                        LogFactory.getInstance().debug("从 JVM 参数获取到 Hotspot Agent 路径: {}", agentFile.getAbsolutePath());
                        return agentFile.getAbsolutePath();
                    }
                }
            }
            LogFactory.getInstance().warn("未找到包含 '{}' 的 -javaagent 启动参数", HOTSPOT_AGENT_KEYWORD);
        } catch (Exception e) {
            LogFactory.getInstance().warn("获取 Agent JAR 路径失败: {}", e.getMessage());
        }
        return null;
    }
}
