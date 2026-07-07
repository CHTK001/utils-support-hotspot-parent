package com.chua.hotspot.dubbo3x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.dubbo3x.support.plugin.DubboContextPlugin;
import com.chua.hotspot.dubbo3x.support.plugin.DubboRequestPlugin;
import com.chua.hotspot.dubbo3x.support.plugin.DubboResponsePlugin;

/**
 * Dubbo3x 插件注册
 *
 * @author CH
 * @since 2024/12/11
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(DubboContextPlugin::new);
        PluginRegistry.registerPlugin(DubboRequestPlugin::new);
        PluginRegistry.registerPlugin(DubboResponsePlugin::new);
    }
    
    public static void init() {}
}
