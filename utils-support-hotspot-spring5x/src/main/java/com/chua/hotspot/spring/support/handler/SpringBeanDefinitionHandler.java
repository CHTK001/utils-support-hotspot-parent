package com.chua.hotspot.spring.support.handler;

import com.chua.hotspot.core.support.utils.ReflectionHelper;
import org.hotswap.agent.plugin.spring.ResetSpringStaticCaches;
import org.hotswap.agent.plugin.spring.getbean.ProxyReplacer;
import org.springframework.beans.factory.annotation.AnnotatedBeanDefinition;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanDefinitionHolder;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanNameGenerator;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.annotation.*;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.type.classreading.CachingMetadataReaderFactory;
import org.springframework.core.type.classreading.MetadataReader;
import org.springframework.core.type.classreading.MetadataReaderFactory;

import java.io.IOException;
import java.util.Map;

/**
 * @author CH
 * 类说明：SpringBeanDefinitionHandler类实现了BeanDefinitionHandler接口，
 * 用于处理Spring框架中的Bean定义逻辑。该类主要负责解析和注册Bean定义，
 * 以便Spring容器能够管理和初始化这些Bean。
 */
public class SpringBeanDefinitionHandler implements BeanDefinitionHandler {
    private final ClassPathBeanDefinitionScanner scanner;
    BeanDefinitionRegistry registry;
    ScopeMetadataResolver scopeMetadataResolver;
    BeanNameGenerator beanNameGenerator;

    public SpringBeanDefinitionHandler(Object scanner) {
        this.scanner = (ClassPathBeanDefinitionScanner) scanner;
        this.registry = ((ClassPathBeanDefinitionScanner) scanner).getRegistry();
        this.scopeMetadataResolver = (ScopeMetadataResolver) ReflectionHelper.get(scanner, "scopeMetadataResolver");
        this.beanNameGenerator = (BeanNameGenerator) ReflectionHelper.get(scanner, "beanNameGenerator");
    }


    private void resetCachingMetadataReaderFactoryCache() {
        if (getMetadataReaderFactory() instanceof CachingMetadataReaderFactory) {
            Map metadataReaderCache = (Map) ReflectionHelper.getNoException(getMetadataReaderFactory(),
                    CachingMetadataReaderFactory.class, "metadataReaderCache");

            if (metadataReaderCache == null) {
                metadataReaderCache = (Map) ReflectionHelper.getNoException(getMetadataReaderFactory(),
                        CachingMetadataReaderFactory.class, "classReaderCache");
            }

            if (metadataReaderCache != null) {
                metadataReaderCache.clear();
            }
        }
    }

    private MetadataReaderFactory getMetadataReaderFactory() {
        return (MetadataReaderFactory) ReflectionHelper.get(scanner, "metadataReaderFactory");
    }


    /**
     * Resolve bean definition from class definition if applicable.
     *
     * @param bytes class definition.
     * @return the definition or null if not a spring bean
     */
    public BeanDefinition resolveBeanDefinition(byte[] bytes) throws IOException {
        Resource resource = new ByteArrayResource(bytes);
        resetCachingMetadataReaderFactoryCache();
        MetadataReader metadataReader = getMetadataReaderFactory().getMetadataReader(resource);

        if (isCandidateComponent(metadataReader)) {
            ScannedGenericBeanDefinition sbd = new ScannedGenericBeanDefinition(metadataReader);
            sbd.setResource(resource);
            sbd.setSource(resource);
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

    private BeanDefinitionHolder applyScopedProxyMode(
            ScopeMetadata metadata, BeanDefinitionHolder definition, BeanDefinitionRegistry registry) {
        return (BeanDefinitionHolder) ReflectionHelper.invoke(null, AnnotationConfigUtils.class,
                "applyScopedProxyMode", new Class[]{ScopeMetadata.class, BeanDefinitionHolder.class, BeanDefinitionRegistry.class},
                metadata, definition, registry);

    }

    private void registerBeanDefinition(BeanDefinitionHolder definitionHolder, BeanDefinitionRegistry registry) {
        ReflectionHelper.invoke(scanner, ClassPathBeanDefinitionScanner.class,
                "registerBeanDefinition", new Class[]{BeanDefinitionHolder.class, BeanDefinitionRegistry.class}, definitionHolder, registry);
    }

    private boolean checkCandidate(String beanName, BeanDefinition candidate) {
        return (Boolean) ReflectionHelper.invoke(scanner, ClassPathBeanDefinitionScanner.class,
                "checkCandidate", new Class[]{String.class, BeanDefinition.class}, beanName, candidate);
    }

    private void processCommonDefinitionAnnotations(AnnotatedBeanDefinition candidate) {
        ReflectionHelper.invoke(null, AnnotationConfigUtils.class,
                "processCommonDefinitionAnnotations", new Class[]{AnnotatedBeanDefinition.class}, candidate);
    }

    private void postProcessBeanDefinition(AbstractBeanDefinition candidate, String beanName) {
        ReflectionHelper.invoke(scanner, ClassPathBeanDefinitionScanner.class,
                "postProcessBeanDefinition", new Class[]{AbstractBeanDefinition.class, String.class},
                candidate, beanName);
    }

    private boolean isCandidateComponent(AnnotatedBeanDefinition sbd) {
        return (Boolean) ReflectionHelper.invoke(scanner, ClassPathScanningCandidateComponentProvider.class,
                "isCandidateComponent", new Class[]{AnnotatedBeanDefinition.class}, sbd);
    }

    private boolean isCandidateComponent(MetadataReader metadataReader) {
        return (Boolean) ReflectionHelper.invoke(scanner, ClassPathScanningCandidateComponentProvider.class,
                "isCandidateComponent", new Class[]{MetadataReader.class}, metadataReader);
    }

    @Override
    public void reset(Class<?> type, byte[] bytes) {
        BeanDefinition beanDefinition = null;
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
    public void defineBean(BeanDefinition candidate) {
        synchronized (getClass()) {

            ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(candidate);
            candidate.setScope(scopeMetadata.getScopeName());
            String beanName = this.beanNameGenerator.generateBeanName(candidate, registry);

            if (candidate instanceof AbstractBeanDefinition) {
                postProcessBeanDefinition((AbstractBeanDefinition) candidate, beanName);
            }
            if (candidate instanceof AnnotatedBeanDefinition) {
                processCommonDefinitionAnnotations((AnnotatedBeanDefinition) candidate);
            }

            removeIfExists(beanName);
            if (checkCandidate(beanName, candidate)) {

                BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(candidate, beanName);
                definitionHolder = applyScopedProxyMode(scopeMetadata, definitionHolder, registry);

                logFactory.info("Registering Spring bean '{}'", beanName);
                logFactory.debug("Bean definition '{}'", beanName, candidate);
                registerBeanDefinition(definitionHolder, registry);

                DefaultListableBeanFactory bf = maybeRegistryToBeanFactory();
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
        if (registry.containsBeanDefinition(beanName)) {
            logFactory.debug("Removing bean definition '{}'", beanName);
            DefaultListableBeanFactory bf = maybeRegistryToBeanFactory();
            if (bf != null) {
                RequestMappingHandler.staticReset(bf);
            }
            registry.removeBeanDefinition(beanName);

            ResetSpringStaticCaches.reset();
            SpringStaticHandler.reset();
            if (bf != null) {
                BeanPostProcessorHandler.staticReset(bf);
            }
        }
    }

    private DefaultListableBeanFactory maybeRegistryToBeanFactory() {
        if (registry instanceof DefaultListableBeanFactory) {
            return (DefaultListableBeanFactory) registry;
        } else if (registry instanceof GenericApplicationContext) {
            return ((GenericApplicationContext) registry).getDefaultListableBeanFactory();
        }
        return null;
    }

    // rerun freez configuration - this method is enhanced with cache reset
    private void freezeConfiguration() {
        if (registry instanceof DefaultListableBeanFactory) {
            ((DefaultListableBeanFactory) registry).freezeConfiguration();
        } else if (registry instanceof GenericApplicationContext) {
            (((GenericApplicationContext) registry).getDefaultListableBeanFactory()).freezeConfiguration();
        }
    }
}
