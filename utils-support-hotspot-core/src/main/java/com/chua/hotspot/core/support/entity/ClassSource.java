package com.chua.hotspot.core.support.entity;

import lombok.Data;

/**
 * 源文件
 *
 * @author CH
 */
@Data
public class ClassSource {

    private Class<?> type;

    private byte[] source;

    public ClassSource() {
    }

    public ClassSource(Class<?> type, byte[] source) {
        this.type = type;
        this.source = source;
    }

    /**
     * 是否{packageName}包
     *
     * @param packageName 包名
     * @return
     */
    public boolean startsWith(String packageName) {
        return type.getTypeName().startsWith(packageName);
    }
}
