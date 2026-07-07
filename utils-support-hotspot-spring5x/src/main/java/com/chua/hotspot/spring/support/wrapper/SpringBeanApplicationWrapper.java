package com.chua.hotspot.spring.support.wrapper;

import com.chua.hotspot.spring.support.factory.SpringFactory;
import org.springframework.context.ApplicationContext;

/**
 * bean处理器
 *
 * @author CH
 */
public class SpringBeanApplicationWrapper implements BeanApplicationWrapper {
    @Override
    public String[] getBeanNamesForType(Class<?> type) {
        return ((ApplicationContext) SpringFactory.getInstance().applicationContext).getBeanNamesForType(type);
    }
}
