package com.chua.hotspot.test.bootb.controller;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 服务 B 的 Controller
 * <p>
 * 接收服务 A 的 HTTP 调用，并可回调服务 A 形成双向链路。
 * Agent 的 HttpClient4xPlugin 会增强 HttpClient 调用，注入链路追踪头。
 * </p>
 */
@RestController
@RequestMapping("/api")
public class ServiceBController {

    /** 服务 A 的地址 */
    private static final String SERVICE_A_URL = "http://127.0.0.1:18081";

    /**
     * hello 接口 - 被服务 A 调用
     * <p>
     * 测试链路：服务A(18081) → HttpClient → 服务B(18082)
     * </p>
     */
    @GetMapping("/hello")
    public Map<String, Object> hello(@RequestParam(defaultValue = "World") String name) {
        Map<String, Object> result = new HashMap<>();
        result.put("service", "B");
        result.put("port", 18082);
        result.put("message", "Hello, " + name + "! from Service B");
        return result;
    }

    /**
     * chain 接口 - 链路追踪测试（回调服务 A 形成双向链路）
     * <p>
     * 测试链路：服务A → 服务B → 服务A → ...
     * 验证跨服务链路追踪和 IP 关系
     * </p>
     */
    @GetMapping("/chain")
    public Map<String, Object> chain(@RequestParam(defaultValue = "1") int depth) {
        Map<String, Object> result = new HashMap<>();
        result.put("service", "B");
        result.put("port", 18082);
        result.put("depth", depth);

        if (depth <= 0) {
            result.put("message", "链路结束");
            return result;
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            // 回调服务 A，形成链路
            HttpGet httpGet = new HttpGet(SERVICE_A_URL + "/api/hello?name=fromB");
            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                HttpEntity entity = response.getEntity();
                String body = EntityUtils.toString(entity, "UTF-8");
                result.put("nextHop", body);
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }

        return result;
    }

    /**
     * 调用服务 A 的 /api/hello 接口
     * <p>
     * 测试链路：服务B(18082) → HttpClient → 服务A(18081)
     * 反向调用，验证双向 IP 关系追踪
     * </p>
     */
    @GetMapping("/call-a")
    public Map<String, Object> callA(@RequestParam(defaultValue = "fromB") String name) {
        Map<String, Object> result = new HashMap<>();
        result.put("service", "B");
        result.put("port", 18082);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(SERVICE_A_URL + "/api/hello?name=" + name);
            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                HttpEntity entity = response.getEntity();
                String body = EntityUtils.toString(entity, "UTF-8");
                result.put("callResult", body);
                result.put("status", response.getStatusLine().getStatusCode());
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }

        return result;
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");
        result.put("service", "B");
        result.put("port", 18082);
        return result;
    }
}