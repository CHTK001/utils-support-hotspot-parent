package com.chua.hotspot.oracle.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.oracle.support.plugin.OraclePlugin;

/**
 * Oracle 插件注册
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.33
 */
public class PluginRegistration {
    
    static {
        PluginRegistry.registerPlugin(OraclePlugin::new);
    }
    
    public static void init() {
        // 触发静态块执行
    }
}
