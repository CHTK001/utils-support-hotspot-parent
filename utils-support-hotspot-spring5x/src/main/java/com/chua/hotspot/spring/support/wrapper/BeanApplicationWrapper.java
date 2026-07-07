package com.chua.hotspot.spring.support.wrapper;

import com.chua.hotspot.spring.support.factory.SpringFactory;

/**
 * bean应用包装
 *
 * @author CH
 */
public interface BeanApplicationWrapper {

    /**
     * 获取静态bean名称
     *
     * @param type 类型
     * @return 名称
     */
    static String[] getStaticBeanNamesForType(Class<?> type) {
        BeanApplicationWrapper wrapper = new ReflectionBeanApplicationWrapper();
        if (SpringFactory.hasSpringType()) {
            wrapper = new SpringBeanApplicationWrapper();
        }

        return wrapper.getBeanNamesForType(type);
    }

    /**
     * 根据类型获取名称
     *
     * @param type 类型
     * @return 名称
     */
    String[] getBeanNamesForType(Class<?> type);
}
