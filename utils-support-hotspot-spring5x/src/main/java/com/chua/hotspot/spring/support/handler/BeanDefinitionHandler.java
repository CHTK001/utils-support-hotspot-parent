package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.utils.ClassUtils;

/**
 * BeanDefinitionHandler接口用于处理Bean的定义
 * 它提供了一个标准的方式来处理如何定义Bean，包括Bean的配置、属性等
 *
 * @author CH
 * @since 版本号 (例如1.0)
 */
public interface BeanDefinitionHandler {
    LogFactory logFactory = LogFactory.getInstance();
    Class<?> CachingMetadataReaderFactoryClass = ClassUtils.forName("org.springframework.core.type.classreading.CachingMetadataReaderFactory");
    Class<?> AnnotatedBeanDefinitionClass = ClassUtils.forName("org.springframework.beans.factory.annotation.AnnotatedBeanDefinition");
    Class<?> AnnotationConfigUtilsClass = ClassUtils.forName("org.springframework.context.annotation.AnnotationConfigUtils");
    Class<?> MetadataReaderClass = ClassUtils.forName("org.springframework.core.type.classreading.MetadataReader");
    Class<?> ClassPathBeanDefinitionScannerClass = ClassUtils.forName("org.springframework.context.annotation.ClassPathBeanDefinitionScanner");
    Class<?> AbstractBeanDefinitionClass = ClassUtils.forName("org.springframework.beans.factory.support.AbstractBeanDefinition");
    Class<?> BeanDefinitionRegistryClass = ClassUtils.forName("org.springframework.beans.factory.support.BeanDefinitionRegistry");
    Class<?> BeanDefinitionClass = ClassUtils.forName("org.springframework.beans.factory.config.BeanDefinition");
    Class<?> ClassPathScanningCandidateComponentProviderClass = ClassUtils.forName("org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider");
    Class<?> BeanDefinitionHolderClass = ClassUtils.forName("org.springframework.beans.factory.config.BeanDefinitionHolder");
    Class<?> ScopeMetadataClass = ClassUtils.forName("org.springframework.context.annotation.ScopeMetadata");
    Class<?> DefaultListableBeanFactoryaClass = ClassUtils.forName("org.springframework.beans.factory.support.DefaultListableBeanFactory");

    /**
     * 创建
     *
     * @param classPathBeanDefinitionScannerPluginObject
     * @return
     */
    static BeanDefinitionHandler create(Object classPathBeanDefinitionScannerPluginObject) {
        BeanDefinitionHandler handler = new ReflectionBeanDefinitionHandler(classPathBeanDefinitionScannerPluginObject);
        if (null != ScopeMetadataClass) {
            handler = new SpringBeanDefinitionHandler(handler);
        }
        return handler;
    }


    /**
     * 重置
     *
     * @param type
     * @param bytes
     */
    void reset(Class<?> type, byte[] bytes);
}
