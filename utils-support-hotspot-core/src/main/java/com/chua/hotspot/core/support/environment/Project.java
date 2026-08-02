package com.chua.hotspot.core.support.environment;

import lombok.Data;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 项目
 *
 * @author CH
 * @since 2024/9/6
 */
@Data
public class Project {

    /**
     * 加密密钥
     */
    public static final String KEY = "oo00OOOO00ooll11";

    /**
     * 单例实例
     */
    private static final Project INSTANCE = new Project();

    /**
     * 监控地址
     */
    private String reportAddress;

    /**
     * 监控类型
     */
    private List<String> reportType = Collections.emptyList();

    /**
     * 应用名称
     */
    private String applicationName;

    /**
     * 应用端口
     */
    private Integer applicationPort;

    /**
     * 应用地址
     */
    private String applicationHost;

    /**
     * 应用环境
     */
    private String applicationActive;

    /**
     * 应用环境包含
     */
    private String applicationActiveInclude;

    /**
     * 上下文路径
     */
    private String contextPath;

    /**
     * 端点地址
     */
    private String endpointsUrl;

    /**
     * 端点
     */
    private String endpoints;

    /**
     * 数据库地址
     */
    private String dataSourceUrl;

    /**
     * 驱动
     */
    private String dataSourceDriver;

    /**
     * 用户名
     */
    private String dataSourceUsername;

    /**
     * 密码
     */
    private String dataSourcePassword;

    /**
     * 环境
     */
    private Object environment;

    /**
     * 客户端绑定的服务端口
     */
    private String clientProtocolEndpointPort;

    /**
     * 客户端绑定的服务协议
     */
    private String clientProtocolEndpointProtocol;

    public Project() {
    }

    /**
     * 获取单例实例
     *
     * @return Project 实例
     */
    public static Project getInstance() {
        return INSTANCE;
    }

    /**
     * 获取项目配置映射
     *
     * @return 项目配置键值对
     */
    public Map<String, String> getProject() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("applicationName", applicationName);
        map.put("applicationPort", String.valueOf(applicationPort));
        map.put("applicationHost", applicationHost);
        map.put("applicationActive", applicationActive);
        map.put("applicationActiveInclude", applicationActiveInclude);

        map.put("contextPath", contextPath);

        map.put("dataSourceUrl", dataSourceUrl);
        map.put("dataSourceDriver", dataSourceDriver);
        map.put("dataSourceUsername", dataSourceUsername);
        map.put("dataSourcePassword", dataSourcePassword);

        map.put("clientProtocolEndpointPort", clientProtocolEndpointPort);
        map.put("clientProtocolEndpointProtocol", clientProtocolEndpointProtocol);

        map.put("endpoints", endpoints);
        map.put("endpointsUrl", endpointsUrl);
        return map;
    }
}