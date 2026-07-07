package com.chua.hotspot.tomcat10x.support.plugin;

/**
 * Tomcat 10.x HTTP 请求链路追踪插件
 * <p>
 * 继承自 Tomcat 9.x 插件，Tomcat 10.x 的 API 与 9.x 完全兼容，
 * 因此直接继承基础实现，无需重写任何方法。
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/11
 */
public class TomcatPlugin extends com.chua.hotspot.tomcat9x.support.plugin.TomcatPlugin {
    // Tomcat 10.x API 与 9.x 完全兼容，直接继承即可
}
