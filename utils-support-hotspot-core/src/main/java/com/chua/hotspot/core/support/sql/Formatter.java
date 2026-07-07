package com.chua.hotspot.core.support.sql;

/**
 * 格式化
 *
 * @author CH
 */
public interface Formatter {
    /**
     * 格式化信息
     *
     * @param source 数据
     * @return 结果
     */
    String format(String source);

}
