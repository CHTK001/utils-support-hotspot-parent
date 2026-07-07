package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.recorder.ContainerQpsRecorder;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.storage.SqliteStorage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * QPS API 端点
 * 
 * 提供 QPS 统计数据查询接口
 * 
 * @author CH
 * @since 2024/12/13
 * @version 4.0.0.35
 */
public class QpsApi implements ApiEndpoint {
    
    @Override
    public String name() {
        return "qps";
    }
    
    @Override
    public String description() {
        return "QPS 统计数据查询接口";
    }
    
    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action");
        
        if (action == null || action.isEmpty()) {
            action = "current";
        }
        
        switch (action) {
            case "current":
                return getCurrentQps(request);
            case "history":
                return getQpsHistory(request);
            case "summary":
                return getQpsSummary(request);
            default:
                return error("未知的操作: " + action);
        }
    }
    
    /**
     * 获取当前 QPS（实时数据，从内存）
     */
    private Object getCurrentQps(HttpRequest request) {
        String containerType = request.getParam("container");
        
        if (containerType != null && !containerType.isEmpty()) {
            // 返回指定容器的 QPS
            Map<String, Object> result = new HashMap<>();
            result.put("containerType", containerType);
            result.put("qps", ContainerQpsRecorder.getInstance().getCurrentQps(containerType));
            result.put("totalRequests", ContainerQpsRecorder.getInstance().getTotalRequests(containerType));
            result.put("activeConnections", ContainerQpsRecorder.getInstance().getActiveConnections(containerType));
            result.put("timestamp", System.currentTimeMillis());
            return result;
        } else {
            // 返回所有容器的 QPS，并包含当前容器类型
            Map<String, Object> response = new HashMap<>();
            response.put("status", "ok");
            response.put("data", ContainerQpsRecorder.getInstance().getAllContainerStats());
            response.put("currentContainer", ContainerQpsRecorder.getInstance().detectCurrentContainer());
            response.put("timestamp", System.currentTimeMillis());
            return response;
        }
    }
    
    /**
     * 获取历史 QPS 数据（从 SQLite）
     */
    private Object getQpsHistory(HttpRequest request) {
        String containerType = request.getParam("container");
        String durationStr = request.getParam("duration");
        
        if (containerType == null || containerType.isEmpty()) {
            return error("缺少参数: container");
        }
        
        // 默认查询最近 1 小时
        long duration = 3600;
        if (durationStr != null && !durationStr.isEmpty()) {
            try {
                duration = Long.parseLong(durationStr);
            } catch (NumberFormatException e) {
                return error("无效的 duration 参数: " + durationStr);
            }
        }
        
        long endTime = System.currentTimeMillis();
        long startTime = endTime - (duration * 1000);
        
        List<Map<String, Object>> history = SqliteStorage.getInstance()
                .queryQpsHistory(containerType, startTime, endTime);
        
        Map<String, Object> result = new HashMap<>();
        result.put("containerType", containerType);
        result.put("startTime", startTime);
        result.put("endTime", endTime);
        result.put("duration", duration);
        result.put("data", history);
        
        return result;
    }
    
    /**
     * 获取 QPS 统计摘要
     */
    private Object getQpsSummary(HttpRequest request) {
        Map<String, Map<String, Object>> allStats = ContainerQpsRecorder.getInstance().getAllContainerStats();
        
        Map<String, Object> summary = new HashMap<>();
        
        int totalQps = 0;
        long totalRequests = 0;
        int totalConnections = 0;
        
        for (Map.Entry<String, Map<String, Object>> entry : allStats.entrySet()) {
            Map<String, Object> stats = entry.getValue();
            totalQps += (Integer) stats.get("qps");
            totalRequests += (Long) stats.get("totalRequests");
            totalConnections += (Integer) stats.get("activeConnections");
        }
        
        summary.put("totalQps", totalQps);
        summary.put("totalRequests", totalRequests);
        summary.put("totalConnections", totalConnections);
        summary.put("containers", allStats);
        summary.put("timestamp", System.currentTimeMillis());
        
        return summary;
    }
    
    /**
     * 返回错误信息
     */
    private Object error(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}
