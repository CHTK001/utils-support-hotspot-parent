package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.utils.ClassUtils;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

/**
 * @author CH
 * 类说明：实现BeanPostProcessorHandler接口，用于处理Bean的后置处理器
 * 该类的主要作用是通过反射机制来处理和管理Bean的生命周期中的某些特定阶段
 * 例如，在Bean初始化前后进行特定操作，或者在Bean销毁前后进行资源清理等操作
 * 通过实现BeanPostProcessorHandler接口，可以自定义Bean的创建和销毁行为，从而提高系统的灵活性和可扩展性
 */
public class ReflectionBeanPostProcessorHandler implements BeanPostProcessorHandler {
    @Override
    public void reset(Object beanFactory) {
        Class<?> c = BeanPostProcessorHandler.getReflectionUtilsClassOrNull();
        if (c != null) {
            try {
                Method m = c.getDeclaredMethod("clearCache");
                m.invoke(c);
            } catch (Exception version42Failed) {
                try {
                    // spring 4.0.x, 4.1.x without clearCache method, clear manually
                    Field declaredMethodsCache = c.getDeclaredField("declaredMethodsCache");
                    if (!declaredMethodsCache.isAccessible()) {
                        declaredMethodsCache.setAccessible(true);
                    }
                    ((Map) declaredMethodsCache.get(null)).clear();

                    Field declaredFieldsCache = c.getDeclaredField("declaredFieldsCache");
                    if (!declaredFieldsCache.isAccessible()) {
                        declaredFieldsCache.setAccessible(true);
                    }
                    ((Map) declaredFieldsCache.get(null)).clear();

                } catch (Exception version40Failed) {
                    LOGGER.debug("Failed to clear internal method/field cache, it's normal with spring 4.1x or lower", version40Failed);
                }
            }
            LOGGER.trace("Cleared Spring 4.2+ internal method/field cache.");
        }

        List o = (List) ClassUtils.invokeMethod("getBeanPostProcessors", beanFactory);
        for (Object bpp : o) {
            if (ClassUtils.isAssignableFrom("org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor", bpp)) {
                resetAutowiredAnnotationBeanPostProcessorCache(bpp);
            }
            if (ClassUtils.isAssignableFrom("org.springframework.beans.factory.annotation.InitDestroyAnnotationBeanPostProcessor", bpp)) {
                resetInitDestroyAnnotationBeanPostProcessorCache(bpp);
            }
        }
    }

    public void resetAutowiredAnnotationBeanPostProcessorCache(Object bpp) {
        try {
            Field field = AutowiredAnnotationBeanPostProcessorClass.getDeclaredField("candidateConstructorsCache");
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            // noinspection unchecked
            Map<Class<?>, Constructor<?>[]> candidateConstructorsCache = (Map<Class<?>, Constructor<?>[]>) field.get(bpp);
            candidateConstructorsCache.clear();
            LOGGER.debug("Cache cleared: AutowiredAnnotationBeanPostProcessor.candidateConstructorsCache");
        } catch (Exception e) {
            throw new IllegalStateException("Unable to clear AutowiredAnnotationBeanPostProcessor.candidateConstructorsCache", e);
        }

        try {
            Field field = AutowiredAnnotationBeanPostProcessorClass.getDeclaredField("injectionMetadataCache");
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            //noinspection unchecked
            Map<Class<?>, ?> injectionMetadataCache = (Map<Class<?>, ?>) field.get(bpp);
            injectionMetadataCache.clear();
            // noinspection unchecked
            LOGGER.debug("Cache cleared: AutowiredAnnotationBeanPostProcessor.injectionMetadataCache");
        } catch (Exception e) {
            throw new IllegalStateException("Unable to clear AutowiredAnnotationBeanPostProcessor.injectionMetadataCache", e);
        }

    }

    public void resetInitDestroyAnnotationBeanPostProcessorCache(Object bpp) {
        try {
            Field field = InitDestroyAnnotationBeanPostProcessorClass.getDeclaredField("lifecycleMetadataCache");
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            Map lifecycleMetadataCache = (Map) field.get(bpp);
            lifecycleMetadataCache.clear();
            LOGGER.trace("Cache cleared: InitDestroyAnnotationBeanPostProcessor.lifecycleMetadataCache");
        } catch (Exception e) {
            throw new IllegalStateException("Unable to clear InitDestroyAnnotationBeanPostProcessor.lifecycleMetadataCache", e);
        }
    }

}
