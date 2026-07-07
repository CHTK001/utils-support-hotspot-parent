package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.plugin.impl.ByteBuddyFileHandlePlugin;
import com.chua.hotspot.core.support.plugin.impl.RSocketPlugin;
import com.chua.hotspot.core.support.plugin.impl.ServerPlugin;

/**
 * 核心插件注册类
 * 负责注册 hotspot-core 模块中的所有插件
 *
 * @author CH
 * @since 2024/12/12
 * @version 4.0.0.36
 */
public class PluginRegistration {

    static {
        // 注册 RSocket 服务插件
        PluginRegistry.registerPlugin(RSocketPlugin::new);
        // 注册 JDBC 驱动服务插件
        PluginRegistry.registerPlugin(ServerPlugin::new);
        // 注册文件句柄监控插件（使用 ByteBuddy Advice 实现）
        PluginRegistry.registerPlugin(ByteBuddyFileHandlePlugin::new);
    }
}
