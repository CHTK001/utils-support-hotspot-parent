package com.chua.hotspot.core.support.server;

import lombok.Data;

/**
 * 服务实例类，用于表示一个服务的实例信息
 *
 * @author CH
 * @version 1.0.0
 * @since 2024/02/05
 */
@Data
public class ServiceInstance {

    /**
     * 默认源类型
     */
    private static final String DEFAULT_SOURCE_NAME = "HOST";

    /**
     * 服务实例的名称
     */
    private String name;

    /**
     * 源类型，默认为 HOST
     */
    private String sourceName = DEFAULT_SOURCE_NAME;

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

    /**
     * 连接计数
     */
    private int count;
}