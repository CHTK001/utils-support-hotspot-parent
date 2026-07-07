package com.chua.hotspot.jetty.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.jetty.support.plugin.JettyPlugin;

/**
 * Jetty 插件注册
 *
 * @author CH
 * @since 2024/12/16
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(JettyPlugin::new);
    }
    
    public static void init() {}
}
