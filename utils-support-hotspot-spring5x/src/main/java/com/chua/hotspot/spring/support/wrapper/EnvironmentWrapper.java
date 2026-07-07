package com.chua.hotspot.spring.support.wrapper;

import static com.chua.hotspot.spring.support.factory.SpringFactory.hasSpringType;

/**
 * 环境注册
 *
 * @author CH
 */
public interface EnvironmentWrapper {

    /**
     * 注册
     */
    static void registerEnvironment(Object environment) {
        if (hasSpringType()) {
            SpringEnvironmentWrapper environmentWrapper = new SpringEnvironmentWrapper();
            environmentWrapper.register(environment);
        }
    }

    /**
     * 注册
     *
     * @param environment 环境
     */
    void register(Object environment);
}
