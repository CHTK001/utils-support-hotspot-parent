package com.chua.hotspot.core.support.storage;

import com.chua.hotspot.core.support.log.LogFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 通用存储服务
 * 
 * 提供内存缓冲+定时批量写入SQLite的功能
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.37
 */
public class StorageService {
    
    /**
     * 日志工厂实例
     */
    private static final LogFactory logger = LogFactory.getInstance();

    /**
     * 单例实例
     */
    private static final StorageService INSTANCE = new StorageService();
    
    /**
     * 存储配置（单例）
     */
    private final StorageConfig config = StorageConfig.getInstance();

    /**
     * 定时刷新调度器（单线程）
     */
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    /**
     * 名称 -> 缓冲队列映射
     */
    private final ConcurrentHashMap<String, BufferQueue<?>> buffers = new ConcurrentHashMap<>();
    
    private StorageService() {
        // 启动定时刷新任务
        scheduler.scheduleAtFixedRate(this::flushAll, 
            config.getFlushIntervalSeconds(), 
            config.getFlushIntervalSeconds(), 
            TimeUnit.SECONDS);
        
        logger.info("StorageService 初始化完成，刷新间隔: {}秒", config.getFlushIntervalSeconds());
    }
    
    public static StorageService getInstance() {
        return INSTANCE;
    }
    
    /**
     * 注册一个缓冲队列
     */
    public <T> void registerBuffer(String name, BatchWriter<T> writer) {
        buffers.putIfAbsent(name, new BufferQueue<>(name, writer, config.getBatchSize()));
        logger.debug("注册存储缓冲区: {}", name);
    }
    
    /**
     * 添加数据到缓冲区
     */
    @SuppressWarnings("unchecked")
    public <T> void add(String bufferName, T data) {
        BufferQueue<T> buffer = (BufferQueue<T>) buffers.get(bufferName);
        if (buffer == null) {
            logger.warn("缓冲区不存在: {}", bufferName);
            return;
        }
        buffer.add(data);
    }
    
    /**
     * 手动刷新指定缓冲区
     */
    public void flush(String bufferName) {
        BufferQueue<?> buffer = buffers.get(bufferName);
        if (buffer != null) {
            buffer.flush();
        }
    }
    
    /**
     * 刷新所有缓冲区
     */
    public void flushAll() {
        for (BufferQueue<?> buffer : buffers.values()) {
            try {
                buffer.flush();
            } catch (Exception e) {
                logger.error("刷新缓冲区失败: {}", buffer.name, e);
            }
        }
    }
    
    /**
     * 关闭服务
     */
    public void shutdown() {
        logger.info("关闭 StorageService...");
        flushAll();
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(10, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * 批量写入接口
     */
    public interface BatchWriter<T> {
        /**
         * 批量写入数据到数据库
         * 
         * @param batch 待写入的数据批次
         */
        void writeBatch(List<T> batch) throws SQLException;
    }
    
    /**
     * 缓冲队列
     */
    private static class BufferQueue<T> {
        /** 缓冲队列名称 */
        private final String name;
        /** 批量写入器 */
        private final BatchWriter<T> writer;
        /** 批量大小 */
        private final int batchSize;
        /** 缓冲列表 */
        private final List<T> buffer;
        /** 缓冲区锁 */
        private final ReentrantLock lock = new ReentrantLock();
        
        BufferQueue(String name, BatchWriter<T> writer, int batchSize) {
            this.name = name;
            this.writer = writer;
            this.batchSize = batchSize;
            this.buffer = new ArrayList<>(batchSize);
        }
        
        /**
         * 添加数据到缓冲区
         */
        void add(T data) {
            lock.lock();
            try {
                buffer.add(data);
                
                // 达到批量大小，立即刷新
                if (buffer.size() >= batchSize) {
                    flush();
                }
            } finally {
                lock.unlock();
            }
        }
        
        /**
         * 刷新缓冲区到数据库
         */
        void flush() {
            List<T> toWrite = null;
            
            lock.lock();
            try {
                if (buffer.isEmpty()) {
                    return;
                }
                
                // 复制数据并清空缓冲区
                toWrite = new ArrayList<>(buffer);
                buffer.clear();
            } finally {
                lock.unlock();
            }
            
            // 在锁外执行写入操作
            if (toWrite != null && !toWrite.isEmpty()) {
                try {
                    writer.writeBatch(toWrite);
                    logger.debug("批量写入完成: buffer={}, count={}", name, toWrite.size());
                } catch (SQLException e) {
                    logger.error("批量写入失败: buffer={}, count={}", name, toWrite.size(), e);
                }
            }
        }
    }
    
    /**
     * HTTP性能数据
     */
    public static class HttpPerfData {
        /** \u7aef\u70b9\u8def\u5f84 */
        public String endpoint;
        /** HTTP\u65b9\u6cd5 */
        public String method;
        /** \u8bf7\u6c42\u603b\u6570 */
        public long requestCount;
        /** \u603b\u8017\u65f6(\u6beb\u79d2) */
        public long totalTime;
        /** \u5e73\u5747\u8017\u65f6(\u6beb\u79d2) */
        public long avgTime;
        /** \u6700\u5c0f\u8017\u65f6(\u6beb\u79d2) */
        public long minTime;
        /** \u6700\u5927\u8017\u65f6(\u6beb\u79d2) */
        public long maxTime;
        /** 50\u5206\u4f4d\u6570(\u6beb\u79d2) */
        public long p50;
        /** 90\u5206\u4f4d\u6570(\u6beb\u79d2) */
        public long p90;
        /** 95\u5206\u4f4d\u6570(\u6beb\u79d2) */
        public long p95;
        /** 99\u5206\u4f4d\u6570(\u6beb\u79d2) */
        public long p99;
        /** \u9519\u8bef\u8ba1\u6570 */
        public int errorCount;
        /** \u65f6\u95f4\u6233(\u6beb\u79d2) */
        public long timestamp;
        
        public HttpPerfData(String endpoint, String method, long requestCount, long totalTime,
                           long avgTime, long minTime, long maxTime,
                           long p50, long p90, long p95, long p99,
                           int errorCount, long timestamp) {
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
    
    /**
     * 方法性能数据
     */
    public static class MethodPerfData {
        /** \u65b9\u6cd5\u7b7e\u540d */
        public String methodSignature;
        /** \u8c03\u7528\u603b\u6570 */
        public long callCount;
        /** \u603b\u8017\u65f6(\u6beb\u79d2) */
        public long totalTime;
        /** \u5e73\u5747\u8017\u65f6(\u6beb\u79d2) */
        public long avgTime;
        /** \u6700\u5c0f\u8017\u65f6(\u6beb\u79d2) */
        public long minTime;
        /** \u6700\u5927\u8017\u65f6(\u6beb\u79d2) */
        public long maxTime;
        /** \u65f6\u95f4\u6233(\u6beb\u79d2) */
        public long timestamp;
        
        public MethodPerfData(String methodSignature, long callCount, long totalTime,
                             long avgTime, long minTime, long maxTime, long timestamp) {
            this.methodSignature = methodSignature;
            this.callCount = callCount;
            this.totalTime = totalTime;
            this.avgTime = avgTime;
            this.minTime = minTime;
            this.maxTime = maxTime;
            this.timestamp = timestamp;
        }
    }
    
    /**
     * HTTP性能批量写入器
     */
    public static class HttpPerfBatchWriter implements BatchWriter<HttpPerfData> {
        @Override
        public void writeBatch(List<HttpPerfData> batch) throws SQLException {
            SqliteStorage storage = SqliteStorage.getInstance();
            Connection conn = storage.getConnection();
            
            String sql = "INSERT INTO http_performance " +
                        "(endpoint, method, request_count, total_time, avg_time, min_time, max_time, " +
                        "p50, p90, p95, p99, error_count, timestamp) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                for (HttpPerfData data : batch) {
                    pstmt.setString(1, data.endpoint);
                    pstmt.setString(2, data.method);
                    pstmt.setLong(3, data.requestCount);
                    pstmt.setLong(4, data.totalTime);
                    pstmt.setLong(5, data.avgTime);
                    pstmt.setLong(6, data.minTime);
                    pstmt.setLong(7, data.maxTime);
                    pstmt.setLong(8, data.p50);
                    pstmt.setLong(9, data.p90);
                    pstmt.setLong(10, data.p95);
                    pstmt.setLong(11, data.p99);
                    pstmt.setInt(12, data.errorCount);
                    pstmt.setLong(13, data.timestamp);
                    pstmt.addBatch();
                }
                pstmt.executeBatch();
            }
        }
    }
    
    /**
     * 方法性能批量写入器
     */
    public static class MethodPerfBatchWriter implements BatchWriter<MethodPerfData> {
        @Override
        public void writeBatch(List<MethodPerfData> batch) throws SQLException {
            SqliteStorage storage = SqliteStorage.getInstance();
            Connection conn = storage.getConnection();
            
            String sql = "INSERT INTO method_performance " +
                        "(method_signature, call_count, total_time, avg_time, min_time, max_time, timestamp) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                for (MethodPerfData data : batch) {
                    pstmt.setString(1, data.methodSignature);
                    pstmt.setLong(2, data.callCount);
                    pstmt.setLong(3, data.totalTime);
                    pstmt.setLong(4, data.avgTime);
                    pstmt.setLong(5, data.minTime);
                    pstmt.setLong(6, data.maxTime);
                    pstmt.setLong(7, data.timestamp);
                    pstmt.addBatch();
                }
                pstmt.executeBatch();
            }
        }
    }
}
