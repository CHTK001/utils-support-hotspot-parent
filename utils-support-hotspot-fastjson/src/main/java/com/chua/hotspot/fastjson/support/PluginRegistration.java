package com.chua.hotspot.fastjson.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.fastjson.support.plugin.FastJson2Plugin;

/**
 * FastJSON 插件注册
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(FastJson2Plugin::new);
    }
    
    public static void init() {}
}
