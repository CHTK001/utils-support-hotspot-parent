package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.utils.ClassUtils;
import org.hotswap.agent.plugin.spring.getbean.ProxyReplacer;
import org.hotswap.agent.util.ReflectionHelper;

import java.io.IOException;
import java.util.Map;

/**
 * bean释义处理程序
 *
 * @author CH
 */
public class ReflectionBeanDefinitionHandler implements BeanDefinitionHandler {

    private final Object scanner;
    Object registry;
    Object scopeMetadataResolver;
    Object beanNameGenerator;


    public ReflectionBeanDefinitionHandler(Object scanner) {
        this.scanner = scanner;
        this.registry = ClassUtils.invoke("getRegistry", scanner);
        this.scopeMetadataResolver = ReflectionHelper.get(scanner, "scopeMetadataResolver");
        this.beanNameGenerator = ReflectionHelper.get(scanner, "beanNameGenerator");
    }

    private void resetCachingMetadataReaderFactoryCache() {
        if (ClassUtils.isAssignableFrom("org.springframework.core.type.classreading.CachingMetadataReaderFactory", getMetadataReaderFactory())) {
            Map metadataReaderCache = (Map) ReflectionHelper.getNoException(getMetadataReaderFactory(),
                    CachingMetadataReaderFactoryClass, "metadataReaderCache");

            if (metadataReaderCache == null) {
                metadataReaderCache = (Map) ReflectionHelper.getNoException(getMetadataReaderFactory(),
                        CachingMetadataReaderFactoryClass, "classReaderCache");
            }

            if (metadataReaderCache != null) {
                metadataReaderCache.clear();
            }
        }
    }

    private Object getMetadataReaderFactory() {
        return ReflectionHelper.get(scanner, "metadataReaderFactory");
    }


    /**
     * Resolve bean definition from class definition if applicable.
     *
     * @param bytes class definition.
     * @return the definition or null if not a spring bean
     */
    public Object resolveBeanDefinition(byte[] bytes) throws IOException {
        Object resource = ClassUtils.newObject("org.springframework.core.io.ByteArrayResource", bytes);
        resetCachingMetadataReaderFactoryCache();
        Object metadataReader = ClassUtils.invoke("getMetadataReader", getMetadataReaderFactory(), resource);

        if (isCandidateComponentForMetadataReader(metadataReader)) {
            Object sbd = ClassUtils.newObject("org.springframework.context.annotation.ScannedGenericBeanDefinition", metadataReader);
            ClassUtils.invoke("setResource", sbd, resource);
            ClassUtils.invoke("setSource", sbd, resource);
//            if (isCandidateComponent(sbd)) {
            return sbd;
//            }
//            return null;
        }
        return null;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////
    // Access private / protected members

    /// /////////////////////////////////////////////////////////////////////////////////////////

    private Object applyScopedProxyMode(
            Object metadata, Object definition, Object registry) {
        return ReflectionHelper.invoke(null, AnnotationConfigUtilsClass,
                "applyScopedProxyMode", new Class[]{ScopeMetadataClass, BeanDefinitionHolderClass, BeanDefinitionRegistryClass},
                metadata, definition, registry);

    }

    private void registerBeanDefinition(Object definitionHolder, Object registry) {
        ReflectionHelper.invoke(scanner, ClassPathBeanDefinitionScannerClass,
                "registerBeanDefinition", new Class[]{BeanDefinitionHolderClass, BeanDefinitionRegistryClass}, definitionHolder, registry);
    }

    private boolean checkCandidate(String beanName, Object candidate) {
        return (Boolean) ReflectionHelper.invoke(scanner, ClassPathBeanDefinitionScannerClass,
                "checkCandidate", new Class[]{String.class, BeanDefinitionClass}, beanName, candidate);
    }

    private void processCommonDefinitionAnnotations(Object candidate) {
        ReflectionHelper.invoke(null, AnnotationConfigUtilsClass,
                "processCommonDefinitionAnnotations", new Class[]{AnnotatedBeanDefinitionClass}, candidate);
    }

    private void postProcessBeanDefinition(Object candidate, String beanName) {
        ReflectionHelper.invoke(scanner, ClassPathBeanDefinitionScannerClass,
                "postProcessBeanDefinition", new Class[]{AbstractBeanDefinitionClass, String.class},
                candidate, beanName);
    }

    private boolean isCandidateComponentForAnnotatedBeanDefinitionClass(Object sbd) {
        return (Boolean) ReflectionHelper.invoke(scanner, ClassPathScanningCandidateComponentProviderClass,
                "isCandidateComponent", new Class[]{AnnotatedBeanDefinitionClass}, sbd);
    }

    private boolean isCandidateComponentForMetadataReader(Object metadataReader) {
        return (Boolean) ReflectionHelper.invoke(scanner, ClassPathScanningCandidateComponentProviderClass,
                "isCandidateComponent", new Class[]{MetadataReaderClass}, metadataReader);
    }

    public void reset(Class<?> type, byte[] bytes) {
        Object beanDefinition = null;
        try {
            beanDefinition = resolveBeanDefinition(bytes);
        } catch (IOException ignored) {
        }

        if (beanDefinition != null) {
            defineBean(beanDefinition);
        }
    }


    /**
     * Resolve candidate to a bean definition and (re)load in Spring.
     * Synchronize to avoid parallel bean definition - usually on reload the beans are interrelated
     * and parallel load will cause concurrent modification exception.
     *
     * @param candidate the candidate to reload
     */
    public void defineBean(Object candidate) {
        synchronized (getClass()) {
            Object scopeMetadata = ClassUtils.invoke("resolveScopeMetadata", this.scopeMetadataResolver, candidate);
            ClassUtils.invoke("setScope", candidate, ClassUtils.invoke("getScopeName", scopeMetadata));
            String beanName = (String) ClassUtils.invoke("generateBeanName", this.beanNameGenerator, candidate, registry);//this.beanNameGenerator.generateBeanName(candidate, registry);

            if (ClassUtils.isAssignableFrom("org.springframework.beans.factory.support.AbstractBeanDefinition", candidate)) {
                postProcessBeanDefinition(candidate, beanName);
                processCommonDefinitionAnnotations(candidate);
            }

            removeIfExists(beanName);
            if (checkCandidate(beanName, candidate)) {

                Object definitionHolder = ClassUtils.newObject(BeanDefinitionHolderClass.getTypeName(), candidate, beanName);
                definitionHolder = applyScopedProxyMode(scopeMetadata, definitionHolder, registry);

                logFactory.info("Registering Spring bean '{}'", beanName);
                logFactory.debug("Bean definition '{}'", beanName, candidate);
                registerBeanDefinition(definitionHolder, registry);

                Object bf = maybeRegistryToBeanFactory();
                if (bf != null) {
                    RequestMappingHandler.staticReset(bf);
                }

                ProxyReplacer.clearAllProxies();
                freezeConfiguration();
            }
        }

    }

    /**
     * If registry contains the bean, remove it first (destroying existing singletons).
     *
     * @param beanName name of the bean
     */
    private void removeIfExists(String beanName) {
        if ((boolean) ClassUtils.invoke("containsBeanDefinition", registry, beanName)) {
            logFactory.debug("Removing bean definition '{}'", beanName);
            Object bf = maybeRegistryToBeanFactory();
            if (bf != null) {
                RequestMappingHandler.staticReset(bf);
            }
            ClassUtils.invoke("removeBeanDefinition", registry, beanName);

            ResetStaticCachesHandler.staticReset();
            SpringStaticHandler.reset();
            if (bf != null) {
                BeanPostProcessorHandler.staticReset(bf);
            }
        }
    }

    private Object maybeRegistryToBeanFactory() {
        if (ClassUtils.isAssignableFrom("org.springframework.beans.factory.support.DefaultListableBeanFactory", registry)) {
            return registry;
        } else if (ClassUtils.isAssignableFrom("org.springframework.context.support.GenericApplicationContext", registry)) {
            return ClassUtils.invoke("getDefaultListableBeanFactory", registry);
        }
        return null;
    }

    // rerun freez configuration - this method is enhanced with cache reset
    private void freezeConfiguration() {
        if (ClassUtils.isAssignableFrom("org.springframework.beans.factory.support.DefaultListableBeanFactory", registry)) {
            ClassUtils.invoke("freezeConfiguration", registry);
        } else if (ClassUtils.isAssignableFrom("org.springframework.context.support.GenericApplicationContext", registry)) {
            Object getDefaultListableBeanFactory = ClassUtils.invoke("getDefaultListableBeanFactory", registry);
            ClassUtils.invoke("freezeConfiguration", getDefaultListableBeanFactory);
        }
    }
}
