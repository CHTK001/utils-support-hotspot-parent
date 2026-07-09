package com.chua.hotspot.core.support.health;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServerFactory;
import com.chua.hotspot.core.support.storage.SqliteStorage;

import java.lang.management.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 健康检查器
 * <p>
 * 对 Agent 自身及依赖组件执行健康检查，支持：
 * <ul>
 *   <li>内置检查项：JVM 内存、线程、类加载、SQLite 存储、HTTP 服务器、WebSocket 服务器</li>
 *   <li>自定义检查项：通过 addChecker() 注册</li>
 *   <li>聚合状态：综合所有检查项得出整体健康状态</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class HealthChecker {

    private static final HealthChecker INSTANCE = new HealthChecker();

    private final LogFactory logger = LogFactory.getInstance();

    /** 自定义检查器列表 */
    private final List<HealthCheck> customCheckers = new CopyOnWriteArrayList<>();

    private HealthChecker() {
    }

    public static HealthChecker getInstance() {
        return INSTANCE;
    }

    /**
     * 健康检查函数式接口
     */
    @FunctionalInterface
    public interface HealthCheck {
        /**
         * 执行健康检查
         *
         * @return 健康状态
         */
        HealthStatus check();
    }

    // ==================== 检查项注册 ====================

    /**
     * 添加自定义健康检查
     */
    public void addChecker(HealthCheck checker) {
        customCheckers.add(checker);
    }

    /**
     * 移除自定义健康检查
     */
    public void removeChecker(HealthCheck checker) {
        customCheckers.remove(checker);
    }

    // ==================== 健康检查执行 ====================

    /**
     * 执行全部健康检查
     *
     * @return 检查结果列表
     */
    public List<HealthStatus> checkAll() {
        List<HealthStatus> results = new ArrayList<>();

        // 内置检查项
        results.add(checkJvmMemory());
        results.add(checkJvmThreads());
        results.add(checkClassLoading());
        results.add(checkSqliteStorage());
        results.add(checkHttpServer());
        results.add(checkWebSocketServer());
        results.add(checkReportFactory());

        // 自定义检查项
        for (HealthCheck checker : customCheckers) {
            try {
                results.add(checker.check());
            } catch (Exception e) {
                results.add(HealthStatus.down("custom", e.getMessage(), 0));
            }
        }

        return results;
    }

    /**
     * 获取聚合健康状态
     *
     * @return 整体状态
     */
    public HealthStatus.State getOverallState() {
        List<HealthStatus> results = checkAll();
        boolean hasDown = false;
        boolean hasDegraded = false;

        for (HealthStatus status : results) {
            if (status.isDown()) hasDown = true;
            if (status.isDegraded()) hasDegraded = true;
        }

        if (hasDown) return HealthStatus.State.DOWN;
        if (hasDegraded) return HealthStatus.State.DEGRADED;
        return HealthStatus.State.UP;
    }

    /**
     * 获取健康摘要
     */
    public Map<String, Object> getHealthSummary() {
        List<HealthStatus> results = checkAll();
        Map<String, Object> summary = new LinkedHashMap<>();

        HealthStatus.State overall = getOverallState();
        summary.put("status", overall.name());
        summary.put("timestamp", System.currentTimeMillis());

        List<Map<String, Object>> components = new ArrayList<>();
        for (HealthStatus status : results) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", status.getName());
            item.put("status", status.getState().name());
            item.put("responseTime", status.getResponseTimeMs() + "ms");
            if (status.getMessage() != null) {
                item.put("message", status.getMessage());
            }
            if (status.getError() != null) {
                item.put("error", status.getError());
            }
            components.add(item);
        }
        summary.put("components", components);

        return summary;
    }

    // ==================== 内置检查项 ====================

    /**
     * 检查 JVM 内存状态
     * <p>
     * 堆内存使用率 > 85% 为 DOWN，> 70% 为 DEGRADED
     * </p>
     */
    private HealthStatus checkJvmMemory() {
        long start = System.currentTimeMillis();
        try {
            MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
            MemoryUsage heapUsage = memoryMXBean.getHeapMemoryUsage();
            long used = heapUsage.getUsed();
            long max = heapUsage.getMax();
            double usagePercent = max > 0 ? (used * 100.0 / max) : 0;

            long rt = System.currentTimeMillis() - start;
            if (usagePercent > 85) {
                return HealthStatus.down("jvm-memory",
                    String.format("堆内存使用率 %.1f%% (>%d%%)", usagePercent, 85), rt);
            } else if (usagePercent > 70) {
                return HealthStatus.degraded("jvm-memory",
                    String.format("堆内存使用率 %.1f%% (>%d%%)", usagePercent, 70), rt);
            }
            return HealthStatus.up("jvm-memory",
                String.format("堆内存使用率 %.1f%% (%dMB/%dMB)", usagePercent, used / 1024 / 1024, max / 1024 / 1024), rt);
        } catch (Exception e) {
            return HealthStatus.down("jvm-memory", e.getMessage(), System.currentTimeMillis() - start);
        }
    }

    /**
     * 检查 JVM 线程状态
     * <p>
     * 线程数 > 500 为 DOWN，> 200 为 DEGRADED
     * </p>
     */
    private HealthStatus checkJvmThreads() {
        long start = System.currentTimeMillis();
        try {
            ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
            int threadCount = threadMXBean.getThreadCount();
            int peakThreadCount = threadMXBean.getPeakThreadCount();
            int deadlockedThreads = threadMXBean.findDeadlockedThreads() != null
                    ? threadMXBean.findDeadlockedThreads().length : 0;

            long rt = System.currentTimeMillis() - start;
            if (deadlockedThreads > 0) {
                return HealthStatus.down("jvm-threads",
                    String.format("检测到 %d 个死锁线程", deadlockedThreads), rt);
            } else if (threadCount > 500) {
                return HealthStatus.down("jvm-threads",
                    String.format("线程数 %d (>%d)", threadCount, 500), rt);
            } else if (threadCount > 200) {
                return HealthStatus.degraded("jvm-threads",
                    String.format("线程数 %d (>%d)", threadCount, 200), rt);
            }
            return HealthStatus.up("jvm-threads",
                String.format("线程数=%d, 峰值=%d", threadCount, peakThreadCount), rt);
        } catch (Exception e) {
            return HealthStatus.down("jvm-threads", e.getMessage(), System.currentTimeMillis() - start);
        }
    }

    /**
     * 检查类加载状态
     */
    private HealthStatus checkClassLoading() {
        long start = System.currentTimeMillis();
        try {
            ClassLoadingMXBean clMXBean = ManagementFactory.getClassLoadingMXBean();
            int loaded = clMXBean.getLoadedClassCount();
            long totalLoaded = clMXBean.getTotalLoadedClassCount();
            long unloaded = clMXBean.getUnloadedClassCount();

            long rt = System.currentTimeMillis() - start;
            return HealthStatus.up("class-loading",
                String.format("已加载=%d, 总计=%d, 已卸载=%d", loaded, totalLoaded, unloaded), rt);
        } catch (Exception e) {
            return HealthStatus.down("class-loading", e.getMessage(), System.currentTimeMillis() - start);
        }
    }

    /**
     * 检查 SQLite 存储状态
     */
    private HealthStatus checkSqliteStorage() {
        long start = System.currentTimeMillis();
        try {
            SqliteStorage storage = SqliteStorage.getInstance();
            java.sql.Connection conn = storage.getConnection();
            boolean healthy = conn != null && !conn.isClosed();

            long rt = System.currentTimeMillis() - start;
            if (healthy) {
                return HealthStatus.up("sqlite-storage", "SQLite 存储正常", rt);
            } else {
                return HealthStatus.down("sqlite-storage", "SQLite 连接已关闭", rt);
            }
        } catch (Exception e) {
            return HealthStatus.down("sqlite-storage", e.getMessage(), System.currentTimeMillis() - start);
        }
    }

    /**
     * 检查 HTTP 服务器状态
     */
    private HealthStatus checkHttpServer() {
        long start = System.currentTimeMillis();
        try {
            ServerFactory serverFactory = ServerFactory.getInstance();
            boolean initialized = serverFactory.isInitialized();

            long rt = System.currentTimeMillis() - start;
            if (initialized) {
                return HealthStatus.up("http-server", "HTTP 服务器运行中", rt);
            } else {
                return HealthStatus.down("http-server", "HTTP 服务器未初始化", rt);
            }
        } catch (Exception e) {
            return HealthStatus.down("http-server", e.getMessage(), System.currentTimeMillis() - start);
        }
    }

    /**
     * 检查 WebSocket 服务器状态
     */
    private HealthStatus checkWebSocketServer() {
        long start = System.currentTimeMillis();
        try {
            ServerFactory serverFactory = ServerFactory.getInstance();
            boolean initialized = serverFactory.isInitialized();
            int wsPort = serverFactory.getWebSocketPort();

            long rt = System.currentTimeMillis() - start;
            if (initialized && wsPort > 0) {
                return HealthStatus.up("websocket-server", "WebSocket 服务器运行中, port=" + wsPort, rt);
            } else {
                return HealthStatus.down("websocket-server", "WebSocket 服务器未运行", rt);
            }
        } catch (Exception e) {
            return HealthStatus.down("websocket-server", e.getMessage(), System.currentTimeMillis() - start);
        }
    }

    /**
     * 检查数据上报工厂状态
     */
    private HealthStatus checkReportFactory() {
        long start = System.currentTimeMillis();
        try {
            ReportFactory reportFactory = ReportFactory.getInstance();
            // ReportFactory 存在即为健康
            long rt = System.currentTimeMillis() - start;
            return HealthStatus.up("report-factory", "数据上报工厂正常", rt);
        } catch (Exception e) {
            return HealthStatus.down("report-factory", e.getMessage(), System.currentTimeMillis() - start);
        }
    }
}