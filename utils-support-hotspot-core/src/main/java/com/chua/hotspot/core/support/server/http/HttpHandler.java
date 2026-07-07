package com.chua.hotspot.core.support.server.http;

/**
 * HTTP 请求处理器接口
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
@FunctionalInterface
public interface HttpHandler {

    /**
     * 处理请求
     *
     * @param request  请求
     * @param response 响应
     */
    void handle(HttpRequest request, HttpResponse response);
}
