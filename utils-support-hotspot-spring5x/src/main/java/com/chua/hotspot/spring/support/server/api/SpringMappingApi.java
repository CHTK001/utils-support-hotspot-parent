package com.chua.hotspot.spring.support.server.api;

import com.chua.hotspot.core.support.recorder.MappingQpsRecorder;
import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.spring.support.factory.SpringFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.*;

import static com.chua.hotspot.core.support.plugin.Plugin.logFactory;

/**
 * Spring Mapping API
 * <p>
 * 展示所有 Spring MVC Mapping 信息和 QPS 统计
 * </p>
 *
 * @author CH
 * @version 4.0.0.36
 * @since 2024/12/14
 */
public class SpringMappingApi implements ApiEndpoint {

    @Override
    public String name() {
        return "spring-mapping-data";
    }

    @Override
    public String description() {
        return "获取 Spring MVC Mapping 信息和 QPS 统计";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "list");
        
        switch (action) {
            case "list":
                return listMappings(request);
            case "qps":
                return getMappingQps(request);
            case "stats":
                return getMappingStats(request);
            default:
                return error("未知的操作: " + action);
        }
    }
    
    /**
     * 获取所有 Mapping 列表
     */
    private Object listMappings(HttpRequest request) {
        logFactory.debug("获取 Spring Mapping 列表");
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            Object appContext = SpringFactory.getInstance().applicationContext;
            
            if (appContext == null) {
                logFactory.warn("Spring ApplicationContext 未初始化");
                return createResponse(result, "Spring ApplicationContext 未初始化");
            }
            
            if (!(appContext instanceof ApplicationContext)) {
                logFactory.warn("ApplicationContext 类型不匹配");
                return createResponse(result, "ApplicationContext 类型不匹配");
            }
            
            ApplicationContext applicationContext = (ApplicationContext) appContext;
            
            // 获取 RequestMappingHandlerMapping
            RequestMappingHandlerMapping handlerMapping = getRequestMappingHandlerMapping(applicationContext);
            if (handlerMapping == null) {
                return createResponse(result, "RequestMappingHandlerMapping 未找到");
            }
            
            // 获取所有 Mapping
            Map<RequestMappingInfo, HandlerMethod> mappings = handlerMapping.getHandlerMethods();
            
            int id = 1;
            for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : mappings.entrySet()) {
                RequestMappingInfo mappingInfo = entry.getKey();
                HandlerMethod handlerMethod = entry.getValue();
                
                // 提取 URL 模式
                Set<String> patterns = extractPatterns(mappingInfo);
                
                // 提取 HTTP 方法
                Set<String> methods = new HashSet<>();
                if (mappingInfo.getMethodsCondition() != null && 
                    mappingInfo.getMethodsCondition().getMethods() != null) {
                    mappingInfo.getMethodsCondition().getMethods()
                        .forEach(method -> methods.add(method.name()));
                }
                
                // 如果没有指定方法，默认支持所有方法
                if (methods.isEmpty()) {
                    methods.add("ALL");
                }
                
                // 构建 handler 信息
                String handler = handlerMethod.getBeanType().getSimpleName() + "." + 
                                handlerMethod.getMethod().getName();
                
                // 为每个 URL + Method 组合创建一条记录
                for (String pattern : patterns) {
                    for (String method : methods) {
                        String mappingId = pattern + "#" + method;
                        
                        Map<String, Object> item = new HashMap<>();
                        item.put("id", id++);
                        item.put("mappingId", mappingId);
                        item.put("url", pattern);
                        item.put("method", method);
                        item.put("handler", handler);
                        item.put("className", handlerMethod.getBeanType().getName());
                        item.put("methodName", handlerMethod.getMethod().getName());
                        
                        // 关联 QPS 统计
                        try {
                            int qps = MappingQpsRecorder.getInstance().getCurrentQps(mappingId);
                            item.put("qps", qps);
                            item.put("totalRequests", 0L);
                            item.put("activeRequests", 0);
                            item.put("avgDuration", 0.0);
                            item.put("errorRate", 0.0);
                        } catch (Exception e) {
                            item.put("qps", 0);
                            item.put("totalRequests", 0L);
                            item.put("activeRequests", 0);
                            item.put("avgDuration", 0.0);
                            item.put("errorRate", 0.0);
                        }
                        
                        result.add(item);
                    }
                }
            }
            
            logFactory.info("获取 Spring Mapping 列表成功，总计 {} 条", result.size());
            
        } catch (Exception e) {
            logFactory.error("获取 Spring Mapping 列表失败: {}", e.getMessage());
            return createResponse(result, e.getMessage());
        }
        
        logFactory.debug("返回 Mapping 数据：total={}, data.size={}", result.size(), result.size());
        return createResponse(result, null);
    }
    
    /**
     * 获取指定 Mapping 的 QPS 统计
     */
    private Object getMappingQps(HttpRequest request) {
        String mappingId = request.getParam("mappingId");
        
        if (mappingId == null || mappingId.isEmpty()) {
            return error("缺少参数: mappingId");
        }
        
        Map<String, Object> stats = MappingQpsRecorder.getInstance().getMappingStats(mappingId);
        
        if (stats == null) {
            return error("Mapping 不存在或无统计数据: " + mappingId);
        }
        
        return stats;
    }
    
    /**
     * 获取所有 Mapping 的统计摘要
     */
    private Object getMappingStats(HttpRequest request) {
        Map<String, Map<String, Object>> allStats = MappingQpsRecorder.getInstance()
            .getAllMappingStats();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMappings", allStats.size());
        summary.put("mappings", allStats);
        summary.put("timestamp", System.currentTimeMillis());
        
        return summary;
    }
    
    /**
     * 提取 URL 模式
     * 支持 Spring 5.3+ 的 pathPatternsCondition 和旧版本的 patternsCondition
     */
    private Set<String> extractPatterns(RequestMappingInfo mappingInfo) {
        Set<String> patterns = new HashSet<>();
        
        // Spring 5.3+ 优先使用 pathPatternsCondition
        try {
            if (mappingInfo.getPathPatternsCondition() != null) {
                mappingInfo.getPathPatternsCondition().getPatterns()
                    .forEach(pattern -> patterns.add(pattern.getPatternString()));
            }
        } catch (Exception e) {
            // Spring 5.3 之前的版本可能没有这个方法
        }
        
        // 回退到 patternsCondition (Spring 5.2 及之前)
        if (patterns.isEmpty() && mappingInfo.getPatternsCondition() != null) {
            patterns.addAll(mappingInfo.getPatternsCondition().getPatterns());
        }
        
        // 如果仍然为空，尝试从 toString 解析
        if (patterns.isEmpty()) {
            String str = mappingInfo.toString();
            // 格式通常是: {GET [/api/xxx]}
            if (str.contains("[") && str.contains("]")) {
                int start = str.indexOf("[");
                int end = str.indexOf("]");
                if (start < end) {
                    String path = str.substring(start + 1, end).trim();
                    if (!path.isEmpty()) {
                        patterns.add(path);
                    }
                }
            }
        }
        
        return patterns;
    }
    
    /**
     * 获取 RequestMappingHandlerMapping
     */
    private RequestMappingHandlerMapping getRequestMappingHandlerMapping(
            ApplicationContext applicationContext) {
        // 优先使用 SpringFactory 中已注册的实例
        Object registered = SpringFactory.requestMappingHandlerMapping;
        if (registered instanceof RequestMappingHandlerMapping) {
            return (RequestMappingHandlerMapping) registered;
        }
        
        // 回退到从 ApplicationContext 获取
        try {
            Map<String, RequestMappingHandlerMapping> beansOfType = applicationContext.getBeansOfType(RequestMappingHandlerMapping.class);
            return beansOfType.get("requestMappingHandlerMapping");
        } catch (Exception e) {
            logFactory.debug("获取 RequestMappingHandlerMapping 失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 创建响应对象
     */
    private Map<String, Object> createResponse(List<Map<String, Object>> data, String error) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("total", data.size());
        response.put("success", error == null);
        if (error != null) {
            response.put("error", error);
        }
        return response;
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
