package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.transform.Listener;
import com.chua.hotspot.core.support.transform.Span;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 句柄监控 API
 * <p>
 * 提供 JVM 文件句柄、Socket 等资源的监控接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class HandleApi implements ApiEndpoint {

    @Override
    public String name() {
        return "handle";
    }

    @Override
    public String description() {
        return "获取句柄监控信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        LogFactory.getInstance().debug("获取句柄监控信息");
        
        String format = request.getParam("format", "json");
        
        try {
            if ("html".equals(format)) {
                // 返回 HTML 格式
                return Listener.dump();
            }
            
            // 返回 JSON 格式
            List<Span> openFiles = Listener.getCurrentOpenFiles();
            List<Map<String, Object>> result = new ArrayList<>();
            
            int index = 0;
            for (Span span : openFiles) {
                Map<String, Object> item = new HashMap<>();
                item.put("index", index++);
                item.put("id", "handle_" + index);
                item.put("message", span.getMessage());
                item.put("stack", span.getStack());
                result.add(item);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("total", result.size());
            response.put("data", result);
            response.put("title", Listener.title());
            response.put("agentInstalled", Listener.isAgentInstalled());
            
            return response;
            
        } catch (Exception e) {
            LogFactory.getInstance().error("获取句柄监控信息失败: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("total", 0);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
            return response;
        }
    }
}
