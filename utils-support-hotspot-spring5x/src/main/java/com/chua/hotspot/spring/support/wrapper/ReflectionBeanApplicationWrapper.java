package com.chua.hotspot.spring.support.wrapper;

import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.spring.support.factory.SpringFactory;

/**
 * bean处理器
 *
 * @author CH
 */
public class ReflectionBeanApplicationWrapper implements BeanApplicationWrapper {
    @Override
    public String[] getBeanNamesForType(Class<?> type) {
        return (String[]) ClassUtils.invoke("getBeanNamesForType", SpringFactory.getInstance().applicationContext);
    }
}
