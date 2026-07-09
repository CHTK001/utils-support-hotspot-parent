package com.chua.hotspot.core.support.environment;

import com.chua.hotspot.core.support.enums.ModuleType;

/**
 * 上报数据
 *
 * @author CH
 * @since 2024/9/12
 */
public class ReportEvent<T> {
    /**
     * 上报类型
     */
    private ModuleType reportType;
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
     * 上报时间
     */
    private long timestamp = System.currentTimeMillis();
    /**
     * 上报数据
     */
    private T reportData;
    public ReportEvent() {
        setApplicationHost(Project.getInstance().getApplicationHost());
        setApplicationPort(Project.getInstance().getApplicationPort());
        setApplicationName(Project.getInstance().getApplicationName());
        setApplicationActive(Project.getInstance().getApplicationActive());
    }

    public ModuleType getReportType() { return reportType; }
    public void setReportType(ModuleType reportType) { this.reportType = reportType; }

    public String getApplicationName() { return applicationName; }
    public void setApplicationName(String applicationName) { this.applicationName = applicationName; }

    public Integer getApplicationPort() { return applicationPort; }
    public void setApplicationPort(Integer applicationPort) { this.applicationPort = applicationPort; }

    public String getApplicationHost() { return applicationHost; }
    public void setApplicationHost(String applicationHost) { this.applicationHost = applicationHost; }

    public String getApplicationActive() { return applicationActive; }
    public void setApplicationActive(String applicationActive) { this.applicationActive = applicationActive; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public T getReportData() { return reportData; }
    public void setReportData(T reportData) { this.reportData = reportData; }

    public enum ReportType {

        /**
         * 日志
         */
        LOG,

        /**
         * sql
         */
        SQL,

        /**
         * url
         */
        URL,
        /**
         * jvm
         */
        JVM,

        /**
         * cpu
         */
        CPU,

        /**
         * 磁盘
         */
        DISK,

        /**
         * usb
         */
        USB,
        /**
         * 内存
         */
        MEM,

        /**
         * 系统
         */
        SYS,

        /**
         * 网络
         */
        NETWORK,

        /**
         * trace
         */
        TRACE,
        /**
         * 磁盘io
         */
        IO_DISK,
        /**
         * agent日志
         */
        AGENT_LOG,
        /**
         * agent sql
         */
        AGENT_SQL,
        /**
         * agent trace
         */
        AGENT_TRACE,

        /**
         * 全部
         */
        ALL
    }
}
