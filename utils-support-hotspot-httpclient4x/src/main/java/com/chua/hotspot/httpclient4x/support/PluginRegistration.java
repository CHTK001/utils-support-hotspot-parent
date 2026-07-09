package com.chua.hotspot.httpclient4x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.httpclient4x.support.plugin.HttpClient4xPlugin;

/**
 * HttpClient 4.x 插件注册类
 * 负责注册 HttpClient 4.x 插件到 PluginRegistry
 *
 * @author CH
 * @since 4.0.0.33
 */
public class PluginRegistration {

    static {
        PluginRegistry.registerPlugin(HttpClient4xPlugin::new);
    }
}