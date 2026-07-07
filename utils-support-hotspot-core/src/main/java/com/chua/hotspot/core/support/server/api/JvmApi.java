package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.pusher.DataPusher;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.lang.management.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * JVM 信息 API
 * <p>
 * 提供 JVM 运行时信息，包括内存、GC、线程、类加载等
 * </p>
 * <p>
 * 注意：JVM 定时推送已由 {@link DataPusher} 统一管理
 * </p>
 *
 * @author CH
 * @version 4.0.0.38
 * @since 2024/12/16
 */
public class JvmApi implements ApiEndpoint {

    // 收集 JVM 信息
    private static Map<String, Object> collectJvmInfo() {
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
        } catch (Exception e) {
            // 忽略
        }
        
        return result;
    }

    @Override
    public String name() {
        return "jvm";
    }

    @Override
    public String description() {
        return "获取 JVM 运行时信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "info");
        
        // GC 触发
        if ("gc".equals(action)) {
            System.gc();
            Map<String, Object> gcResult = new HashMap<>();
            gcResult.put("success", true);
            gcResult.put("message", "GC 已触发");
            return gcResult;
        }
        
        return collectJvmInfo();
        
    }
}
