package com.chua.hotspot.core.support.alert;

import com.chua.hotspot.core.support.enums.ModuleType;
import lombok.Data;

/**
 * 告警规则定义
 * <p>
 * 定义一条告警规则的触发条件、阈值和告警级别。
 * 支持以下触发条件类型：
 * <ul>
 *   <li>THRESHOLD - 阈值告警：指标超过阈值时触发</li>
 *   <li>RATE - 速率告警：指标变化速率超过阈值时触发</li>
 *   <li>COUNT - 计数告警：指标累计次数超过阈值时触发</li>
 *   <li>ABSENCE - 缺失告警：指标在指定时间内未上报时触发</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.34
 */
@Data
public class AlertRule {

    /**
     * 默认评估窗口（秒）
     */
    private static final int DEFAULT_WINDOW_SECONDS = 60;

    /**
     * 默认连续触发次数
     */
    private static final int DEFAULT_CONSECUTIVE_COUNT = 1;

    /**
     * 默认告警间隔（秒）
     */
    private static final int DEFAULT_ALERT_INTERVAL_SECONDS = 300;

    /**
     * 规则 ID
     */
    private String id;

    /**
     * 规则名称
     */
    private String name;

    /**
     * 规则描述
     */
    private String description;

    /**
     * 监控模块类型
     */
    private ModuleType moduleType;

    /**
     * 监控指标名称（如 "sql.slowQuery", "exception.count", "jvm.memory.used"）
     */
    private String metric;

    /**
     * 触发条件类型
     */
    private ConditionType conditionType;

    /**
     * 阈值
     */
    private double threshold;

    /**
     * 告警级别
     */
    private AlertLevel level;

    /**
     * 评估时间窗口（秒），在窗口内满足条件才触发
     */
    private int windowSeconds;

    /**
     * 连续触发次数，达到该次数才产生告警（避免瞬时抖动）
     */
    private int consecutiveCount;

    /**
     * 告警间隔（秒），同一规则两次告警之间的最小间隔
     */
    private int alertIntervalSeconds;

    /**
     * 是否启用
     */
    private boolean enabled;

    /**
     * 触发条件类型枚举
     */
    public enum ConditionType {
        /**
         * 阈值告警：指标超过阈值
         */
        THRESHOLD,
        /**
         * 速率告警：指标变化速率超过阈值
         */
        RATE,
        /**
         * 计数告警：指标累计次数超过阈值
         */
        COUNT,
        /**
         * 缺失告警：指标在指定时间内未上报
         */
        ABSENCE
    }

    public AlertRule() {
        this.enabled = true;
        this.windowSeconds = DEFAULT_WINDOW_SECONDS;
        this.consecutiveCount = DEFAULT_CONSECUTIVE_COUNT;
        this.alertIntervalSeconds = DEFAULT_ALERT_INTERVAL_SECONDS;
    }

    @Override
    public String toString() {
        return "AlertRule{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", metric='" + metric + '\'' +
                ", level=" + level +
                ", threshold=" + threshold +
                ", enabled=" + enabled +
                '}';
    }
}