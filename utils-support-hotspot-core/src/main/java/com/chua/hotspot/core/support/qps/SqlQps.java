package com.chua.hotspot.core.support.qps;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.indicator.Indicator;
import com.chua.hotspot.core.support.utils.DateUtils;
import com.chua.hotspot.core.support.utils.StringUtils;

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
public class SqlQps implements Indicator<String>, Runnable, AutoCloseable {

    private static final SqlQps INSTANCE = new SqlQps();
    private static final AtomicBoolean STATE = new AtomicBoolean(true);

    final File parentFile = new File("./agent/indicator/sql");
    final LinkedBlockingQueue<JSONObject> queue = new LinkedBlockingQueue<>();

    public SqlQps() {
        if (!parentFile.exists()) {
            parentFile.mkdirs();
        }
    }

    public static SqlQps getInstance() {
        return INSTANCE;
    }

    @Override
    public Indicator<String> addMetric(String name, String data) {
        if (!EnvironmentFactory.getInstance().equalsConfig("indicator", "true")) {
            queue.clear();
            return this;
        }
        queue.add(new JSONObject().fluentPut("name", name).fluentPut("data", data.replace("\n", " ")));
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
        File[] files = parentFile.listFiles();
        if (null == files) {
            return new String[0];
        }
        return Arrays.stream(files).map(File::getName).map(it -> it.replace("\\", "/")).toArray(String[]::new);
    }

    public int count(String path) {
        return count(path, DateUtils.currentDay());
    }

    public int count(String path, String date) {
        try (BufferedReader reader = new BufferedReader(new FileReader(new File(parentFile, date + "/" + path)))) {
            int lineCount = 0;
            while (reader.readLine() != null) {
                lineCount++;
            }
            return lineCount;
        } catch (Exception e) {
            return 0;
        }
    }

    public byte[] statistics(String date) {
        if (StringUtils.isBlank(date)) {
            date = DateUtils.currentDay();
        }

        File[] files = parentFile.listFiles();
        if (null == files) {
            return new byte[0];
        }

        File matchFile = null;
        for (File file : files) {
            if (file.getName().equals(date)) {
                matchFile = file;
                break;
            }
        }
        if (null == matchFile) {
            return new byte[0];
        }

        List<JSONObject> jsonObjects = new LinkedList<>();
        File[] files1 = matchFile.listFiles();
        if (null != files) {
            for (File file : Objects.requireNonNull(files1)) {
                JSONObject item = new JSONObject();
                item.put("table", file.getName());
                item.put("count", count(file.getName()));

                jsonObjects.add(item);
            }

            jsonObjects.sort((o1, o2) -> o2.getInteger("count").compareTo(o1.getInteger("count")));
        }
        return JSON.toJSONBytes(jsonObjects);
    }

}
