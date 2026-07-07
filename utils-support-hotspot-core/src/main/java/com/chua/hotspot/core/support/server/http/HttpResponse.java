package com.chua.hotspot.core.support.server.http;

import com.alibaba.fastjson.JSON;
import com.chua.hotspot.core.support.log.LogFactory;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import lombok.Getter;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * HTTP 响应封装
 * <p>
 * 对 {@link HttpExchange} 的封装，提供更便捷的响应写入方式
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
@Getter
public class HttpResponse {

    /**
     * 原始 HttpExchange
     */
    private final HttpExchange exchange;

    /**
     * 响应头
     */
    private final Headers headers;

    /**
     * HTTP 状态码
     */
    private int statusCode = 200;

    /**
     * 是否已发送
     */
    private boolean sent = false;

    /**
     * 构造函数
     *
     * @param exchange HttpExchange
     */
    public HttpResponse(HttpExchange exchange) {
        this.exchange = exchange;
        this.headers = exchange.getResponseHeaders();
        // 默认响应头
        this.headers.set("Content-Type", "application/json;charset=UTF-8");
        this.headers.set("Access-Control-Allow-Origin", "*");
        this.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        this.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    /**
     * 设置响应头
     *
     * @param name  头名称
     * @param value 头值
     * @return this
     */
    public HttpResponse setHeader(String name, String value) {
        headers.set(name, value);
        return this;
    }

    /**
     * 设置 Content-Type
     *
     * @param contentType 内容类型
     * @return this
     */
    public HttpResponse setContentType(String contentType) {
        headers.set("Content-Type", contentType);
        return this;
    }

    /**
     * 设置状态码
     *
     * @param code 状态码
     * @return this
     */
    public HttpResponse setStatus(int code) {
        this.statusCode = code;
        return this;
    }

    /**
     * 写入 JSON 响应
     *
     * @param data 数据对象
     */
    public void json(Object data) {
        setContentType("application/json;charset=UTF-8");
        write(JSON.toJSONBytes(data));
    }

    /**
     * 写入文本响应
     *
     * @param text 文本内容
     */
    public void text(String text) {
        setContentType("text/plain;charset=UTF-8");
        write(text.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 写入 HTML 响应
     *
     * @param html HTML 内容
     */
    public void html(String html) {
        setContentType("text/html;charset=UTF-8");
        write(html.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 写入字节数组响应
     *
     * @param data 字节数组
     */
    public void write(byte[] data) {
        if (sent) {
            LogFactory.getInstance().warn("响应已发送，无法重复写入");
            return;
        }
        sent = true;

        try {
            exchange.sendResponseHeaders(statusCode, data.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(data);
                os.flush();
            }
        } catch (IOException e) {
            LogFactory.getInstance().error("写入 HTTP 响应失败: {}", e.getMessage());
        }
    }

    /**
     * 发送成功响应
     *
     * @param data 数据
     */
    public void success(Object data) {
        json(ApiResult.success(data));
    }

    /**
     * 发送成功响应（无数据）
     */
    public void success() {
        json(ApiResult.success(null));
    }

    /**
     * 发送错误响应
     *
     * @param message 错误消息
     */
    public void error(String message) {
        setStatus(500);
        json(ApiResult.error(message));
    }

    /**
     * 发送错误响应
     *
     * @param code    状态码
     * @param message 错误消息
     */
    public void error(int code, String message) {
        setStatus(code);
        json(ApiResult.error(code, message));
    }

    /**
     * 发送 404 响应
     */
    public void notFound() {
        error(404, "资源未找到");
    }

    /**
     * 发送 OPTIONS 响应（CORS 预检）
     */
    public void options() {
        setStatus(204);
        write(new byte[0]);
    }

    /**
     * 发送静态资源响应
     *
     * @param content  资源内容
     * @param mimeType MIME 类型
     */
    public void staticResource(byte[] content, String mimeType) {
        setContentType(mimeType);
        // 添加缓存控制头
        setHeader("Cache-Control", "public, max-age=3600");
        write(content);
    }

    /**
     * 发送 401 未授权响应
     */
    public void unauthorized() {
        setHeader("WWW-Authenticate", "Basic realm=\"Agent\"");
        error(401, "未授权，请提供有效的认证信息");
    }
}
