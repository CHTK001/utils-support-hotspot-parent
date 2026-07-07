package com.chua.hotspot.spring.support.wrapper;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.spring.support.factory.SpringFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.io.Resource;

import java.net.URI;

/**
 * spring bean工厂
 *
 * @author CH
 */
public class ReflectionBeanFactoryWrapper implements BeanFactoryWrapper {

    static final ReflectionBeanFactoryWrapper INSTANCE = new ReflectionBeanFactoryWrapper();

    public static byte[] getStaticBean() {
        return INSTANCE.getBean();
    }

    private static void registerRootBean(JSONObject jsonObject, String beanDefinitionName, ConfigurableListableBeanFactory factory) {
        BeanDefinition beanDefinition = factory.getBeanDefinition(beanDefinitionName);
        if (!(beanDefinition instanceof RootBeanDefinition)) {
            return;
        }
        
        RootBeanDefinition rootBean = (RootBeanDefinition) beanDefinition;
        jsonObject.put("factory", rootBean.getFactoryBeanName());
        jsonObject.put("factoryMethodName", rootBean.getFactoryMethodName());
        jsonObject.put("initMethodName", rootBean.getInitMethodName());
        jsonObject.put("destroyMethodName", rootBean.getDestroyMethodName());
        jsonObject.put("autowireMode", rootBean.getAutowireMode());
        jsonObject.put("dependsOn", rootBean.getDependsOn());
        jsonObject.put("constructorArgumentCount", rootBean.getConstructorArgumentValues().getArgumentCount());
        
        try {
            Resource resource = rootBean.getResource();
            if (resource != null) {
                jsonObject.put("resource", resource.getURI().toURL().toExternalForm());
            } else if (rootBean.hasBeanClass()) {
                Class<?> beanClass = rootBean.getBeanClass();
                jsonObject.put("resource", beanClass.getProtectionDomain().getCodeSource().getLocation().toExternalForm());
            }
        } catch (Throwable ignored) {
        }
    }

    private static void registerBean(JSONObject jsonObject, String beanDefinitionName, ConfigurableListableBeanFactory factory) {
        BeanDefinition beanDefinition = factory.getBeanDefinition(beanDefinitionName);

        jsonObject.put("qualifiers", factory.getAliases(beanDefinitionName));
        jsonObject.put("class", beanDefinition.getBeanClassName());
        jsonObject.put("attributes", beanDefinition.attributeNames());
        jsonObject.put("scope", beanDefinition.getScope());
        jsonObject.put("singleton", beanDefinition.isSingleton());
        jsonObject.put("prototype", beanDefinition.isPrototype());
        jsonObject.put("primary", beanDefinition.isPrimary());
    }

    @Override
    public byte[] getBean() {
        Object applicationContext = SpringFactory.getInstance().applicationContext;
        if (!(applicationContext instanceof ConfigurableApplicationContext)) {
            return new byte[0];
        }
        
        ConfigurableApplicationContext context = (ConfigurableApplicationContext) applicationContext;
        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();

        JSONArray jsonArray = new JSONArray();
        String[] beanDefinitionNames = beanFactory.getBeanDefinitionNames();
        
        for (String beanDefinitionName : beanDefinitionNames) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("bean", beanDefinitionName);
            registerBean(jsonObject, beanDefinitionName, beanFactory);
            registerRootBean(jsonObject, beanDefinitionName, beanFactory);
            jsonArray.add(jsonObject);
        }

        return jsonArray.toJSONString().getBytes();
    }
}
