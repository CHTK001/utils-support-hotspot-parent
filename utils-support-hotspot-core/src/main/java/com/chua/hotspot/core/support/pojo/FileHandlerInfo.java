package com.chua.hotspot.core.support.pojo;

import lombok.Data;

/**
 * 文件句柄
 *
 * @author CH
 */
@Data
public class FileHandlerInfo {

    private final Object aThis;
    private final Object[] args;
    /**
     * 文件句柄
     */
    private String typeName;

    /**
     * 文件路径
     */
    private String filePath;

    public FileHandlerInfo(Object aThis, Object[] args) {
        this.aThis = aThis;
        this.typeName = aThis.getClass().getName();
        this.filePath = args[0].toString();
        this.args = args;
    }
}
