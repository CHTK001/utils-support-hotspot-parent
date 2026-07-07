package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.utils.ClassUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Map;


/**
 * 请求映射处理器
 *
 * @author CH
 */
public class ReflectionRequestMappingHandler implements RequestMappingHandler {

    @Override
    public void reset(Object beanFactory) {
        Class<?> c = RequestMappingHandler.getHandlerMethodMappingClassOrNull();
        if (c == null) {
            return;
        }

        Map<String, ?> mappings = ClassUtils.invokeStatistic("org.springframework.beans.factory.BeanFactoryUtils", "beansOfTypeIncludingAncestors", beanFactory, c, true, false);
        if (mappings.isEmpty()) {
            LOGGER.trace("Spring: no HandlerMappings found");
        }
        try {
            for (Map.Entry<String, ?> e : mappings.entrySet()) {
                Object am = e.getValue();
                LOGGER.info("Spring: clearing HandlerMapping for {}", am.getClass());
                try {
                    Field f = c.getDeclaredField("handlerMethods");
                    if (!f.isAccessible()) {
                        f.setAccessible(true);
                    }
                    ((Map<?, ?>) f.get(am)).clear();
                    f = c.getDeclaredField("urlMap");
                    if (!f.isAccessible()) {
                        f.setAccessible(true);
                    }
                    ((Map<?, ?>) f.get(am)).clear();
                    try {
                        f = c.getDeclaredField("nameMap");
                        if (!f.isAccessible()) {
                            f.setAccessible(true);
                        }
                        ((Map<?, ?>) f.get(am)).clear();
                    } catch (NoSuchFieldException nsfe) {
                        LOGGER.trace("Probably using Spring 4.0 or below", nsfe);
                    }
                } catch (NoSuchFieldException nsfe) {
                    LOGGER.trace("Probably using Spring 4.2+", nsfe);
                    Method m = c.getDeclaredMethod("getHandlerMethods");
                    Class<?>[] parameterTypes = new Class[1];
                    parameterTypes[0] = Object.class;
                    Method u = c.getDeclaredMethod("unregisterMapping", parameterTypes);
                    Map<?, ?> unmodifiableHandlerMethods = (Map<?, ?>) m.invoke(am);
                    Object[] keys = unmodifiableHandlerMethods.keySet().toArray();
                    unmodifiableHandlerMethods = null;
                    for (Object key : keys) {
                        u.invoke(am, key);
                    }
                }

                if (ClassUtils.isAssignableFrom("org.springframework.beans.factory.InitializingBean", am)) {
                    ClassUtils.invokeMethod("afterPropertiesSet", am);
                }
            }
        } catch (Exception ignored) {
        }
    }
}
