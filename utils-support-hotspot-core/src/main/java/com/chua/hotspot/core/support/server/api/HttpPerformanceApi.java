package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.perf.HttpPerformanceRecorder;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.*;

/**
 * HTTP Performance API
 * 
 * Provides HTTP performance monitoring endpoints:
 * - action=summary: Overall HTTP statistics
 * - action=top: Top endpoints by request frequency
 * - action=slow: Slow endpoints analysis
 * - action=errors: Error endpoints analysis
 * - action=all: All endpoints
 * - action=config: Get/set configuration (slow threshold)
 * - action=clear: Clear all statistics
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class HttpPerformanceApi implements ApiEndpoint {
    
    private final LogFactory logFactory = LogFactory.getInstance();
    private final HttpPerformanceRecorder recorder = HttpPerformanceRecorder.getInstance();
    
    @Override
    public String name() {
        return "http-perf";
    }
    
    @Override
    public String description() {
        return "HTTP Performance Monitoring";
    }
    
    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action");
        
        if (action == null || action.isEmpty()) {
            action = "summary";
        }
        
        try {
            switch (action) {
                case "summary":
                    return handleSummary();
                    
                case "top":
                    return handleTop(request);
                    
                case "slow":
                    return handleSlow(request);
                    
                case "errors":
                    return handleErrors(request);
                    
                case "all":
                    return handleAll();
                    
                case "config":
                    return handleConfig(request);
                    
                case "clear":
                    return handleClear();
                    
                default:
                    return error("Unknown action: " + action);
            }
        } catch (Exception e) {
            logFactory.error("HTTP performance API error", e);
            return error("Error: " + e.getMessage());
        }
    }
    
    /**
     * Get overall HTTP statistics
     */
    private Object handleSummary() {
        return recorder.getSummary();
    }
    
    /**
     * Get top endpoints by request frequency
     */
    private Object handleTop(HttpRequest request) {
        int limit = 20;
        String limitStr = request.getParam("limit");
        if (limitStr != null && !limitStr.isEmpty()) {
            limit = Integer.parseInt(limitStr);
        }
        
        List<Map<String, Object>> topEndpoints = recorder.getTopEndpoints(limit);
        
        Map<String, Object> result = new HashMap<>();
        result.put("limit", limit);
        result.put("count", topEndpoints.size());
        result.put("endpoints", topEndpoints);
        
        return result;
    }
    
    /**
     * Get slow endpoints analysis
     */
    private Object handleSlow(HttpRequest request) {
        int limit = 20;
        String limitStr = request.getParam("limit");
        if (limitStr != null && !limitStr.isEmpty()) {
            limit = Integer.parseInt(limitStr);
        }
        
        List<Map<String, Object>> slowEndpoints = recorder.getSlowEndpoints(limit);
        
        Map<String, Object> result = new HashMap<>();
        result.put("limit", limit);
        result.put("threshold", recorder.getSlowThreshold());
        result.put("count", slowEndpoints.size());
        result.put("endpoints", slowEndpoints);
        
        return result;
    }
    
    /**
     * Get error endpoints analysis
     */
    private Object handleErrors(HttpRequest request) {
        int limit = 20;
        String limitStr = request.getParam("limit");
        if (limitStr != null && !limitStr.isEmpty()) {
            limit = Integer.parseInt(limitStr);
        }
        
        List<Map<String, Object>> errorEndpoints = recorder.getErrorEndpoints(limit);
        
        Map<String, Object> result = new HashMap<>();
        result.put("limit", limit);
        result.put("count", errorEndpoints.size());
        result.put("endpoints", errorEndpoints);
        
        return result;
    }
    
    /**
     * Get all endpoints
     */
    private Object handleAll() {
        List<Map<String, Object>> allEndpoints = recorder.getAllEndpoints();
        
        Map<String, Object> result = new HashMap<>();
        result.put("count", allEndpoints.size());
        result.put("endpoints", allEndpoints);
        
        return result;
    }
    
    /**
     * Get/set configuration
     */
    private Object handleConfig(HttpRequest request) {
        String thresholdStr = request.getParam("slowThreshold");
        
        if (thresholdStr != null && !thresholdStr.isEmpty()) {
            // Set threshold
            long threshold = Long.parseLong(thresholdStr);
            recorder.setSlowThreshold(threshold);
            logFactory.info("HTTP performance slow threshold set to: {}ms", threshold);
        }
        
        Map<String, Object> config = new HashMap<>();
        config.put("slowThreshold", recorder.getSlowThreshold());
        
        return config;
    }
    
    /**
     * Clear all statistics
     */
    private Object handleClear() {
        recorder.clear();
        logFactory.info("HTTP performance statistics cleared");
        
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
