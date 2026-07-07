package com.chua.hotspot.spring6x.support.wrapper;

/**
 * BeanApplicationWrapper
 *
 * @author CH
 */
public class BeanApplicationWrapper {

    private final Object applicationContext;

    public BeanApplicationWrapper(Object applicationContext) {
        this.applicationContext = applicationContext;
    }

    public Object getApplicationContext() {
        return applicationContext;
    }
}
