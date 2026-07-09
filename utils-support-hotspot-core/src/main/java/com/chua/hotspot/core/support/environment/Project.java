package com.chua.hotspot.core.support.environment;

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
public class Project {
    public static final String KEY = "oo00OOOO00ooll11";

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
     * 应用环境
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

    public static Project getInstance() {
        return INSTANCE;
    }

    public String getReportAddress() {
        return reportAddress;
    }

    public void setReportAddress(String reportAddress) {
        this.reportAddress = reportAddress;
    }

    public List<String> getReportType() {
        return reportType;
    }

    public void setReportType(List<String> reportType) {
        this.reportType = reportType;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public Integer getApplicationPort() {
        return applicationPort;
    }

    public void setApplicationPort(Integer applicationPort) {
        this.applicationPort = applicationPort;
    }

    public String getApplicationHost() {
        return applicationHost;
    }

    public void setApplicationHost(String applicationHost) {
        this.applicationHost = applicationHost;
    }

    public String getApplicationActive() {
        return applicationActive;
    }

    public void setApplicationActive(String applicationActive) {
        this.applicationActive = applicationActive;
    }

    public String getApplicationActiveInclude() {
        return applicationActiveInclude;
    }

    public void setApplicationActiveInclude(String applicationActiveInclude) {
        this.applicationActiveInclude = applicationActiveInclude;
    }

    public String getContextPath() {
        return contextPath;
    }

    public void setContextPath(String contextPath) {
        this.contextPath = contextPath;
    }

    public String getEndpointsUrl() {
        return endpointsUrl;
    }

    public void setEndpointsUrl(String endpointsUrl) {
        this.endpointsUrl = endpointsUrl;
    }

    public String getEndpoints() {
        return endpoints;
    }

    public void setEndpoints(String endpoints) {
        this.endpoints = endpoints;
    }

    public String getDataSourceUrl() {
        return dataSourceUrl;
    }

    public void setDataSourceUrl(String dataSourceUrl) {
        this.dataSourceUrl = dataSourceUrl;
    }

    public String getDataSourceDriver() {
        return dataSourceDriver;
    }

    public void setDataSourceDriver(String dataSourceDriver) {
        this.dataSourceDriver = dataSourceDriver;
    }

    public String getDataSourceUsername() {
        return dataSourceUsername;
    }

    public void setDataSourceUsername(String dataSourceUsername) {
        this.dataSourceUsername = dataSourceUsername;
    }

    public String getDataSourcePassword() {
        return dataSourcePassword;
    }

    public void setDataSourcePassword(String dataSourcePassword) {
        this.dataSourcePassword = dataSourcePassword;
    }

    public Object getEnvironment() {
        return environment;
    }

    public void setEnvironment(Object environment) {
        this.environment = environment;
    }

    public String getClientProtocolEndpointPort() {
        return clientProtocolEndpointPort;
    }

    public void setClientProtocolEndpointPort(String clientProtocolEndpointPort) {
        this.clientProtocolEndpointPort = clientProtocolEndpointPort;
    }

    public String getClientProtocolEndpointProtocol() {
        return clientProtocolEndpointProtocol;
    }

    public void setClientProtocolEndpointProtocol(String clientProtocolEndpointProtocol) {
        this.clientProtocolEndpointProtocol = clientProtocolEndpointProtocol;
    }

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