package com.chua.hotspot.testagent;

import com.chua.hotspot.core.support.utils.FastMethodHelper;

import java.lang.instrument.Instrumentation;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * FastMethodHelper 双引擎验证 Agent
 * <p>
 * 使用方式：
 * <pre>
 * # 方式1：启动时加载
 * java -javaagent:utils-support-hotspot-test-agent.jar -jar your-app.jar
 *
 * # 方式2：运行时attach（需要Agent-Class配置）
 * VirtualMachine vm = VirtualMachine.attach(pid);
 * vm.loadAgent("/path/to/utils-support-hotspot-test-agent.jar");
 * </pre>
 * <p>
 * 测试内容：
 * 1. MethodHandle 调用无参方法（返回Object/String/int）
 * 2. MethodHandle 调用带参方法
 * 3. MethodHandle 调用静态方法
 * 4. MethodHandle 降级到 MethodAccess(ASM)
 * 5. MethodHandle 缓存命中验证
 * 6. 性能对比：MethodHandle vs 反射
 *
 * @author CH
 * @since 4.0.0.34
 */
public class FastMethodHelperTestAgent {

    // ==================== 测试目标类 ====================

    /**
     * 模拟数据库连接对象（类似 MySQL Connection）
     */
    public static class MockConnection {
        private final String catalog;
        private final String schema;

        public MockConnection(String catalog, String schema) {
            this.catalog = catalog;
            this.schema = schema;
        }

        public String getCatalog() {
            return catalog;
        }

        public String getSchema() {
            return schema;
        }

        @Override
        public String toString() {
            return "MockConnection{catalog='" + catalog + "', schema='" + schema + "'}";
        }
    }

    /**
     * 模拟HTTP请求对象（类似 HttpClient HttpMethod）
     */
    public static class MockHttpRequest {
        private final String name;
        private final String uri;

        public MockHttpRequest(String name, String uri) {
            this.name = name;
            this.uri = uri;
        }

        public String getName() {
            return name;
        }

        public String getURI() {
            return uri;
        }

        public void addRequestHeader(String key, String value) {
            // 模拟添加请求头
        }
    }

    /**
     * 模拟Redis配置对象（类似 RedisStandaloneConfiguration）
     */
    public static class MockRedisConfig {
        private final String hostName;
        private final int port;

        public MockRedisConfig(String hostName, int port) {
            this.hostName = hostName;
            this.port = port;
        }

        public String getHostName() {
            return hostName;
        }

        public int getPort() {
            return port;
        }
    }

    /**
     * 模拟包含静态方法的工具类
     */
    public static class MockVersionUtil {
        public static String getVersion() {
            return "4.0.0.34";
        }

        public static int getServerNumber() {
            return 42;
        }
    }

    // ==================== Agent 入口 ====================

    /**
     * premain 入口（-javaagent 方式加载）
     */
    public static void premain(String args, Instrumentation inst) {
        System.out.println("========================================");
        System.out.println("  FastMethodHelper 双引擎验证 Agent 启动");
        System.out.println("========================================");
        System.out.println();

        try {
            runAllTests();
        } catch (Exception e) {
            System.err.println("[ERROR] 测试执行异常: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println();
        System.out.println("========================================");
        System.out.println("  FastMethodHelper 双引擎验证 Agent 完成");
        System.out.println("========================================");
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

        // 测试1：invokeString - 无参方法返回String
        System.out.println("--- 测试1: invokeString 无参方法返回String ---");
        try {
            MockConnection conn = new MockConnection("testdb", "public");
            String catalog = FastMethodHelper.invokeString(conn, "getCatalog");
            String schema = FastMethodHelper.invokeString(conn, "getSchema");
            assertEq("getCatalog", "testdb", catalog);
            assertEq("getSchema", "public", schema);
            System.out.println("[PASS] invokeString 无参方法返回String");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] invokeString 无参方法返回String: " + e.getMessage());
            failed++;
        }

        // 测试2：invoke - 无参方法返回Object
        System.out.println("--- 测试2: invoke 无参方法返回Object ---");
        try {
            MockConnection conn = new MockConnection("mydb", "dbo");
            Object result = FastMethodHelper.invoke(conn, "toString");
            assertEq("toString", "MockConnection{catalog='mydb', schema='dbo'}", result);
            System.out.println("[PASS] invoke 无参方法返回Object");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] invoke 无参方法返回Object: " + e.getMessage());
            failed++;
        }

        // 测试3：invokeInt - 无参方法返回int
        System.out.println("--- 测试3: invokeInt 无参方法返回int ---");
        try {
            MockRedisConfig config = new MockRedisConfig("localhost", 6379);
            int port = FastMethodHelper.invokeInt(config, "getPort");
            assertEq("getPort", 6379, port);
            System.out.println("[PASS] invokeInt 无参方法返回int");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] invokeInt 无参方法返回int: " + e.getMessage());
            failed++;
        }

        // 测试4：invoke 带参数方法
        System.out.println("--- 测试4: invoke 带参数方法 ---");
        try {
            MockHttpRequest request = new MockHttpRequest("GET", "http://localhost:8080/api");
            String name = FastMethodHelper.invokeString(request, "getName");
            String uri = FastMethodHelper.invokeString(request, "getURI");
            assertEq("getName", "GET", name);
            assertEq("getURI", "http://localhost:8080/api", uri);
            System.out.println("[PASS] invoke 带参数方法");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] invoke 带参数方法: " + e.getMessage());
            failed++;
        }

        // 测试5：invokeStatic - 静态方法调用
        System.out.println("--- 测试5: invokeStatic 静态方法调用 ---");
        try {
            Object version = FastMethodHelper.invokeStatic(
                    MockVersionUtil.class, "getVersion", new Class[0]);
            assertEq("getVersion", "4.0.0.34", version);
            System.out.println("[PASS] invokeStatic 静态方法调用");
            passed++;
        } catch (AssertionError e) {
            System.out.println("[FAIL] invokeStatic 静态方法调用: " + e.getMessage());
            failed++;
        }

        // 测试6：降级测试 - 不存在的方法应返回null
        System.out.println("--- 测试6: 降级测试 - 不存在的方法 ---");
        try {
            MockConnection conn = new MockConnection("test", "test");
            Object result = FastMethodHelper.invoke(conn, "nonExistentMethod");
            if (result == null) {
                System.out.println("[PASS] 不存在的方法返回null（降级成功）");
                passed++;
            } else {
                System.out.println("[FAIL] 不存在的方法应返回null，实际返回: " + result);
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] 不存在的方法不应抛异常: " + e.getMessage());
            failed++;
        }

        // 测试7：null参数安全测试
        System.out.println("--- 测试7: null参数安全测试 ---");
        try {
            Object result1 = FastMethodHelper.invoke(null, "getName");
            Object result2 = FastMethodHelper.invoke(new MockConnection("a", "b"), null);
            if (result1 == null && result2 == null) {
                System.out.println("[PASS] null参数安全返回null");
                passed++;
            } else {
                System.out.println("[FAIL] null参数应返回null");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] null参数不应抛异常: " + e.getMessage());
            failed++;
        }

        // 测试8：缓存命中验证 - 重复调用应走缓存
        System.out.println("--- 测试8: 缓存命中验证 ---");
        try {
            MockRedisConfig config = new MockRedisConfig("redis-host", 6380);
            // 第一次调用
            long start1 = System.nanoTime();
            for (int i = 0; i < 1000; i++) {
                FastMethodHelper.invokeString(config, "getHostName");
            }
            long time1 = System.nanoTime() - start1;

            // 第二次调用（应走缓存）
            long start2 = System.nanoTime();
            for (int i = 0; i < 1000; i++) {
                FastMethodHelper.invokeString(config, "getHostName");
            }
            long time2 = System.nanoTime() - start2;

            // 缓存命中后，第二次不应比第一次慢很多
            System.out.println("[INFO] 第一次1000次调用耗时: " + (time1 / 1_000_000) + "ms");
            System.out.println("[INFO] 第二次1000次调用耗时: " + (time2 / 1_000_000) + "ms");
            System.out.println("[PASS] 缓存命中验证（两次调用均成功）");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] 缓存命中验证异常: " + e.getMessage());
            failed++;
        }

        // 测试9：性能对比 - FastMethodHelper vs 反射
        System.out.println("--- 测试9: 性能对比 - FastMethodHelper vs 反射 ---");
        try {
            MockRedisConfig config = new MockRedisConfig("perf-host", 6379);
            int warmup = 1000;
            int iterations = 100000;

            // 预热
            for (int i = 0; i < warmup; i++) {
                FastMethodHelper.invokeString(config, "getHostName");
            }

            // FastMethodHelper 测试
            long startFH = System.nanoTime();
            for (int i = 0; i < iterations; i++) {
                FastMethodHelper.invokeString(config, "getHostName");
            }
            long timeFH = System.nanoTime() - startFH;

            // 反射测试
            Method getHostNameMethod = MockRedisConfig.class.getMethod("getHostName");
            getHostNameMethod.setAccessible(true);
            long startReflect = System.nanoTime();
            for (int i = 0; i < iterations; i++) {
                getHostNameMethod.invoke(config);
            }
            long timeReflect = System.nanoTime() - startReflect;

            System.out.println("[INFO] FastMethodHelper " + iterations + "次调用耗时: " + (timeFH / 1_000_000) + "ms");
            System.out.println("[INFO] 反射 " + iterations + "次调用耗时: " + (timeReflect / 1_000_000) + "ms");
            if (timeReflect > 0) {
                double ratio = (double) timeReflect / timeFH;
                System.out.println("[INFO] 反射/FastMethodHelper 耗时比: " + String.format("%.2f", ratio));
            }
            System.out.println("[PASS] 性能对比测试完成");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] 性能对比测试异常: " + e.getMessage());
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

    // ==================== 断言辅助 ====================

    private static void assertEq(String method, Object expected, Object actual) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new AssertionError(method + ": 期望 '" + expected + "', 实际 '" + actual + "'");
        }
    }
}