package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.health.HealthChecker;
import com.chua.hotspot.core.support.health.HealthStatus;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 健康检查 API
 * <p>
 * 提供 Agent 自身及依赖组件的健康状态查询。
 * 支持的操作：
 * <ul>
 *   <li>overview - 聚合健康状态概览</li>
 *   <li>detail - 各组件详细健康状态</li>
 *   <li>liveness - 存活探针（进程是否存活）</li>
 *   <li>readiness - 就绪探针（是否可接收请求）</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class HealthApi implements ApiEndpoint {

    @Override
    public String name() {
        return "health";
    }

    @Override
    public String description() {
        return "健康检查 - Agent 及依赖组件健康状态";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "overview");
        switch (action) {
            case "overview":
                return HealthChecker.getInstance().getHealthSummary();
            case "detail":
                return detailHealth();
            case "liveness":
                return liveness();
            case "readiness":
                return readiness();
            default:
                return error("未知操作: " + action);
        }
    }

    /**
     * 详细健康状态
     */
    private Object detailHealth() {
        List<HealthStatus> results = HealthChecker.getInstance().checkAll();
        Map<String, Object> detail = new LinkedHashMap<>();
        detail.put("timestamp", System.currentTimeMillis());
        detail.put("overallStatus", HealthChecker.getInstance().getOverallState().name());

        Map<String, Object> components = new LinkedHashMap<>();
        for (HealthStatus status : results) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("status", status.getState().name());
            item.put("responseTime", status.getResponseTimeMs() + "ms");
            if (status.getMessage() != null) item.put("message", status.getMessage());
            if (status.getError() != null) item.put("error", status.getError());
            components.put(status.getName(), item);
        }
        detail.put("components", components);
        return detail;
    }

    /**
     * 存活探针 - 进程是否存活
     */
    private Object liveness() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "UP");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }

    /**
     * 就绪探针 - 是否可接收请求
     */
    private Object readiness() {
        HealthStatus.State overall = HealthChecker.getInstance().getOverallState();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", overall.name());
        result.put("timestamp", System.currentTimeMillis());
        result.put("ready", overall != HealthStatus.State.DOWN);
        return result;
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", false);
        result.put("error", message);
        return result;
    }
}