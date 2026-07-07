package com.chua.hotspot.spring.support.handler;

import org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor;
import org.springframework.beans.factory.annotation.InitDestroyAnnotationBeanPostProcessor;
import org.springframework.beans.factory.annotation.InjectionMetadata;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Map;

/**
 * Spring BeanPostProcessor处理器类
 * 该类实现了BeanPostProcessorHandler接口，用于在Spring框架中处理Bean的初始化前后
 * 该类的实现可以对Bean进行自定义的初始化前处理和初始化后处理
 *
 * @author CH
 */
public class SpringBeanPostProcessorHandler implements BeanPostProcessorHandler {
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
        for (BeanPostProcessor bpp : ((DefaultListableBeanFactory) beanFactory).getBeanPostProcessors()) {
            if (bpp instanceof AutowiredAnnotationBeanPostProcessor) {
                resetAutowiredAnnotationBeanPostProcessorCache((AutowiredAnnotationBeanPostProcessor) bpp);
            } else if (bpp instanceof InitDestroyAnnotationBeanPostProcessor) {
                resetInitDestroyAnnotationBeanPostProcessorCache((InitDestroyAnnotationBeanPostProcessor) bpp);
            }
        }
    }

    public void resetInitDestroyAnnotationBeanPostProcessorCache(InitDestroyAnnotationBeanPostProcessor bpp) {
        try {
            Field field = InitDestroyAnnotationBeanPostProcessor.class.getDeclaredField("lifecycleMetadataCache");
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

    // @Autowired cache
    public void resetAutowiredAnnotationBeanPostProcessorCache(AutowiredAnnotationBeanPostProcessor bpp) {
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
            Map<Class<?>, InjectionMetadata> injectionMetadataCache = (Map<Class<?>, InjectionMetadata>) field.get(bpp);
            injectionMetadataCache.clear();
            // noinspection unchecked
            LOGGER.debug("Cache cleared: AutowiredAnnotationBeanPostProcessor.injectionMetadataCache");
        } catch (Exception e) {
            throw new IllegalStateException("Unable to clear AutowiredAnnotationBeanPostProcessor.injectionMetadataCache", e);
        }

    }
}
