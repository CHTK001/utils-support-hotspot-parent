package com.chua.hotspot.tomcat10x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.tomcat10x.support.plugin.TomcatPlugin;

/**
 * Tomcat 插件注册
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(TomcatPlugin::new);
    }
    
    public static void init() {}
}
