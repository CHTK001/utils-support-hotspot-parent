package com.chua.hotspot.core.support.utils;

/**
 * 数字工具
 *
 * @author CH
 * @since 2024/9/20
 */
public class NumberUtils {
    /**
     * 字符串转int
     *
     * @param s 字符串
     * @return int
     */
    public static int toInt(String s) {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
