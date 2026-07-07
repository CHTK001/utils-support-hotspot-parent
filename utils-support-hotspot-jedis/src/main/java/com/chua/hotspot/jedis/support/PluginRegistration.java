package com.chua.hotspot.jedis.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.jedis.support.plugin.JedisPlugin;

/**
 * Jedis 插件注册
 * 
 * 只保留底层拦截（DefaultJedisSocketFactory.createSocket）
 * 可以同时捕获原生 Jedis 和 Spring Data Redis 两种场景
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.35
 */
public class PluginRegistration {
    
    static {
        // 只注册底层拦截器，避免重复报告
        PluginRegistry.registerPlugin(JedisPlugin::new);
    }
    
    public static void init() {
        // 触发静态块执行
    }
}
