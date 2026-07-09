package com.chua.hotspot.core.support.server.http;

import com.chua.hotspot.core.support.utils.NetAddress;
import com.sun.net.httpserver.HttpExchange;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static com.chua.hotspot.core.support.server.http.HttpServer.DEFAULT_CONTEXT;

/**
 * HTTP 请求封装
 * <p>
 * 对 {@link HttpExchange} 的封装，提供更便捷的请求参数获取方式
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class HttpRequest {

    /**
     * 原始 HttpExchange
     */
    private final HttpExchange exchange;

    /**
     * 请求路径（不含查询参数）
     */
    private final String path;

    /**
     * 请求方法
     */
    private final String method;

    /**
     * 查询参数
     */
    private final Map<String, String> queryParams;

    /**
     * 请求体（懒加载）
     */
    private String body;

    /**
     * 构造函数
     *
     * @param exchange HttpExchange
     */
    public HttpRequest(HttpExchange exchange) {
        this.exchange = exchange;
        this.method = exchange.getRequestMethod();

        // 解析 URI
        String uri = exchange.getRequestURI().toString();
        NetAddress netAddress = NetAddress.of(uri);
        this.path = netAddress.getAddress().replace(DEFAULT_CONTEXT, "");
        Map<String, Object> params = netAddress.parametric();
        this.queryParams = new HashMap<String, String>();
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (entry.getValue() != null) {
                this.queryParams.put(entry.getKey(), String.valueOf(entry.getValue()));
            }
        }
    }

    public HttpExchange getExchange() {
        return exchange;
    }

    public String getPath() {
        return path;
    }

    public String getMethod() {
        return method;
    }

    public Map<String, String> getQueryParams() {
        return queryParams;
    }

    public void setBody(String body) {
        this.body = body;
    }

    /**
     * 获取请求头
     *
     * @param name 头名称
     * @return 头值
     */
    public String getHeader(String name) {
        return exchange.getRequestHeaders().getFirst(name);
    }

    /**
     * 获取查询参数
     *
     * @param name 参数名
     * @return 参数值
     */
    public String getParam(String name) {
        return queryParams.get(name);
    }

    /**
     * 获取查询参数（带默认值）
     *
     * @param name         参数名
     * @param defaultValue 默认值
     * @return 参数值
     */
    public String getParam(String name, String defaultValue) {
        return queryParams.getOrDefault(name, defaultValue);
    }

    /**
     * 获取整数参数
     *
     * @param name         参数名
     * @param defaultValue 默认值
     * @return 参数值
     */
    public int getIntParam(String name, int defaultValue) {
        String value = queryParams.get(name);
        if (value == null || value.isEmpty()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    /**
     * 获取请求体
     *
     * @return 请求体字符串
     */
    public String getBody() {
        if (body == null) {
            try (InputStream is = exchange.getRequestBody();
                 BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                body = reader.lines().collect(Collectors.joining("\n"));
            } catch (IOException e) {
                body = "";
            }
        }
        return body;
    }

    /**
     * 获取请求体输入流
     *
     * @return 输入流
     */
    public InputStream getBodyStream() {
        return exchange.getRequestBody();
    }

    /**
     * 获取客户端地址
     *
     * @return 客户端地址
     */
    public String getRemoteAddress() {
        return exchange.getRemoteAddress().getAddress().getHostAddress();
    }
}