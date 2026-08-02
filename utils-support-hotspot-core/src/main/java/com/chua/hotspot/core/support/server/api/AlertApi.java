package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.alert.AlertLevel;
import com.chua.hotspot.core.support.alert.AlertManager;
import com.chua.hotspot.core.support.alert.AlertRecord;
import com.chua.hotspot.core.support.alert.AlertRule;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.*;

/**
 * Alert API
 * <p>
 * 提供告警管理端点：
 * - action=list: 查询最近告警记录
 * - action=stats: 告警统计（按级别分组）
 * - action=rules: 查询告警规则列表
 * - action=level: 按级别查询告警
 * - action=clear: 清除所有告警记录
 * </p>
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.34
 */
public class AlertApi implements ApiEndpoint {

    /**
     * 日志对象
     */
    private final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 告警管理器
     */
    private final AlertManager alertManager = AlertManager.getInstance();

    @Override
    public String name() {
        return "alerts";
    }

    @Override
    public String description() {
        return "Alert Management & Monitoring";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action");

        if (action == null || action.isEmpty()) {
            action = "list";
        }

        try {
            switch (action) {
                case "list":
                    return alertManager.getRecentAlerts();
                case "stats":
                    return alertManager.getAlertStats();
                case "rules":
                    return alertManager.getRules();
                case "level":
                    return handleLevelQuery(request);
                case "clear":
                    alertManager.clearAlerts();
                    return Collections.singletonMap("status", "cleared");
                default:
                    return Collections.singletonMap("error", "Unknown action: " + action);
            }
        } catch (Exception e) {
            LOGGER.warn("Alert API 处理失败: {}", e.getMessage());
            return Collections.singletonMap("error", e.getMessage());
        }
    }

    /**
     * 按级别查询告警
     */
    private Object handleLevelQuery(HttpRequest request) {
        String levelStr = request.getParam("level");
        if (levelStr == null || levelStr.isEmpty()) {
            return Collections.singletonMap("error", "Missing parameter: level");
        }
        try {
            AlertLevel level = AlertLevel.valueOf(levelStr.toUpperCase());
            return alertManager.getAlertsByLevel(level);
        } catch (IllegalArgumentException e) {
            return Collections.singletonMap("error", "Invalid level: " + levelStr +
                    ". Valid levels: " + Arrays.toString(AlertLevel.values()));
        }
    }
}