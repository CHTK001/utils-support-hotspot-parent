package com.chua.hotspot.nacos.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.nacos.support.plugin.NacosNamingPlugin;

/**
 * Nacos 插件注册
 *
 * @author CH
 * @since 2024/12/14
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(NacosNamingPlugin::new);
    }
    
    public static void init() {}
}
