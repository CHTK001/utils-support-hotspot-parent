package com.chua.hotspot.core.support.server;

/**
 * 服务实例类，用于表示一个服务的实例信息
 *
 * @author CH
 * @version 1.0.0
 * @since 2024/02/05
 */
public class ServiceInstance {

    /**
     * 服务实例的名称
     */
    private String name;

    /**
     * 源类型，默认为"HOST"
     */
    private String sourceName = "HOST";

    /**
     * 源主机地址
     */
    private String sourceHost;

    /**
     * 源主机端口号
     */
    private int sourcePort;

    /**
     * 目标主机地址
     */
    private String targetHost;

    /**
     * 目标主机端口号
     */
    private int targetPort;

    private int count;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceHost() { return sourceHost; }
    public void setSourceHost(String sourceHost) { this.sourceHost = sourceHost; }

    public int getSourcePort() { return sourcePort; }
    public void setSourcePort(int sourcePort) { this.sourcePort = sourcePort; }

    public String getTargetHost() { return targetHost; }
    public void setTargetHost(String targetHost) { this.targetHost = targetHost; }

    public int getTargetPort() { return targetPort; }
    public void setTargetPort(int targetPort) { this.targetPort = targetPort; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}
