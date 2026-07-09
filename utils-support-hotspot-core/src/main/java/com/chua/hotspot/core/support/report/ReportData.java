package com.chua.hotspot.core.support.report;

import com.chua.hotspot.core.support.environment.Project;
import com.chua.hotspot.core.support.enums.ModuleType;

/**
 * 上报数据对象
 * <p>
 * 包含服务的 IP、端口、环境配置等信息，用于数据上报时标识数据来源
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ReportData {

    /**
     * 服务 IP 地址
     */
    private String ip;

    /**
     * 服务端口
     */
    private Integer port;

    /**
     * 环境配置（如 dev、test、prod）
     */
    private String profile;

    /**
     * 应用名称
     */
    private String applicationName;

    /**
     * 模块类型
     */
    private String moduleType;

    /**
     * 事件名称
     */
    private String event;

    /**
     * 实际数据
     */
    private Object data;

    /**
     * 时间戳
     */
    private Long timestamp;

    /**
     * 构造函数
     */
    public ReportData() {
        this.timestamp = System.currentTimeMillis();
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getModuleType() {
        return moduleType;
    }

    public void setModuleType(String moduleType) {
        this.moduleType = moduleType;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * 从 Project 实例创建 ReportData
     *
     * @param moduleType 模块类型
     * @param event      事件名称
     * @param data       实际数据
     * @return ReportData 实例
     */
    public static ReportData of(ModuleType moduleType, String event, Object data) {
        Project project = Project.getInstance();
        ReportData reportData = new ReportData();
        reportData.setIp(project.getApplicationHost());
        reportData.setPort(project.getApplicationPort());
        reportData.setProfile(project.getApplicationActive());
        reportData.setApplicationName(project.getApplicationName());
        reportData.setModuleType(moduleType != null ? moduleType.name() : null);
        reportData.setEvent(event);
        reportData.setData(data);
        return reportData;
    }

    /**
     * 获取服务唯一标识
     * <p>
     * 格式: applicationName:ip:port:profile
     * </p>
     *
     * @return 服务唯一标识
     */
    public String getServiceKey() {
        return String.format("%s:%s:%d:%s", 
            applicationName != null ? applicationName : "unknown",
            ip != null ? ip : "unknown",
            port != null ? port : 0,
            profile != null ? profile : "default");
    }
}