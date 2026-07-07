package com.chua.hotspot.lettuce.support;

/**
 * Lettuce 插件注册
 * 
 * 注意：Lettuce 与 Spring Data Redis 的集成插件已移至 spring5x 和 spring6x 模块
 * 本模块仅保留纯 Lettuce 客户端相关的代码
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class PluginRegistration {
    
    static {
        // Lettuce 底层客户端的插件注册（如果有的话）
        // LettuceConnectionFactoryPlugin 已移至 spring5x 模块
    }
    
    public static void init() {
        // 触发静态块执行
    }
}
