package com.chua.hotspot.core.support.server.api.endpoints;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.qps.ComponentConnectionRecorder;
import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 组件统计 API
 * <p>
 * 提供组件连接统计查询（只从内存读取，不存 SQLite）
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/13
 */
public class ComponentApi implements ApiEndpoint {

    @Override
    public String name() {
        return "component";
    }

    @Override
    public Object handle(HttpRequest request) {
        try {
            // 组件连接只支持 current，不支持 history
            return getCurrentStats(request);
            
        } catch (Exception e) {
            LogFactory.getInstance().error("处理组件统计请求失败: {}", e.getMessage());
            return error("内部错误: " + e.getMessage());
        }
    }

    /**
     * 获取当前组件连接统计（从内存）
     */
    private Object getCurrentStats(HttpRequest request) {
        String componentType = request.getParam("type");
        
        List<ComponentConnectionRecorder.ComponentStat> stats = 
            ComponentConnectionRecorder.getInstance().getCurrentStats();
        
        // 如果指定了类型，过滤结果
        if (componentType != null && !componentType.isEmpty()) {
            stats.removeIf(s -> !s.componentType.equalsIgnoreCase(componentType));
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("status", "ok");
        result.put("data", stats);
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }

    /**
     * 构建错误响应
     */
    private Object error(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "error");
        result.put("message", message);
        return result;
    }

    @Override
    public String description() {
        return "组件连接统计查询 API";
    }
}
