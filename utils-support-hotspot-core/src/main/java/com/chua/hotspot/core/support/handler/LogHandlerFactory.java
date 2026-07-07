package com.chua.hotspot.core.support.handler;

/**
 * 日志处理工厂
 *
 * @author CH
 */
public class LogHandlerFactory {
    private static final LogHandlerFactory FILE_HANDLER = new LogHandlerFactory();

    private LogHandlerFactory() {
    }


    public static LogHandlerFactory getInstance() {
        return FILE_HANDLER;
    }

    public static void open(Object _this, Object[] args) {
        System.out.println();
    }
}
