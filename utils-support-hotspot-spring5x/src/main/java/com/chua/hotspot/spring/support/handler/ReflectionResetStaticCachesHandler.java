package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.utils.ClassUtils;
import org.hotswap.agent.plugin.spring.ResetSpringStaticCaches;
import org.hotswap.agent.util.ReflectionHelper;

import java.lang.reflect.Field;
import java.util.Map;

import static com.chua.hotspot.spring.support.handler.RequestMappingHandler.LOGGER;
import static com.chua.hotspot.spring.support.handler.SpringStaticHandler.*;

/**
 * 重置静态缓存处理器
 *
 * @author CH
 */
public class ReflectionResetStaticCachesHandler implements ResetStaticCachesHandler {
    private static void resetPropetyCache() {
        try {
            ClassLoader classLoader = ResetSpringStaticCaches.class.getClassLoader();
            Map annotationCache = (Map) ReflectionHelper.get(null,
                    classLoader.loadClass("org.springframework.core.convert.Property"), "annotationCache");
            annotationCache.clear();
            LOGGER.trace("Cache cleared: Property.annotationCache");
        } catch (Exception e) {
            LOGGER.trace("Unable to clear Property.annotationCache (ok before Spring 3.2.x)", e);
        }
    }

    private static void resetResolvableTypeCache() {
        ReflectionHelper.invokeNoException(null, "org.springframework.core.ResolvableType",
                ResetSpringStaticCaches.class.getClassLoader(), "clearCache", new Class<?>[]{});
    }

    private static void resetReflectionUtilsCache() {
        ReflectionHelper.invokeNoException(null, "org.springframework.util.ReflectionUtils",
                ResetSpringStaticCaches.class.getClassLoader(), "clearCache", new Class<?>[]{});

        Map declaredMethodsCache = (Map) ReflectionHelper.getNoException(null, ReflectionUtilsClass,
                "declaredMethodsCache");
        if (declaredMethodsCache != null) {
            declaredMethodsCache.clear();
            LOGGER.trace("Cache cleared: ReflectionUtils.declaredMethodsCache");
        } else {
            LOGGER.trace("Cache NOT cleared: ReflectionUtils.declaredMethodsCache not exists");
        }
    }

    private static void resetAnnotationUtilsCache() {
        ReflectionHelper.invokeNoException(null, "org.springframework.core.annotation.AnnotationUtils",
                ResetSpringStaticCaches.class.getClassLoader(), "clearCache", new Class<?>[]{});

        Map annotatedInterfaceCache = (Map) ReflectionHelper.getNoException(null, AnnotationUtilsClass,
                "annotatedInterfaceCache");
        if (annotatedInterfaceCache != null) {
            annotatedInterfaceCache.clear();
            LOGGER.trace("Cache cleared: AnnotationUtils.annotatedInterfaceCache");
        } else {
            LOGGER.trace("Cache NOT cleared: AnnotationUtils.annotatedInterfaceCache not exists in target Spring verion (pre 3.1.x)");
        }

        Map findAnnotationCache = (Map) ReflectionHelper.getNoException(null, AnnotationUtilsClass, "findAnnotationCache");
        if (findAnnotationCache != null) {
            findAnnotationCache.clear();
            LOGGER.trace("Cache cleared: AnnotationUtils.findAnnotationCache");
        } else {
            LOGGER.trace("Cache NOT cleared: AnnotationUtils.findAnnotationCache not exists in target Spring version (pre 4.1)");
        }

    }

    private static void resetTypeVariableCache() {
        try {
            Field field = GenericTypeResolverClass.getDeclaredField("typeVariableCache");
            field.setAccessible(true);
            Map<Class, Map> typeVariableCache = (Map) field.get(null);
            typeVariableCache.clear();
            LOGGER.trace("Cache cleared: GenericTypeResolver.typeVariableCache");
        } catch (Exception e) {
            throw new IllegalStateException("Unable to clear GenericTypeResolver.typeVariableCache", e);
        }
    }

    @Override
    public void reset() {
        resetTypeVariableCache();
        resetAnnotationUtilsCache();
        resetReflectionUtilsCache();
        resetResolvableTypeCache();
        resetPropetyCache();
        ClassUtils.invokeStatistic("org.springframework.beans.CachedIntrospectionResults", "clearClassLoader", ResetSpringStaticCaches.class.getClassLoader());
    }
}
