package com.chua.hotspot.core.support.report;

/**
 * SyncClient 提供者 SPI 接口
 * <p>
 * 替代 ReportFactory 中通过反射获取 Spring ApplicationContext 和 SyncClient 的方式。
 * spring-support-report-client-starter 模块可实现此接口，
 * 通过 Java SPI (ServiceLoader) 机制自动注册，避免运行时反射调用。
 * </p>
 * <p>
 * 使用方式：
 * <ol>
 *   <li>在 spring-support-report-client-starter 中实现此接口</li>
 *   <li>在 META-INF/services/com.chua.hotspot.core.support.report.SyncClientProvider 中注册实现类</li>
 *   <li>ReportFactory 通过 ServiceLoader 自动发现并使用</li>
 * </ol>
 * </p>
 *
 * @author CH
 * @since 4.0.0.34
 */
public interface SyncClientProvider {

    /**
     * 发布数据到 SyncClient
     *
     * @param topic 主题
     * @param data  数据
     */
    void publish(String topic, Object data);

    /**
     * 获取提供者名称（用于日志标识）
     *
     * @return 提供者名称
     */
    default String name() {
        return this.getClass().getSimpleName();
    }
}