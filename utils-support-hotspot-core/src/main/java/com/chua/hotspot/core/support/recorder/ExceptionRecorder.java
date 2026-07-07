package com.chua.hotspot.core.support.recorder;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.pusher.DataPusher;
import com.chua.hotspot.core.support.storage.SqliteStorage;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 异常记录器
 * <p>
 * 记录应用异常，包括：
 * - 异常类型和频率
 * - 堆栈跟踪
 * - 异常趋势
 * - 线程信息
 * </p>
 *
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.38
 */
public class ExceptionRecorder {
    
    private static final LogFactory logger = LogFactory.getInstance();
    private static final ExceptionRecorder INSTANCE = new ExceptionRecorder();
    
    // 最近异常（限制 1000 条）
    private final ConcurrentLinkedQueue<ExceptionInfo> recentExceptions = new ConcurrentLinkedQueue<>();
    private static final int MAX_RECENT_EXCEPTIONS = 1000;
    
    // 异常类型统计
    private final Map<String, ExceptionStats> exceptionStats = new ConcurrentHashMap<>();
    
    private ExceptionRecorder() {
        installExceptionHandler();
    }
    
    public static ExceptionRecorder getInstance() {
        return INSTANCE;
    }
    
    /**
     * 安装全局未捕获异常处理器
     */
    private void installExceptionHandler() {
        Thread.UncaughtExceptionHandler originalHandler = Thread.getDefaultUncaughtExceptionHandler();
        
        Thread.setDefaultUncaughtExceptionHandler((thread, exception) -> {
            recordException(exception, thread);
            
            if (originalHandler != null) {
                originalHandler.uncaughtException(thread, exception);
            }
        });
        
        logger.info("全局异常处理器已安装");
    }
    
    /**
     * 记录异常
     */
    public void recordException(Throwable exception, Thread thread) {
        if (exception == null) {
            return;
        }
        
        try {
            String exceptionType = exception.getClass().getName();
            String message = exception.getMessage() != null ? exception.getMessage() : "";
            String stackTrace = getStackTraceAsString(exception);
            String threadName = thread != null ? thread.getName() : Thread.currentThread().getName();
            String location = extractLocation(exception);
            long timestamp = System.currentTimeMillis();
            
            // 创建异常信息
            ExceptionInfo info = new ExceptionInfo(
                exceptionType, message, stackTrace, threadName, location, timestamp
            );
            
            // 添加到最近异常
            recentExceptions.offer(info);
            while (recentExceptions.size() > MAX_RECENT_EXCEPTIONS) {
                recentExceptions.poll();
            }
            
            // 更新统计
            ExceptionStats stats = exceptionStats.computeIfAbsent(exceptionType, 
                k -> new ExceptionStats(exceptionType));
            stats.increment(timestamp);
            
            // 存储到 SQLite
            SqliteStorage.getInstance().insertExceptionRecord(
                exceptionType, message, stackTrace, threadName, location, timestamp
            );
            
            // 使用 DataPusher 推送
            DataPusher.getInstance().pushException(info.toMap());
            
            logger.debug("已记录异常: {} 在线程: {}", exceptionType, threadName);
            
        } catch (Exception e) {
            logger.debug("记录异常失败: {}", e.getMessage());
        }
    }
    
    /**
     * 获取最近异常
     */
    public List<Map<String, Object>> getRecentExceptions(int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        Iterator<ExceptionInfo> iterator = recentExceptions.iterator();
        int count = 0;
        
        while (iterator.hasNext() && count < limit) {
            ExceptionInfo info = iterator.next();
            result.add(info.toMap());
            count++;
        }
        
        // 反转显示最新的在前
        Collections.reverse(result);
        
        return result;
    }
    
    /**
     * 获取异常统计
     */
    public List<Map<String, Object>> getExceptionStats() {
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (ExceptionStats stats : exceptionStats.values()) {
            result.add(stats.toMap());
        }
        
        // 按计数降序排序
        result.sort((a, b) -> Long.compare((Long) b.get("count"), (Long) a.get("count")));
        
        return result;
    }
    
    /**
     * 获取异常趋势（过去一小时每分钟的异常数）
     */
    public List<Map<String, Object>> getExceptionTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();
        long now = System.currentTimeMillis();
        long oneHour = 60 * 60 * 1000;
        long startTime = now - oneHour;
        
        // 按分钟分组异常
        Map<Long, Integer> exceptionsByMinute = new HashMap<>();
        
        for (ExceptionInfo info : recentExceptions) {
            if (info.timestamp >= startTime) {
                long minute = info.timestamp / (60 * 1000);
                exceptionsByMinute.merge(minute, 1, Integer::sum);
            }
        }
        
        // 转换为列表
        for (Map.Entry<Long, Integer> entry : exceptionsByMinute.entrySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("timestamp", entry.getKey() * 60 * 1000);
            point.put("count", entry.getValue());
            trend.add(point);
        }
        
        // 按时间排序
        trend.sort((a, b) -> Long.compare((Long) a.get("timestamp"), (Long) b.get("timestamp")));
        
        return trend;
    }
    
    /**
     * 清除所有统计
     */
    public void clear() {
        recentExceptions.clear();
        exceptionStats.clear();
        logger.info("异常统计已清除");
    }
    
    /**
     * 获取堆栈跟踪字符串
     */
    private String getStackTraceAsString(Throwable exception) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        exception.printStackTrace(pw);
        return sw.toString();
    }
    
    /**
     * 从堆栈跟踪提取位置
     */
    private String extractLocation(Throwable exception) {
        StackTraceElement[] elements = exception.getStackTrace();
        if (elements != null && elements.length > 0) {
            StackTraceElement element = elements[0];
            return element.getClassName() + "." + element.getMethodName() + 
                   "(" + element.getFileName() + ":" + element.getLineNumber() + ")";
        }
        return "Unknown";
    }
    
    /**
     * 异常信息
     */
    private static class ExceptionInfo {
        final String exceptionType;
        final String message;
        final String stackTrace;
        final String thread;
        final String location;
        final long timestamp;
        
        ExceptionInfo(String exceptionType, String message, String stackTrace, 
                     String thread, String location, long timestamp) {
            this.exceptionType = exceptionType;
            this.message = message;
            this.stackTrace = stackTrace;
            this.thread = thread;
            this.location = location;
            this.timestamp = timestamp;
        }
        
        Map<String, Object> toMap() {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("exceptionType", exceptionType);
            map.put("message", message);
            map.put("stackTrace", stackTrace);
            map.put("thread", thread);
            map.put("location", location);
            map.put("timestamp", timestamp);
            return map;
        }
    }
    
    /**
     * 异常统计
     */
    private static class ExceptionStats {
        final String exceptionType;
        final AtomicLong count = new AtomicLong(0);
        volatile long firstOccurrence = 0;
        volatile long lastOccurrence = 0;
        
        ExceptionStats(String exceptionType) {
            this.exceptionType = exceptionType;
        }
        
        void increment(long timestamp) {
            count.incrementAndGet();
            
            if (firstOccurrence == 0) {
                firstOccurrence = timestamp;
            }
            lastOccurrence = timestamp;
        }
        
        Map<String, Object> toMap() {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("exceptionType", exceptionType);
            map.put("count", count.get());
            map.put("firstOccurrence", firstOccurrence);
            map.put("lastOccurrence", lastOccurrence);
            return map;
        }
    }
}
