package com.chua.hotspot.core.support.recorder;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.pusher.DataPusher;

import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Spring Mapping QPS 记录器
 * <p>
 * 记录每个 Spring MVC Mapping 的请求统计
 * 包括：QPS、总请求数、平均响应时间、错误率
 * </p>
 *
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.38
 */
public class MappingQpsRecorder {
    
    private static final LogFactory logger = LogFactory.getInstance();
    private static final MappingQpsRecorder INSTANCE = new MappingQpsRecorder();
    
    // Mapping 统计（mappingId -> MappingStats）
    private final Map<String, MappingStats> mappingStatsMap = new ConcurrentHashMap<>();
    
    private MappingQpsRecorder() {
    }
    
    public static MappingQpsRecorder getInstance() {
        return INSTANCE;
    }
    
    /**
     * 记录请求开始
     */
    public void recordRequestStart(String mappingId, String url, String method, String handler) {
        MappingStats stats = mappingStatsMap.computeIfAbsent(mappingId, k -> 
            new MappingStats(mappingId, url, method, handler));
        stats.incrementActive();
        stats.incrementTotal();
    }
    
    /**
     * 记录请求结束
     */
    public void recordRequestEnd(String mappingId, long duration, boolean hasError) {
        MappingStats stats = mappingStatsMap.get(mappingId);
        if (stats != null) {
            stats.decrementActive();
            stats.recordDuration(duration);
            if (hasError) {
                stats.incrementError();
            }
        }
        
        // 使用 DataPusher 推送 QPS 数据
        pushToWebSocket(mappingId);
    }
    
    /**
     * 推送 QPS 数据到 WebSocket
     */
    private void pushToWebSocket(String mappingId) {
        try {
            Map<String, Object> data = getMappingStats(mappingId);
            if (data != null) {
                DataPusher.getInstance().pushQps("MAPPING", data);
            }
        } catch (Exception e) {
            // 忽略推送异常
        }
    }
    
    /**
     * 获取指定 Mapping 的 QPS
     */
    public int getCurrentQps(String mappingId) {
        MappingStats stats = mappingStatsMap.get(mappingId);
        return stats != null ? stats.getCurrentQps() : 0;
    }
    
    /**
     * 获取指定 Mapping 的统计信息
     */
    public Map<String, Object> getMappingStats(String mappingId) {
        MappingStats stats = mappingStatsMap.get(mappingId);
        if (stats == null) {
            return null;
        }
        
        Map<String, Object> result = new ConcurrentHashMap<>();
        result.put("mappingId", stats.mappingId);
        result.put("url", stats.url);
        result.put("method", stats.method);
        result.put("handler", stats.handler);
        result.put("qps", stats.getCurrentQps());
        result.put("totalRequests", stats.getTotalRequests());
        result.put("activeRequests", stats.getActiveRequests());
        result.put("avgDuration", stats.getAvgDuration());
        result.put("errorCount", stats.getErrorCount());
        result.put("errorRate", stats.getErrorRate());
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }
    
    /**
     * 获取所有 Mapping 的统计信息
     */
    public Map<String, Map<String, Object>> getAllMappingStats() {
        Map<String, Map<String, Object>> result = new ConcurrentHashMap<>();
        
        for (Map.Entry<String, MappingStats> entry : mappingStatsMap.entrySet()) {
            String mappingId = entry.getKey();
            Map<String, Object> stats = getMappingStats(mappingId);
            if (stats != null) {
                result.put(mappingId, stats);
            }
        }
        
        return result;
    }
    
    /**
     * Mapping 统计数据
     */
    private static class MappingStats {
        private final String mappingId;
        private final String url;
        private final String method;
        private final String handler;
        
        private final AtomicLong totalRequests = new AtomicLong(0);
        private final AtomicInteger activeRequests = new AtomicInteger(0);
        private final AtomicLong errorCount = new AtomicLong(0);
        
        // 响应时间统计
        private final AtomicLong totalDuration = new AtomicLong(0);
        
        // 滑动窗口：最近 60 秒的请求数（用于计算 QPS）
        private final ConcurrentLinkedDeque<RequestRecord> requestWindow = new ConcurrentLinkedDeque<>();
        private final long WINDOW_SIZE = 60_000; // 60 秒
        
        public MappingStats(String mappingId, String url, String method, String handler) {
            this.mappingId = mappingId;
            this.url = url;
            this.method = method;
            this.handler = handler;
        }
        
        public void incrementTotal() {
            totalRequests.incrementAndGet();
            requestWindow.offer(new RequestRecord(System.currentTimeMillis()));
        }
        
        public void incrementActive() {
            activeRequests.incrementAndGet();
        }
        
        public void decrementActive() {
            activeRequests.decrementAndGet();
        }
        
        public void incrementError() {
            errorCount.incrementAndGet();
        }
        
        public void recordDuration(long duration) {
            totalDuration.addAndGet(duration);
        }
        
        public long getTotalRequests() {
            return totalRequests.get();
        }
        
        public int getActiveRequests() {
            return activeRequests.get();
        }
        
        public long getErrorCount() {
            return errorCount.get();
        }
        
        public double getErrorRate() {
            long total = getTotalRequests();
            if (total == 0) {
                return 0.0;
            }
            return (double) getErrorCount() / total * 100;
        }
        
        public double getAvgDuration() {
            long total = getTotalRequests();
            if (total == 0) {
                return 0.0;
            }
            return (double) totalDuration.get() / total;
        }
        
        public int calculateQps() {
            long now = System.currentTimeMillis();
            long cutoffTime = now - WINDOW_SIZE;
            
            while (!requestWindow.isEmpty()) {
                RequestRecord first = requestWindow.peekFirst();
                if (first != null && first.timestamp < cutoffTime) {
                    requestWindow.pollFirst();
                } else {
                    break;
                }
            }
            
            int requestCount = requestWindow.size();
            if (requestCount == 0) {
                return 0;
            }
            
            RequestRecord oldest = requestWindow.peekFirst();
            if (oldest == null) {
                return 0;
            }
            
            long timeSpan = (now - oldest.timestamp) / 1000;
            if (timeSpan == 0) {
                return requestCount;
            }
            
            return (int) (requestCount / timeSpan);
        }
        
        public int getCurrentQps() {
            long now = System.currentTimeMillis();
            long cutoffTime = now - WINDOW_SIZE;
            
            int count = 0;
            for (RequestRecord record : requestWindow) {
                if (record.timestamp >= cutoffTime) {
                    count++;
                }
            }
            
            return count / 60;
        }
    }
    
    private static class RequestRecord {
        public final long timestamp;
        
        public RequestRecord(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
