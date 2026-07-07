package com.chua.hotspot.core.support.server.api.endpoints;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.ServerFactory;
import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * WebSocket 配置 API
 * <p>
 * 提供 WebSocket 连接配置信息
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/13
 */
public class WebSocketConfigApi implements ApiEndpoint {

    @Override
    public String name() {
        return "websocket-config";
    }

    @Override
    public Object handle(HttpRequest request) {
        try {
            Map<String, Object> result = new HashMap<>();
            
            ServerFactory serverFactory = ServerFactory.getInstance();
            int wsPort = serverFactory.getWebSocketPort();
            
            result.put("port", wsPort);
            result.put("url", "ws://127.0.0.1:" + wsPort);
            result.put("status", "ok");
            
            return result;
            
        } catch (Exception e) {
            LogFactory.getInstance().error("处理 WebSocket 配置请求失败: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", "内部错误");
            return error;
        }
    }
    
    @Override
    public String description() {
        return "获取 WebSocket 连接配置信息";
    }
}
