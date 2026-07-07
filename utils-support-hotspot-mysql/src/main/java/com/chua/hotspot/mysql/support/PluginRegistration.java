package com.chua.hotspot.mysql.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.mysql.support.plugin.MysqlPlugin;

/**
 * MySQL 插件注册
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class PluginRegistration {
    
    static {
        PluginRegistry.registerPlugin(MysqlPlugin::new);
    }
    
    public static void init() {
        // 触发静态块执行
    }
}
