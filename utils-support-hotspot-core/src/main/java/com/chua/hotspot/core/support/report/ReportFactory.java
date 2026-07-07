package com.chua.hotspot.core.support.report;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.environment.Project;
import com.chua.hotspot.core.support.log.LogFactory;
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
     * 本机 IP（排除 127.0.0.1 的真实 IP）
     */
    public static String LOCAL_HOST = "127.0.0.1";

    /**
     * 应用端口
     */
    public static String APP_PORT = "8080";

    /**
     * 应用主机
     */
    public static String APP_HOST = "127.0.0.1";

    static {
        try {
            // 优先获取非 127.0.0.1 的本机 IP
            LOCAL_HOST = getRealLocalHost();
            APP_HOST = LOCAL_HOST;
        } catch (Exception e) {
            LogFactory.getInstance().warn("获取本机IP失败: {}", e.getMessage());
        }
    }
    
    /**
     * 获取真实的本机 IP 地址（排除 127.0.0.1 和回环地址）
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
            if (!"127.0.0.1".equals(ip)) {
                return ip;
            }
        } catch (Exception ignored) {
        }
        
        return "127.0.0.1";
    }

    /**
     * SyncClient 类名（spring-support-report-client-starter）
     */
    private static final String SYNC_CLIENT_CLASS = "com.chua.sync.support.client.SyncClient";

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
         * 联动上报（使用 SyncClient）
         */
        SYNC_CLIENT
    }

    private final EnvironmentFactory environmentFactory = EnvironmentFactory.getInstance();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<ReportProtocol, Boolean> enabledProtocols = new ConcurrentHashMap<>();

    private HttpReporter httpReporter;
    
    /**
     * SyncClient 实例（通过反射获取）
     */
    private Object syncClient;
    
    /**
     * SyncClient.publish 方法
     */
    private Method syncClientPublishMethod;
    
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

        LogFactory.getInstance().info("=============================数据上报========================");
        
        // 优先尝试联动上报（spring-support-report-client-starter）
        initSyncClient();
        
        if (useSyncClient) {
            LogFactory.getInstance().info("检测到 SyncClient，使用联动上报模式");
        } else {
            LogFactory.getInstance().info("未检测到 SyncClient，使用自主上报模式");
            
            // 初始化 HTTP 上报
            initHttpReporter();
        }
        
        // 注册关闭钩子
        registerShutdownHook();
    }

    /**
     * 初始化 SyncClient 联动上报
     * 通过反射检测是否存在 spring-support-report-client-starter
     */
    private void initSyncClient() {
        try {
            // 尝试加载 SyncClient 类
            Class<?> syncClientClass = Class.forName(SYNC_CLIENT_CLASS, false, 
                    Thread.currentThread().getContextClassLoader());
            
            // 尝试从 Spring 容器获取 SyncClient 实例
            Object applicationContext = getSpringApplicationContext();
            if (applicationContext != null) {
                Method getBeanMethod = applicationContext.getClass().getMethod("getBean", Class.class);
                syncClient = getBeanMethod.invoke(applicationContext, syncClientClass);
                
                if (syncClient != null) {
                    // 获取 publish 方法
                    syncClientPublishMethod = syncClientClass.getMethod("publish", String.class, Object.class);
                    useSyncClient = true;
                    enabledProtocols.put(ReportProtocol.SYNC_CLIENT, true);
                    LogFactory.getInstance().info("SyncClient 联动上报初始化成功");
                }
            }
        } catch (ClassNotFoundException e) {
            LogFactory.getInstance().debug("未检测到 SyncClient 类，使用自主上报");
        } catch (Exception e) {
            LogFactory.getInstance().debug("SyncClient 初始化失败: {}", e.getMessage());
        }
    }

    /**
     * 获取 Spring ApplicationContext
     *
     * @return ApplicationContext 实例，如果不存在返回 null
     */
    private Object getSpringApplicationContext() {
        try {
            // 尝试从 SpringContextHolder 获取
            Class<?> holderClass = Class.forName("com.chua.starter.common.support.application.ApplicationContextHelper",
                    false, Thread.currentThread().getContextClassLoader());
            Method getContextMethod = holderClass.getMethod("getApplicationContext");
            return getContextMethod.invoke(null);
        } catch (Exception e) {
            LogFactory.getInstance().debug("获取 Spring ApplicationContext 失败: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 初始化 HTTP 上报器
     */
    private void initHttpReporter() {
        try {
            String httpEnabledStr = environmentFactory.getString("hotspot.report.http.enabled", "false");
            boolean httpEnabled = Boolean.parseBoolean(httpEnabledStr);
            enabledProtocols.put(ReportProtocol.HTTP, httpEnabled);
            
            if (!httpEnabled) {
                LogFactory.getInstance().debug("HTTP 数据上报未启用");
                return;
            }

            String httpUrl = environmentFactory.getString("hotspot.report.http.url", "");
            if (httpUrl.isEmpty()) {
                LogFactory.getInstance().warn("HTTP 上报 URL 未配置");
                enabledProtocols.put(ReportProtocol.HTTP, false);
                return;
            }

            int timeout = Integer.parseInt(environmentFactory.getString("hotspot.report.http.timeout", "5000"));
            int retries = Integer.parseInt(environmentFactory.getString("hotspot.report.http.retries", "3"));
            
            httpReporter = new HttpReporter(httpUrl, timeout, retries);
            
            LogFactory.getInstance().info("HTTP 上报服务已配置，URL: {}", httpUrl);
        } catch (Exception e) {
            LogFactory.getInstance().warn("HTTP 上报服务初始化失败: {}", e.getMessage());
            enabledProtocols.put(ReportProtocol.HTTP, false);
        }
    }

    /**
     * 注册关闭钩子
     */
    private void registerShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            LogFactory.getInstance().info("开始关闭数据上报服务...");
            LogFactory.getInstance().info("数据上报服务已关闭");
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
        // 优先使用联动上报
        if (useSyncClient && isProtocolEnabled(ReportProtocol.SYNC_CLIENT)) {
            reportToSyncClient(moduleType, event, data);
        } else if (isProtocolEnabled(ReportProtocol.HTTP)) {
            // HTTP 上报
            reportToHttp(moduleType, event, data);
        }
        
        // WebSocket 实时推送（无论使用何种上报协议，都推送到前端页面）
        reportToWebSocket(moduleType, event, data);
    }

    /**
     * 上报数据到 SyncClient（联动上报）
     *
     * @param moduleType 模块类型
     * @param event 事件名称
     * @param data 事件数据
     */
    public void reportToSyncClient(ModuleType moduleType, String event, Object data) {
        if (syncClient == null || syncClientPublishMethod == null) {
            return;
        }

        try {
            // 构建上报主题
            String topic = "hotspot." + moduleType.name().toLowerCase() + "." + event;
            
            // 使用 ReportData 包装上报数据
            ReportData reportData = ReportData.of(moduleType, event, data);

            // 调用 SyncClient.publish(topic, data)
            syncClientPublishMethod.invoke(syncClient, topic, reportData);
        } catch (Exception e) {
            LogFactory.getInstance().debug("SyncClient 联动上报失败: {}", e.getMessage());
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
            LogFactory.getInstance().debug("HTTP 上报失败: {}", e.getMessage());
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
            LogFactory.getInstance().debug("WebSocket 推送失败: {}", e.getMessage());
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
        LogFactory.getInstance().info("当前应用: {}:{}，本机IP: {}", project.getApplicationName(), APP_PORT, LOCAL_HOST);
        
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
            LogFactory.getInstance().debug("忽略无效端口的服务实例: source={}:{}, target={}:{}",
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
