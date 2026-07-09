package com.chua.hotspot.core.support.endpoint.request;

/**
 * 监视器请求类型
 *
 * @author CH
 * @version 1.0.0
 * @since 2024/01/31
 */
public enum MonitorRequestType {

    /**
     * 心跳事件
     */
    HEARTBEAT("heartbeat"),

    /**
     * 报告事件
     */
    REPORT("report"),

    ;

    private final String name;

    MonitorRequestType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}