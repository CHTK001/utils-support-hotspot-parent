package com.chua.hotspot.ui.support;

/**
 * UI 模块标记类
 * UI 模块只提供静态资源，无需注册插件
 *
 * @author CH
 * @since 2024/12/10
 */
public class PluginRegistration {
    static {
        System.out.println("[INFO] UI 模块已加载");
    }
    
    public static void init() {}
}
