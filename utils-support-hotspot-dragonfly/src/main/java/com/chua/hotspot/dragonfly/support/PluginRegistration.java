package com.chua.hotspot.dragonfly.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.dragonfly.support.plugin.DragonflyPlugin;

/**
 * Dragonfly 插件注册
 * 
 * 拦截 DefaultJedisSocketFactory.createSocket
 * 由于 Dragonfly 兼容 Redis 协议，使用 Jedis 客户端连接
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.33
 */
public class PluginRegistration {
    
    static {
        PluginRegistry.registerPlugin(DragonflyPlugin::new);
    }
    
    public static void init() {
        // 触发静态块执行
    }
}
