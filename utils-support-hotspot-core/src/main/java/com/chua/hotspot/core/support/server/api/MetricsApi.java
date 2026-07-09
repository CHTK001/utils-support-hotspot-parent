package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.metrics.MetricsExporter;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 指标导出 API
 * <p>
 * 提供 Prometheus 格式和 JSON 格式的监控指标导出。
 * 支持的操作：
 * <ul>
 *   <li>prometheus - Prometheus exposition 格式（用于 Prometheus 抓取）</li>
 *   <li>summary - JSON 格式指标摘要</li>
 *   <li>counters - 查看所有计数器</li>
 *   <li>gauges - 查看所有仪表盘</li>
 *   <li>reset - 重置所有计数器</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class MetricsApi implements ApiEndpoint {

    @Override
    public String name() {
        return "metrics";
    }

    @Override
    public String description() {
        return "指标导出 - Prometheus/JSON 格式监控指标";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "summary");
        switch (action) {
            case "prometheus":
                return exportPrometheus();
            case "summary":
                return MetricsExporter.getInstance().getMetricsSummary();
            case "counters":
                return getCounters();
            case "gauges":
                return getGauges();
            case "reset":
                return resetCounters();
            default:
                return error("未知操作: " + action);
        }
    }

    /**
     * 导出 Prometheus 格式
     * <p>
     * 返回纯文本字符串，Content-Type 应为 text/plain; version=0.0.4; charset=utf-8
     * </p>
     */
    private String exportPrometheus() {
        return MetricsExporter.getInstance().exportPrometheus();
    }

    /**
     * 查看所有计数器
     */
    private Map<String, Object> getCounters() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("type", "counters");
        result.put("data", MetricsExporter.getInstance().getMetricsSummary().get("counters"));
        return result;
    }

    /**
     * 查看所有仪表盘
     */
    private Map<String, Object> getGauges() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("type", "gauges");
        result.put("data", MetricsExporter.getInstance().getMetricsSummary().get("gauges"));
        return result;
    }

    /**
     * 重置计数器
     */
    private Map<String, Object> resetCounters() {
        MetricsExporter.getInstance().resetCounters();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "所有计数器已重置");
        return result;
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", false);
        result.put("error", message);
        return result;
    }
}