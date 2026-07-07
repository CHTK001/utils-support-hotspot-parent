package com.chua.hotspot.core.support.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author CH
 */
public class DateUtils {

    static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    static final DateTimeFormatter FORMATTER_DAY = DateTimeFormatter.ofPattern("yyyyMMdd");

    /**
     * 现在
     *
     * @return {@link String}
     */
    public static String current() {
        return FORMATTER.format(LocalDateTime.now());
    }

    /**
     * 现在
     *
     * @return {@link String}
     */
    public static String currentDay() {
        return FORMATTER_DAY.format(LocalDateTime.now());
    }
}
