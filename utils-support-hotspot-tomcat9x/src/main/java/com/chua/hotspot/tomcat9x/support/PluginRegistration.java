package com.chua.hotspot.tomcat9x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.tomcat9x.support.plugin.TomcatPlugin;

/**
 * Tomcat 9x 插件注册入口
 *
 * @author CH
 * @since 2024/12/11
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(TomcatPlugin::new);
    }
    public static void init() {}
}
