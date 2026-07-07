package com.chua.hotspot.core.support.qps;


import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.indicator.Indicator;
import com.chua.hotspot.core.support.utils.DateUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * qps指标
 *
 * @author CH
 * @since 2024/11/13
 */
public class UrlQps implements Indicator<String>, Runnable, AutoCloseable {

    private static final UrlQps INSTANCE = new UrlQps();
    private static final AtomicBoolean STATE = new AtomicBoolean(true);

    final File parentFile = new File("./agent/indicator/qps");
    final LinkedBlockingQueue<JSONObject> queue = new LinkedBlockingQueue<>();

    public UrlQps() {
        if (!parentFile.exists()) {
            parentFile.mkdirs();
        }
    }

    public static UrlQps getInstance() {
        return INSTANCE;
    }

    @Override
    public Indicator<String> addMetric(String name, String data) {
        if (!EnvironmentFactory.getInstance().equalsConfig("indicator", "true")) {
            queue.clear();
            return this;
        }
        queue.add(new JSONObject().fluentPut("name", name).fluentPut("data", data));
        return this;
    }


    @Override
    public void run() {
        while (STATE.get()) {
            try {
                Map<String, List<String>> stringListMap = all(queue);
                writeDisk(stringListMap);
                Thread.sleep(60_000);
            } catch (Throwable ignored) {
            }
        }
    }

    private Map<String, List<String>> all(LinkedBlockingQueue<JSONObject> queue) {
        JSONObject poll = null;
        Map<String, List<String>> stringListMap = new LinkedHashMap<>();
        while ((poll = queue.poll()) != null) {
            String name = poll.getString("name");
            String data = poll.getString("data");
            stringListMap.computeIfAbsent(name, it -> new LinkedList<>()).add(data);
        }

        return stringListMap;
    }

    private void writeDisk(Map<String, List<String>> stringListMap) {
        for (Map.Entry<String, List<String>> entry : stringListMap.entrySet()) {
            try {
                File file = new File(parentFile, DateUtils.currentDay() + "/" + entry.getKey().replace("/", "_"));
                if (!file.getParentFile().exists()) {
                    file.getParentFile().mkdirs();
                }
                if (!file.exists()) {
                    file.createNewFile();
                }
                Files.write(file.toPath(), entry.getValue(), StandardCharsets.UTF_8, StandardOpenOption.APPEND);
            } catch (IOException ignored) {
            }
        }
    }

    @Override
    public void close() throws Exception {
        STATE.set(false);
    }

    /**
     * 获取所有指标
     *
     * @return
     */
    public String[] statistics() {
        File[] files = new File(parentFile, DateUtils.currentDay()).listFiles();
        if (null == files) {
            return new String[0];
        }
        return Arrays.stream(files).map(File::getName).map(it -> it.replace("\\", "/")).toArray(String[]::new);
    }

    public int count(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(new File(parentFile, DateUtils.currentDay() + "/" + path)))) {
            int lineCount = 0;
            while (reader.readLine() != null) {
                lineCount++;
            }
            return lineCount;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * 获取最新一条链路追踪数据
     *
     * @return 最新链路数据
     */
    public Map<String, Object> getLatestTrace() {
        LinkedBlockingQueue<JSONObject> snapshot = new LinkedBlockingQueue<>(queue);
        JSONObject latest = null;
        for (JSONObject obj : snapshot) {
            latest = obj;
        }
        if (latest == null) {
            return Collections.emptyMap();
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("name", latest.getString("name"));
        result.put("data", latest.getString("data"));
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }

    /**
     * 获取链路追踪列表
     *
     * @param limit 返回数量限制
     * @return 链路列表
     */
    public List<Map<String, Object>> getTraceList(int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        LinkedBlockingQueue<JSONObject> snapshot = new LinkedBlockingQueue<>(queue);
        List<JSONObject> list = new ArrayList<>(snapshot);
        
        // 从最新的开始取
        int start = Math.max(0, list.size() - limit);
        for (int i = list.size() - 1; i >= start && result.size() < limit; i--) {
            JSONObject obj = list.get(i);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", obj.getString("name"));
            item.put("data", obj.getString("data"));
            item.put("index", i);
            result.add(item);
        }
        return result;
    }

    /**
     * 根据 traceId 获取链路详情
     *
     * @param traceId 链路ID
     * @return 链路详情
     */
    public Map<String, Object> getTraceById(String traceId) {
        LinkedBlockingQueue<JSONObject> snapshot = new LinkedBlockingQueue<>(queue);
        for (JSONObject obj : snapshot) {
            String data = obj.getString("data");
            if (data != null && data.contains(traceId)) {
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("name", obj.getString("name"));
                result.put("data", data);
                result.put("traceId", traceId);
                return result;
            }
        }
        return null;
    }
}
