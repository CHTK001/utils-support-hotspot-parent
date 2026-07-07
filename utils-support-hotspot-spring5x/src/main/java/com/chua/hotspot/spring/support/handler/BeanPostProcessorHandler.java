package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.utils.ClassUtils;

/**
 * BeanPostProcessorHandler
 *
 * @author CH
 */
public interface BeanPostProcessorHandler {

    LogFactory LOGGER = LogFactory.getInstance();
    Class<?> AutowiredAnnotationBeanPostProcessorClass = ClassUtils.forName("org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor");
    Class<?> InitDestroyAnnotationBeanPostProcessorClass = ClassUtils.forName("org.springframework.beans.factory.annotation.InitDestroyAnnotationBeanPostProcessor");

    /**
     * 重置
     *
     * @param bf bf
     */
    static void staticReset(Object bf) {
        Class<?> handlerMethodMappingClassOrNull = getReflectionUtilsClassOrNull();
        BeanPostProcessorHandler handler = new ReflectionBeanPostProcessorHandler();
        if (null != handlerMethodMappingClassOrNull) {
            handler = new SpringBeanPostProcessorHandler();
        }
        handler.reset(bf);
    }

    /**
     * 获取映射类
     *
     * @return Class
     */
    static Class<?> getReflectionUtilsClassOrNull() {
        try {
            //This is probably a bad idea as Class.forName has lots of issues but this was easiest for now.
            return Class.forName("org.springframework.util.ReflectionUtils");
        } catch (ClassNotFoundException e) {
            LOGGER.trace("Spring 4.1.x or below - ReflectionUtils class not found");
            return null;
        }
    }

    /**
     * 重置
     *
     * @param beanFactory beanFactory
     */
    void reset(Object beanFactory);
}
