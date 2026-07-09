package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.monitor.AgentSelfMonitor;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Agent 自监控 API
 * <p>
 * 提供 Agent 自身运行状态和性能开销查询。
 * 支持的操作：
 * <ul>
 *   <li>summary - Agent 自监控摘要</li>
 *   <li>overhead - 性能开销评估</li>
 *   <li>sync - 手动同步指标到 MetricsExporter</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class MonitorApi implements ApiEndpoint {

    @Override
    public String name() {
        return "monitor";
    }

    @Override
    public String description() {
        return "Agent自监控 - 运行状态与性能开销";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "summary");
        switch (action) {
            case "summary":
                return AgentSelfMonitor.getInstance().getMonitorSummary();
            case "overhead":
                return AgentSelfMonitor.getInstance().getPerformanceOverhead();
            case "sync":
                AgentSelfMonitor.getInstance().syncToMetricsExporter();
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("success", true);
                result.put("message", "指标已同步到 MetricsExporter");
                return result;
            default:
                Map<String, Object> err = new LinkedHashMap<>();
                err.put("success", false);
                err.put("error", "未知操作: " + action);
                return err;
        }
    }
}