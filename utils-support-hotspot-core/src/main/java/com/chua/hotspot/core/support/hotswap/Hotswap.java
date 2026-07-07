package com.chua.hotspot.core.support.hotswap;

/**
 * 热加载
 *
 * @author CH
 */
public interface Hotswap<T> {

    /**
     * 重载
     *
     * @param t t
     */
    void reload(T t);
}
