package com.chua.hotspot.spring.support.wrapper;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.spring.support.factory.SpringFactory;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;

/**
 * spring bean工厂
 *
 * @author CH
 */
public class SpringBeanFactoryWrapper implements BeanFactoryWrapper {

    static final SpringBeanFactoryWrapper INSTANCE = new SpringBeanFactoryWrapper();

    public static byte[] getStaticBean() {
        return INSTANCE.getBean();
    }

    private static void registerRootBean(JSONObject jsonObject, String beanDefinitionName, ConfigurableListableBeanFactory listableBeanFactory) {
        BeanDefinition beanDefinition = listableBeanFactory.getBeanDefinition(beanDefinitionName);

        if (!(beanDefinition instanceof RootBeanDefinition)) {
            return;
        }
        RootBeanDefinition rootBeanDefinition = (RootBeanDefinition) beanDefinition;
        jsonObject.put("factory", rootBeanDefinition.getFactoryBeanName());
        jsonObject.put("factoryMethodName", rootBeanDefinition.getFactoryMethodName());
        jsonObject.put("initMethodName", rootBeanDefinition.getInitMethodName());
        jsonObject.put("destroyMethodName", rootBeanDefinition.getDestroyMethodName());
        jsonObject.put("autowireMode", rootBeanDefinition.getAutowireMode());
        jsonObject.put("dependsOn", rootBeanDefinition.getDependsOn());
        jsonObject.put("constructorArgumentCount", rootBeanDefinition.getConstructorArgumentValues().getArgumentCount());
        try {
            Resource resource = rootBeanDefinition.getResource();
            if (null != resource) {
                jsonObject.put("resource", resource.getURI().toURL().toExternalForm());
            } else {
                jsonObject.put("resource", rootBeanDefinition.getBeanClass().getProtectionDomain().getCodeSource().getLocation().toExternalForm());
            }
        } catch (Throwable ignored) {
        }
    }

    private static void registerBean(JSONObject jsonObject, String beanDefinitionName, ConfigurableListableBeanFactory listableBeanFactory) {
        BeanDefinition beanDefinition = listableBeanFactory.getBeanDefinition(beanDefinitionName);
        jsonObject.put("qualifiers", listableBeanFactory.getAliases(beanDefinitionName));
        jsonObject.put("class", beanDefinition.getBeanClassName());
        jsonObject.put("attributes", beanDefinition.attributeNames());
        jsonObject.put("scope", beanDefinition.getScope());
        jsonObject.put("singleton", beanDefinition.isSingleton());
        jsonObject.put("prototype", beanDefinition.isPrototype());
        jsonObject.put("primary", beanDefinition.isPrimary());
    }

    @Override
    public byte[] getBean() {
        ApplicationContext applicationContext = (ApplicationContext) SpringFactory.getInstance().applicationContext;
        if (null == applicationContext) {
            return new byte[0];
        }
        AutowireCapableBeanFactory autowireCapableBeanFactory = applicationContext.getAutowireCapableBeanFactory();
        if (!(autowireCapableBeanFactory instanceof ConfigurableListableBeanFactory)) {
            return new byte[0];
        }

        ConfigurableListableBeanFactory listableBeanFactory = (ConfigurableListableBeanFactory) autowireCapableBeanFactory;
        JSONArray jsonArray = new JSONArray();
        for (String beanDefinitionName : listableBeanFactory.getBeanDefinitionNames()) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("bean", beanDefinitionName);
            registerBean(jsonObject, beanDefinitionName, listableBeanFactory);
            registerRootBean(jsonObject, beanDefinitionName, listableBeanFactory);

            jsonArray.add(jsonObject);
        }

        return jsonArray.toJSONString().getBytes();
    }
}
