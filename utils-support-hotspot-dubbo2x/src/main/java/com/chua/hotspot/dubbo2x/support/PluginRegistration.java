package com.chua.hotspot.dubbo2x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.dubbo2x.support.plugin.Dubbo2xPlugin;
import com.chua.hotspot.dubbo2x.support.plugin.Dubbo2xContextPlugin;
import com.chua.hotspot.dubbo2x.support.plugin.Dubbo2xResponsePlugin;

/**
 * Dubbo2x 插件注册
 *
 * @author CH
 * @since 2024/12/11
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(Dubbo2xPlugin::new);
        PluginRegistry.registerPlugin(Dubbo2xContextPlugin::new);
        PluginRegistry.registerPlugin(Dubbo2xResponsePlugin::new);
    }
    
    public static void init() {}
}
