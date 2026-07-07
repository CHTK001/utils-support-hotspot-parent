package com.chua.hotspot.core.support.hotswap;

/**
 * 热加载工厂
 *
 * @author CH
 */
public class HotswapFactory {


    private static final HotswapFactory HOTSWAP_FACTORY = new HotswapFactory();

    private HotswapFactory() {
    }

    public static HotswapFactory getInstance() {
        return HOTSWAP_FACTORY;
    }

}
