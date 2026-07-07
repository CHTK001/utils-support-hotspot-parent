package com.chua.hotspot.core.support.pojo;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * log事件
 *
 * @author CH
 * @since 2024/9/7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class LogEvent extends TimestampEvent implements Serializable {

    /**
     * 日志级别
     */
    private String level;
    /**
     * traceId
     */
    private String traceId;
    /**
     * 日志内容
     */
    private String message;
    /**
     * 日志类
     */
    private String logger;
    /**
     * 线程
     */
    private String thread;
    /**
     * 类名
     */
    private String className;
    /**
     * 行号
     */
    private Integer line;

}
