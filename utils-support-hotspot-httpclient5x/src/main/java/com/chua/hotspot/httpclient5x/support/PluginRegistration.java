package com.chua.hotspot.httpclient5x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.httpclient5x.support.plugin.HttpClient5xPlugin;

/**
 * HttpClient 5.x 插件注册
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(HttpClient5xPlugin::new);
    }
    
    public static void init() {}
}
