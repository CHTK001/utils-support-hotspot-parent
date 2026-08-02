package com.chua.hotspot.hikaricp.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.hikaricp.support.plugin.HikariCPPlugin;

/**
 * HikariCP 插件注册
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.40
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(HikariCPPlugin::new);
    }

    public static void init() {
        // 触发静态块执行
    }
}