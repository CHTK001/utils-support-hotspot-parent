package com.chua.hotspot.test.boota.controller;

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
 * 服务 A 的 Controller
 * <p>
 * 提供 REST 接口，内部通过 HttpClient 4.x 调用服务 B。
 * Agent 的 HttpClient4xPlugin 会增强 HttpClient 调用，注入链路追踪头。
 * </p>
 */
@RestController
@RequestMapping("/api")
public class ServiceAController {

    /** 服务 B 的地址 */
    private static final String SERVICE_B_URL = "http://127.0.0.1:18082";

    /**
     * 调用服务 B 的 /api/hello 接口
     * <p>
     * 测试链路：用户 → 服务A(18081) → HttpClient → 服务B(18082)
     * Agent 增强 HttpClient 后会自动注入 traceId 等链路追踪头
     * </p>
     */
    @GetMapping("/call-b")
    public Map<String, Object> callB(@RequestParam(defaultValue = "World") String name) {
        Map<String, Object> result = new HashMap<>();
        result.put("service", "A");
        result.put("port", 18081);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(SERVICE_B_URL + "/api/hello?name=" + name);
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
     * 调用服务 B 的 /api/chain 接口（多层链路）
     * <p>
     * 测试链路：用户 → 服务A → HttpClient → 服务B → HttpClient → 服务A
     * 验证跨服务链路追踪和 IP 关系
     * </p>
     */
    @GetMapping("/chain")
    public Map<String, Object> chain(@RequestParam(defaultValue = "1") int depth) {
        Map<String, Object> result = new HashMap<>();
        result.put("service", "A");
        result.put("port", 18081);
        result.put("depth", depth);

        if (depth <= 0) {
            result.put("message", "链路结束");
            return result;
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            // 服务 B 会回调服务 A，形成链路
            HttpGet httpGet = new HttpGet(SERVICE_B_URL + "/api/chain?depth=" + (depth - 1));
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
     * 服务 A 自身的 hello 接口（被服务 B 回调）
     */
    @GetMapping("/hello")
    public Map<String, Object> hello(@RequestParam(defaultValue = "World") String name) {
        Map<String, Object> result = new HashMap<>();
        result.put("service", "A");
        result.put("port", 18081);
        result.put("message", "Hello, " + name + "! from Service A");
        return result;
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");
        result.put("service", "A");
        result.put("port", 18081);
        return result;
    }
}