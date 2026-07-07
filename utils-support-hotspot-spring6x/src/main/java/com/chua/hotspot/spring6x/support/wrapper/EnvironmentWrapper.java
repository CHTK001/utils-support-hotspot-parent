package com.chua.hotspot.spring6x.support.wrapper;

/**
 * EnvironmentWrapper
 *
 * @author CH
 */
public class EnvironmentWrapper {

    private final Object environment;

    public EnvironmentWrapper(Object environment) {
        this.environment = environment;
    }

    public Object getEnvironment() {
        return environment;
    }
}
