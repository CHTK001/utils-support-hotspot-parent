package com.chua.hotspot.profiler.support;

import com.chua.hotspot.core.support.log.LogFactory;
import lombok.Data;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 方法性能分析器
 * 负责记录和统计方法执行时间
 *
 * @author CH
 */
public class MethodProfiler {

    private static final LogFactory logger = LogFactory.getInstance();
    
    private static final MethodProfiler INSTANCE = new MethodProfiler();
    
    // 方法统计信息 Map<methodSignature, MethodStats>
    private final Map<String, MethodStats> methodStatsMap = new ConcurrentHashMap<>();
    
    // 慢方法阈值（毫秒），默认1000ms
    private volatile long slowMethodThreshold = 1000;
    
    // 最大保留方法数量
    private static final int MAX_METHODS = 10000;
    
    // 是否启用profiler
    private volatile boolean enabled = true;

    private MethodProfiler() {
    }

    public static MethodProfiler getInstance() {
        return INSTANCE;
    }

    /**
     * 记录方法执行
     * 
     * @param methodSignature 方法签名（全限定类名.方法名(参数类型)）
     * @param executionTime 执行时间（毫秒）
     */
    public void recordMethodExecution(String methodSignature, long executionTime) {
        if (!enabled) {
            return;
        }

        try {
            MethodStats stats = methodStatsMap.computeIfAbsent(methodSignature, k -> new MethodStats(k));
            stats.record(executionTime);

            // 如果超过最大数量，清理最少调用的方法
            if (methodStatsMap.size() > MAX_METHODS) {
                cleanupOldStats();
            }
        } catch (Exception e) {
            logger.error("Failed to record method execution: " + methodSignature, e);
        }
    }

    /**
     * 获取所有慢方法（执行时间超过阈值）
     * 
     * @return 慢方法列表，按平均执行时间降序
     */
    public List<MethodStats> getSlowMethods() {
        List<MethodStats> slowMethods = new ArrayList<>();
        
        for (MethodStats stats : methodStatsMap.values()) {
            if (stats.getAverageTime() >= slowMethodThreshold) {
                slowMethods.add(stats);
            }
        }
        
        slowMethods.sort((a, b) -> Long.compare(b.getAverageTime(), a.getAverageTime()));
        return slowMethods;
    }

    /**
     * 获取方法调用耗时排行榜
     * 
     * @param limit 返回数量
     * @return 方法统计列表，按平均执行时间降序
     */
    public List<MethodStats> getTopSlowMethods(int limit) {
        List<MethodStats> allMethods = new ArrayList<>(methodStatsMap.values());
        allMethods.sort((a, b) -> Long.compare(b.getAverageTime(), a.getAverageTime()));
        
        return allMethods.subList(0, Math.min(limit, allMethods.size()));
    }

    /**
     * 获取指定方法的统计信息
     * 
     * @param methodSignature 方法签名
     * @return 方法统计信息，如果不存在返回null
     */
    public MethodStats getMethodStats(String methodSignature) {
        return methodStatsMap.get(methodSignature);
    }

    /**
     * 获取所有方法统计信息
     * 
     * @return 所有方法统计信息列表
     */
    public List<MethodStats> getAllMethodStats() {
        return new ArrayList<>(methodStatsMap.values());
    }

    /**
     * 清理统计数据
     */
    public void clear() {
        methodStatsMap.clear();
        logger.info("Method profiler statistics cleared");
    }

    /**
     * 设置慢方法阈值
     * 
     * @param thresholdMs 阈值（毫秒）
     */
    public void setSlowMethodThreshold(long thresholdMs) {
        this.slowMethodThreshold = thresholdMs;
        logger.info("Slow method threshold set to: {}ms", thresholdMs);
    }

    /**
     * 获取慢方法阈值
     * 
     * @return 阈值（毫秒）
     */
    public long getSlowMethodThreshold() {
        return slowMethodThreshold;
    }

    /**
     * 启用/禁用profiler
     * 
     * @param enabled 是否启用
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
        logger.info("Method profiler enabled: {}", enabled);
    }

    /**
     * 检查profiler是否启用
     * 
     * @return 是否启用
     */
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * 清理最少调用的方法统计
     */
    private void cleanupOldStats() {
        if (methodStatsMap.size() <= MAX_METHODS) {
            return;
        }

        try {
            List<Map.Entry<String, MethodStats>> entries = new ArrayList<>(methodStatsMap.entrySet());
            entries.sort(Comparator.comparingLong(e -> e.getValue().getCallCount()));
            
            // 移除调用次数最少的10%
            int removeCount = MAX_METHODS / 10;
            for (int i = 0; i < removeCount && i < entries.size(); i++) {
                methodStatsMap.remove(entries.get(i).getKey());
            }
        } catch (Exception e) {
            logger.error("Failed to cleanup old stats", e);
        }
    }

    /**
     * 方法统计信息
     */
    @Data
    public static class MethodStats {
        private final String methodSignature;
        private final AtomicLong callCount = new AtomicLong(0);
        private final AtomicLong totalTime = new AtomicLong(0);
        private volatile long minTime = Long.MAX_VALUE;
        private volatile long maxTime = Long.MIN_VALUE;
        private volatile long lastExecutionTime = 0;
        private volatile long lastRecordTime = System.currentTimeMillis();

        public MethodStats(String methodSignature) {
            this.methodSignature = methodSignature;
        }

        /**
         * 记录一次执行
         * 
         * @param executionTime 执行时间（毫秒）
         */
        public synchronized void record(long executionTime) {
            callCount.incrementAndGet();
            totalTime.addAndGet(executionTime);
            lastExecutionTime = executionTime;
            lastRecordTime = System.currentTimeMillis();
            
            if (executionTime < minTime) {
                minTime = executionTime;
            }
            if (executionTime > maxTime) {
                maxTime = executionTime;
            }
        }

        /**
         * 获取平均执行时间
         * 
         * @return 平均执行时间（毫秒）
         */
        public long getAverageTime() {
            long count = callCount.get();
            return count > 0 ? totalTime.get() / count : 0;
        }

        /**
         * 获取调用次数
         * 
         * @return 调用次数
         */
        public long getCallCount() {
            return callCount.get();
        }

        /**
         * 获取总执行时间
         * 
         * @return 总执行时间（毫秒）
         */
        public long getTotalTime() {
            return totalTime.get();
        }

        /**
         * 转换为Map用于JSON序列化
         * 
         * @return Map表示
         */
        public Map<String, Object> toMap() {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("methodSignature", methodSignature);
            map.put("callCount", callCount.get());
            map.put("totalTime", totalTime.get());
            map.put("averageTime", getAverageTime());
            map.put("minTime", minTime == Long.MAX_VALUE ? 0 : minTime);
            map.put("maxTime", maxTime == Long.MIN_VALUE ? 0 : maxTime);
            map.put("lastExecutionTime", lastExecutionTime);
            map.put("lastRecordTime", lastRecordTime);
            return map;
        }
    }
}
