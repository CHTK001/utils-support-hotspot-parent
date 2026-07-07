package com.chua.hotspot.undertow.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.undertow.support.plugin.UndertowPlugin;

/**
 * Undertow 插件注册
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(UndertowPlugin::new);
    }
    
    public static void init() {}
}
