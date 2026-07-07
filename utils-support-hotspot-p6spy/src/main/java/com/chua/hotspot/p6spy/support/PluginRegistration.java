package com.chua.hotspot.p6spy.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.p6spy.support.plugin.P6SpyPlugin;

/**
 * P6Spy 插件注册
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(P6SpyPlugin::new);
    }
    
    public static void init() {}
}
