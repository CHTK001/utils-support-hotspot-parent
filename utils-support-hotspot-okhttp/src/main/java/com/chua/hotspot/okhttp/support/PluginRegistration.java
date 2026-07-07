package com.chua.hotspot.okhttp.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.okhttp.support.plugin.OkHttp3xPlugin;

/**
 * OkHttp 插件注册
 *
 * @author CH
 * @since 2024/12/12
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(OkHttp3xPlugin::new);
    }
    
    public static void init() {}
}
