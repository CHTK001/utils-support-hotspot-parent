package com.chua.hotspot.core.support.enums;

/**
 * 模块类型枚举
 * 定义 Hotspot Agent 支持的监控模块类型
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public enum ModuleType {

    /**
     * 链路追踪
     * 支持微服务调用链路追踪，包括 HTTP、RPC、MQ 等
     */
    TRACE,

    /**
     * 日志监控
     * 捕获应用程序的日志输出
     */
    LOG,

    /**
     * SQL 监控
     * 监控数据库操作，包括查询、更新、删除等
     */
    SQL,

    /**
     * 服务监控
     * 监控服务实例的状态和调用情况
     */
    SERVER,

    /**
     * 异常监控
     * 捕获和记录应用程序异常
     */
    EXCEPTION,

    /**
     * 性能监控
     * 监控方法执行时间和性能指标
     */
    PERFORMANCE,

    /**
     * 缓存监控
     * 监控 Redis、本地缓存等操作
     */
    CACHE,

    /**
     * 消息队列监控
     * 监控 Kafka、RabbitMQ 等消息队列操作
     */
    MQ,

    /**
     * Spring 监控
     * 监控 Spring 框架相关信息，如路由映射、Bean 等
     */
    SPRING,

    /**
     * JFR 监控
     * JDK Flight Recorder 性能录制状态
     */
    JFR,

    /**
     * JVM 监控
     * JVM 运行时信息，包括内存、线程、GC 等
     */
    JVM,

    /**
     * 告警
     * 告警规则管理和告警事件触发
     */
    ALERT;

    /**
     * 根据名称获取模块类型
     *
     * @param name 模块名称
     * @return 模块类型，不存在则返回 null
     */
    public static ModuleType of(String name) {
        if (name == null || name.isEmpty()) {
            return null;
        }
        for (ModuleType type : values()) {
            if (type.name().equalsIgnoreCase(name)) {
                return type;
            }
        }
        return null;
    }
}
