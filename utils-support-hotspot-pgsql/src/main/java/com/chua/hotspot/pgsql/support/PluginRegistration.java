package com.chua.hotspot.pgsql.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.pgsql.support.plugin.PgsqlPlugin;

/**
 * PostgreSQL 插件注册
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.33
 */
public class PluginRegistration {
    
    static {
        PluginRegistry.registerPlugin(PgsqlPlugin::new);
    }
    
    public static void init() {
        // 触发静态块执行
    }
}
