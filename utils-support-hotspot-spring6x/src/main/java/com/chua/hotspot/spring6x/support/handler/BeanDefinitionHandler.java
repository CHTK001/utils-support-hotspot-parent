package com.chua.hotspot.spring6x.support.handler;

import com.chua.hotspot.core.support.entity.ClassSource;

/**
 * BeanDefinitionHandler
 *
 * @author CH
 */
public interface BeanDefinitionHandler {

    /**
     * 处理
     *
     * @param classSource classSource
     */
    void handle(ClassSource classSource);
}
