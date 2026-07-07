package com.chua.hotspot.spring.support.handler;

import org.hotswap.agent.plugin.spring.ResetSpringStaticCaches;

/**
 * spring重置静态缓存
 *
 * @author CH
 */
public class SpringResetStaticCachesHandler implements ResetStaticCachesHandler {
    @Override
    public void reset() {
        ResetSpringStaticCaches.reset();
    }
}
