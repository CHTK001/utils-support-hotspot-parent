package com.chua.hotspot.netty.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.netty.support.plugin.NettyPlugin;

/**
 * Netty 插件注册
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(NettyPlugin::new);
    }
    
    public static void init() {}
}
