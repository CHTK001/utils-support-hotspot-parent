package com.chua.hotspot.profiler.support;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 慢方法分析API
 * 提供方法性能统计和慢方法查询接口
 *
 * @author CH
 */
public class SlowMethodApi implements ApiEndpoint {

    private static final LogFactory logger = LogFactory.getInstance();

    @Override
    public String name() {
        return "profiler";
    }

    @Override
    public String description() {
        return "Slow Method Profiler";
    }

    @Override
    public Object handle(HttpRequest request) {
        ensureInitialized();
        String action = request.getParam("action");
        
        if (action == null || action.isEmpty()) {
            action = "status";
        }
        
        try {
            switch (action) {
                case "slow":
                    return getSlowMethods(request);
                case "top":
                    return getTopMethods(request);
                case "stats":
                    return getMethodStats(request);
                case "all":
                    return getAllMethods(request);
                case "config":
                    return handleConfig(request);
                case "enable":
                    return enableProfiling(request);
                case "clear":
                    return clearStats();
                case "status":
                    return getStatus();
                default:
                    return error("Unknown action: " + action);
            }
        } catch (Exception e) {
            logger.error("Error executing profiler API action: " + action, e);
            return error("Error: " + e.getMessage());
        }
    }

    /**
     * 获取慢方法列表
     */
    private Object getSlowMethods(HttpRequest request) {
        try {
            List<MethodProfiler.MethodStats> slowMethods = MethodProfiler.getInstance().getSlowMethods();
            
            List<Map<String, Object>> result = slowMethods.stream()
                    .map(MethodProfiler.MethodStats::toMap)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("threshold", MethodProfiler.getInstance().getSlowMethodThreshold());
            response.put("count", result.size());
            response.put("methods", result);
            
            return response;
        } catch (Exception e) {
            logger.error("Failed to get slow methods", e);
            return error("Failed to get slow methods: " + e.getMessage());
        }
    }

    /**
     * 获取方法耗时排行榜
     */
    private Object getTopMethods(HttpRequest request) {
        try {
            int limit = 50;
            String limitStr = request.getParam("limit");
            if (limitStr != null && !limitStr.isEmpty()) {
                limit = Integer.parseInt(limitStr);
            }
            
            List<MethodProfiler.MethodStats> topMethods = MethodProfiler.getInstance()
                    .getTopSlowMethods(limit);
            
            List<Map<String, Object>> result = topMethods.stream()
                    .map(MethodProfiler.MethodStats::toMap)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("limit", limit);
            response.put("count", result.size());
            response.put("methods", result);
            
            return response;
        } catch (Exception e) {
            logger.error("Failed to get top methods", e);
            return error("Failed to get top methods: " + e.getMessage());
        }
    }

    /**
     * 获取指定方法的统计信息
     */
    private Object getMethodStats(HttpRequest request) {
        try {
            String methodSignature = request.getParam("method");
            if (methodSignature == null || methodSignature.isEmpty()) {
                return error("Parameter 'method' is required");
            }
            
            MethodProfiler.MethodStats stats = MethodProfiler.getInstance()
                    .getMethodStats(methodSignature);
            
            if (stats == null) {
                return error("Method not found: " + methodSignature);
            }
            
            return stats.toMap();
        } catch (Exception e) {
            logger.error("Failed to get method stats", e);
            return error("Failed to get method stats: " + e.getMessage());
        }
    }

    /**
     * 获取所有方法统计信息
     */
    private Object getAllMethods(HttpRequest request) {
        try {
            List<MethodProfiler.MethodStats> allMethods = MethodProfiler.getInstance()
                    .getAllMethodStats();
            
            // 按调用次数排序
            allMethods.sort((a, b) -> Long.compare(b.getCallCount(), a.getCallCount()));
            
            List<Map<String, Object>> result = allMethods.stream()
                    .map(MethodProfiler.MethodStats::toMap)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("count", result.size());
            response.put("methods", result);
            
            return response;
        } catch (Exception e) {
            logger.error("Failed to get all methods", e);
            return error("Failed to get all methods: " + e.getMessage());
        }
    }

    /**
     * 处理配置相关操作
     */
    private Object handleConfig(HttpRequest request) {
        try {
            String operation = request.getParam("operation");
            
            if ("get".equals(operation) || operation == null) {
                // 获取当前配置
                Map<String, Object> config = new LinkedHashMap<>();
                config.put("enabled", MethodProfiler.getInstance().isEnabled());
                config.put("threshold", MethodProfiler.getInstance().getSlowMethodThreshold());
                config.put("detectorInitialized", SlowMethodDetector.getInstance().isInitialized());
                config.put("excludedPackages", SlowMethodDetector.getInstance().getExcludedPackages());
                config.put("instrumentedClasses", SlowMethodDetector.getInstance().getInstrumentedClasses());
                
                return config;
            } else if ("set".equals(operation)) {
                // 设置配置
                String thresholdStr = request.getParam("threshold");
                if (thresholdStr != null) {
                    long threshold = Long.parseLong(thresholdStr);
                    MethodProfiler.getInstance().setSlowMethodThreshold(threshold);
                }
                
                String enabledStr = request.getParam("enabled");
                if (enabledStr != null) {
                    boolean enabled = Boolean.parseBoolean(enabledStr);
                    MethodProfiler.getInstance().setEnabled(enabled);
                }
                
                Map<String, Object> resp = new LinkedHashMap<>();
                resp.put("message", "Configuration updated");
                return resp;
            } else {
                return error("Invalid operation: " + operation);
            }
        } catch (Exception e) {
            logger.error("Failed to handle config", e);
            return error("Failed to handle config: " + e.getMessage());
        }
    }

    /**
     * 启用方法profiling
     */
    private Object enableProfiling(HttpRequest request) {
        try {
            String type = request.getParam("type");
            String target = request.getParam("target");
            
            if (target == null || target.isEmpty()) {
                return error("Parameter 'target' is required");
            }
            
            Map<String, Object> resp = new LinkedHashMap<>();
            if ("class".equals(type)) {
                SlowMethodDetector.getInstance().enableProfilingForClass(target);
                resp.put("message", "Enabled profiling for class: " + target);
                return resp;
            } else if ("package".equals(type)) {
                SlowMethodDetector.getInstance().enableProfilingForPackage(target);
                resp.put("message", "Enabled profiling for package: " + target);
                return resp;
            } else {
                return error("Invalid type: " + type + ". Use 'class' or 'package'");
            }
        } catch (Exception e) {
            logger.error("Failed to enable profiling", e);
            return error("Failed to enable profiling: " + e.getMessage());
        }
    }

    /**
     * 清理统计数据
     */
    private Object clearStats() {
        try {
            MethodProfiler.getInstance().clear();
            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("message", "Statistics cleared");
            return resp;
        } catch (Exception e) {
            logger.error("Failed to clear stats", e);
            return error("Failed to clear stats: " + e.getMessage());
        }
    }

    /**
     * 获取profiler状态
     */
    private Object getStatus() {
        ensureInitialized();
        try {
            Map<String, Object> status = new LinkedHashMap<>();
            status.put("profilerEnabled", MethodProfiler.getInstance().isEnabled());
            status.put("detectorInitialized", SlowMethodDetector.getInstance().isInitialized());
            status.put("slowMethodThreshold", MethodProfiler.getInstance().getSlowMethodThreshold());
            status.put("totalMethods", MethodProfiler.getInstance().getAllMethodStats().size());
            status.put("slowMethodCount", MethodProfiler.getInstance().getSlowMethods().size());
            status.put("instrumentedClasses", SlowMethodDetector.getInstance().getInstrumentedClasses().size());
            
            return status;
        } catch (Exception e) {
            logger.error("Failed to get status", e);
            return error("Failed to get status: " + e.getMessage());
        }
    }
    private Map<String, Object> error(String message) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }

    private void ensureInitialized() {
        try {
            if (!SlowMethodDetector.getInstance().isInitialized()) {
                if (InstrumentationFactory.getInstance().get() != null) {
                    SlowMethodDetector.getInstance().initialize(InstrumentationFactory.getInstance().get());
                    logger.info("SlowMethodDetector initialized via InstrumentationFactory");
                } else {
                    logger.warn("Instrumentation is null; cannot initialize SlowMethodDetector yet");
                }
            }
        } catch (Throwable e) {
            logger.warn("Failed to initialize SlowMethodDetector: {}", e.getMessage());
        }
    }
}
