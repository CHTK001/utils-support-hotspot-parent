package com.chua.hotspot.logger.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.logger.support.plugin.LogPlugin;
import com.chua.hotspot.logger.support.plugin.SystemOutPlugin;

/**
 * Logger 插件注册
 * 支持 Logback、Log4j、System.out/System.err 日志检测
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(LogPlugin::new);
        PluginRegistry.registerPlugin(SystemOutPlugin::new);
    }
    
    public static void init() {}
}
