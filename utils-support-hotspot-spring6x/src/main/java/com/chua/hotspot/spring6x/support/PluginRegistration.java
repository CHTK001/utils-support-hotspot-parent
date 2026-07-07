package com.chua.hotspot.spring6x.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.spring6x.support.plugin.*;

/**
 * Spring 插件注册
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class PluginRegistration {
    
    static {
        PluginRegistry.registerPlugin(SpringApplicationPlugin::new);
        PluginRegistry.registerPlugin(SpringEnvironmentPlugin::new);
        PluginRegistry.registerPlugin(SpringRequestMappingHandlerMappingPlugin::new);
        
        // Spring Data Redis 监控插件（继承自 Spring5x，同时支持 Lettuce 和 Jedis）
        PluginRegistry.registerPlugin(RedisTemplatePlugin::new);
        
        // 链路追踪、HTTP 性能、QPS 统计由 TomcatPlugin/UndertowPlugin 等容器插件统一处理
    }
    
    public static void init() {
        // 触发静态块执行
    }
}
