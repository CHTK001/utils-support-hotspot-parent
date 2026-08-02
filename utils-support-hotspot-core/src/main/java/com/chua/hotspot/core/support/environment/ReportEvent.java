package com.chua.hotspot.core.support.environment;

import com.chua.hotspot.core.support.enums.ModuleType;
import lombok.Data;

/**
 * 上报数据
 *
 * @author CH
 * @since 2024/9/12
 */
@Data
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

    /**
     * 上报类型枚举
     */
    public enum ReportType {

        /**
         * 日志
         */
        LOG,

        /**
         * SQL
         */
        SQL,

        /**
         * URL
         */
        URL,

        /**
         * JVM
         */
        JVM,

        /**
         * CPU
         */
        CPU,

        /**
         * 磁盘
         */
        DISK,

        /**
         * USB
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
         * TRACE
         */
        TRACE,

        /**
         * 磁盘 IO
         */
        IO_DISK,

        /**
         * Agent 日志
         */
        AGENT_LOG,

        /**
         * Agent SQL
         */
        AGENT_SQL,

        /**
         * Agent Trace
         */
        AGENT_TRACE,

        /**
         * 全部
         */
        ALL
    }
}