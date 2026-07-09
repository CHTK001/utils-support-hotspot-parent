package com.chua.hotspot.httpclient3x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.httpclient3x.support.plugin.HttpClient3xPlugin;

/**
 * HttpClient 3.x 插件注册类
 * 负责注册 HttpClient 3.x 插件到 PluginRegistry
 *
 * @author CH
 * @since 4.0.0.33
 */
public class PluginRegistration {

    static {
        PluginRegistry.registerPlugin(HttpClient3xPlugin::new);
    }
}