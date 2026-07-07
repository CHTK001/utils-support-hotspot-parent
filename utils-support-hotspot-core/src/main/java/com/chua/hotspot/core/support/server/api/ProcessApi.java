package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.HashMap;
import java.util.Map;

/**
 * 进程信息 API
 * <p>
 * 提供 JVM 进程信息查询接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ProcessApi implements ApiEndpoint {

    @Override
    public String name() {
        return "process";
    }

    @Override
    public String description() {
        return "获取 JVM 进程信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        
        Map<String, Object> result = new HashMap<>();
        result.put("name", runtimeMXBean.getName());
        result.put("pid", getPid(runtimeMXBean));
        result.put("vmName", runtimeMXBean.getVmName());
        result.put("vmVersion", runtimeMXBean.getVmVersion());
        result.put("vmVendor", runtimeMXBean.getVmVendor());
        result.put("startTime", runtimeMXBean.getStartTime());
        result.put("uptime", runtimeMXBean.getUptime());
        result.put("inputArguments", runtimeMXBean.getInputArguments());
        result.put("classPath", runtimeMXBean.getClassPath());
        result.put("libraryPath", runtimeMXBean.getLibraryPath());
        
        // 内存信息
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memory = new HashMap<>();
        memory.put("maxMemory", runtime.maxMemory());
        memory.put("totalMemory", runtime.totalMemory());
        memory.put("freeMemory", runtime.freeMemory());
        memory.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
        result.put("memory", memory);
        
        // 处理器信息
        result.put("availableProcessors", runtime.availableProcessors());
        
        return result;
    }

    /**
     * 获取进程 ID
     *
     * @param runtimeMXBean RuntimeMXBean
     * @return 进程 ID
     */
    private long getPid(RuntimeMXBean runtimeMXBean) {
        String name = runtimeMXBean.getName();
        int index = name.indexOf('@');
        if (index > 0) {
            try {
                return Long.parseLong(name.substring(0, index));
            } catch (NumberFormatException ignored) {
            }
        }
        return -1;
    }
}
