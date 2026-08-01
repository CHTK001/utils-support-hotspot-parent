package com.chua.hotspot.core.support.storage;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.span.Span;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 统一数据记录器
 * 
 * 管理所有类型数据的内存缓冲区，定时批量持久化到 SQLite
 * 保存后自动清理内存
 * 
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.33
 */
public class DataRecorder {
    
    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 单例实例（延迟初始化）
     */
    private static DataRecorder INSTANCE;
    
    /**
     * 各类型数据缓冲区
     */
    private final List<TraceRecord> traceBuffer = new CopyOnWriteArrayList<>();
    private final List<LogRecord> logBuffer = new CopyOnWriteArrayList<>();
    private final List<ExceptionRecord> exceptionBuffer = new CopyOnWriteArrayList<>();
    private final List<QpsRecord> qpsBuffer = new CopyOnWriteArrayList<>();
    private final List<HttpPerfRecord> httpPerfBuffer = new CopyOnWriteArrayList<>();
    
    /**
     * 定时任务调度器
     */
    private final ScheduledExecutorService scheduler;
    
    /**
     * 配置参数
     */
    private final long flushIntervalMs;     // 统一刷新间隔
    private final int maxBufferSize;         // 单个缓冲区最大大小
    
    /**
     * 统计信息
     */
    private final AtomicInteger totalFlushed = new AtomicInteger(0);
    private final AtomicInteger totalDropped = new AtomicInteger(0);
    
    /**
     * 私有构造函数
     */
    private DataRecorder() {
        // 从系统属性读取配置
        this.flushIntervalMs = Long.getLong("data.recorder.flush.interval", 5000L);
        this.maxBufferSize = Integer.getInteger("data.recorder.max.buffer.size", 10000);
        
        // 创建定时调度器（守护线程）
        this.scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "data-recorder-flush");
            t.setDaemon(true);
            return t;
        });
        
        // 启动定时刷新任务
        scheduler.scheduleAtFixedRate(
            this::flushAllData,
            flushIntervalMs,
            flushIntervalMs,
            TimeUnit.MILLISECONDS
        );
        
        // 注册 JVM 关闭钩子
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            LOGGER.info("DataRecorder 正在关闭，刷新所有剩余数据...");
            shutdown();
        }, "data-recorder-shutdown"));
        
        LOGGER.info("DataRecorder 初始化完成 [flushInterval={}ms, maxBufferSize={}]",
                   flushIntervalMs, maxBufferSize);
    }
    
    /**
     * 获取单例实例
     */
    public static synchronized DataRecorder getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new DataRecorder();
        }
        return INSTANCE;
    }
    
    // ==================== 添加数据到缓冲区 ====================
    
    /**
     * 记录链路追踪数据
     */
    public void recordTrace(Span span) {
        if (span == null) {
            return;
        }
        
        if (traceBuffer.size() >= maxBufferSize) {
            totalDropped.incrementAndGet();
            return;
        }
        
        try {
            String spanData = com.alibaba.fastjson.JSON.toJSONString(span);
            traceBuffer.add(new TraceRecord(
                span.getLinkId(),
                span.getId(),
                span.getPid(),
                span.getLinkId(),
                spanData,
                System.currentTimeMillis()
            ));
        } catch (Exception e) {
            LOGGER.debug("记录链路追踪数据失败: {}", e.getMessage());
        }
    }
    
    /**
     * 批量记录链路追踪数据
     */
    public void recordTraces(List<Span> spans) {
        if (spans == null || spans.isEmpty()) {
            return;
        }
        
        for (Span span : spans) {
            recordTrace(span);
        }
    }
    
    /**
     * 记录日志数据
     */
    public void recordLog(String level, String loggerName, String message, String thread) {
        if (logBuffer.size() >= maxBufferSize) {
            totalDropped.incrementAndGet();
            return;
        }
        
        logBuffer.add(new LogRecord(
            level, loggerName, message, thread, System.currentTimeMillis()
        ));
    }
    
    /**
     * 记录异常数据
     */
    public void recordException(String exceptionType, String message, String stackTrace, 
                                String thread, String location) {
        if (exceptionBuffer.size() >= maxBufferSize) {
            totalDropped.incrementAndGet();
            return;
        }
        
        long now = System.currentTimeMillis();
        exceptionBuffer.add(new ExceptionRecord(
            exceptionType, message, stackTrace, thread, location, now
        ));
    }
    
    /**
     * 记录 QPS 数据
     */
    public void recordQps(String containerType, int qps, long totalRequests, int activeConnections) {
        if (qpsBuffer.size() >= maxBufferSize) {
            totalDropped.incrementAndGet();
            return;
        }
        
        qpsBuffer.add(new QpsRecord(
            containerType, System.currentTimeMillis(), qps, totalRequests, activeConnections
        ));
    }
    
    /**
     * 记录 HTTP 性能数据
     */
    public void recordHttpPerf(String endpoint, String method, long requestCount, long totalTime,
                              long avgTime, long minTime, long maxTime, long p50, long p90, 
                              long p95, long p99, int errorCount) {
        if (httpPerfBuffer.size() >= maxBufferSize) {
            totalDropped.incrementAndGet();
            return;
        }
        
        httpPerfBuffer.add(new HttpPerfRecord(
            endpoint, method, requestCount, totalTime, avgTime, minTime, maxTime,
            p50, p90, p95, p99, errorCount, System.currentTimeMillis()
        ));
    }
    
    // ==================== 定时刷新所有数据 ====================
    
    /**
     * 刷新所有缓冲区数据到数据库
     */
    private void flushAllData() {
        int totalCount = 0;
        
        try {
            SqliteStorage storage = SqliteStorage.getInstance();
            
            // 刷新链路追踪数据
            totalCount += flushTraceData(storage);
            
            // 刷新日志数据
            totalCount += flushLogData(storage);
            
            // 刷新异常数据
            totalCount += flushExceptionData(storage);
            
            // 刷新 QPS 数据
            totalCount += flushQpsData(storage);
            
            // 刷新 HTTP 性能数据
            totalCount += flushHttpPerfData(storage);
            
            if (totalCount > 0) {
                int flushed = totalFlushed.addAndGet(totalCount);
                LOGGER.debug("刷新 {} 条数据到数据库（累计: {}）", totalCount, flushed);
            }
        } catch (Exception e) {
            LOGGER.error("批量刷新数据失败: {}", e.getMessage());
        }
    }
    
    /**
     * 刷新链路追踪数据
     */
    private int flushTraceData(SqliteStorage storage) {
        if (traceBuffer.isEmpty()) {
            return 0;
        }
        
        List<TraceRecord> batch = new ArrayList<>(traceBuffer);
        traceBuffer.clear(); // 清空内存
        
        try {
            batchInsertTraceRecords(storage, batch);
            return batch.size();
        } catch (Exception e) {
            LOGGER.error("刷新链路追踪数据失败: {}", e.getMessage());
            return 0;
        }
    }
    
    /**
     * 刷新日志数据
     */
    private int flushLogData(SqliteStorage storage) {
        if (logBuffer.isEmpty()) {
            return 0;
        }
        
        List<LogRecord> batch = new ArrayList<>(logBuffer);
        logBuffer.clear(); // 清空内存
        
        try {
            batchInsertLogRecords(storage, batch);
            return batch.size();
        } catch (Exception e) {
            LOGGER.error("刷新日志数据失败: {}", e.getMessage());
            return 0;
        }
    }
    
    /**
     * 刷新异常数据
     */
    private int flushExceptionData(SqliteStorage storage) {
        if (exceptionBuffer.isEmpty()) {
            return 0;
        }
        
        List<ExceptionRecord> batch = new ArrayList<>(exceptionBuffer);
        exceptionBuffer.clear(); // 清空内存
        
        try {
            batchInsertExceptionRecords(storage, batch);
            return batch.size();
        } catch (Exception e) {
            LOGGER.error("刷新异常数据失败: {}", e.getMessage());
            return 0;
        }
    }
    
    /**
     * 刷新 QPS 数据
     */
    private int flushQpsData(SqliteStorage storage) {
        if (qpsBuffer.isEmpty()) {
            return 0;
        }
        
        List<QpsRecord> batch = new ArrayList<>(qpsBuffer);
        qpsBuffer.clear(); // 清空内存
        
        try {
            batchInsertQpsRecords(storage, batch);
            return batch.size();
        } catch (Exception e) {
            LOGGER.error("刷新 QPS 数据失败: {}", e.getMessage());
            return 0;
        }
    }
    
    /**
     * 刷新 HTTP 性能数据
     */
    private int flushHttpPerfData(SqliteStorage storage) {
        if (httpPerfBuffer.isEmpty()) {
            return 0;
        }
        
        List<HttpPerfRecord> batch = new ArrayList<>(httpPerfBuffer);
        httpPerfBuffer.clear(); // 清空内存
        
        try {
            batchInsertHttpPerfRecords(storage, batch);
            return batch.size();
        } catch (Exception e) {
            LOGGER.error("刷新 HTTP 性能数据失败: {}", e.getMessage());
            return 0;
        }
    }
    
    // ==================== 批量插入数据库 ====================
    
    private void batchInsertTraceRecords(SqliteStorage storage, List<TraceRecord> records) throws Exception {
        java.sql.Connection conn = storage.getConnection();
        conn.setAutoCommit(false);
        
        String sql = "INSERT INTO trace_records (trace_id, span_id, parent_id, link_id, span_data, timestamp) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";
        
        try (java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (TraceRecord record : records) {
                pstmt.setString(1, record.traceId);
                pstmt.setString(2, record.spanId);
                pstmt.setString(3, record.parentId);
                pstmt.setString(4, record.linkId);
                pstmt.setString(5, record.spanData);
                pstmt.setLong(6, record.timestamp);
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            conn.commit();
        } finally {
            conn.setAutoCommit(true);
        }
    }
    
    private void batchInsertLogRecords(SqliteStorage storage, List<LogRecord> records) throws Exception {
        java.sql.Connection conn = storage.getConnection();
        conn.setAutoCommit(false);
        
        String sql = "INSERT INTO log_records (level, logger, message, thread, timestamp) " +
                    "VALUES (?, ?, ?, ?, ?)";
        
        try (java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (LogRecord record : records) {
                pstmt.setString(1, record.level);
                pstmt.setString(2, record.loggerName);
                pstmt.setString(3, record.message);
                pstmt.setString(4, record.thread);
                pstmt.setLong(5, record.timestamp);
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            conn.commit();
        } finally {
            conn.setAutoCommit(true);
        }
    }
    
    private void batchInsertExceptionRecords(SqliteStorage storage, List<ExceptionRecord> records) throws Exception {
        java.sql.Connection conn = storage.getConnection();
        conn.setAutoCommit(false);
        
        String sql = "INSERT INTO exception_records (exception_type, message, stack_trace, thread, location, " +
                    "first_occurrence, last_occurrence, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (ExceptionRecord record : records) {
                pstmt.setString(1, record.exceptionType);
                pstmt.setString(2, record.message);
                pstmt.setString(3, record.stackTrace);
                pstmt.setString(4, record.thread);
                pstmt.setString(5, record.location);
                pstmt.setLong(6, record.timestamp);
                pstmt.setLong(7, record.timestamp);
                pstmt.setLong(8, record.timestamp);
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            conn.commit();
        } finally {
            conn.setAutoCommit(true);
        }
    }
    
    private void batchInsertQpsRecords(SqliteStorage storage, List<QpsRecord> records) throws Exception {
        java.sql.Connection conn = storage.getConnection();
        conn.setAutoCommit(false);
        
        String sql = "INSERT INTO qps_statistics (container_type, timestamp, qps, total_requests, active_connections) " +
                    "VALUES (?, ?, ?, ?, ?)";
        
        try (java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (QpsRecord record : records) {
                pstmt.setString(1, record.containerType);
                pstmt.setLong(2, record.timestamp);
                pstmt.setInt(3, record.qps);
                pstmt.setLong(4, record.totalRequests);
                pstmt.setInt(5, record.activeConnections);
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            conn.commit();
        } finally {
            conn.setAutoCommit(true);
        }
    }
    
    private void batchInsertHttpPerfRecords(SqliteStorage storage, List<HttpPerfRecord> records) throws Exception {
        java.sql.Connection conn = storage.getConnection();
        conn.setAutoCommit(false);
        
        String sql = "INSERT INTO http_performance (endpoint, method, request_count, total_time, avg_time, " +
                    "min_time, max_time, p50, p90, p95, p99, error_count, timestamp) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (HttpPerfRecord record : records) {
                pstmt.setString(1, record.endpoint);
                pstmt.setString(2, record.method);
                pstmt.setLong(3, record.requestCount);
                pstmt.setLong(4, record.totalTime);
                pstmt.setLong(5, record.avgTime);
                pstmt.setLong(6, record.minTime);
                pstmt.setLong(7, record.maxTime);
                pstmt.setLong(8, record.p50);
                pstmt.setLong(9, record.p90);
                pstmt.setLong(10, record.p95);
                pstmt.setLong(11, record.p99);
                pstmt.setInt(12, record.errorCount);
                pstmt.setLong(13, record.timestamp);
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            conn.commit();
        } finally {
            conn.setAutoCommit(true);
        }
    }
    
    // ==================== 关闭和统计 ====================
    
    /**
     * 关闭记录器
     */
    public void shutdown() {
        try {
            scheduler.shutdown();
            
            // 刷新所有剩余数据
            flushAllData();
            
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
            
            LOGGER.info("DataRecorder 已关闭 [flushed={}, dropped={}]", 
                       totalFlushed.get(), totalDropped.get());
        } catch (Exception e) {
            LOGGER.error("关闭 DataRecorder 失败: {}", e.getMessage());
        }
    }
    
    /**
     * 获取统计信息
     */
    public String getStatistics() {
        return String.format("DataRecorder [trace=%d, log=%d, exception=%d, qps=%d, httpPerf=%d, flushed=%d, dropped=%d]",
                           traceBuffer.size(), logBuffer.size(), exceptionBuffer.size(),
                           qpsBuffer.size(), httpPerfBuffer.size(),
                           totalFlushed.get(), totalDropped.get());
    }
    
    // ==================== 数据记录类 ====================
    
    private static class TraceRecord {
        final String traceId;
        final String spanId;
        final String parentId;
        final String linkId;
        final String spanData;
        final long timestamp;
        
        TraceRecord(String traceId, String spanId, String parentId, String linkId, 
                   String spanData, long timestamp) {
            this.traceId = traceId;
            this.spanId = spanId;
            this.parentId = parentId;
            this.linkId = linkId;
            this.spanData = spanData;
            this.timestamp = timestamp;
        }
    }
    
    private static class LogRecord {
        final String level;
        final String loggerName;
        final String message;
        final String thread;
        final long timestamp;
        
        LogRecord(String level, String loggerName, String message, String thread, long timestamp) {
            this.level = level;
            this.loggerName = loggerName;
            this.message = message;
            this.thread = thread;
            this.timestamp = timestamp;
        }
    }
    
    private static class ExceptionRecord {
        final String exceptionType;
        final String message;
        final String stackTrace;
        final String thread;
        final String location;
        final long timestamp;
        
        ExceptionRecord(String exceptionType, String message, String stackTrace, 
                       String thread, String location, long timestamp) {
            this.exceptionType = exceptionType;
            this.message = message;
            this.stackTrace = stackTrace;
            this.thread = thread;
            this.location = location;
            this.timestamp = timestamp;
        }
    }
    
    private static class QpsRecord {
        final String containerType;
        final long timestamp;
        final int qps;
        final long totalRequests;
        final int activeConnections;
        
        QpsRecord(String containerType, long timestamp, int qps, 
                 long totalRequests, int activeConnections) {
            this.containerType = containerType;
            this.timestamp = timestamp;
            this.qps = qps;
            this.totalRequests = totalRequests;
            this.activeConnections = activeConnections;
        }
    }
    
    private static class HttpPerfRecord {
        final String endpoint;
        final String method;
        final long requestCount;
        final long totalTime;
        final long avgTime;
        final long minTime;
        final long maxTime;
        final long p50;
        final long p90;
        final long p95;
        final long p99;
        final int errorCount;
        final long timestamp;
        
        HttpPerfRecord(String endpoint, String method, long requestCount, long totalTime,
                      long avgTime, long minTime, long maxTime, long p50, long p90,
                      long p95, long p99, int errorCount, long timestamp) {
            this.endpoint = endpoint;
            this.method = method;
            this.requestCount = requestCount;
            this.totalTime = totalTime;
            this.avgTime = avgTime;
            this.minTime = minTime;
            this.maxTime = maxTime;
            this.p50 = p50;
            this.p90 = p90;
            this.p95 = p95;
            this.p99 = p99;
            this.errorCount = errorCount;
            this.timestamp = timestamp;
        }
    }
}
