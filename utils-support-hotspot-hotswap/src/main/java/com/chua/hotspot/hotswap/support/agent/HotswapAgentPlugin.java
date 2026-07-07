package com.chua.hotspot.hotswap.support.agent;

import org.hotswap.agent.annotation.Init;
import org.hotswap.agent.annotation.LoadEvent;
import org.hotswap.agent.annotation.OnClassLoadEvent;
import org.hotswap.agent.annotation.Plugin;
import org.hotswap.agent.command.Scheduler;
import org.hotswap.agent.javassist.CtClass;
import org.hotswap.agent.logging.AgentLogger;

/**
 * HotswapAgent 热重载插件
 * <p>
 * 这是一个简单的 HotswapAgent 插件，用于记录类热重载事件。
 * HotswapAgent 本身已经实现了热重载功能，此插件仅用于日志记录和事件通知。
 * </p>
 *
 * <h3>使用方式：</h3>
 * <p>1. 在 hotswap-agent.properties 中配置：</p>
 * <pre>
 * pluginPackages=com.chua.hotspot.hotswap.support.agent
 * </pre>
 *
 * <p>2. 启动应用：</p>
 * <pre>
 * # Java 17/21 (JetBrains Runtime 推荐)
 * java -XX:+AllowEnhancedClassRedefinition -XX:HotswapAgent=fatjar -jar app.jar
 *
 * # Java 11 (需要 DCEVM)
 * java -XX:HotswapAgent=fatjar -jar app.jar
 *
 * # Java 8 (需要 DCEVM)
 * java -XXaltjvm=dcevm -javaagent:hotswap-agent.jar -jar app.jar
 * </pre>
 *
 * <h3>HotswapAgent 会自动处理：</h3>
 * <ul>
 *     <li>类字节码热替换</li>
 *     <li>Spring Bean 重新加载（需要 Spring 插件）</li>
 *     <li>MyBatis/Hibernate 等框架支持（需要对应插件）</li>
 * </ul>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.35
 * @see <a href="https://github.com/HotswapProjects/HotswapAgent">HotswapAgent GitHub</a>
 */
@Plugin(
        name = "HotspotPlugin",
        description = "Hotspot 热重载日志插件",
        testedVersions = {"1.4.1"},
        expectedVersions = {"1.4.x"}
)
public class HotswapAgentPlugin {

    private static final AgentLogger LOGGER = AgentLogger.getLogger(HotswapAgentPlugin.class);

    /**
     * 调度器
     */
    @Init
    Scheduler scheduler;

    /**
     * 应用类加载器
     */
    @Init
    ClassLoader appClassLoader;

    /**
     * 插件初始化
     */
    @Init
    public void init() {
        LOGGER.info("HotspotPlugin 已初始化，HotswapAgent 热重载功能已启用");
    }

    /**
     * 监听类热重载事件
     * <p>
     * HotswapAgent 会自动完成类的热替换，此方法仅用于记录日志。
     * </p>
     *
     * @param ctClass 被重载的类
     */
    @OnClassLoadEvent(classNameRegexp = ".*", events = LoadEvent.REDEFINE)
    public static void onClassRedefine(CtClass ctClass) {
        if (ctClass != null) {
            LOGGER.info("类已热重载: {}", ctClass.getName());
        }
    }
}
