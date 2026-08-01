package com.chua.hotspot.core.support.pusher;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.ServerFactory;

import java.lang.management.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 统一数据推送器
 * <p>
 * 集中管理所有模块的 WebSocket 数据推送
 * </p>
 *
 * @author CH
 * @version 4.0.0.38
 * @since 2024/12/16
 */
public class DataPusher {

    /**
     * 单例实例
     */
    private static final DataPusher INSTANCE = new DataPusher();

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 调度线程池大小
     */
    private static final int SCHEDULER_POOL_SIZE = 2;

    /**
     * 推送线程名称
     */
    private static final String PUSHER_THREAD_NAME = "data-pusher";

    /**
     * JVM 信息推送初始延迟（秒）
     */
    private static final int JVM_PUSH_INITIAL_DELAY_SECONDS = 0;

    /**
     * JVM 信息推送间隔（秒）
     */
    private static final int JVM_PUSH_INTERVAL_SECONDS = 5;

    /**
     * 系统信息推送初始延迟（秒）
     */
    private static final int SYSTEM_PUSH_INITIAL_DELAY_SECONDS = 0;

    /**
     * 系统信息推送间隔（秒）
     */
    private static final int SYSTEM_PUSH_INTERVAL_SECONDS = 10;

    /**
     * QPS 信息推送初始延迟（秒）
     */
    private static final int QPS_PUSH_INITIAL_DELAY_SECONDS = 3;

    /**
     * QPS 信息推送间隔（秒）
     */
    private static final int QPS_PUSH_INTERVAL_SECONDS = 3;

    /**
     * 线程信息推送初始延迟（秒）
     */
    private static final int THREAD_PUSH_INITIAL_DELAY_SECONDS = 0;

    /**
     * 线程信息推送间隔（秒）
     */
    private static final int THREAD_PUSH_INTERVAL_SECONDS = 5;

    /**
     * 推送定时器（单一线程池管理所有推送任务）
     */
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(SCHEDULER_POOL_SIZE, r -> {
        Thread t = new Thread(r, PUSHER_THREAD_NAME);
        t.setDaemon(true);
        return t;
    });

    /**
     * JVM 信息推送任务句柄
     */
    private ScheduledFuture<?> jvmPushTask;

    /**
     * 系统信息推送任务句柄
     */
    private ScheduledFuture<?> systemPushTask;

    /**
     * QPS 信息推送任务句柄
     */
    private ScheduledFuture<?> qpsPushTask;

    /**
     * 线程信息推送任务句柄
     */
    private ScheduledFuture<?> threadPushTask;

    /**
     * 启动标志（保证只启动一次）
     */
    private final AtomicBoolean started = new AtomicBoolean(false);

    private DataPusher() {
    }

    public static DataPusher getInstance() {
        return INSTANCE;
    }

    /**
     * 启动所有推送任务
     */
    public synchronized void start() {
        if (started.compareAndSet(false, true)) {
            // JVM 信息推送
            jvmPushTask = scheduler.scheduleAtFixedRate(this::pushJvmInfo,
                    JVM_PUSH_INITIAL_DELAY_SECONDS, JVM_PUSH_INTERVAL_SECONDS, TimeUnit.SECONDS);

            // 系统信息推送
            systemPushTask = scheduler.scheduleAtFixedRate(this::pushSystemInfo,
                    SYSTEM_PUSH_INITIAL_DELAY_SECONDS, SYSTEM_PUSH_INTERVAL_SECONDS, TimeUnit.SECONDS);

            // QPS 信息推送
            qpsPushTask = scheduler.scheduleAtFixedRate(this::pushContainerQps,
                    QPS_PUSH_INITIAL_DELAY_SECONDS, QPS_PUSH_INTERVAL_SECONDS, TimeUnit.SECONDS);

            // 线程信息推送
            threadPushTask = scheduler.scheduleAtFixedRate(this::pushThreadInfo,
                    THREAD_PUSH_INITIAL_DELAY_SECONDS, THREAD_PUSH_INTERVAL_SECONDS, TimeUnit.SECONDS);

            LOGGER.info("数据推送器已启动");
        }
    }

    /**
     * 停止所有推送任务
     */
    public synchronized void stop() {
        if (started.compareAndSet(true, false)) {
            if (jvmPushTask != null) {
                jvmPushTask.cancel(false);
            }
            if (systemPushTask != null) {
                systemPushTask.cancel(false);
            }
            if (qpsPushTask != null) {
                qpsPushTask.cancel(false);
            }
            if (threadPushTask != null) {
                threadPushTask.cancel(false);
            }
            LOGGER.info("数据推送器已停止");
        }
    }

    /**
     * 推送 JVM 信息
     */
    private void pushJvmInfo() {
        try {
            Map<String, Object> data = collectJvmInfo();
            ServerFactory.getInstance().publish(ModuleType.JVM, "JVM_INFO", data);
        } catch (Exception e) {
            LOGGER.debug("JVM 信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送系统信息
     */
    private void pushSystemInfo() {
        try {
            Map<String, Object> data = collectSystemInfo();
            ServerFactory.getInstance().publish(ModuleType.PERFORMANCE, "SYSTEM_INFO", data);
        } catch (Exception e) {
            LOGGER.debug("系统信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送容器 QPS 信息
     */
    private void pushContainerQps() {
        try {
            com.chua.hotspot.core.support.recorder.ContainerQpsRecorder recorder = 
                com.chua.hotspot.core.support.recorder.ContainerQpsRecorder.getInstance();
            
            Map<String, Object> data = new HashMap<>();
            data.put("status", "ok");
            data.put("data", recorder.getAllContainerStats());
            data.put("currentContainer", recorder.detectCurrentContainer());
            data.put("timestamp", System.currentTimeMillis());
            
            ServerFactory.getInstance().publish(ModuleType.PERFORMANCE, "QPS_CONTAINER", data);
        } catch (Exception e) {
            LOGGER.debug("QPS 信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送线程信息
     */
    private void pushThreadInfo() {
        try {
            Map<String, Object> data = collectThreadInfo();
            ServerFactory.getInstance().publish(ModuleType.JVM, "THREAD_INFO", data);
        } catch (Exception e) {
            LOGGER.debug("线程信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送异常信息
     */
    public void pushException(Map<String, Object> exceptionData) {
        try {
            ServerFactory.getInstance().publish(ModuleType.EXCEPTION, "EXCEPTION_UPDATE", exceptionData);
        } catch (Exception e) {
            LOGGER.debug("异常信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送 QPS 信息
     */
    public void pushQps(String type, Map<String, Object> qpsData) {
        try {
            ServerFactory.getInstance().publish(ModuleType.PERFORMANCE, "QPS_" + type, qpsData);
        } catch (Exception e) {
            LOGGER.debug("QPS 信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送 HTTP 性能信息
     */
    public void pushHttpPerformance(Map<String, Object> perfData) {
        try {
            ServerFactory.getInstance().publish(ModuleType.PERFORMANCE, "HTTP_PERF_UPDATE", perfData);
        } catch (Exception e) {
            LOGGER.debug("HTTP 性能信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送 SQL 信息
     */
    public void pushSql(Map<String, Object> sqlData) {
        try {
            ServerFactory.getInstance().publish(ModuleType.SQL, "SQL_RECORD", sqlData);
        } catch (Exception e) {
            LOGGER.debug("SQL 信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送链路追踪信息
     */
    public void pushTrace(Map<String, Object> traceData) {
        try {
            ServerFactory.getInstance().publish(ModuleType.TRACE, "AGENT_TRACE", traceData);
        } catch (Exception e) {
            LOGGER.debug("链路追踪信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送日志信息
     */
    public void pushLog(Map<String, Object> logData) {
        try {
            ServerFactory.getInstance().publish(ModuleType.LOG, "AGENT_LOG", logData);
        } catch (Exception e) {
            LOGGER.debug("日志信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 推送服务实例信息
     */
    public void pushServer(Map<String, Object> serverData) {
        try {
            ServerFactory.getInstance().publish(ModuleType.SERVER, "AGENT_SERVER", serverData);
        } catch (Exception e) {
            LOGGER.debug("服务实例信息推送失败: {}", e.getMessage());
        }
    }

    /**
     * 通用推送方法
     */
    public void push(ModuleType module, String event, Object data) {
        try {
            ServerFactory.getInstance().publish(module, event, data);
        } catch (Exception e) {
            LOGGER.debug("数据推送失败: module={}, event={}, error={}", module, event, e.getMessage());
        }
    }

    /**
     * 收集 JVM 信息
     */
    private Map<String, Object> collectJvmInfo() {
        Map<String, Object> result = new HashMap<>();

        // 内存信息
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryMXBean.getHeapMemoryUsage();
        MemoryUsage nonHeapUsage = memoryMXBean.getNonHeapMemoryUsage();

        result.put("heapMemoryUsed", heapUsage.getUsed());
        result.put("heapMemoryMax", heapUsage.getMax());
        result.put("heapMemoryCommitted", heapUsage.getCommitted());
        result.put("heapMemoryInit", heapUsage.getInit());

        result.put("nonHeapMemoryUsed", nonHeapUsage.getUsed());
        result.put("nonHeapMemoryMax", nonHeapUsage.getMax());
        result.put("nonHeapMemoryCommitted", nonHeapUsage.getCommitted());

        // 线程信息
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        result.put("threadCount", threadMXBean.getThreadCount());
        result.put("peakThreadCount", threadMXBean.getPeakThreadCount());
        result.put("daemonThreadCount", threadMXBean.getDaemonThreadCount());
        result.put("totalStartedThreadCount", threadMXBean.getTotalStartedThreadCount());

        // 类加载信息
        ClassLoadingMXBean classLoadingMXBean = ManagementFactory.getClassLoadingMXBean();
        result.put("loadedClassCount", classLoadingMXBean.getLoadedClassCount());
        result.put("totalLoadedClassCount", classLoadingMXBean.getTotalLoadedClassCount());
        result.put("unloadedClassCount", classLoadingMXBean.getUnloadedClassCount());

        // GC 信息
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        long youngGcCount = 0;
        long youngGcTime = 0;
        long fullGcCount = 0;
        long fullGcTime = 0;

        for (GarbageCollectorMXBean gcBean : gcBeans) {
            String gcName = gcBean.getName().toLowerCase();
            if (gcName.contains("young") || gcName.contains("minor") ||
                    gcName.contains("copy") || gcName.contains("scavenge") ||
                    gcName.contains("ps scavenge") || gcName.contains("parnew") ||
                    gcName.contains("g1 young")) {
                youngGcCount += gcBean.getCollectionCount();
                youngGcTime += gcBean.getCollectionTime();
            } else {
                fullGcCount += gcBean.getCollectionCount();
                fullGcTime += gcBean.getCollectionTime();
            }
        }

        result.put("youngGcCount", youngGcCount);
        result.put("youngGcTime", youngGcTime);
        result.put("fullGcCount", fullGcCount);
        result.put("fullGcTime", fullGcTime);

        // 运行时信息
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        result.put("vmName", runtimeMXBean.getVmName());
        result.put("vmVersion", runtimeMXBean.getVmVersion());
        result.put("startTime", runtimeMXBean.getStartTime());
        result.put("uptime", runtimeMXBean.getUptime());

        // CPU 信息
        OperatingSystemMXBean osMXBean = ManagementFactory.getOperatingSystemMXBean();
        result.put("availableProcessors", osMXBean.getAvailableProcessors());

        try {
            if (osMXBean instanceof com.sun.management.OperatingSystemMXBean) {
                com.sun.management.OperatingSystemMXBean sunOsMXBean =
                        (com.sun.management.OperatingSystemMXBean) osMXBean;
                result.put("processCpuLoad", sunOsMXBean.getProcessCpuLoad());
                result.put("systemCpuLoad", sunOsMXBean.getSystemCpuLoad());
            }
        } catch (Exception ignored) {
        }

        return result;
    }

    /**
     * 收集线程信息
     */
    private Map<String, Object> collectThreadInfo() {
        Map<String, Object> result = new HashMap<>();
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        ThreadInfo[] threadInfos = threadMXBean.dumpAllThreads(false, false);
        
        List<Map<String, Object>> threadList = new ArrayList<>();
        for (ThreadInfo info : threadInfos) {
            Map<String, Object> threadData = new HashMap<>();
            threadData.put("threadId", info.getThreadId());
            threadData.put("threadName", info.getThreadName());
            threadData.put("threadState", info.getThreadState().name());
            threadData.put("blockedCount", info.getBlockedCount());
            threadData.put("blockedTime", info.getBlockedTime());
            threadData.put("waitedCount", info.getWaitedCount());
            threadData.put("waitedTime", info.getWaitedTime());
            threadData.put("lockName", info.getLockName());
            threadData.put("lockOwnerId", info.getLockOwnerId());
            threadData.put("lockOwnerName", info.getLockOwnerName());
            threadData.put("inNative", info.isInNative());
            threadData.put("suspended", info.isSuspended());
            threadList.add(threadData);
        }
        
        result.put("threads", threadList);
        result.put("threadCount", threadMXBean.getThreadCount());
        result.put("peakThreadCount", threadMXBean.getPeakThreadCount());
        result.put("daemonThreadCount", threadMXBean.getDaemonThreadCount());
        result.put("totalStartedThreadCount", threadMXBean.getTotalStartedThreadCount());
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }

    /**
     * 收集系统信息
     */
    private Map<String, Object> collectSystemInfo() {
        Map<String, Object> result = new HashMap<>();

        // 操作系统信息
        OperatingSystemMXBean osMXBean = ManagementFactory.getOperatingSystemMXBean();
        result.put("osName", osMXBean.getName());
        result.put("osVersion", osMXBean.getVersion());
        result.put("osArch", osMXBean.getArch());
        result.put("availableProcessors", osMXBean.getAvailableProcessors());
        result.put("systemLoadAverage", osMXBean.getSystemLoadAverage());

        try {
            if (osMXBean instanceof com.sun.management.OperatingSystemMXBean) {
                com.sun.management.OperatingSystemMXBean sunOsMXBean =
                        (com.sun.management.OperatingSystemMXBean) osMXBean;
                result.put("totalPhysicalMemory", sunOsMXBean.getTotalPhysicalMemorySize());
                result.put("freePhysicalMemory", sunOsMXBean.getFreePhysicalMemorySize());
                result.put("processCpuLoad", sunOsMXBean.getProcessCpuLoad());
                result.put("systemCpuLoad", sunOsMXBean.getSystemCpuLoad());
            }
        } catch (Exception ignored) {
        }

        // 运行时信息
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        result.put("pid", runtimeMXBean.getName().split("@")[0]);
        result.put("uptime", runtimeMXBean.getUptime());

        // 主机名
        try {
            result.put("hostname", java.net.InetAddress.getLocalHost().getHostName());
        } catch (Exception e) {
            result.put("hostname", "unknown");
        }

        return result;
    }
}
