package com.chua.hotspot.mybatis.support;

import com.chua.hotspot.core.support.plugin.PluginRegistry;
import com.chua.hotspot.mybatis.support.plugin.*;

/**
 * MyBatis 插件注册
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        PluginRegistry.registerPlugin(MybatisConfigurationPlugin::new);
        PluginRegistry.registerPlugin(MybatisPluginConfigurationPlugin::new);
        PluginRegistry.registerPlugin(MybatisSimpleExecutorPlugin::new);
        PluginRegistry.registerPlugin(MybatisSqlSessionTemplatePlugin::new);
        PluginRegistry.registerPlugin(MybatisSqlMonitorPlugin::new);
    }
    
    public static void init() {}
}
