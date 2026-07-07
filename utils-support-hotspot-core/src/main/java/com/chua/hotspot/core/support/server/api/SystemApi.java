package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.io.File;
import java.lang.management.*;
import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;

/**
 * 系统信息 API
 * <p>
 * 提供系统和 JVM 运行环境的概览信息
 * </p>
 *
 * @author CH
 * @version 4.0.0.37
 * @since 2024/12/16
 */
public class SystemApi implements ApiEndpoint {

    @Override
    public String name() {
        return "system";
    }

    @Override
    public String description() {
        return "获取系统概览信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        // 主机信息
        try {
            InetAddress localHost = InetAddress.getLocalHost();
            result.put("hostname", localHost.getHostName());
            result.put("hostAddress", localHost.getHostAddress());
        } catch (Exception e) {
            result.put("hostname", "unknown");
            result.put("hostAddress", "unknown");
        }
        
        // 操作系统信息
        OperatingSystemMXBean osMXBean = ManagementFactory.getOperatingSystemMXBean();
        result.put("osName", osMXBean.getName());
        result.put("osVersion", osMXBean.getVersion());
        result.put("osArch", osMXBean.getArch());
        result.put("availableProcessors", osMXBean.getAvailableProcessors());
        result.put("systemLoadAverage", osMXBean.getSystemLoadAverage());
        
        // JVM 信息
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        result.put("jvmName", runtimeMXBean.getVmName());
        result.put("jvmVersion", runtimeMXBean.getVmVersion());
        result.put("jvmVendor", runtimeMXBean.getVmVendor());
        result.put("javaVersion", System.getProperty("java.version"));
        result.put("javaHome", System.getProperty("java.home"));
        result.put("startTime", runtimeMXBean.getStartTime());
        result.put("uptime", runtimeMXBean.getUptime());
        result.put("pid", getPid());
        
        // 内存概览
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryMXBean.getHeapMemoryUsage();
        result.put("heapMemoryUsed", heapUsage.getUsed());
        result.put("heapMemoryMax", heapUsage.getMax());
        result.put("heapMemoryCommitted", heapUsage.getCommitted());
        
        // 线程概览
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        result.put("threadCount", threadMXBean.getThreadCount());
        result.put("peakThreadCount", threadMXBean.getPeakThreadCount());
        
        // 类加载概览
        ClassLoadingMXBean classLoadingMXBean = ManagementFactory.getClassLoadingMXBean();
        result.put("loadedClassCount", classLoadingMXBean.getLoadedClassCount());
        
        // 磁盘信息
        File[] roots = File.listRoots();
        long totalSpace = 0;
        long freeSpace = 0;
        for (File root : roots) {
            totalSpace += root.getTotalSpace();
            freeSpace += root.getFreeSpace();
        }
        result.put("diskTotal", totalSpace);
        result.put("diskFree", freeSpace);
        result.put("diskUsed", totalSpace - freeSpace);
        
        // 尝试获取更详细的系统信息（如果是 Sun/Oracle JVM）
        try {
            if (osMXBean instanceof com.sun.management.OperatingSystemMXBean) {
                com.sun.management.OperatingSystemMXBean sunOsMXBean = 
                    (com.sun.management.OperatingSystemMXBean) osMXBean;
                result.put("processCpuLoad", formatPercent(sunOsMXBean.getProcessCpuLoad()));
                result.put("systemCpuLoad", formatPercent(sunOsMXBean.getSystemCpuLoad()));
                result.put("totalPhysicalMemory", sunOsMXBean.getTotalPhysicalMemorySize());
                result.put("freePhysicalMemory", sunOsMXBean.getFreePhysicalMemorySize());
                result.put("usedPhysicalMemory", sunOsMXBean.getTotalPhysicalMemorySize() - sunOsMXBean.getFreePhysicalMemorySize());
            }
        } catch (Exception e) {
            // 忽略，可能不是 Sun/Oracle JVM
        }
        
        // 应用信息
        result.put("userDir", System.getProperty("user.dir"));
        result.put("userName", System.getProperty("user.name"));
        
        return result;
    }
    
    /**
     * 获取进程 ID
     */
    private long getPid() {
        try {
            String name = ManagementFactory.getRuntimeMXBean().getName();
            return Long.parseLong(name.split("@")[0]);
        } catch (Exception e) {
            return -1;
        }
    }
    
    /**
     * 格式化百分比
     */
    private double formatPercent(double value) {
        if (value < 0) return 0;
        return Math.round(value * 10000) / 100.0;
    }
}
