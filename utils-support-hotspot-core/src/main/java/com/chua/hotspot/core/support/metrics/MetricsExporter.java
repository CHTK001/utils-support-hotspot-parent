package com.chua.hotspot.core.support.metrics;

import com.chua.hotspot.core.support.log.LogFactory;

import java.lang.management.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 指标导出器
 * <p>
 * 收集并导出 Agent 监控指标，支持 Prometheus exposition 格式。
 * 内置指标分类：
 * <ul>
 *   <li>jvm - JVM 运行时指标（内存、线程、GC、类加载）</li>
 *   <li>agent - Agent 自身指标（增强类数、拦截方法数、上报数）</li>
 *   <li>sql - SQL 指标（执行次数、慢查询数、错误数）</li>
 *   <li>exception - 异常指标（捕获异常数、按类型统计）</li>
 *   <li>http - HTTP 指标（请求量、响应时间、错误率）</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class MetricsExporter {

    private static final MetricsExporter INSTANCE = new MetricsExporter();

    private final LogFactory logger = LogFactory.getInstance();

    /** 自定义计数器 */
    private final Map<String, AtomicLong> counters = new ConcurrentHashMap<>();

    /** 自定义仪表盘 */
    private final Map<String, AtomicLong> gauges = new ConcurrentHashMap<>();

    /** 指标标签（附加到所有导出指标） */
    private final Map<String, String> globalLabels = new ConcurrentHashMap<>();

    private MetricsExporter() {
        // 初始化全局标签
        try {
            String appName = System.getProperty("hotspot.application.name", "unknown");
            String host = java.net.InetAddress.getLocalHost().getHostName();
            globalLabels.put("application", appName);
            globalLabels.put("host", host);
        } catch (Exception ignored) {
            globalLabels.put("application", "unknown");
            globalLabels.put("host", "unknown");
        }
    }

    public static MetricsExporter getInstance() {
        return INSTANCE;
    }

    // ==================== 计数器操作 ====================

    /**
     * 递增计数器
     */
    public void increment(String name) {
        increment(name, 1);
    }

    /**
     * 递增计数器（指定增量）
     */
    public void increment(String name, long delta) {
        counters.computeIfAbsent(name, k -> new AtomicLong(0)).addAndGet(delta);
    }

    /**
     * 获取计数器值
     */
    public long getCounter(String name) {
        AtomicLong counter = counters.get(name);
        return counter != null ? counter.get() : 0;
    }

    // ==================== 仪表盘操作 ====================

    /**
     * 设置仪表盘值
     */
    public void setGauge(String name, long value) {
        gauges.computeIfAbsent(name, k -> new AtomicLong(0)).set(value);
    }

    /**
     * 获取仪表盘值
     */
    public long getGauge(String name) {
        AtomicLong gauge = gauges.get(name);
        return gauge != null ? gauge.get() : 0;
    }

    // ==================== 全局标签 ====================

    /**
     * 添加全局标签
     */
    public void addGlobalLabel(String key, String value) {
        globalLabels.put(key, value);
    }

    // ==================== Prometheus 格式导出 ====================

    /**
     * 导出 Prometheus exposition 格式指标
     * <p>
     * 格式规范：https://prometheus.io/docs/instrumenting/exposition_formats/
     * </p>
     *
     * @return Prometheus 文本格式指标
     */
    public String exportPrometheus() {
        StringBuilder sb = new StringBuilder();
        String labelStr = buildLabelString();

        // JVM 指标
        exportJvmMetrics(sb, labelStr);

        // Agent 指标
        exportAgentMetrics(sb, labelStr);

        // 自定义计数器
        exportCustomMetrics(sb, labelStr);

        return sb.toString();
    }

    /**
     * 导出 JVM 指标
     */
    private void exportJvmMetrics(StringBuilder sb, String labelStr) {
        // 内存指标
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryMXBean.getHeapMemoryUsage();
        MemoryUsage nonHeapUsage = memoryMXBean.getNonHeapMemoryUsage();

        writeGauge(sb, "jvm_memory_heap_used_bytes", "JVM heap memory used", heapUsage.getUsed(), labelStr);
        writeGauge(sb, "jvm_memory_heap_max_bytes", "JVM heap memory max", heapUsage.getMax(), labelStr);
        writeGauge(sb, "jvm_memory_heap_committed_bytes", "JVM heap memory committed", heapUsage.getCommitted(), labelStr);
        writeGauge(sb, "jvm_memory_nonheap_used_bytes", "JVM non-heap memory used", nonHeapUsage.getUsed(), labelStr);
        writeGauge(sb, "jvm_memory_nonheap_committed_bytes", "JVM non-heap memory committed", nonHeapUsage.getCommitted(), labelStr);

        // 线程指标
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        writeGauge(sb, "jvm_threads_current", "Current thread count", threadMXBean.getThreadCount(), labelStr);
        writeGauge(sb, "jvm_threads_daemon", "Daemon thread count", threadMXBean.getDaemonThreadCount(), labelStr);
        writeGauge(sb, "jvm_threads_peak", "Peak thread count", threadMXBean.getPeakThreadCount(), labelStr);

        long[] deadlockedThreads = threadMXBean.findDeadlockedThreads();
        writeGauge(sb, "jvm_threads_deadlocked", "Deadlocked thread count",
                deadlockedThreads != null ? deadlockedThreads.length : 0, labelStr);

        // 类加载指标
        ClassLoadingMXBean clMXBean = ManagementFactory.getClassLoadingMXBean();
        writeGauge(sb, "jvm_classes_loaded", "Currently loaded class count", clMXBean.getLoadedClassCount(), labelStr);
        writeCounter(sb, "jvm_classes_loaded_total", "Total loaded class count", clMXBean.getTotalLoadedClassCount(), labelStr);
        writeCounter(sb, "jvm_classes_unloaded_total", "Total unloaded class count", clMXBean.getUnloadedClassCount(), labelStr);

        // GC 指标
        for (GarbageCollectorMXBean gcMXBean : ManagementFactory.getGarbageCollectorMXBeans()) {
            String gcName = sanitizeName(gcMXBean.getName());
            writeCounter(sb, "jvm_gc_collection_seconds_total",
                    "GC collection time in seconds",
                    gcMXBean.getCollectionTime() / 1000.0,
                    labelStr + ",gc=\"" + gcName + "\"");
            writeCounter(sb, "jvm_gc_collection_count_total",
                    "GC collection count",
                    gcMXBean.getCollectionCount(),
                    labelStr + ",gc=\"" + gcName + "\"");
        }

        // 运行时间
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        writeGauge(sb, "jvm_uptime_seconds", "JVM uptime in seconds", runtimeMXBean.getUptime() / 1000.0, labelStr);
    }

    /**
     * 导出 Agent 自身指标
     */
    private void exportAgentMetrics(StringBuilder sb, String labelStr) {
        // 从自定义计数器/仪表盘中导出 agent_ 前缀的指标
        for (Map.Entry<String, AtomicLong> entry : counters.entrySet()) {
            if (entry.getKey().startsWith("agent_")) {
                writeCounter(sb, entry.getKey(), "Agent counter", entry.getValue().get(), labelStr);
            }
        }
        for (Map.Entry<String, AtomicLong> entry : gauges.entrySet()) {
            if (entry.getKey().startsWith("agent_")) {
                writeGauge(sb, entry.getKey(), "Agent gauge", entry.getValue().get(), labelStr);
            }
        }
    }

    /**
     * 导出自定义指标（非 agent_ 前缀）
     */
    private void exportCustomMetrics(StringBuilder sb, String labelStr) {
        for (Map.Entry<String, AtomicLong> entry : counters.entrySet()) {
            if (!entry.getKey().startsWith("agent_") && !entry.getKey().startsWith("jvm_")) {
                writeCounter(sb, entry.getKey(), "Custom counter", entry.getValue().get(), labelStr);
            }
        }
        for (Map.Entry<String, AtomicLong> entry : gauges.entrySet()) {
            if (!entry.getKey().startsWith("agent_") && !entry.getKey().startsWith("jvm_")) {
                writeGauge(sb, entry.getKey(), "Custom gauge", entry.getValue().get(), labelStr);
            }
        }
    }

    // ==================== Prometheus 格式辅助方法 ====================

    /**
     * 写入 HELP 和 TYPE 行 + gauge 值
     */
    private void writeGauge(StringBuilder sb, String name, String help, double value, String labels) {
        sb.append("# HELP ").append(name).append(" ").append(help).append("\n");
        sb.append("# TYPE ").append(name).append(" gauge\n");
        sb.append(name).append(labels).append(" ").append(formatValue(value)).append("\n");
    }

    /**
     * 写入 HELP 和 TYPE 行 + counter 值
     */
    private void writeCounter(StringBuilder sb, String name, String help, double value, String labels) {
        sb.append("# HELP ").append(name).append(" ").append(help).append("\n");
        sb.append("# TYPE ").append(name).append(" counter\n");
        sb.append(name).append(labels).append(" ").append(formatValue(value)).append("\n");
    }

    /**
     * 构建标签字符串
     */
    private String buildLabelString() {
        if (globalLabels.isEmpty()) return "";
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, String> entry : globalLabels.entrySet()) {
            if (!first) sb.append(",");
            sb.append(entry.getKey()).append("=\"").append(escapeLabelValue(entry.getValue())).append("\"");
            first = false;
        }
        sb.append("}");
        return sb.toString();
    }

    /**
     * 格式化数值（避免科学计数法）
     */
    private String formatValue(double value) {
        if (value == (long) value) {
            return String.valueOf((long) value);
        }
        return String.format("%.6f", value);
    }

    /**
     * 清理指标名称（Prometheus 命名规范：只允许 [a-zA-Z_:][a-zA-Z0-9_:]*）
     */
    private String sanitizeName(String name) {
        return name.replaceAll("[^a-zA-Z0-9_:]", "_");
    }

    /**
     * 转义标签值中的特殊字符
     */
    private String escapeLabelValue(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }

    // ==================== 指标摘要（JSON 友好） ====================

    /**
     * 获取指标摘要（用于 API 返回）
     */
    public Map<String, Object> getMetricsSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("timestamp", System.currentTimeMillis());

        // JVM 指标
        Map<String, Object> jvm = new LinkedHashMap<>();
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryMXBean.getHeapMemoryUsage();
        jvm.put("heapUsedMB", heapUsage.getUsed() / 1024 / 1024);
        jvm.put("heapMaxMB", heapUsage.getMax() / 1024 / 1024);
        jvm.put("heapUsagePercent", heapUsage.getMax() > 0
                ? String.format("%.1f%%", heapUsage.getUsed() * 100.0 / heapUsage.getMax()) : "N/A");

        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        jvm.put("threadCount", threadMXBean.getThreadCount());
        jvm.put("peakThreadCount", threadMXBean.getPeakThreadCount());

        ClassLoadingMXBean clMXBean = ManagementFactory.getClassLoadingMXBean();
        jvm.put("loadedClassCount", clMXBean.getLoadedClassCount());

        summary.put("jvm", jvm);

        // 自定义计数器
        Map<String, Long> counterMap = new LinkedHashMap<>();
        for (Map.Entry<String, AtomicLong> entry : counters.entrySet()) {
            counterMap.put(entry.getKey(), entry.getValue().get());
        }
        summary.put("counters", counterMap);

        // 自定义仪表盘
        Map<String, Long> gaugeMap = new LinkedHashMap<>();
        for (Map.Entry<String, AtomicLong> entry : gauges.entrySet()) {
            gaugeMap.put(entry.getKey(), entry.getValue().get());
        }
        summary.put("gauges", gaugeMap);

        return summary;
    }

    /**
     * 重置所有自定义计数器
     */
    public void resetCounters() {
        for (AtomicLong counter : counters.values()) {
            counter.set(0);
        }
    }
}