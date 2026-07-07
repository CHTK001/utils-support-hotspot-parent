package com.chua.hotspot.jackson.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;

/**
 * Jackson 插件注册
 *
 * @author CH
 * @since 2024/12/12
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(JacksonPlugin::new);
    }
    
    public static void init() {}
}
