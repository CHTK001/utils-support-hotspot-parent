package com.chua.hotspot.core.support.alert;

import com.chua.hotspot.core.support.enums.ModuleType;
import lombok.Data;

/**
 * 告警记录
 * <p>
 * 记录一次告警的完整信息，包括触发规则、指标值、告警时间等。
 * </p>
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.34
 */
@Data
public class AlertRecord {

    /**
     * 告警 ID
     */
    private String id;

    /**
     * 触发的规则 ID
     */
    private String ruleId;

    /**
     * 规则名称
     */
    private String ruleName;

    /**
     * 告警级别
     */
    private AlertLevel level;

    /**
     * 监控模块类型
     */
    private ModuleType moduleType;

    /**
     * 监控指标名称
     */
    private String metric;

    /**
     * 当前指标值
     */
    private double currentValue;

    /**
     * 阈值
     */
    private double threshold;

    /**
     * 告警消息
     */
    private String message;

    /**
     * 告警时间戳（毫秒）
     */
    private long timestamp;

    /**
     * 应用名称
     */
    private String applicationName;

    /**
     * 主机地址
     */
    private String host;

    public AlertRecord() {
        this.timestamp = System.currentTimeMillis();
    }

    @Override
    public String toString() {
        return "AlertRecord{" +
                "id='" + id + '\'' +
                ", ruleName='" + ruleName + '\'' +
                ", level=" + level +
                ", metric='" + metric + '\'' +
                ", currentValue=" + currentValue +
                ", threshold=" + threshold +
                ", message='" + message + '\'' +
                '}';
    }
}