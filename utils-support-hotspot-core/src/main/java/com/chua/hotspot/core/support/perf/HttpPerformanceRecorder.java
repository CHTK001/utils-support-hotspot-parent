package com.chua.hotspot.core.support.perf;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.ServerFactory;
import com.chua.hotspot.core.support.storage.DataPersistenceScheduler;
import com.chua.hotspot.core.support.storage.SqliteStorage;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * HTTP Performance Recorder
 * 
 * Tracks detailed HTTP performance metrics including:
 * - Response time percentiles (P50/P90/P95/P99)
 * - Request frequency ranking
 * - Slow endpoint analysis
 * - Error rate statistics
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class HttpPerformanceRecorder {

    /**
     * 单例实例
     */
    private static final HttpPerformanceRecorder INSTANCE = new HttpPerformanceRecorder();

    /**
     * 默认慢请求阈值（毫秒）
     */
    private static final long DEFAULT_SLOW_THRESHOLD_MS = 1000L;

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 端点统计（url+method -> EndpointMetrics）
     */
    private final Map<String, EndpointMetrics> metricsMap = new ConcurrentHashMap<>();

    /**
     * 慢请求阈值（毫秒）
     */
    private volatile long slowThreshold = DEFAULT_SLOW_THRESHOLD_MS;

    /**
     * 是否已初始化
     */
    private volatile boolean initialized = false;
    
    // 持久化任务
    private final DataPersistenceScheduler.PersistenceTask persistenceTask = new DataPersistenceScheduler.PersistenceTask() {
        @Override
        public String getName() {
            return "HttpPerformance";
        }
        
        @Override
        public void persist() {
            persistToStorage();
        }
    };
    
    private HttpPerformanceRecorder() {
    }
    
    /**
     * 初始化，从数据库加载历史数据并注册持久化任务
     */
    public void initialize() {
        if (initialized) {
            return;
        }
        initialized = true;
        loadFromStorage();
        // 注册到统一调度器
        DataPersistenceScheduler.getInstance().register(persistenceTask);
    }
    
    /**
     * 从 SQLite 加载历史数据
     */
    private void loadFromStorage() {
        try {
            SqliteStorage storage = SqliteStorage.getInstance();
            if (storage == null || storage.getConnection() == null) {
                return;
            }
            
            // 查询最近24小时的数据，按 endpoint+method 聚合
            long startTime = System.currentTimeMillis() - 24 * 60 * 60 * 1000;
            String sql = "SELECT endpoint, method, SUM(request_count) as total_requests, " +
                        "SUM(total_time) as total_time, SUM(error_count) as error_count, " +
                        "MIN(min_time) as min_time, MAX(max_time) as max_time " +
                        "FROM http_performance WHERE timestamp > ? " +
                        "GROUP BY endpoint, method";
            
            try (PreparedStatement pstmt = storage.getConnection().prepareStatement(sql)) {
                pstmt.setLong(1, startTime);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        String url = rs.getString("endpoint");
                        String method = rs.getString("method");
                        long totalRequests = rs.getLong("total_requests");
                        long totalTime = rs.getLong("total_time");
                        long errorCount = rs.getLong("error_count");
                        long minTime = rs.getLong("min_time");
                        long maxTime = rs.getLong("max_time");
                        
                        // 创建 EndpointMetrics 并恢复数据
                        String key = buildKey(url, method);
                        EndpointMetrics metrics = metricsMap.computeIfAbsent(key,
                            k -> new EndpointMetrics(url, method));
                        metrics.restoreFromStorage(totalRequests, totalTime, errorCount, minTime, maxTime);
                    }
                }
            }
            
            LOGGER.debug("从SQL加载HTTP性能数据: {} 个端点", metricsMap.size());
        } catch (Exception e) {
            LOGGER.debug("加载HTTP性能数据失败: {}", e.getMessage());
        }
    }
    
    /**
     * 保存到 SQLite
     */
    public void persistToStorage() {
        if (metricsMap.isEmpty()) {
            return;
        }
        
        try {
            SqliteStorage storage = SqliteStorage.getInstance();
            if (storage == null || storage.getConnection() == null) {
                return;
            }
            
            long timestamp = System.currentTimeMillis();
            String sql = "INSERT INTO http_performance (endpoint, method, request_count, total_time, " +
                        "avg_time, min_time, max_time, p50, p90, p95, p99, error_count, timestamp) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            try (PreparedStatement pstmt = storage.getConnection().prepareStatement(sql)) {
                for (EndpointMetrics metrics : metricsMap.values()) {
                    Map<String, Long> percentiles = metrics.calculatePercentiles();
                    
                    pstmt.setString(1, metrics.url);
                    pstmt.setString(2, metrics.method);
                    pstmt.setLong(3, metrics.totalRequests.get());
                    pstmt.setLong(4, metrics.totalDuration.get());
                    pstmt.setLong(5, (long) metrics.getAvgDuration());
                    pstmt.setLong(6, metrics.minDuration.get() == Long.MAX_VALUE ? 0 : metrics.minDuration.get());
                    pstmt.setLong(7, metrics.maxDuration.get());
                    pstmt.setLong(8, percentiles.get("p50"));
                    pstmt.setLong(9, percentiles.get("p90"));
                    pstmt.setLong(10, percentiles.get("p95"));
                    pstmt.setLong(11, percentiles.get("p99"));
                    pstmt.setLong(12, metrics.errorCount.get());
                    pstmt.setLong(13, timestamp);
                    pstmt.addBatch();
                }
            pstmt.executeBatch();
            }
        } catch (Exception e) {
            LOGGER.debug("保存HTTP性能数据失败: {}", e.getMessage());
        }
    }
    
    public static HttpPerformanceRecorder getInstance() {
        return INSTANCE;
    }
    
    /**
     * Record HTTP request start
     */
    public long recordRequestStart(String url, String method) {
        String key = buildKey(url, method);
        EndpointMetrics metrics = metricsMap.computeIfAbsent(key, 
            k -> new EndpointMetrics(url, method));
        metrics.incrementActive();
        return System.currentTimeMillis();
    }
    
    /**
     * Record HTTP request end
     */
    public void recordRequestEnd(String url, String method, long startTime, boolean hasError) {
        String key = buildKey(url, method);
        long duration = System.currentTimeMillis() - startTime;
        
        EndpointMetrics metrics = metricsMap.get(key);
        if (metrics != null) {
            metrics.decrementActive();
            metrics.recordRequest(duration, hasError);
        }
        
        // Push to WebSocket with throttling
        pushToWebSocket();
    }
    
    /**
     * Push HTTP performance data to WebSocket
     */
    private void pushToWebSocket() {
        try {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("summary", getSummary());
            data.put("topEndpoints", getTopEndpoints(10));
            data.put("slowEndpoints", getSlowEndpoints(10));
            data.put("errorEndpoints", getErrorEndpoints(10));
            
            ServerFactory.getInstance().publish(ModuleType.PERFORMANCE, "HTTP_PERF_UPDATE", data);
        } catch (Exception e) {
            // Ignore push failures
        }
    }
    
    /**
     * Get summary statistics
     */
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        
        long totalRequests = 0;
        long totalErrors = 0;
        long totalDuration = 0;
        int endpointCount = metricsMap.size();
        
        for (EndpointMetrics metrics : metricsMap.values()) {
            totalRequests += metrics.totalRequests.get();
            totalErrors += metrics.errorCount.get();
            totalDuration += metrics.totalDuration.get();
        }
        
        summary.put("totalRequests", totalRequests);
        summary.put("totalErrors", totalErrors);
        summary.put("totalEndpoints", endpointCount);
        summary.put("avgDuration", totalRequests > 0 ? totalDuration / totalRequests : 0);
        summary.put("errorRate", totalRequests > 0 ? (double) totalErrors / totalRequests * 100 : 0.0);
        summary.put("timestamp", System.currentTimeMillis());
        
        return summary;
    }
    
    /**
     * Get top endpoints by request frequency
     */
    public List<Map<String, Object>> getTopEndpoints(int limit) {
        return metricsMap.values().stream()
            .sorted((a, b) -> Long.compare(b.totalRequests.get(), a.totalRequests.get()))
            .limit(limit)
            .map(this::toMap)
            .collect(Collectors.toList());
    }
    
    /**
     * Get slow endpoints analysis
     */
    public List<Map<String, Object>> getSlowEndpoints(int limit) {
        return metricsMap.values().stream()
            .filter(m -> m.getAvgDuration() > slowThreshold)
            .sorted((a, b) -> Double.compare(b.getAvgDuration(), a.getAvgDuration()))
            .limit(limit)
            .map(this::toMap)
            .collect(Collectors.toList());
    }
    
    /**
     * Get endpoints with high error rates
     */
    public List<Map<String, Object>> getErrorEndpoints(int limit) {
        return metricsMap.values().stream()
            .filter(m -> m.errorCount.get() > 0)
            .sorted((a, b) -> Double.compare(b.getErrorRate(), a.getErrorRate()))
            .limit(limit)
            .map(this::toMap)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all endpoints statistics
     */
    public List<Map<String, Object>> getAllEndpoints() {
        return metricsMap.values().stream()
            .map(this::toMap)
            .collect(Collectors.toList());
    }
    
    /**
     * Get specific endpoint metrics
     */
    public Map<String, Object> getEndpointMetrics(String url, String method) {
        String key = buildKey(url, method);
        EndpointMetrics metrics = metricsMap.get(key);
        return metrics != null ? toMap(metrics) : null;
    }
    
    /**
     * Set slow request threshold
     */
    public void setSlowThreshold(long threshold) {
        this.slowThreshold = threshold;
    }
    
    /**
     * Get slow request threshold
     */
    public long getSlowThreshold() {
        return slowThreshold;
    }
    
    /**
     * Clear all statistics
     */
    public void clear() {
        metricsMap.clear();
    }
    
    private String buildKey(String url, String method) {
        return method + " " + url;
    }
    
    private Map<String, Object> toMap(EndpointMetrics metrics) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("url", metrics.url);
        map.put("method", metrics.method);
        map.put("totalRequests", metrics.totalRequests.get());
        map.put("activeRequests", metrics.activeRequests.get());
        map.put("errorCount", metrics.errorCount.get());
        map.put("errorRate", metrics.getErrorRate());
        map.put("avgDuration", metrics.getAvgDuration());
        map.put("minDuration", metrics.minDuration.get());
        map.put("maxDuration", metrics.maxDuration.get());
        
        // Calculate percentiles
        Map<String, Long> percentiles = metrics.calculatePercentiles();
        map.put("p50", percentiles.get("p50"));
        map.put("p90", percentiles.get("p90"));
        map.put("p95", percentiles.get("p95"));
        map.put("p99", percentiles.get("p99"));
        
        return map;
    }
    
    /**
     * Endpoint metrics data
     */
    private static class EndpointMetrics {
        private final String url;
        private final String method;
        
        private final AtomicLong totalRequests = new AtomicLong(0);
        private final AtomicInteger activeRequests = new AtomicInteger(0);
        private final AtomicLong errorCount = new AtomicLong(0);
        private final AtomicLong totalDuration = new AtomicLong(0);
        private final AtomicLong minDuration = new AtomicLong(Long.MAX_VALUE);
        private final AtomicLong maxDuration = new AtomicLong(0);
        
        // Store recent durations for percentile calculation (limited to 1000 samples)
        private final ConcurrentLinkedQueue<Long> durations = new ConcurrentLinkedQueue<>();
        private static final int MAX_SAMPLES = 1000;
        
        public EndpointMetrics(String url, String method) {
            this.url = url;
            this.method = method;
        }
        
        public void incrementActive() {
            activeRequests.incrementAndGet();
        }
        
        public void decrementActive() {
            activeRequests.decrementAndGet();
        }
        
        public void recordRequest(long duration, boolean hasError) {
            totalRequests.incrementAndGet();
            totalDuration.addAndGet(duration);
            
            if (hasError) {
                errorCount.incrementAndGet();
            }
            
            // Update min/max
            updateMin(duration);
            updateMax(duration);
            
            // Store duration for percentile calculation
            durations.offer(duration);
            
            // Limit sample size
            while (durations.size() > MAX_SAMPLES) {
                durations.poll();
            }
        }
        
        private void updateMin(long duration) {
            long current;
            do {
                current = minDuration.get();
                if (duration >= current) {
                    return;
                }
            } while (!minDuration.compareAndSet(current, duration));
        }
        
        private void updateMax(long duration) {
            long current;
            do {
                current = maxDuration.get();
                if (duration <= current) {
                    return;
                }
            } while (!maxDuration.compareAndSet(current, duration));
        }
        
        public double getAvgDuration() {
            long total = totalRequests.get();
            return total > 0 ? (double) totalDuration.get() / total : 0.0;
        }
        
        public double getErrorRate() {
            long total = totalRequests.get();
            return total > 0 ? (double) errorCount.get() / total * 100 : 0.0;
        }
        
        /**
         * Calculate percentiles from stored durations
         */
        public Map<String, Long> calculatePercentiles() {
            List<Long> sortedDurations = durations.stream()
                .sorted()
                .collect(Collectors.toList());
            
            Map<String, Long> percentiles = new HashMap<>();
            
            if (sortedDurations.isEmpty()) {
                percentiles.put("p50", 0L);
                percentiles.put("p90", 0L);
                percentiles.put("p95", 0L);
                percentiles.put("p99", 0L);
            } else {
                percentiles.put("p50", getPercentile(sortedDurations, 50));
                percentiles.put("p90", getPercentile(sortedDurations, 90));
                percentiles.put("p95", getPercentile(sortedDurations, 95));
                percentiles.put("p99", getPercentile(sortedDurations, 99));
            }
            
            return percentiles;
        }
        
        private long getPercentile(List<Long> sortedList, int percentile) {
            if (sortedList.isEmpty()) {
                return 0;
            }
            
            int index = (int) Math.ceil(sortedList.size() * percentile / 100.0) - 1;
            index = Math.max(0, Math.min(index, sortedList.size() - 1));
            
            return sortedList.get(index);
        }
        
        /**
         * 从存储恢复数据
         */
        public void restoreFromStorage(long requests, long duration, long errors, long min, long max) {
            totalRequests.addAndGet(requests);
            totalDuration.addAndGet(duration);
            errorCount.addAndGet(errors);
            if (min > 0 && min < minDuration.get()) {
                minDuration.set(min);
            }
            if (max > maxDuration.get()) {
                maxDuration.set(max);
            }
        }
    }
}
