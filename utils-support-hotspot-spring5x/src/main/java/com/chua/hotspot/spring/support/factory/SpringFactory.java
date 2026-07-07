package com.chua.hotspot.spring.support.factory;

import com.chua.hotspot.core.support.entity.ClassSource;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.spring.support.handler.BeanDefinitionHandler;
import com.chua.hotspot.spring.support.wrapper.BeanApplicationWrapper;
import com.chua.hotspot.spring.support.wrapper.EnvironmentWrapper;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static com.chua.hotspot.core.support.plugin.Plugin.logFactory;

/**
 * SpringFactory
 *
 * @author CH
 */
public class SpringFactory {

    static Map<String, BeanDefinitionHandler> classPathBeanDefinitionScannerMap = new ConcurrentHashMap<>();
    private static final SpringFactory factory = new SpringFactory();
    public Object applicationContext;
    public static Object requestMappingHandlerMapping;
    BeanDefinitionHandler reflectionBeanDefinitionHandler;
    private Object environment;
    private Object classPathBeanDefinitionScannerPluginObject;
    private String classPathBeanDefinitionScannerPluginObjectParam0;


    private SpringFactory() {
    }

    public static SpringFactory getInstance() {
        return factory;
    }

    public static boolean hasSpringType() {
        return ClassUtils.isPresent("org.springframework.context.ApplicationContext");
    }

    public void registerApplicationContext(Object applicationContext) {
        this.applicationContext = applicationContext;
    }
    

    public void registerEnvironment(Object environment) {
        if (this.environment != null) {
            return;
        }
        this.environment = environment;
        logFactory.info("初始化 -> spring-environment");
        EnvironmentWrapper.registerEnvironment(environment);
    }

    public void registerRequestMappingHandlerMapping(Object requestMappingHandlerMapping) {
        if (this.requestMappingHandlerMapping != null) {
            return;
        }

        if(requestMappingHandlerMapping.getClass().getTypeName().contains("Endpoint")) {
            return;
        }
        logFactory.info("初始化 -> spring-requestMappingHandlerMapping");
        this.requestMappingHandlerMapping = requestMappingHandlerMapping;
    }


    public String[] getBeanNamesForType(Class<?> type) {
        return BeanApplicationWrapper.getStaticBeanNamesForType(type);
    }

    public void reset(ClassSource classSource) {
        for (BeanDefinitionHandler handler : classPathBeanDefinitionScannerMap.values()) {
            handler.reset(classSource.getType(), classSource.getSource());
        }
    }
}
