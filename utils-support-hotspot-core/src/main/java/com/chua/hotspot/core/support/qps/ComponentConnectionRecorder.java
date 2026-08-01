package com.chua.hotspot.core.support.qps;

import com.chua.hotspot.core.support.environment.Project;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 组件连接监控记录器
 * <p>
 * 记录各种中间件组件（MySQL、Redis、Kafka、RabbitMQ 等）的连接信息
 * 只存储在内存中，不写入 SQLite，用于实时显示
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/13
 */
public class ComponentConnectionRecorder {

    /**
     * 单例实例
     */
    private static final ComponentConnectionRecorder INSTANCE = new ComponentConnectionRecorder();

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 组件连接计数
     * Key: componentType|host|port
     */
    private final Map<String, AtomicInteger> connectionCounts = new ConcurrentHashMap<>();

    /**
     * 组件信息缓存
     * Key: componentType|host|port, Value: ServiceInstance
     */
    private final Map<String, ServiceInstance> componentCache = new ConcurrentHashMap<>();

    private ComponentConnectionRecorder() {
    }

    public static ComponentConnectionRecorder getInstance() {
        return INSTANCE;
    }

    /**
     * 记录组件连接
     *
     * @param instance 服务实例
     */
    public void recordConnection(ServiceInstance instance) {
        if (instance == null) {
            return;
        }

        String key = buildKey(instance.getName(), instance.getTargetHost(), instance.getTargetPort());
        
        // 增加连接计数
        connectionCounts.computeIfAbsent(key, k -> new AtomicInteger(0)).incrementAndGet();
        
        // 缓存组件信息，并更新为最新的应用信息
        updateInstanceInfo(instance);
        componentCache.put(key, instance);
        
        LOGGER.debug("记录组件连接: {} {}:{} (count={})", 
                instance.getName(), 
                instance.getTargetHost(), 
                instance.getTargetPort(),
                connectionCounts.get(key).get());
    }

    /**
     * 更新实例信息为最新的应用信息
     */
    private void updateInstanceInfo(ServiceInstance instance) {
        // 始终使用最新的 HOST（可能已经获取到真实 IP）
        instance.setSourceHost(ReportFactory.LOCAL_HOST);
        
        Project project = Project.getInstance();
        Integer appPort = project.getApplicationPort();
        
        // 如果应用端口已经确定，使用最新值；否则尝试解析 APP_PORT 字符串
        if (appPort != null) {
            instance.setSourcePort(appPort);
        } else {
            try {
                instance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            } catch (NumberFormatException e) {
                instance.setSourcePort(8080);
            }
        }
    }
    
    /**
     * 刷新所有已有连接的 sourceHost 和 sourcePort 为真实值
     * 当应用端口和 IP 初始化完成后调用，更新之前用默认值记录的连接
     */
    public void refreshAllConnectionsWithRealInfo() {
        String realHost = ReportFactory.LOCAL_HOST;
        Project project = Project.getInstance();
        Integer realPort = project.getApplicationPort();
        
        if (realPort == null) {
            try {
                realPort = Integer.parseInt(ReportFactory.APP_PORT);
            } catch (NumberFormatException e) {
                realPort = 8080;
            }
        }
        
        LOGGER.info("刷新组件连接信息: {}:{}", realHost, realPort);
        
        int updatedCount = 0;
        // 更新所有缓存的 ServiceInstance
        for (ServiceInstance instance : componentCache.values()) {
            String oldInfo = instance.getSourceHost() + ":" + instance.getSourcePort();
            instance.setSourceHost(realHost);
            instance.setSourcePort(realPort);
            String newInfo = instance.getSourceHost() + ":" + instance.getSourcePort();
            
            if (!oldInfo.equals(newInfo)) {
                updatedCount++;
                LOGGER.debug("更新组件 {} 连接: {} -> {} (target: {}:{})", 
                    instance.getName(), oldInfo, newInfo, 
                    instance.getTargetHost(), instance.getTargetPort());
            }
        }
        
        if (updatedCount > 0) {
            LOGGER.info("已更新 {} 个组件连接信息", updatedCount);
        }
    }

    /**
     * 获取当前组件连接统计（从内存）
     *
     * @return 统计列表
     */
    public List<ComponentStat> getCurrentStats() {
        List<ComponentStat> result = new ArrayList<>();
        
        for (Map.Entry<String, ServiceInstance> entry : componentCache.entrySet()) {
            String key = entry.getKey();
            ServiceInstance instance = entry.getValue();
            AtomicInteger count = connectionCounts.get(key);
            
            if (count != null) {
                result.add(new ComponentStat(
                    instance.getName(),
                    instance.getSourceHost(),
                    instance.getSourcePort(),
                    instance.getTargetHost(),
                    instance.getTargetPort(),
                    count.get()
                ));
            }
        }
        
        return result;
    }
    
    /**
     * 组件连接统计数据
     */
    public static class ComponentStat {
        public String componentType;  // 组件类型（REDIS, MYSQL, KAFKA 等）
        public String name;            // 组件名称（前端显示用，同 componentType）
        public String sourceHost;      // 源主机（应用端）
        public int sourcePort;         // 源端口（应用端）
        public String targetHost;      // 目标主机（组件端）
        public int targetPort;         // 目标端口（组件端）
        public int connectionCount;    // 连接数
        
        public ComponentStat(String componentType, String sourceHost, int sourcePort,
                           String targetHost, int targetPort, int connectionCount) {
            this.componentType = componentType;
            this.name = componentType;  // name 和 componentType 保持一致，方便前端显示
            this.sourceHost = sourceHost;
            this.sourcePort = sourcePort;
            this.targetHost = targetHost;
            this.targetPort = targetPort;
            this.connectionCount = connectionCount;
        }
    }

    /**
     * 构建键
     */
    private String buildKey(String componentType, String host, int port) {
        return componentType + "|" + host + "|" + port;
    }
}
