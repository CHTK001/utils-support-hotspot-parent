package com.chua.hotspot.core.support.handler;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.pojo.FileHandlerInfo;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 文件处理工厂
 *
 * @author CH
 */
public class FileHandlerFactory {

    static final LogFactory logger = LogFactory.getInstance();
    static final Map<Object, FileHandlerInfo> METHOD_CALL_MAP = new ConcurrentHashMap<>();
    private static final FileHandlerFactory FILE_HANDLER = new FileHandlerFactory();

    public static FileHandlerFactory getInstance() {
        return FILE_HANDLER;
    }


    public static void open(Object _this, Object[] args) {
        if (args[0].toString().contains("FileHandlerInfo.class")) {
            return;
        }
        METHOD_CALL_MAP.put(_this, new FileHandlerInfo(_this, args));
        logger.info("句柄数量:{}", METHOD_CALL_MAP.size());
    }

    public static void close(Object _this, Object[] args) {
        METHOD_CALL_MAP.remove(_this);
        logger.info("句柄数量:{}", METHOD_CALL_MAP.size());

    }

}
