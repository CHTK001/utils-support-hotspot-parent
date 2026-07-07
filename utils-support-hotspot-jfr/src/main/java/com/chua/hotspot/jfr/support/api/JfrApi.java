package com.chua.hotspot.jfr.support.api;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.server.ServerFactory;
import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.server.ws.WebSocketServer;
import jdk.jfr.FlightRecorder;
import jdk.jfr.Recording;
import jdk.jfr.RecordingState;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

import static com.chua.hotspot.core.support.plugin.Plugin.logFactory;

/**
 * JFR API
 * <p>
 * 提供 JDK Flight Recorder 控制接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.36
 * @since 2024/12/14
 */
public class JfrApi implements ApiEndpoint {

    private static final Map<Long, Recording> recordings = new ConcurrentHashMap<>();
    private static final AtomicLong recordingIdCounter = new AtomicLong(1);
    
    // 状态推送定时器
    private static final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "jfr-status-pusher");
        t.setDaemon(true);
        return t;
    });
    private static ScheduledFuture<?> statusPushTask;
    
    // 启动状态推送
    private static synchronized void startStatusPush() {
        if (statusPushTask == null || statusPushTask.isCancelled()) {
            statusPushTask = scheduler.scheduleAtFixedRate(() -> {
                try {
                    pushRecordingStatus();
                } catch (Exception e) {
                    logFactory.debug("JFR 状态推送异常: {}", e.getMessage());
                }
            }, 0, 3, TimeUnit.SECONDS);
        }
    }
    
    // 停止状态推送
    private static synchronized void stopStatusPushIfNoRunning() {
        boolean hasRunning = recordings.values().stream()
                .anyMatch(r -> r.getState() == RecordingState.RUNNING);
        if (!hasRunning && statusPushTask != null) {
            statusPushTask.cancel(false);
            statusPushTask = null;
        }
    }
    
    // 推送录制状态
    private static void pushRecordingStatus() {
        List<Map<String, Object>> recordingList = new ArrayList<>();
        int running = 0, stopped = 0;
        
        for (Map.Entry<Long, Recording> entry : recordings.entrySet()) {
            Recording recording = entry.getValue();
            Map<String, Object> item = new HashMap<>();
            item.put("recordingId", entry.getKey());
            item.put("name", recording.getName());
            item.put("state", recording.getState().name());
            item.put("duration", recording.getDuration() != null ? recording.getDuration().getSeconds() : null);
            item.put("maxSize", recording.getMaxSize());
            item.put("size", recording.getSize());
            recordingList.add(item);
            
            if (recording.getState() == RecordingState.RUNNING) {
                running++;
            } else if (recording.getState() == RecordingState.STOPPED) {
                stopped++;
            }
        }
        
        Map<String, Object> status = new HashMap<>();
        status.put("available", true);
        status.put("activeRecordings", recordings.size());
        status.put("runningRecordings", running);
        status.put("stoppedRecordings", stopped);
        status.put("recordings", recordingList);

        ServerFactory.getInstance().publish(ModuleType.JFR, "JFR_STATUS", status);
    }
    
    // 推送录制事件
    private static void pushRecordingEvent(String event, long recordingId, Recording recording) {
        Map<String, Object> data = new HashMap<>();
        data.put("recordingId", recordingId);
        data.put("name", recording.getName());
        data.put("state", recording.getState().name());
        data.put("size", recording.getSize());
        data.put("timestamp", System.currentTimeMillis());

        ServerFactory.getInstance().publish(ModuleType.JFR, event, data);
    }

    @Override
    public String name() {
        return "jfr";
    }

    @Override
    public String description() {
        return "JFR 监控";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "list");
        
        try {
            // 检查 JFR 是否可用
            if (!isJfrAvailable()) {
                return error("JFR 不可用，请确保使用 Java 11+ 且 JFR 已启用");
            }
            
            switch (action) {
                case "start":
                    return startRecording(request);
                case "stop":
                    return stopRecording(request);
                case "dump":
                    return dumpRecording(request);
                case "list":
                    return listRecordings();
                case "status":
                    return getStatus();
                default:
                    return error("未知的操作: " + action);
            }
        } catch (NoClassDefFoundError e) {
            logFactory.error("JFR 类未找到，可能 JVM 不支持 JFR: {}", e.getMessage());
            return error("JFR 不可用: " + e.getMessage());
        } catch (Exception e) {
            logFactory.error("JFR 操作失败: {}", e.getMessage(), e);
            return error("操作失败: " + e.getMessage());
        }
    }
    
    /**
     * 开始 JFR 记录
     */
    private Object startRecording(HttpRequest request) {
        try {
            String name = request.getParam("name", "hotspot-recording-" + System.currentTimeMillis());
            String durationStr = request.getParam("duration");
            String maxSizeStr = request.getParam("maxSize");
            
            Recording recording = new Recording();
            recording.setName(name);
            
            // 设置持续时间
            if (durationStr != null && !durationStr.isEmpty()) {
                long duration = Long.parseLong(durationStr);
                recording.setDuration(Duration.ofSeconds(duration));
            }
            
            // 设置最大大小（MB）
            if (maxSizeStr != null && !maxSizeStr.isEmpty()) {
                long maxSize = Long.parseLong(maxSizeStr);
                recording.setMaxSize(maxSize * 1024 * 1024);
            }
            
            // 启用常用事件
            recording.enable("jdk.CPULoad");
            recording.enable("jdk.GarbageCollection");
            recording.enable("jdk.ThreadAllocationStatistics");
            recording.enable("jdk.ObjectAllocationInNewTLAB");
            recording.enable("jdk.JavaMonitorEnter");
            recording.enable("jdk.ThreadPark");
            
            recording.start();
            
            long recordingId = recordingIdCounter.getAndIncrement();
            recordings.put(recordingId, recording);
            
            // 推送录制启动事件
            pushRecordingEvent("JFR_STARTED", recordingId, recording);
            // 启动状态推送
            startStatusPush();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("recordingId", recordingId);
            result.put("name", name);
            result.put("state", recording.getState().name());
            
            logFactory.info("JFR 记录已启动: {}", name);
            
            return result;
            
        } catch (Exception e) {
            logFactory.error("启动 JFR 记录失败: {}", e.getMessage());
            return error("启动失败: " + e.getMessage());
        }
    }
    
    /**
     * 停止 JFR 记录
     */
    private Object stopRecording(HttpRequest request) {
        try {
            // 支持 recordingId 和 id 两种参数名
            String recordingIdStr = request.getParam("recordingId");
            if (recordingIdStr == null || recordingIdStr.isEmpty()) {
                recordingIdStr = request.getParam("id");
            }
            if (recordingIdStr == null || recordingIdStr.isEmpty()) {
                return error("缺少参数: recordingId 或 id");
            }
            
            long recordingId = Long.parseLong(recordingIdStr);
            Recording recording = recordings.get(recordingId);
            
            if (recording == null) {
                return error("Recording 不存在: " + recordingId);
            }
            
            recording.stop();
            
            // 推送录制停止事件
            pushRecordingEvent("JFR_STOPPED", recordingId, recording);
            // 检查是否需要停止状态推送
            stopStatusPushIfNoRunning();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("recordingId", recordingId);
            result.put("name", recording.getName());
            result.put("state", recording.getState().name());
            result.put("size", recording.getSize());
            
            logFactory.info("JFR 记录已停止: {}", recording.getName());
            
            return result;
            
        } catch (Exception e) {
            logFactory.error("停止 JFR 记录失败: {}", e.getMessage());
            return error("停止失败: " + e.getMessage());
        }
    }
    
    /**
     * 导出 JFR 记录
     */
    private Object dumpRecording(HttpRequest request) {
        try {
            // 支持 recordingId 和 id 两种参数名
            String recordingIdStr = request.getParam("recordingId");
            if (recordingIdStr == null || recordingIdStr.isEmpty()) {
                recordingIdStr = request.getParam("id");
            }
            String filename = request.getParam("filename");
            
            if (recordingIdStr == null || recordingIdStr.isEmpty()) {
                return error("缺少参数: recordingId 或 id");
            }
            
            long recordingId = Long.parseLong(recordingIdStr);
            Recording recording = recordings.get(recordingId);
            
            if (recording == null) {
                return error("Recording 不存在: " + recordingId);
            }
            
            // 生成文件名
            if (filename == null || filename.isEmpty()) {
                filename = recording.getName() + "-" + System.currentTimeMillis() + ".jfr";
            }
            
            Path outputPath = Paths.get(filename);
            recording.dump(outputPath);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("recordingId", recordingId);
            result.put("filename", outputPath.toAbsolutePath().toString());
            result.put("size", Files.size(outputPath));
            
            logFactory.info("JFR 记录已导出: {}", outputPath);
            
            return result;
            
        } catch (Exception e) {
            logFactory.error("导出 JFR 记录失败: {}", e.getMessage());
            return error("导出失败: " + e.getMessage());
        }
    }
    
    /**
     * 列出所有记录
     */
    private Object listRecordings() {
        List<Map<String, Object>> result = new ArrayList<>();
        
        // 列出自己管理的记录
        for (Map.Entry<Long, Recording> entry : recordings.entrySet()) {
            Recording recording = entry.getValue();
            
            Map<String, Object> item = new HashMap<>();
            item.put("recordingId", entry.getKey());
            item.put("name", recording.getName());
            item.put("state", recording.getState().name());
            item.put("duration", recording.getDuration() != null ? recording.getDuration().getSeconds() : null);
            item.put("maxSize", recording.getMaxSize());
            item.put("size", recording.getSize());
            
            result.add(item);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("recordings", result);
        response.put("total", result.size());
        
        return response;
    }
    
    /**
     * 检查 JFR 是否可用
     */
    private boolean isJfrAvailable() {
        try {
            FlightRecorder.getFlightRecorder();
            return true;
        } catch (Throwable e) {
            return false;
        }
    }
    
    /**
     * 获取 JFR 状态
     */
    private Object getStatus() {
        try {
            FlightRecorder fr = FlightRecorder.getFlightRecorder();
            
            Map<String, Object> status = new HashMap<>();
            status.put("available", true);
            status.put("activeRecordings", recordings.size());
            
            // 统计状态
            int running = 0;
            int stopped = 0;
            for (Recording recording : recordings.values()) {
                if (recording.getState() == RecordingState.RUNNING) {
                    running++;
                } else if (recording.getState() == RecordingState.STOPPED) {
                    stopped++;
                }
            }
            
            status.put("runningRecordings", running);
            status.put("stoppedRecordings", stopped);
            
            return status;
        } catch (Exception e) {
            Map<String, Object> status = new HashMap<>();
            status.put("available", false);
            status.put("error", e.getMessage());
            return status;
        }
    }
    
    /**
     * 返回错误信息
     */
    private Object error(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}
