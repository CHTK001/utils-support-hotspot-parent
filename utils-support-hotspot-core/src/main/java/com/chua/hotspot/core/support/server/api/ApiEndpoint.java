package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.server.http.HttpRequest;

/**
 * API 端点接口
 * <p>
 * 所有 REST API 端点都需要实现此接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public interface ApiEndpoint {

    /**
     * 获取端点名称（用于路由匹配）
     *
     * @return 端点名称
     */
    String name();

    /**
     * 处理请求并返回数据
     *
     * @param request HTTP 请求
     * @return 响应数据
     */
    Object handle(HttpRequest request);

    /**
     * 获取端点描述
     *
     * @return 描述
     */
    default String description() {
        return "";
    }
}
