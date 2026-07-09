package com.chua.hotspot.testagent;

import com.chua.hotspot.core.support.monitor.AgentSelfMonitor;

import java.lang.instrument.Instrumentation;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * AgentSelfMonitor 监控功能验证 Agent
 * <p>
 * 使用方式：
 * <pre>
 * # 方式1：启动时加载
 * java -javaagent:utils-support-hotspot-test-agent.jar=monitor -jar your-app.jar
 *
 * # 方式2：运行时attach
 * VirtualMachine vm = VirtualMachine.attach(pid);
 * vm.loadAgent("/path/to/utils-support-hotspot-test-agent.jar=monitor");
 * </pre>
 * <p>
 * 测试内容：
 * 1. 字节码增强统计（recordTransform / recordTransformFail）
 * 2. 数据上报统计（recordReport / recordReportFail）
 * 3. 拦截方法执行统计（recordIntercept / recordInterceptException）
 * 4. 插件注册统计（recordPluginRegister）
 * 5. 监控摘要输出（getMonitorSummary）
 * 6. 性能开销评估（getPerformanceOverhead）
 * 7. 并发安全性验证
 *
 * @author CH
 * @since 4.0.0.38
 */
public class AgentSelfMonitorTestAgent {

    // ==================== Agent 入口 ====================

    /**
     * premain 入口（-javaagent 方式加载）
     */
    public static void premain(String args, Instrumentation inst) {
        System.out.println("============================================");
        System.out.println("  AgentSelfMonitor 监控功能验证 Agent 启动");
        System.out.println("============================================");
        System.out.println();

        try {
            runAllTests();
        } catch (Exception e) {
            System.err.println("[ERROR] 测试执行异常: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println();
        System.out.println("============================================");
        System.out.println("  AgentSelfMonitor 监控功能验证 Agent 完成");
        System.out.println("============================================");
    }

    /**
     * agentmain 入口（运行时 attach 方式加载）
     */
    public static void agentmain(String args, Instrumentation inst) {
        premain(args, inst);
    }

    // ==================== 测试执行 ====================

    private static void runAllTests() {
        int passed = 0;
        int failed = 0;

        AgentSelfMonitor monitor = AgentSelfMonitor.getInstance();

        // 测试1：字节码增强统计
        System.out.println("--- 测试1: 字节码增强统计 ---");
        try {
            monitor.recordTransform("com.example.ServiceA", 3, 5_000_000L);
            monitor.recordTransform("com.example.ServiceB", 5, 8_000_000L);
            monitor.recordTransform("com.example.DaoC", 2, 3_000_000L);
            monitor.recordTransformFail("com.example.BrokenClass");

            Map<String, Object> summary = monitor.getMonitorSummary();
            @SuppressWarnings("unchecked")
            Map<String, Object> transform = (Map<String, Object>) summary.get("transform");

            assertEq("transformedClassCount", 3L, transform.get("transformedClassCount"));
            assertEq("interceptedMethodCount", 10L, transform.get("interceptedMethodCount"));
            assertEq("transformFailCount", 1L, transform.get("transformFailCount"));

            System.out.println("[PASS] 字节码增强统计正确");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] 字节码增强统计: " + e.getMessage());
            failed++;
        }

        // 测试2：数据上报统计
        System.out.println("--- 测试2: 数据上报统计 ---");
        try {
            monitor.recordReport(50, 120L);
            monitor.recordReport(30, 80L);
            monitor.recordReportFail();

            Map<String, Object> summary = monitor.getMonitorSummary();
            @SuppressWarnings("unchecked")
            Map<String, Object> report = (Map<String, Object>) summary.get("report");

            assertEq("reportCount", 2L, report.get("reportCount"));
            assertEq("reportDataCount", 80L, report.get("reportDataCount"));
            assertEq("reportFailCount", 1L, report.get("reportFailCount"));

            System.out.println("[PASS] 数据上报统计正确");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] 数据上报统计: " + e.getMessage());
            failed++;
        }

        // 测试3：拦截方法执行统计
        System.out.println("--- 测试3: 拦截方法执行统计 ---");
        try {
            monitor.recordIntercept(500_000L);  // 0.5ms
            monitor.recordIntercept(1_200_000L); // 1.2ms
            monitor.recordIntercept(300_000L);   // 0.3ms
            monitor.recordInterceptException();

            Map<String, Object> summary = monitor.getMonitorSummary();
            @SuppressWarnings("unchecked")
            Map<String, Object> intercept = (Map<String, Object>) summary.get("intercept");

            assertEq("invokeCount", 3L, intercept.get("invokeCount"));
            assertEq("exceptionCount", 1L, intercept.get("exceptionCount"));

            System.out.println("[PASS] 拦截方法执行统计正确");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] 拦截方法执行统计: " + e.getMessage());
            failed++;
        }

        // 测试4：插件注册统计
        System.out.println("--- 测试4: 插件注册统计 ---");
        try {
            monitor.recordPluginRegister("MysqlPlugin");
            monitor.recordPluginRegister("RedisPlugin");
            monitor.recordPluginRegister("KafkaPlugin");
            monitor.recordPluginRegister("MysqlPlugin"); // 重复注册

            Map<String, Object> summary = monitor.getMonitorSummary();
            @SuppressWarnings("unchecked")
            Map<String, Object> plugin = (Map<String, Object>) summary.get("plugin");

            assertEq("registeredPluginCount", 4L, plugin.get("registeredPluginCount"));

            @SuppressWarnings("unchecked")
            Map<String, Long> plugins = (Map<String, Long>) plugin.get("plugins");
            assertEq("MysqlPlugin count", 2L, plugins.get("MysqlPlugin"));
            assertEq("RedisPlugin count", 1L, plugins.get("RedisPlugin"));
            assertEq("KafkaPlugin count", 1L, plugins.get("KafkaPlugin"));

            System.out.println("[PASS] 插件注册统计正确");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] 插件注册统计: " + e.getMessage());
            failed++;
        }

        // 测试5：监控摘要完整性
        System.out.println("--- 测试5: 监控摘要完整性 ---");
        try {
            Map<String, Object> summary = monitor.getMonitorSummary();

            // 验证所有关键section都存在
            String[] requiredKeys = {"timestamp", "uptimeSeconds", "transform", "report", "intercept", "plugin", "memoryEstimate"};
            for (String key : requiredKeys) {
                if (!summary.containsKey(key)) {
                    throw new AssertionError("缺少关键key: " + key);
                }
            }

            System.out.println("[PASS] 监控摘要包含所有关键section");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] 监控摘要完整性: " + e.getMessage());
            failed++;
        }

        // 测试6：性能开销评估
        System.out.println("--- 测试6: 性能开销评估 ---");
        try {
            Map<String, Object> overhead = monitor.getPerformanceOverhead();

            String[] requiredKeys = {"avgInterceptOverheadNs", "interceptsPerSecond",
                    "overheadPercent", "transformFailRate", "reportFailRate",
                    "totalInterceptTimeMs", "uptimeSeconds"};
            for (String key : requiredKeys) {
                if (!overhead.containsKey(key)) {
                    throw new AssertionError("缺少关键key: " + key);
                }
            }

            System.out.println("[INFO] 性能开销评估: " + overhead);
            System.out.println("[PASS] 性能开销评估输出正确");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] 性能开销评估: " + e.getMessage());
            failed++;
        }

        // 测试7：并发安全性验证
        System.out.println("--- 测试7: 并发安全性验证 ---");
        try {
            // 创建新的monitor实例进行并发测试（单例，复用同一个）
            int threadCount = 8;
            int opsPerThread = 1000;
            CountDownLatch latch = new CountDownLatch(threadCount);
            AtomicInteger errors = new AtomicInteger(0);

            ExecutorService executor = Executors.newFixedThreadPool(threadCount);
            for (int t = 0; t < threadCount; t++) {
                final int threadId = t;
                executor.submit(() -> {
                    try {
                        for (int i = 0; i < opsPerThread; i++) {
                            // 模拟各类并发操作
                            monitor.recordIntercept(1000L);
                            monitor.recordTransform("com.example.ThreadClass" + threadId + "_" + i, 1, 1000L);
                            monitor.recordReport(1, 10L);
                            monitor.recordPluginRegister("ConcurrentPlugin" + threadId);
                        }
                    } catch (Exception e) {
                        errors.incrementAndGet();
                    } finally {
                        latch.countDown();
                    }
                });
            }

            latch.await(30, TimeUnit.SECONDS);
            executor.shutdown();

            if (errors.get() > 0) {
                throw new AssertionError("并发测试出现 " + errors.get() + " 个错误");
            }

            // 验证计数器值
            Map<String, Object> summary = monitor.getMonitorSummary();
            @SuppressWarnings("unchecked")
            Map<String, Object> intercept = (Map<String, Object>) summary.get("intercept");
            long totalInterceptCount = (Long) intercept.get("invokeCount");

            // 3（之前测试的）+ threadCount * opsPerThread
            long expectedMin = 3 + (long) threadCount * opsPerThread;
            if (totalInterceptCount < expectedMin) {
                throw new AssertionError("并发计数不完整: 期望至少 " + expectedMin + ", 实际 " + totalInterceptCount);
            }

            System.out.println("[INFO] 并发测试: " + threadCount + "线程 x " + opsPerThread + "操作/线程");
            System.out.println("[INFO] 总拦截次数: " + totalInterceptCount);
            System.out.println("[PASS] 并发安全性验证通过");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] 并发安全性验证: " + e.getMessage());
            failed++;
        } catch (Exception e) {
            System.out.println("[FAIL] 并发安全性验证异常: " + e.getMessage());
            failed++;
        }

        // 测试8：监控摘要格式化输出
        System.out.println("--- 测试8: 监控摘要格式化输出 ---");
        try {
            Map<String, Object> summary = monitor.getMonitorSummary();
            printSummary(summary);
            System.out.println("[PASS] 监控摘要格式化输出完成");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] 监控摘要格式化输出异常: " + e.getMessage());
            failed++;
        }

        // 汇总
        System.out.println();
        System.out.println("========== 测试结果汇总 ==========");
        System.out.println("通过: " + passed);
        System.out.println("失败: " + failed);
        System.out.println("总计: " + (passed + failed));
        System.out.println("==================================");
    }

    // ==================== 辅助方法 ====================

    private static void assertEq(String name, Object expected, Object actual) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new AssertionError(name + ": 期望 '" + expected + "', 实际 '" + actual + "'");
        }
    }

    /**
     * 格式化输出监控摘要
     */
    private static void printSummary(Map<String, Object> summary) {
        System.out.println("┌─────────────────────────────────────────────────────┐");
        System.out.println("│           Agent 自监控摘要                          │");
        System.out.println("├─────────────────────────────────────────────────────┤");

        // 基础信息
        System.out.printf("│ 运行时间: %-42s│%n", summary.get("uptimeSeconds") + " 秒");

        // 字节码增强
        @SuppressWarnings("unchecked")
        Map<String, Object> transform = (Map<String, Object>) summary.get("transform");
        if (transform != null) {
            System.out.println("├─────────────────────────────────────────────────────┤");
            System.out.println("│ 字节码增强统计:                                     │");
            System.out.printf("│   增强类数: %-39s│%n", transform.get("transformedClassCount"));
            System.out.printf("│   拦截方法数: %-38s│%n", transform.get("interceptedMethodCount"));
            System.out.printf("│   增强总耗时: %-38s│%n", transform.get("transformTimeMs") + " ms");
            System.out.printf("│   增强失败数: %-38s│%n", transform.get("transformFailCount"));
            System.out.printf("│   平均增强耗时: %-36s│%n", transform.get("avgTransformTimeMs") + " ms");
        }

        // 数据上报
        @SuppressWarnings("unchecked")
        Map<String, Object> report = (Map<String, Object>) summary.get("report");
        if (report != null) {
            System.out.println("├─────────────────────────────────────────────────────┤");
            System.out.println("│ 数据上报统计:                                       │");
            System.out.printf("│   上报次数: %-39s│%n", report.get("reportCount"));
            System.out.printf("│   上报数据条数: %-36s│%n", report.get("reportDataCount"));
            System.out.printf("│   上报失败次数: %-35s│%n", report.get("reportFailCount"));
            System.out.printf("│   上报总耗时: %-38s│%n", report.get("reportTimeMs") + " ms");
        }

        // 拦截方法
        @SuppressWarnings("unchecked")
        Map<String, Object> intercept = (Map<String, Object>) summary.get("intercept");
        if (intercept != null) {
            System.out.println("├─────────────────────────────────────────────────────┤");
            System.out.println("│ 拦截方法统计:                                       │");
            System.out.printf("│   调用总次数: %-38s│%n", intercept.get("invokeCount"));
            System.out.printf("│   总耗时: %-42s│%n", intercept.get("totalTimeMs") + " ms");
            System.out.printf("│   异常次数: %-39s│%n", intercept.get("exceptionCount"));
            System.out.printf("│   平均耗时: %-38s│%n", intercept.get("avgInterceptTimeNs") + " ns");
        }

        // 插件
        @SuppressWarnings("unchecked")
        Map<String, Object> plugin = (Map<String, Object>) summary.get("plugin");
        if (plugin != null) {
            System.out.println("├─────────────────────────────────────────────────────┤");
            System.out.println("│ 插件统计:                                           │");
            System.out.printf("│   已注册插件数: %-36s│%n", plugin.get("registeredPluginCount"));
            @SuppressWarnings("unchecked")
            Map<String, Long> plugins = (Map<String, Long>) plugin.get("plugins");
            if (plugins != null) {
                for (Map.Entry<String, Long> entry : plugins.entrySet()) {
                    System.out.printf("│   - %-20s 加载次数: %-14s│%n", entry.getKey(), entry.getValue());
                }
            }
        }

        System.out.println("└─────────────────────────────────────────────────────┘");
    }
}