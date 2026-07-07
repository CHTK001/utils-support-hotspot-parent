package com.chua.hotspot.spring.support.handler;

import static com.chua.hotspot.spring.support.handler.RequestMappingHandler.getHandlerMethodMappingClassOrNull;

/**
 * @author CH
 * 接口定义了重置Spring静态缓存的处理逻辑
 */
public interface ResetStaticCachesHandler {


    static void staticReset() {
        ResetStaticCachesHandler handler = new ReflectionResetStaticCachesHandler();
        if (null != getHandlerMethodMappingClassOrNull()) {
            handler = new SpringResetStaticCachesHandler();
        }
        handler.reset();
    }

    /**
     * 重置Spring静态缓存
     */
    void reset();
}
