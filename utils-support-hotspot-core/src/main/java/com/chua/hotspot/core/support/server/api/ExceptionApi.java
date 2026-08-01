package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.recorder.ExceptionRecorder;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.storage.SqliteStorage;

import java.util.*;

/**
 * Exception API
 * 
 * Provides exception monitoring endpoints:
 * - action=list: Recent exceptions
 * - action=stats: Exception statistics by type
 * - action=trend: Exception trend analysis
 * - action=detail: Exception detail by ID
 * - action=history: Historical exceptions from SQLite
 * - action=clear: Clear all statistics
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class ExceptionApi implements ApiEndpoint {
    
    private final LogFactory LOGGER = LogFactory.getInstance();
    private final ExceptionRecorder recorder = ExceptionRecorder.getInstance();
    
    @Override
    public String name() {
        return "exceptions";
    }
    
    @Override
    public String description() {
        return "Exception Monitoring & Alerting";
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
                    return handleList(request);
                    
                case "stats":
                    return handleStats(request);
                    
                case "trend":
                    return handleTrend(request);
                    
                case "detail":
                    return handleDetail(request);
                    
                case "history":
                    return handleHistory(request);
                    
                case "clear":
                    return handleClear();
                    
                default:
                    return error("Unknown action: " + action);
            }
        } catch (Exception e) {
            LOGGER.error("Exception API error", e);
            return error("Error: " + e.getMessage());
        }
    }
    
    /**
     * Get recent exceptions (from memory)
     */
    private Object handleList(HttpRequest request) {
        int limit = 100;
        String limitStr = request.getParam("limit");
        if (limitStr != null && !limitStr.isEmpty()) {
            limit = Integer.parseInt(limitStr);
        }
        
        List<Map<String, Object>> exceptions = recorder.getRecentExceptions(limit);
        
        Map<String, Object> result = new HashMap<>();
        result.put("count", exceptions.size());
        result.put("exceptions", exceptions);
        
        return result;
    }
    
    /**
     * Get exception statistics
     */
    private Object handleStats(HttpRequest request) {
        List<Map<String, Object>> stats = recorder.getExceptionStats();
        
        Map<String, Object> result = new HashMap<>();
        result.put("count", stats.size());
        result.put("statistics", stats);
        
        return result;
    }
    
    /**
     * Get exception trend
     */
    private Object handleTrend(HttpRequest request) {
        List<Map<String, Object>> trend = recorder.getExceptionTrend();
        
        Map<String, Object> result = new HashMap<>();
        result.put("trend", trend);
        
        return result;
    }
    
    /**
     * Get exception detail
     */
    private Object handleDetail(HttpRequest request) {
        String idStr = request.getParam("id");
        
        if (idStr == null || idStr.isEmpty()) {
            return error("Missing parameter: id");
        }
        
        long id = Long.parseLong(idStr);
        Map<String, Object> detail = SqliteStorage.getInstance().queryExceptionDetail(id);
        
        if (detail == null) {
            return error("Exception not found: " + id);
        }
        
        return detail;
    }
    
    /**
     * Get historical exceptions (from SQLite)
     */
    private Object handleHistory(HttpRequest request) {
        String durationStr = request.getParam("duration");
        
        // Default query last 24 hours
        long duration = 24 * 60 * 60;
        if (durationStr != null && !durationStr.isEmpty()) {
            duration = Long.parseLong(durationStr);
        }
        
        int limit = 1000;
        String limitStr = request.getParam("limit");
        if (limitStr != null && !limitStr.isEmpty()) {
            limit = Integer.parseInt(limitStr);
        }
        
        long endTime = System.currentTimeMillis();
        long startTime = endTime - (duration * 1000);
        
        List<Map<String, Object>> exceptions = SqliteStorage.getInstance()
                .queryExceptionRecords(startTime, endTime, limit);
        
        List<Map<String, Object>> statsByType = SqliteStorage.getInstance()
                .queryExceptionStatsByType(startTime, endTime);
        
        Map<String, Object> result = new HashMap<>();
        result.put("startTime", startTime);
        result.put("endTime", endTime);
        result.put("duration", duration);
        result.put("count", exceptions.size());
        result.put("exceptions", exceptions);
        result.put("statsByType", statsByType);
        
        return result;
    }
    
    /**
     * Clear all statistics
     */
    private Object handleClear() {
        recorder.clear();
        LOGGER.info("Exception statistics cleared");
        
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Statistics cleared");
        
        return result;
    }
    
    private Object error(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}
