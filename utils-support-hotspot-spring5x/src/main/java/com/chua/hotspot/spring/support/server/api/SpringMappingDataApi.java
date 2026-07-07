package com.chua.hotspot.spring.support.server.api;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.perf.HttpPerformanceRecorder;
import com.chua.hotspot.core.support.server.ServerFactory;
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
 * Spring Mapping 数据 API
 * <p>
 * 直接使用 ApplicationContext 和 RequestMappingHandlerMapping，避免反射调用
 * </p>
 *
 * @author CH
 * @version 4.0.0.35
 * @since 2024/12/13
 */
public class SpringMappingDataApi implements ApiEndpoint {
    
    // WebSocket push throttling
    private static volatile long lastWsPushTime = 0;
    private static final long WS_PUSH_INTERVAL = 5000;
    
    // Cached mapping data for WebSocket push
    private static List<Map<String, Object>> cachedMappingData = new ArrayList<>();

    @Override
    public String name() {
        return "spring-mapping-data";
    }

    @Override
    public String description() {
        return "获取 Spring MVC 路由映射信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        logFactory.debug("获取 Spring 路由映射信息");
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            // 获取 RequestMappingHandlerMapping
            RequestMappingHandlerMapping handlerMapping =  (RequestMappingHandlerMapping) SpringFactory.requestMappingHandlerMapping;
            if (handlerMapping == null) {
                Map<String, RequestMappingHandlerMapping> beansOfType = ((ApplicationContext) SpringFactory.getInstance().applicationContext).getBeansOfType(RequestMappingHandlerMapping.class);
                for (RequestMappingHandlerMapping value : beansOfType.values()) {
                    if(value.getClass().getTypeName().contains("Endpoint")) {
                        continue;
                    }
                    handlerMapping = value;
                    break;
                }
            }
            if (handlerMapping == null) {
                return createResponse(result, "RequestMappingHandlerMapping 为空");
            }

//
            // 获取所有映射
            Map<RequestMappingInfo, HandlerMethod> handlerMethods = handlerMapping.getHandlerMethods();
            
            int id = 1;
            for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
                try {
                    RequestMappingInfo mappingInfo = entry.getKey();
                    HandlerMethod handlerMethod = entry.getValue();
                    
                    // 获取路由路径
                    String pattern = getMappingPattern(mappingInfo);
                    
                    // 获取处理类和方法
                    String className = handlerMethod.getBeanType().getName();
                    String methodName = handlerMethod.getMethod().getName();
                    
                    // 获取该路由的性能指标
                    Map<String, Object> perfMetrics = getPerformanceMetrics(pattern);
                    
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", id++);
                    item.put("name", pattern);
                    item.put("className", className);
                    item.put("method", methodName);
                    item.put("resource", null);
                    
                    // 添加 QPS 和请求统计
                    if (perfMetrics != null) {
                        item.put("qps", calculateQps(perfMetrics));
                        item.put("totalRequests", perfMetrics.get("totalRequests"));
                        item.put("avgDuration", perfMetrics.get("avgDuration"));
                        item.put("errorRate", perfMetrics.get("errorRate"));
                    } else {
                        item.put("qps", 0);
                        item.put("totalRequests", 0);
                        item.put("avgDuration", 0);
                        item.put("errorRate", 0.0);
                    }
                    
                    result.add(item);
                } catch (Exception e) {
                    logFactory.debug("获取映射信息失败: {}", e.getMessage());
                }
            }
            
        } catch (Exception e) {
            logFactory.error("获取 Spring 路由映射失败: {}", e.getMessage());
            return createResponse(result, e.getMessage());
        }
        
        // Cache and push to WebSocket
        cachedMappingData = result;
        pushToWebSocket(result);
        
        return createResponse(result, null);
    }
    
    /**
     * 推送 Spring 路由映射数据到 WebSocket
     */
    private void pushToWebSocket(List<Map<String, Object>> data) {
        long now = System.currentTimeMillis();
        if (now - lastWsPushTime < WS_PUSH_INTERVAL) {
            return;
        }
        lastWsPushTime = now;
        
        try {
            ServerFactory.getInstance().publish(ModuleType.SPRING, "SPRING_MAPPING_UPDATE", data);
        } catch (Exception e) {
            // Ignore push failures
        }
    }
    
    /**
     * 获取缓存的映射数据（用于外部调用）
     */
    public static List<Map<String, Object>> getCachedMappingData() {
        return cachedMappingData;
    }

    /**
     * 获取映射路径
     *
     * @param mappingInfo 映射信息对象
     * @return 路径字符串
     */
    private String getMappingPattern(RequestMappingInfo mappingInfo) {
        try {
            // Spring 5.3+ 使用 getPathPatternsCondition
            if (mappingInfo.getPathPatternsCondition() != null) {
                Set<?> patterns = mappingInfo.getPathPatternsCondition().getPatterns();
                if (patterns != null && !patterns.isEmpty()) {
                    return patterns.iterator().next().toString();
                }
            }
            
            // Spring 5.2 及以下使用 getPatternsCondition
            if (mappingInfo.getPatternsCondition() != null) {
                Set<String> patterns = mappingInfo.getPatternsCondition().getPatterns();
                if (patterns != null && !patterns.isEmpty()) {
                    return patterns.iterator().next();
                }
            }
            
            // 降级使用 toString
            return mappingInfo.toString();
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * 获取指定路由的性能指标
     *
     * @param pattern 路由路径
     * @return 性能指标
     */
    private Map<String, Object> getPerformanceMetrics(String pattern) {
        try {
            HttpPerformanceRecorder recorder = HttpPerformanceRecorder.getInstance();
            
            // 尝试获取 GET 请求的指标
            Map<String, Object> metrics = recorder.getEndpointMetrics(pattern, "GET");
            if (metrics != null) {
                return metrics;
            }
            
            // 尝试获取 POST 请求的指标
            metrics = recorder.getEndpointMetrics(pattern, "POST");
            if (metrics != null) {
                return metrics;
            }
            
            // 遍历所有 endpoints 查找匹配的
            List<Map<String, Object>> allEndpoints = recorder.getAllEndpoints();
            for (Map<String, Object> endpoint : allEndpoints) {
                String url = (String) endpoint.get("url");
                if (url != null && url.equals(pattern)) {
                    return endpoint;
                }
            }
            
            return null;
        } catch (Exception e) {
            logFactory.debug("获取路由性能指标失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 计算 QPS（基于活跃请求数估算）
     *
     * @param metrics 性能指标
     * @return QPS
     */
    private int calculateQps(Map<String, Object> metrics) {
        try {
            Object activeRequests = metrics.get("activeRequests");
            if (activeRequests instanceof Number) {
                return ((Number) activeRequests).intValue();
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * 创建响应对象
     *
     * @param data  数据
     * @param error 错误信息
     * @return 响应对象
     */
    private Map<String, Object> createResponse(List<Map<String, Object>> data, String error) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("total", data.size());
        if (error != null) {
            response.put("error", error);
        }
        return response;
    }
}
