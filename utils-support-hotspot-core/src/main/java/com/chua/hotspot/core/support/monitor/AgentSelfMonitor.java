package com.chua.hotspot.core.support.monitor;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.metrics.MetricsExporter;

import java.lang.management.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Agent 自监控器
 * <p>
 * 监控 Agent 自身的运行开销，包括：
 * <ul>
 *   <li>字节码增强统计：增强类数、拦截方法数、增强耗时</li>
 *   <li>数据上报统计：上报次数、上报数据量、上报失败数</li>
 *   <li>内存占用：Agent 自身内存占用估算</li>
 *   <li>线程统计：Agent 创建的线程数</li>
 *   <li>性能开销：字节码增强对目标方法的耗时影响</li>
 * </ul>
 * </p>
 * <p>
 * 所有统计数据自动注册到 MetricsExporter，可通过 /metrics 端点导出。
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class AgentSelfMonitor {

    private static final AgentSelfMonitor INSTANCE = new AgentSelfMonitor();

    private final LogFactory logger = LogFactory.getInstance();

    // ==================== 字节码增强统计 ====================

    /** 已增强的类数量 */
    private final AtomicLong transformedClassCount = new AtomicLong(0);

    /** 已拦截的方法数量 */
    private final AtomicLong interceptedMethodCount = new AtomicLong(0);

    /** 增强总耗时（纳秒） */
    private final AtomicLong transformTimeNanos = new AtomicLong(0);

    /** 增强失败次数 */
    private final AtomicLong transformFailCount = new AtomicLong(0);

    // ==================== 数据上报统计 ====================

    /** 上报总次数 */
    private final AtomicLong reportCount = new AtomicLong(0);

    /** 上报数据条数 */
    private final AtomicLong reportDataCount = new AtomicLong(0);

    /** 上报失败次数 */
    private final AtomicLong reportFailCount = new AtomicLong(0);

    /** 上报总耗时（毫秒） */
    private final AtomicLong reportTimeMs = new AtomicLong(0);

    // ==================== 拦截方法执行统计 ====================

    /** 拦截方法调用总次数 */
    private final AtomicLong interceptInvokeCount = new AtomicLong(0);

    /** 拦截方法总耗时（纳秒） */
    private final AtomicLong interceptTimeNanos = new AtomicLong(0);

    /** 拦截方法异常次数 */
    private final AtomicLong interceptExceptionCount = new AtomicLong(0);

    // ==================== 插件统计 ====================

    /** 已注册插件数 */
    private final AtomicLong registeredPluginCount = new AtomicLong(0);

    /** 插件加载数（按名称统计） */
    private final Map<String, AtomicLong> pluginLoadCount = new ConcurrentHashMap<>();

    // ==================== 启动时间 ====================

    /** Agent 启动时间戳 */
    private final long startTimeMs;

    private AgentSelfMonitor() {
        this.startTimeMs = System.currentTimeMillis();
    }

    public static AgentSelfMonitor getInstance() {
        return INSTANCE;
    }

    // ==================== 字节码增强统计方法 ====================

    /**
     * 记录类增强成功
     *
     * @param className   类名
     * @param methodCount 增强方法数
     * @param costNanos   增强耗时（纳秒）
     */
    public void recordTransform(String className, int methodCount, long costNanos) {
        transformedClassCount.incrementAndGet();
        interceptedMethodCount.addAndGet(methodCount);
        transformTimeNanos.addAndGet(costNanos);
        // 同步到 MetricsExporter
        MetricsExporter.getInstance().increment("agent_transform_class_total");
        MetricsExporter.getInstance().increment("agent_transform_method_total", methodCount);
    }

    /**
     * 记录类增强失败
     */
    public void recordTransformFail(String className) {
        transformFailCount.incrementAndGet();
        MetricsExporter.getInstance().increment("agent_transform_fail_total");
        logger.warn("类增强失败: {}", className);
    }

    // ==================== 数据上报统计方法 ====================

    /**
     * 记录数据上报成功
     *
     * @param dataCount 数据条数
     * @param costMs    上报耗时（毫秒）
     */
    public void recordReport(int dataCount, long costMs) {
        reportCount.incrementAndGet();
        reportDataCount.addAndGet(dataCount);
        reportTimeMs.addAndGet(costMs);
        MetricsExporter.getInstance().increment("agent_report_total");
        MetricsExporter.getInstance().increment("agent_report_data_total", dataCount);
    }

    /**
     * 记录数据上报失败
     */
    public void recordReportFail() {
        reportFailCount.incrementAndGet();
        MetricsExporter.getInstance().increment("agent_report_fail_total");
    }

    // ==================== 拦截方法执行统计方法 ====================

    /**
     * 记录拦截方法调用
     *
     * @param costNanos 方法拦截耗时（纳秒）
     */
    public void recordIntercept(long costNanos) {
        interceptInvokeCount.incrementAndGet();
        interceptTimeNanos.addAndGet(costNanos);
    }

    /**
     * 记录拦截方法异常
     */
    public void recordInterceptException() {
        interceptExceptionCount.incrementAndGet();
        MetricsExporter.getInstance().increment("agent_intercept_exception_total");
    }

    // ==================== 插件统计方法 ====================

    /**
     * 记录插件注册
     */
    public void recordPluginRegister(String pluginName) {
        registeredPluginCount.incrementAndGet();
        pluginLoadCount.computeIfAbsent(pluginName, k -> new AtomicLong(0)).incrementAndGet();
        MetricsExporter.getInstance().increment("agent_plugin_register_total");
    }

    // ==================== 查询方法 ====================

    /**
     * 获取 Agent 自监控摘要
     */
    public Map<String, Object> getMonitorSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("timestamp", System.currentTimeMillis());
        summary.put("uptimeSeconds", (System.currentTimeMillis() - startTimeMs) / 1000);

        // 字节码增强统计
        Map<String, Object> transform = new LinkedHashMap<>();
        transform.put("transformedClassCount", transformedClassCount.get());
        transform.put("interceptedMethodCount", interceptedMethodCount.get());
        transform.put("transformTimeMs", transformTimeNanos.get() / 1_000_000);
        transform.put("transformFailCount", transformFailCount.get());
        transform.put("avgTransformTimeMs", transformedClassCount.get() > 0
                ? String.format("%.2f", transformTimeNanos.get() / 1_000_000.0 / transformedClassCount.get())
                : "0");
        summary.put("transform", transform);

        // 数据上报统计
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportCount", reportCount.get());
        report.put("reportDataCount", reportDataCount.get());
        report.put("reportFailCount", reportFailCount.get());
        report.put("reportTimeMs", reportTimeMs.get());
        report.put("avgReportTimeMs", reportCount.get() > 0
                ? String.format("%.2f", reportTimeMs.get() * 1.0 / reportCount.get())
                : "0");
        summary.put("report", report);

        // 拦截方法执行统计
        Map<String, Object> intercept = new LinkedHashMap<>();
        intercept.put("invokeCount", interceptInvokeCount.get());
        intercept.put("totalTimeMs", interceptTimeNanos.get() / 1_000_000);
        intercept.put("exceptionCount", interceptExceptionCount.get());
        intercept.put("avgInterceptTimeNs", interceptInvokeCount.get() > 0
                ? String.format("%.0f", interceptTimeNanos.get() * 1.0 / interceptInvokeCount.get())
                : "0");
        summary.put("intercept", intercept);

        // 插件统计
        Map<String, Object> plugin = new LinkedHashMap<>();
        plugin.put("registeredPluginCount", registeredPluginCount.get());
        Map<String, Long> pluginCounts = new LinkedHashMap<>();
        for (Map.Entry<String, AtomicLong> entry : pluginLoadCount.entrySet()) {
            pluginCounts.put(entry.getKey(), entry.getValue().get());
        }
        plugin.put("plugins", pluginCounts);
        summary.put("plugin", plugin);

        // Agent 内存估算
        summary.put("memoryEstimate", estimateAgentMemory());

        return summary;
    }

    /**
     * 获取性能开销评估
     * <p>
     * 评估 Agent 字节码增强对应用性能的影响
     * </p>
     */
    public Map<String, Object> getPerformanceOverhead() {
        Map<String, Object> overhead = new LinkedHashMap<>();

        long totalInterceptMs = interceptTimeNanos.get() / 1_000_000;
        long uptimeSeconds = (System.currentTimeMillis() - startTimeMs) / 1000;

        // 平均每次拦截的额外耗时
        double avgInterceptNs = interceptInvokeCount.get() > 0
                ? interceptTimeNanos.get() * 1.0 / interceptInvokeCount.get() : 0;
        overhead.put("avgInterceptOverheadNs", String.format("%.0f", avgInterceptNs));

        // 每秒拦截次数
        double interceptsPerSecond = uptimeSeconds > 0
                ? interceptInvokeCount.get() * 1.0 / uptimeSeconds : 0;
        overhead.put("interceptsPerSecond", String.format("%.1f", interceptsPerSecond));

        // 每秒拦截总耗时占比
        double overheadPercent = uptimeSeconds > 0
                ? (totalInterceptMs * 100.0 / (uptimeSeconds * 1000.0)) : 0;
        overhead.put("overheadPercent", String.format("%.4f%%", overheadPercent));

        // 增强失败率
        double failRate = transformedClassCount.get() > 0
                ? transformFailCount.get() * 100.0 / (transformedClassCount.get() + transformFailCount.get()) : 0;
        overhead.put("transformFailRate", String.format("%.2f%%", failRate));

        // 上报失败率
        double reportFailRate = reportCount.get() > 0
                ? reportFailCount.get() * 100.0 / reportCount.get() : 0;
        overhead.put("reportFailRate", String.format("%.2f%%", reportFailRate));

        overhead.put("totalInterceptTimeMs", totalInterceptMs);
        overhead.put("uptimeSeconds", uptimeSeconds);

        return overhead;
    }

    /**
     * 估算 Agent 自身内存占用
     */
    private Map<String, Object> estimateAgentMemory() {
        Map<String, Object> memory = new LinkedHashMap<>();

        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryMXBean.getHeapMemoryUsage();
        MemoryUsage nonHeapUsage = memoryMXBean.getNonHeapMemoryUsage();

        // Agent 线程数估算（以 hotspot- 前缀的守护线程）
        int agentThreadCount = 0;
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        for (ThreadInfo info : threadMXBean.dumpAllThreads(false, false)) {
            if (info.getThreadName().startsWith("hotspot-")) {
                agentThreadCount++;
            }
        }

        memory.put("heapUsedMB", heapUsage.getUsed() / 1024 / 1024);
        memory.put("nonHeapUsedMB", nonHeapUsage.getUsed() / 1024 / 1024);
        memory.put("agentThreadCount", agentThreadCount);

        return memory;
    }

    // ==================== 同步到 MetricsExporter ====================

    /**
     * 将当前统计值同步到 MetricsExporter（用于 Prometheus 导出）
     * <p>
     * 建议在定时任务中定期调用
     * </p>
     */
    public void syncToMetricsExporter() {
        MetricsExporter exporter = MetricsExporter.getInstance();

        // 字节码增强指标
        exporter.setGauge("agent_transformed_classes", transformedClassCount.get());
        exporter.setGauge("agent_intercepted_methods", interceptedMethodCount.get());
        exporter.setGauge("agent_transform_fail_count", transformFailCount.get());

        // 上报指标
        exporter.setGauge("agent_report_count", reportCount.get());
        exporter.setGauge("agent_report_data_count", reportDataCount.get());
        exporter.setGauge("agent_report_fail_count", reportFailCount.get());

        // 拦截执行指标
        exporter.setGauge("agent_intercept_invoke_count", interceptInvokeCount.get());
        exporter.setGauge("agent_intercept_exception_count", interceptExceptionCount.get());

        // 插件指标
        exporter.setGauge("agent_registered_plugins", registeredPluginCount.get());
    }

    /**
     * 获取 Agent 启动时间
     */
    public long getStartTimeMs() {
        return startTimeMs;
    }
}