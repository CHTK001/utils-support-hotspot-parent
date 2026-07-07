package com.chua.hotspot.spring6x.support.handler;

import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.ReflectionHelper;
import org.hotswap.agent.plugin.spring.ResetSpringStaticCaches;
import org.hotswap.agent.util.spring.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.Map;

/**
 * @author CH
 */
public class SpringStaticHandler {

    static Class<?> AnnotationUtilsClass = ClassUtils.forName("org.springframework.core.annotation.AnnotationUtils");
    static Class<?> ReflectionUtilsClass = ClassUtils.forName("org.springframework.util.ReflectionUtils");
    static Class<?> GenericTypeResolverClass = ClassUtils.forName("org.springframework.core.GenericTypeResolver");
    static Class<?> CachedIntrospectionResultsClass = ClassUtils.forName("org.springframework.beans.CachedIntrospectionResults");

    /**
     * Spring bean by type cache.
     * <p>
     * Cache names change between versions, call via reflection and ignore errors.
     */
    public static void resetBeanNamesByType(Object defaultListableBeanFactory) {
        try {
            Field field = defaultListableBeanFactory.getClass().getDeclaredField("singletonBeanNamesByType");
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            // noinspection unchecked
            Map singletonBeanNamesByType = (Map) field.get(defaultListableBeanFactory);
            singletonBeanNamesByType.clear();
        } catch (Exception ignored) {
        }

        try {
            Field field = defaultListableBeanFactory.getClass().getDeclaredField("allBeanNamesByType");
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            // noinspection unchecked
            Map allBeanNamesByType = (Map) field.get(defaultListableBeanFactory);
            allBeanNamesByType.clear();
        } catch (Exception ignored) {
        }

        try {
            Field field = defaultListableBeanFactory.getClass().getDeclaredField("nonSingletonBeanNamesByType");
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            // noinspection unchecked
            Map nonSingletonBeanNamesByType = (Map) field.get(defaultListableBeanFactory);
            nonSingletonBeanNamesByType.clear();
        } catch (Exception ignored) {
        }

    }

    /**
     * Reset all caches.
     */
    public static void reset() {
        resetTypeVariableCache();
        resetAnnotationUtilsCache();
        resetReflectionUtilsCache();
        resetResolvableTypeCache();
        resetPropetyCache();
        ClassUtils.invokeStatistic(CachedIntrospectionResultsClass.getTypeName(), "clearClassLoader", ResetSpringStaticCaches.class.getClassLoader());
    }

    private static void resetResolvableTypeCache() {
        ReflectionHelper.invokeNoException(null, "org.springframework.core.ResolvableType",
                ResetSpringStaticCaches.class.getClassLoader(), "clearCache", new Class<?>[]{});
    }

    private static void resetTypeVariableCache() {
        try {
            Field field = GenericTypeResolverClass.getDeclaredField("typeVariableCache");
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            // noinspection unchecked
            Map<Class, Map> typeVariableCache = (Map<Class, Map>) field.get(null);
            typeVariableCache.clear();
        } catch (Exception e) {
            throw new IllegalStateException("Unable to clear GenericTypeResolver.typeVariableCache", e);
        }
    }

    private static void resetReflectionUtilsCache() {
        ReflectionHelper.invokeNoException(null, "org.springframework.util.ReflectionUtils",
                ResetSpringStaticCaches.class.getClassLoader(), "clearCache", new Class<?>[]{});

        Map declaredMethodsCache = (Map) ReflectionHelper.getNoException(null, ReflectionUtils.class,
                "declaredMethodsCache");
        if (declaredMethodsCache != null) {
            declaredMethodsCache.clear();
        }
    }

    private static void resetAnnotationUtilsCache() {
        ReflectionHelper.invokeNoException(null, "org.springframework.core.annotation.AnnotationUtils",
                ResetSpringStaticCaches.class.getClassLoader(), "clearCache", new Class<?>[]{});

        Map annotatedInterfaceCache = (Map) ReflectionHelper.getNoException(null, AnnotationUtilsClass,
                "annotatedInterfaceCache");
        if (annotatedInterfaceCache != null) {
            annotatedInterfaceCache.clear();
        }

        Map findAnnotationCache = (Map) ReflectionHelper.getNoException(null, AnnotationUtilsClass, "findAnnotationCache");
        if (findAnnotationCache != null) {
            findAnnotationCache.clear();
        }

    }

    private static void resetPropetyCache() {
        try {
            ClassLoader classLoader = ResetSpringStaticCaches.class.getClassLoader();
            Map annotationCache = (Map) ReflectionHelper.get(null,
                    classLoader.loadClass("org.springframework.core.convert.Property"), "annotationCache");
            annotationCache.clear();
        } catch (Exception ignored) {
        }
    }
}
