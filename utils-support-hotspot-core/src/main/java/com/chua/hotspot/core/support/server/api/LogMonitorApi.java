package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.storage.SqliteStorage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 日志监控 API 端点
 * 
 * 提供日志查询接口
 * 
 * @author CH
 * @since 2024/12/13
 * @version 4.0.0.35
 */
public class LogMonitorApi implements ApiEndpoint {
    
    @Override
    public String name() {
        return "logs";
    }
    
    @Override
    public String description() {
        return "日志监控查询接口";
    }
    
    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "query");
        
        switch (action) {
            case "query":
                return queryLogs(request);
            case "levels":
                return getLogLevels();
            default:
                return error("未知的操作: " + action);
        }
    }
    
    /**
     * 查询日志
     */
    private Object queryLogs(HttpRequest request) {
        // 参数解析
        String level = request.getParam("level");
        int limit = request.getIntParam("limit", 100);
        String durationStr = request.getParam("duration");
        
        // 时间范围（默认最近 1 小时）
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
        
        // 查询日志
        List<Map<String, Object>> logs = SqliteStorage.getInstance()
                .queryLogRecords(level, limit, startTime, endTime);
        
        Map<String, Object> result = new HashMap<>();
        result.put("level", level);
        result.put("limit", limit);
        result.put("startTime", startTime);
        result.put("endTime", endTime);
        result.put("duration", duration);
        result.put("count", logs.size());
        result.put("logs", logs);
        
        return result;
    }
    
    /**
     * 获取日志级别列表
     */
    private Object getLogLevels() {
        Map<String, Object> result = new HashMap<>();
        result.put("levels", new String[]{"TRACE", "DEBUG", "INFO", "WARN", "ERROR"});
        return result;
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
