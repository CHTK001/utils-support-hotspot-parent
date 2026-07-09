package com.chua.hotspot.core.support.alert;

/**
 * 告警级别枚举
 * 定义告警的严重程度，从低到高分为 INFO、WARN、ERROR、CRITICAL
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.34
 */
public enum AlertLevel {

    /**
     * 信息级别 - 仅供记录，无需立即处理
     */
    INFO(0, "信息"),

    /**
     * 警告级别 - 需要关注，但尚未影响核心功能
     */
    WARN(1, "警告"),

    /**
     * 错误级别 - 影响部分功能，需要尽快处理
     */
    ERROR(2, "错误"),

    /**
     * 严重级别 - 影响核心功能，需要立即处理
     */
    CRITICAL(3, "严重");

    private final int code;
    private final String description;

    AlertLevel(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * 根据代码值获取告警级别
     *
     * @param code 级别代码
     * @return 告警级别，不存在则返回 INFO
     */
    public static AlertLevel fromCode(int code) {
        for (AlertLevel level : values()) {
            if (level.code == code) {
                return level;
            }
        }
        return INFO;
    }
}