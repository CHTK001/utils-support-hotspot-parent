package com.chua.hotspot.tomcat9x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.tomcat9x.support.plugin.TomcatPlugin;

public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(TomcatPlugin::new);
    }
    public static void init() {}
}
