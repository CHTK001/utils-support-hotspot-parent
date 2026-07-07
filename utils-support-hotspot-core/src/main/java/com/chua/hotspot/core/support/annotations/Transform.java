package com.chua.hotspot.core.support.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 转化
 *
 * @author CH
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Transform {


    /**
     * 转化
     *
     * @return Class
     */
    Class<?>[] value();
}
