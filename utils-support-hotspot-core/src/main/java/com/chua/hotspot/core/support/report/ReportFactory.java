package com.chua.hotspot.core.support.report;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.environment.Project;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.monitor.AgentSelfMonitor;
import com.chua.hotspot.core.support.server.ServerFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.qps.ComponentConnectionRecorder;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Method;
import java.net.InetAddress;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * 数据上报工厂
 * 支持 HTTP、WebSocket、RSocket 多种协议进行数据上报
 * 支持与 spring-support-report-client-starter 联动上报
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class ReportFactory {

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 单例实例
     */
    private static final ReportFactory INSTANCE = new ReportFactory();

    /**
     * 服务实例计数器
     */
    private static final Map<String, AtomicInteger> SERVICE_COUNT = new LinkedHashMap<>();

    /**
     * 服务实例列表
     */
    private static final List<ServiceInstance> SERVICE_LIST = new LinkedList<>();

    /**
     * 回环 IP 地址
     */
    private static final String LOOPBACK_IP = "127.0.0.1";

    /**
     * 默认应用端口
     */
    private static final String DEFAULT_APP_PORT = "8080";

    /**
     * SyncClient 类名（spring-support-report-client-starter）
     * 保留用于反射降级方案
     */
    private static final String SYNC_CLIENT_CLASS = "com.chua.sync.support.client.SyncClient";

    /**
     * 默认应用主机
     */
    private static final String DEFAULT_APP_HOST = LOOPBACK_IP;

    /**
     * HTTP 上报启用配置键
     */
    private static final String CONFIG_HTTP_ENABLED = "hotspot.report.http.enabled";

    /**
     * HTTP 上报 URL 配置键
     */
    private static final String CONFIG_HTTP_URL = "hotspot.report.http.url";

    /**
     * HTTP 上报超时配置键
     */
    private static final String CONFIG_HTTP_TIMEOUT = "hotspot.report.http.timeout";

    /**
     * HTTP 上报重试次数配置键
     */
    private static final String CONFIG_HTTP_RETRIES = "hotspot.report.http.retries";

    /**
     * HTTP 上报默认禁用
     */
    private static final String DEFAULT_HTTP_ENABLED = "false";

    /**
     * HTTP 上报默认超时（毫秒）
     */
    private static final String DEFAULT_HTTP_TIMEOUT_MS = "5000";

    /**
     * HTTP 上报默认重试次数
     */
    private static final String DEFAULT_HTTP_RETRIES = "3";

    /**
     * HTTP 上报 URL 默认值（空字符串表示未配置）
     */
    private static final String DEFAULT_HTTP_URL = "";

    /**
     * 联动上报主题前缀
     */
    private static final String SYNC_TOPIC_PREFIX = "hotspot.";

    /**
     * Spring ApplicationContext Helper 类名
     */
    private static final String SPRING_CONTEXT_HELPER_CLASS = "com.chua.starter.common.support.application.ApplicationContextHelper";

    /**
     * 本机 IP（排除 127.0.0.1 的真实 IP）
     */
    public static String LOCAL_HOST = LOOPBACK_IP;

    /**
     * 应用端口
     */
    public static String APP_PORT = DEFAULT_APP_PORT;

    /**
     * 应用主机
     */
    public static String APP_HOST = DEFAULT_APP_HOST;

    static {
        try {
            // 优先获取非 127.0.0.1 的本机 IP
            LOCAL_HOST = getRealLocalHost();
            APP_HOST = LOCAL_HOST;
        } catch (Exception e) {
            LOGGER.warn("获取本机IP失败: {}", e.getMessage());
        }
    }

    /**
     * 获取真实的本机 IP 地址（排除 127.0.0.1 和回环地址）
     *
     * @return 真实的本机 IP 地址
     */
    private static String getRealLocalHost() {
        try {
            java.net.NetworkInterface networkInterface;
            java.util.Enumeration<java.net.NetworkInterface> interfaces = java.net.NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                networkInterface = interfaces.nextElement();
                // 跳过回环接口和未启用的接口
                if (networkInterface.isLoopback() || !networkInterface.isUp()) {
                    continue;
                }
                java.util.Enumeration<InetAddress> addresses = networkInterface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress address = addresses.nextElement();
                    // 只要 IPv4 地址，排除回环地址
                    if (address instanceof java.net.Inet4Address && !address.isLoopbackAddress()) {
                        return address.getHostAddress();
                    }
                }
            }
        } catch (Exception e) {
            // 如果获取失败，使用默认方式
        }

        // 降级方案
        try {
            InetAddress inet = InetAddress.getLocalHost();
            String ip = inet.getHostAddress();
            if (!LOOPBACK_IP.equals(ip)) {
                return ip;
            }
        } catch (Exception ignored) {
        }

        return LOOPBACK_IP;
    }

    /**
     * 上报协议类型
     */
    public enum ReportProtocol {
        /**
         * HTTP 协议
         */
        HTTP,
        /**
         * WebSocket 协议
         */
        WEBSOCKET,
        /**
         * RSocket 协议
         */
        RSOCKET,
        /**
         * 联动上报（使用 SyncClientProvider SPI）
         */
        SYNC_CLIENT
    }

    /**
     * 环境变量工厂
     */
    private final EnvironmentFactory environmentFactory = EnvironmentFactory.getInstance();

    /**
     * JSON 序列化器
     */
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 已启用的上报协议集合
     */
    private final Map<ReportProtocol, Boolean> enabledProtocols = new ConcurrentHashMap<>();

    /**
     * HTTP 上报器
     */
    private HttpReporter httpReporter;

    /**
     * SyncClient SPI 提供者（优先使用 SPI，替代反射方式）
     */
    private SyncClientProvider syncClientProvider;

    /**
     * 是否使用联动上报
     */
    private boolean useSyncClient = false;

    private ReportFactory() {
    }

    /**
     * 获取单例实例
     *
     * @return ReportFactory 实例
     */
    public static ReportFactory getInstance() {
        return INSTANCE;
    }

    /**
     * 初始化数据上报服务
     */
    public void init() {
        // 初始化应用信息
        initAppInfo();

        LOGGER.info("=============================数据上报========================");
        
        // 优先尝试联动上报（spring-support-report-client-starter）
        initSyncClient();
        
        if (useSyncClient) {
            LOGGER.info("检测到 SyncClient，使用联动上报模式");
        } else {
            LOGGER.info("未检测到 SyncClient，使用自主上报模式");
            
            // 初始化 HTTP 上报
            initHttpReporter();
        }
        
        // 注册关闭钩子
        registerShutdownHook();
    }

    /**
     * 初始化 SyncClient 联动上报
     * 优先使用 SPI (ServiceLoader) 发现 SyncClientProvider，避免运行时反射调用。
     * 当 SPI 不可用时，降级使用反射方式（兼容旧版 spring-support-report-client-starter）。
     */
    private void initSyncClient() {
        // 优先使用 SPI 发现 SyncClientProvider
        try {
            java.util.ServiceLoader<SyncClientProvider> loader = java.util.ServiceLoader.load(SyncClientProvider.class);
            Iterator<SyncClientProvider> iterator = loader.iterator();
            if (iterator.hasNext()) {
                syncClientProvider = iterator.next();
                useSyncClient = true;
                enabledProtocols.put(ReportProtocol.SYNC_CLIENT, true);
                LOGGER.info("通过 SPI 发现 SyncClientProvider: {}", syncClientProvider.name());
                return;
            }
        } catch (Exception e) {
            LOGGER.debug("SPI 加载 SyncClientProvider 失败: {}", e.getMessage());
        }
        
        // 降级方案：反射方式获取 SyncClient（兼容旧版）
        initSyncClientByReflection();
    }

    /**
     * 反射方式初始化 SyncClient（降级方案，兼容旧版 spring-support-report-client-starter）
     * <p>
     * 此方法仅在 SPI 未发现 SyncClientProvider 时使用。
     * 新项目应实现 SyncClientProvider 接口并通过 SPI 注册，避免反射调用。
     * </p>
     */
    private void initSyncClientByReflection() {
        try {
            Class<?> syncClientClass = Class.forName(SYNC_CLIENT_CLASS, false,
                    Thread.currentThread().getContextClassLoader());
            Object applicationContext = getSpringApplicationContext();
            if (applicationContext != null) {
                Method getBeanMethod = applicationContext.getClass().getMethod("getBean", Class.class);
                Object syncClient = getBeanMethod.invoke(applicationContext, syncClientClass);
                if (syncClient != null) {
                    Method publishMethod = syncClientClass.getMethod("publish", String.class, Object.class);
                    // 创建反射代理包装为 SyncClientProvider
                    final Object clientRef = syncClient;
                    final Method publishRef = publishMethod;
                    syncClientProvider = new SyncClientProvider() {
                        @Override
                        public void publish(String topic, Object data) {
                            try {
                                publishRef.invoke(clientRef, topic, data);
                            } catch (Exception e) {
                                LOGGER.debug("反射调用 SyncClient.publish 失败: {}", e.getMessage());
                            }
                        }
                        @Override
                        public String name() {
                            return "ReflectionSyncClientProxy";
                        }
                    };
                    useSyncClient = true;
                    enabledProtocols.put(ReportProtocol.SYNC_CLIENT, true);
                    LOGGER.info("通过反射降级方式初始化 SyncClient 成功");
                }
            }
        } catch (ClassNotFoundException e) {
            LOGGER.debug("未检测到 SyncClient 类，使用自主上报");
        } catch (Exception e) {
            LOGGER.debug("SyncClient 反射降级初始化失败: {}", e.getMessage());
        }
    }

    /**
     * 获取 Spring ApplicationContext（反射降级方案）
     *
     * @return ApplicationContext 实例，如果不存在返回 null
     */
    private Object getSpringApplicationContext() {
        try {
            Class<?> holderClass = Class.forName(SPRING_CONTEXT_HELPER_CLASS,
                    false, Thread.currentThread().getContextClassLoader());
            Method getContextMethod = holderClass.getMethod("getApplicationContext");
            return getContextMethod.invoke(null);
        } catch (Exception e) {
            LOGGER.debug("获取 Spring ApplicationContext 失败: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 初始化 HTTP 上报器
     */
    private void initHttpReporter() {
        try {
            String httpEnabledStr = environmentFactory.getString(CONFIG_HTTP_ENABLED, DEFAULT_HTTP_ENABLED);
            boolean httpEnabled = Boolean.parseBoolean(httpEnabledStr);
            enabledProtocols.put(ReportProtocol.HTTP, httpEnabled);

            if (!httpEnabled) {
                LOGGER.debug("HTTP 数据上报未启用");
                return;
            }

            String httpUrl = environmentFactory.getString(CONFIG_HTTP_URL, DEFAULT_HTTP_URL);
            if (httpUrl.isEmpty()) {
                LOGGER.warn("HTTP 上报 URL 未配置");
                enabledProtocols.put(ReportProtocol.HTTP, false);
                return;
            }

            int timeout = Integer.parseInt(environmentFactory.getString(CONFIG_HTTP_TIMEOUT, DEFAULT_HTTP_TIMEOUT_MS));
            int retries = Integer.parseInt(environmentFactory.getString(CONFIG_HTTP_RETRIES, DEFAULT_HTTP_RETRIES));

            httpReporter = new HttpReporter(httpUrl, timeout, retries);

            LOGGER.info("HTTP 上报服务已配置，URL: {}", httpUrl);
        } catch (Exception e) {
            LOGGER.warn("HTTP 上报服务初始化失败: {}", e.getMessage());
            enabledProtocols.put(ReportProtocol.HTTP, false);
        }
    }

    /**
     * 注册关闭钩子
     */
    private void registerShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            LOGGER.info("开始关闭数据上报服务...");
            LOGGER.info("数据上报服务已关闭");
        }));
    }

    /**
     * 上报数据（静态方法，简化调用）
     *
     * @param moduleType 模块类型
     * @param event      事件名称
     * @param data       事件数据
     */
    public static void report(ModuleType moduleType, String event, Object data) {
        INSTANCE.doReport(moduleType, event, data);
    }

    /**
     * 上报数据（内部实现）
     *
     * @param moduleType 模块类型
     * @param event      事件名称
     * @param data       事件数据
     */
    private void doReport(ModuleType moduleType, String event, Object data) {
        long startTime = System.currentTimeMillis();
        boolean success = false;
        try {
            // 优先使用联动上报
            if (useSyncClient && isProtocolEnabled(ReportProtocol.SYNC_CLIENT)) {
                reportToSyncClient(moduleType, event, data);
            } else if (isProtocolEnabled(ReportProtocol.HTTP)) {
                // HTTP 上报
                reportToHttp(moduleType, event, data);
            }
            
            // WebSocket 实时推送（无论使用何种上报协议，都推送到前端页面）
            reportToWebSocket(moduleType, event, data);
            success = true;
        } finally {
            long costMs = System.currentTimeMillis() - startTime;
            if (success) {
                AgentSelfMonitor.getInstance().recordReport(1, costMs);
            } else {
                AgentSelfMonitor.getInstance().recordReportFail();
            }
        }
    }

    /**
     * 上报数据到 SyncClient（联动上报）
     * 通过 SyncClientProvider SPI 接口调用，避免运行时反射
     *
     * @param moduleType 模块类型
     * @param event 事件名称
     * @param data 事件数据
     */
    public void reportToSyncClient(ModuleType moduleType, String event, Object data) {
        if (syncClientProvider == null) {
            return;
        }

        try {
            // 构建上报主题
            String topic = SYNC_TOPIC_PREFIX + moduleType.name().toLowerCase() + "." + event;

            // 使用 ReportData 包装上报数据
            ReportData reportData = ReportData.of(moduleType, event, data);

            // 通过 SPI 接口调用，无需反射
            syncClientProvider.publish(topic, reportData);
        } catch (Exception e) {
            LOGGER.debug("SyncClient 联动上报失败: {}", e.getMessage());
        }
    }

    /**
     * 上报数据到 HTTP
     *
     * @param moduleType 模块类型
     * @param event 事件名称
     * @param data 事件数据
     */
    public void reportToHttp(ModuleType moduleType, String event, Object data) {
        if (httpReporter == null) {
            return;
        }

        try {
            // 使用 ReportData 包装上报数据
            ReportData reportData = ReportData.of(moduleType, event, data);
            httpReporter.reportAsync(objectMapper.writeValueAsString(reportData));
        } catch (Exception e) {
            LOGGER.debug("HTTP 上报失败: {}", e.getMessage());
        }
    }

    /**
     * 上报数据到 WebSocket（实时推送给前端页面）
     *
     * @param moduleType 模块类型
     * @param event 事件名称
     * @param data 事件数据
     */
    public void reportToWebSocket(ModuleType moduleType, String event, Object data) {
        try {
            // 通过 ServerFactory 推送到 WebSocket 客户端
            ServerFactory.getInstance().publish(moduleType, event, data);
        } catch (Exception e) {
            LOGGER.debug("WebSocket 推送失败: {}", e.getMessage());
        }
    }

    /**
     * 检查协议是否启用
     *
     * @param protocol 协议类型
     * @return 是否启用
     */
    public boolean isProtocolEnabled(ReportProtocol protocol) {
        return Boolean.TRUE.equals(enabledProtocols.get(protocol));
    }

    /**
     * 初始化应用信息
     */
    private void initAppInfo() {
        Project project = Project.getInstance();
        Integer appPort = project.getApplicationPort();
        if (appPort != null) {
            APP_PORT = String.valueOf(appPort);
        }
        APP_HOST = LOCAL_HOST;
        LOGGER.info("当前应用: {}:{}，本机IP: {}", project.getApplicationName(), APP_PORT, LOCAL_HOST);
        
        // 触发 ComponentConnectionRecorder 刷新所有已有连接的 sourceHost 和 sourcePort
        ComponentConnectionRecorder.getInstance().refreshAllConnectionsWithRealInfo();
    }

    /**
     * 发送服务实例
     *
     * @param instance 服务实例
     */
    public static void sendServiceInstance(ServiceInstance instance) {
        if (instance == null) {
            return;
        }
        
        // 验证端口号：端口不能小于 0
        if (instance.getSourcePort() < 0 || instance.getTargetPort() < 0) {
            LOGGER.debug("忽略无效端口的服务实例: source={}:{}, target={}:{}",
                    instance.getSourceHost(), instance.getSourcePort(),
                    instance.getTargetHost(), instance.getTargetPort());
            return;
        }

        String key = getServiceKey(instance);
        Span currentSpan = NewTrackManager.getCurrentSpan();
        if (currentSpan != null) {
            currentSpan.addServiceInstance(instance);
        }

        if (!SERVICE_COUNT.containsKey(key)) {
            SERVICE_LIST.add(instance);
            SERVICE_COUNT.put(key, new AtomicInteger(1));
            report(ModuleType.SERVER, "AGENT_SERVER", instance);
            
            // 记录组件连接到 ComponentConnectionRecorder
            ComponentConnectionRecorder.getInstance().recordConnection(instance);
            return;
        }

        SERVICE_COUNT.get(key).incrementAndGet();
        
        // 记录组件连接到 ComponentConnectionRecorder
        ComponentConnectionRecorder.getInstance().recordConnection(instance);
    }

    /**
     * 获取服务实例键
     */
    private static String getServiceKey(ServiceInstance instance) {
        return instance.getSourceHost() + instance.getSourcePort() +
               instance.getTargetHost() + instance.getTargetPort() + instance.getName();
    }

    /**
     * 获取服务实例列表
     *
     * @return 服务实例列表
     */
    public static List<ServiceInstance> getServiceList() {
        List<ServiceInstance> result = SERVICE_LIST.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        for (ServiceInstance instance : result) {
            if (instance != null) {
                AtomicInteger count = SERVICE_COUNT.get(getServiceKey(instance));
                if (count != null) {
                    instance.setCount(count.get());
                }
            }
        }
        return result;
    }
}
