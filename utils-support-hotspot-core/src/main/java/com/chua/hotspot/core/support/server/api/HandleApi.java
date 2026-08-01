package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.transform.Listener;
import com.chua.hotspot.core.support.transform.Span;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 句柄监控 API
 * <p>
 * 提供 JVM 文件句柄、Socket 等资源的监控接口。
 * 支持的操作：
 * <ul>
 *   <li>默认 - 获取所有打开的句柄列表</li>
 *   <li>action=stats - 获取分类统计信息</li>
 *   <li>action=leaks - 获取潜在泄漏的句柄</li>
 *   <li>action=type - 按类型获取句柄（需传 type 参数）</li>
 *   <li>action=setLeakThreshold - 设置泄漏检测阈值（需传 threshold 参数，单位毫秒）</li>
 *   <li>action=setCountThreshold - 设置句柄数量告警阈值（需传 threshold 参数）</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class HandleApi implements ApiEndpoint {

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    @Override
    public String name() {
        return "handle";
    }

    @Override
    public String description() {
        return "句柄监控 - 文件句柄/Socket/管道/选择器的监控、统计与泄漏检测";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "");
        String format = request.getParam("format", "json");

        try {
            switch (action) {
                case "stats":
                    return handleStats();
                case "leaks":
                    return handleLeaks();
                case "type":
                    return handleByType(request);
                case "setLeakThreshold":
                    return handleSetLeakThreshold(request);
                case "setCountThreshold":
                    return handleSetCountThreshold(request);
                default:
                    return handleList(format);
            }
        } catch (Exception e) {
            LOGGER.error("获取句柄监控信息失败: {}", e.getMessage());
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return response;
        }
    }

    /**
     * 获取所有打开的句柄列表
     */
    private Object handleList(String format) {
        LOGGER.debug("获取句柄列表");

        if ("html".equals(format)) {
            return Listener.dump();
        }

        List<Span> openFiles = Listener.getCurrentOpenFiles();
        List<Map<String, Object>> result = new ArrayList<>();

        int index = 0;
        for (Span span : openFiles) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("index", index++);
            item.put("id", "handle_" + index);
            item.put("message", span.getMessage());
            item.put("stack", span.getStack());
            result.add(item);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("total", result.size());
        response.put("data", result);
        response.put("title", Listener.title());
        response.put("agentInstalled", Listener.isAgentInstalled());
        // 附加统计摘要
        response.put("statistics", Listener.getStatisticsMap());

        return response;
    }

    /**
     * 获取分类统计信息
     */
    private Object handleStats() {
        LOGGER.debug("获取句柄分类统计");
        Map<String, Object> stats = Listener.getStatisticsMap();
        stats.put("success", true);
        return stats;
    }

    /**
     * 获取潜在泄漏的句柄
     */
    private Object handleLeaks() {
        LOGGER.debug("获取泄漏句柄");
        List<Map<String, Object>> leaks = Listener.getLeakedHandles();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("leakCount", leaks.size());
        response.put("leaks", leaks);
        response.put("leakThresholdMs", Listener.getStatistics().leakThresholdMs);

        // 按严重程度分组统计
        Map<String, Integer> severityCount = new LinkedHashMap<>();
        severityCount.put("CRITICAL", 0);
        severityCount.put("HIGH", 0);
        severityCount.put("MEDIUM", 0);
        severityCount.put("LOW", 0);
        for (Map<String, Object> leak : leaks) {
            String severity = (String) leak.get("leakSeverity");
            severityCount.put(severity, severityCount.getOrDefault(severity, 0) + 1);
        }
        response.put("severitySummary", severityCount);

        return response;
    }

    /**
     * 按类型获取句柄
     */
    private Object handleByType(HttpRequest request) {
        String typeStr = request.getParam("type", "");
        LOGGER.debug("按类型获取句柄: {}", typeStr);

        Listener.HandleType type;
        try {
            type = Listener.HandleType.valueOf(typeStr);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", false);
            response.put("error", "无效的句柄类型: " + typeStr);
            response.put("validTypes", getValidTypeNames());
            return response;
        }

        List<Map<String, Object>> handles = Listener.getHandlesByType(type);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("type", type.name());
        response.put("typeDisplayName", type.getDisplayName());
        response.put("count", handles.size());
        response.put("data", handles);

        return response;
    }

    /**
     * 设置泄漏检测阈值
     */
    private Object handleSetLeakThreshold(HttpRequest request) {
        String thresholdStr = request.getParam("threshold", "300000");
        long thresholdMs;
        try {
            thresholdMs = Long.parseLong(thresholdStr);
        } catch (NumberFormatException e) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", false);
            response.put("error", "无效的阈值: " + thresholdStr);
            return response;
        }

        Listener.setLeakThreshold(thresholdMs);
        LOGGER.info("泄漏检测阈值已设置为: {}ms", thresholdMs);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "泄漏检测阈值已更新");
        response.put("leakThresholdMs", thresholdMs);
        return response;
    }

    /**
     * 设置句柄数量告警阈值
     */
    private Object handleSetCountThreshold(HttpRequest request) {
        String thresholdStr = request.getParam("threshold", "1000");
        int threshold;
        try {
            threshold = Integer.parseInt(thresholdStr);
        } catch (NumberFormatException e) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", false);
            response.put("error", "无效的阈值: " + thresholdStr);
            return response;
        }

        Listener.setHandleCountThreshold(threshold);
        LOGGER.info("句柄数量告警阈值已设置为: {}", threshold);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "句柄数量告警阈值已更新");
        response.put("handleCountThreshold", threshold);
        return response;
    }

    /**
     * 获取有效的句柄类型名称列表
     */
    private List<String> getValidTypeNames() {
        List<String> names = new ArrayList<>();
        for (Listener.HandleType type : Listener.HandleType.values()) {
            names.add(type.name());
        }
        return names;
    }
}
