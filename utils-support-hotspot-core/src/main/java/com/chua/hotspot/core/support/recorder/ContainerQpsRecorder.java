package com.chua.hotspot.core.support.recorder;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.storage.DataRecorder;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 容器 QPS 记录器
 * <p>
 * 负责记录容器（Tomcat/Undertow/Jetty/Netty）的请求统计
 * 包括：QPS、总请求数、活跃连接数
 * </p>
 * <p>
 * 注意：WebSocket 推送由 DataPusher 统一管理，SQLite 存储由 DataRecorder 统一管理
 * </p>
 *
 * @author CH
 * @since 2024/12/13
 * @version 4.0.0.38
 */
public class ContainerQpsRecorder {
    
    private static final LogFactory logger = LogFactory.getInstance();
    private static final ContainerQpsRecorder INSTANCE = new ContainerQpsRecorder();
    
    // 容器类型统计
    private final Map<String, ContainerStats> containerStatsMap = new ConcurrentHashMap<>();
    
    private ContainerQpsRecorder() {
        // 初始化常见容器类型
        containerStatsMap.put("TOMCAT", new ContainerStats("TOMCAT"));
        containerStatsMap.put("UNDERTOW", new ContainerStats("UNDERTOW"));
        containerStatsMap.put("JETTY", new ContainerStats("JETTY"));
        containerStatsMap.put("NETTY", new ContainerStats("NETTY"));
    }
    
    public static ContainerQpsRecorder getInstance() {
        return INSTANCE;
    }
    
    /**
     * 记录请求开始
     */
    public void recordRequestStart(String containerType) {
        ContainerStats stats = containerStatsMap.get(containerType);
        if (stats != null) {
            stats.incrementActive();
            stats.incrementTotal();
        }
    }
    
    /**
     * 记录请求结束
     */
    public void recordRequestEnd(String containerType) {
        ContainerStats stats = containerStatsMap.get(containerType);
        if (stats != null) {
            stats.decrementActive();
        }
    }
    
    /**
     * 获取当前 QPS
     */
    public int getCurrentQps(String containerType) {
        ContainerStats stats = containerStatsMap.get(containerType);
        return stats != null ? stats.getCurrentQps() : 0;
    }
    
    /**
     * 获取总请求数
     */
    public long getTotalRequests(String containerType) {
        ContainerStats stats = containerStatsMap.get(containerType);
        return stats != null ? stats.getTotalRequests() : 0;
    }
    
    /**
     * 获取活跃连接数
     */
    public int getActiveConnections(String containerType) {
        ContainerStats stats = containerStatsMap.get(containerType);
        return stats != null ? stats.getActiveConnections() : 0;
    }
    
    /**
     * 检测当前运行的容器类型
     */
    public String detectCurrentContainer() {
        try {
            Class.forName("org.apache.catalina.util.ServerInfo");
            return "TOMCAT";
        } catch (ClassNotFoundException e) {
            // 不是 Tomcat
        }
        
        try {
            Class.forName("io.undertow.Version");
            return "UNDERTOW";
        } catch (ClassNotFoundException e) {
            // 不是 Undertow
        }
        
        try {
            Class.forName("org.eclipse.jetty.util.Jetty");
            return "JETTY";
        } catch (ClassNotFoundException e) {
            // 不是 Jetty
        }
        
        try {
            Class.forName("io.netty.util.Version");
            return "NETTY";
        } catch (ClassNotFoundException e) {
            // 不是 Netty
        }
        
        return null;
    }
    
    /**
     * 获取所有容器的实时统计
     */
    public Map<String, Map<String, Object>> getAllContainerStats() {
        Map<String, Map<String, Object>> result = new ConcurrentHashMap<>();
        
        for (Map.Entry<String, ContainerStats> entry : containerStatsMap.entrySet()) {
            String containerType = entry.getKey();
            ContainerStats stats = entry.getValue();
            
            Map<String, Object> statsMap = new HashMap<>();
            statsMap.put("qps", stats.getCurrentQps());
            statsMap.put("totalRequests", stats.getTotalRequests());
            statsMap.put("activeConnections", stats.getActiveConnections());
            statsMap.put("timestamp", System.currentTimeMillis());
            
            result.put(containerType, statsMap);
        }
        
        // 同时将数据记录到 DataRecorder（定时批量写入 SQLite）
        for (Map.Entry<String, ContainerStats> entry : containerStatsMap.entrySet()) {
            String containerType = entry.getKey();
            ContainerStats stats = entry.getValue();
            int qps = stats.calculateQps();
            long totalRequests = stats.getTotalRequests();
            int activeConnections = stats.getActiveConnections();
            
            if (totalRequests > 0 || activeConnections > 0) {
                DataRecorder.getInstance().recordQps(containerType, qps, totalRequests, activeConnections);
            }
        }
        
        return result;
    }
    
    /**
     * 容器统计数据
     */
    private static class ContainerStats {
        private final String containerType;
        private final AtomicLong totalRequests = new AtomicLong(0);
        private final AtomicInteger activeConnections = new AtomicInteger(0);
        
        private final ConcurrentLinkedDeque<RequestRecord> requestWindow = new ConcurrentLinkedDeque<>();
        private final long WINDOW_SIZE = 60_000; // 60 秒
        
        public ContainerStats(String containerType) {
            this.containerType = containerType;
        }
        
        public void incrementTotal() {
            totalRequests.incrementAndGet();
            requestWindow.offer(new RequestRecord(System.currentTimeMillis()));
        }
        
        public void incrementActive() {
            activeConnections.incrementAndGet();
        }
        
        public void decrementActive() {
            activeConnections.decrementAndGet();
        }
        
        public long getTotalRequests() {
            return totalRequests.get();
        }
        
        public int getActiveConnections() {
            return activeConnections.get();
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
