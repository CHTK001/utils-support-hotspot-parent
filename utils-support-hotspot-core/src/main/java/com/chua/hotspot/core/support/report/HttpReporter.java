package com.chua.hotspot.core.support.report;

import lombok.extern.slf4j.Slf4j;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * HTTP 数据上报器
 * 使用 HttpURLConnection 进行 HTTP 请求（Java 8 兼容）
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
@Slf4j
public class HttpReporter {

    /**
     * 上报 URL
     */
    private final String url;

    /**
     * 超时时间（毫秒）
     */
    private final int timeout;

    /**
     * 最大重试次数
     */
    private final int maxRetries;

    /**
     * 异步执行线程池
     */
    private final ExecutorService executor;

    /**
     * 构造函数
     *
     * @param url        上报 URL
     * @param timeout    超时时间（毫秒）
     * @param maxRetries 最大重试次数
     */
    public HttpReporter(String url, int timeout, int maxRetries) {
        this.url = url;
        this.timeout = timeout;
        this.maxRetries = maxRetries;
        this.executor = Executors.newCachedThreadPool();
    }

    /**
     * 异步上报数据
     *
     * @param data JSON 格式的数据
     * @return CompletableFuture
     */
    public CompletableFuture<Boolean> reportAsync(String data) {
        return CompletableFuture.supplyAsync(() -> {
            for (int i = 0; i < maxRetries; i++) {
                try {
                    boolean success = doReport(data);
                    if (success) {
                        return true;
                    }
                } catch (Exception e) {
                    log.debug("HTTP 上报失败，重试 {}/{}: {}", i + 1, maxRetries, e.getMessage());
                }

                // 重试前等待
                if (i < maxRetries - 1) {
                    try {
                        Thread.sleep(1000L * (i + 1));
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return false;
                    }
                }
            }
            return false;
        }, executor);
    }

    /**
     * 同步上报数据
     *
     * @param data JSON 格式的数据
     * @return 是否成功
     */
    public boolean report(String data) {
        for (int i = 0; i < maxRetries; i++) {
            try {
                boolean success = doReport(data);
                if (success) {
                    return true;
                }
            } catch (Exception e) {
                log.debug("HTTP 上报失败，重试 {}/{}: {}", i + 1, maxRetries, e.getMessage());
            }
        }
        return false;
    }

    /**
     * 执行上报
     *
     * @param data JSON 数据
     * @return 是否成功
     * @throws Exception 异常
     */
    private boolean doReport(String data) throws Exception {
        HttpURLConnection connection = null;
        try {
            URL targetUrl = new URL(url);
            connection = (HttpURLConnection) targetUrl.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            connection.setConnectTimeout(timeout);
            connection.setReadTimeout(timeout);
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = data.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int statusCode = connection.getResponseCode();
            if (statusCode >= 200 && statusCode < 300) {
                log.debug("HTTP 上报成功，状态码: {}", statusCode);
                return true;
            } else {
                log.warn("HTTP 上报失败，状态码: {}", statusCode);
                return false;
            }
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    /**
     * 关闭上报器
     */
    public void close() {
        if (executor != null && !executor.isShutdown()) {
            executor.shutdown();
        }
    }

    /**
     * 获取上报 URL
     *
     * @return URL
     */
    public String getUrl() {
        return url;
    }

    /**
     * 获取超时时间
     *
     * @return 超时时间（毫秒）
     */
    public int getTimeout() {
        return timeout;
    }

    /**
     * 获取最大重试次数
     *
     * @return 最大重试次数
     */
    public int getMaxRetries() {
        return maxRetries;
    }
}
