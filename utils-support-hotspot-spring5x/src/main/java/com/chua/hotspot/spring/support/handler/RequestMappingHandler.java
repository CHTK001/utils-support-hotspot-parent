package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.log.LogFactory;

/**
 * 请求映射处理器
 *
 * @author CH
 */
public interface RequestMappingHandler {
    LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 重置
     *
     * @param bf bf
     */
    static void staticReset(Object bf) {
        Class<?> handlerMethodMappingClassOrNull = getHandlerMethodMappingClassOrNull();
        RequestMappingHandler handler = new ReflectionRequestMappingHandler();
        if (null != handlerMethodMappingClassOrNull) {
            handler = new SpringRequestMappingHandler();
        }
        handler.reset(bf);
    }

    /**
     * 获取映射类
     *
     * @return Class
     */
    static Class<?> getHandlerMethodMappingClassOrNull() {
        try {
            //This is probably a bad idea as Class.forName has lots of issues but this was easiest for now.
            return Class.forName("org.springframework.web.servlet.handler.AbstractHandlerMethodMapping");
        } catch (ClassNotFoundException e) {
            LOGGER.trace("HandlerMethodMapping class not found");
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
