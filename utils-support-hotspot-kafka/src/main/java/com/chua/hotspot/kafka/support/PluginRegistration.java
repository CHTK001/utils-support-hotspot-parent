package com.chua.hotspot.kafka.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.kafka.support.plugin.KafkaPlugin;

/**
 * Kafka 插件注册
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(KafkaPlugin::new);
    }
    
    public static void init() {}
}
