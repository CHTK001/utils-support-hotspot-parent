package com.chua.hotspot.spring.support.server.api;

import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.utils.ClassUtils;

import static com.chua.hotspot.core.support.plugin.Plugin.logFactory;

/**
 * Spring Bean 数据 API
 *
 * @author CH
 * @since 2024/11/7
 */
public class SpringBeanRestful implements ApiEndpoint {

    @Override
    public String name() {
        return "spring-bean";
    }

    @Override
    public String description() {
        return "Spring Bean 数据";
    }

    @Override
    public Object handle(HttpRequest request) {
        // 向后兼容：委托给新的 SpringBeanDataApi，避免依赖已移除的 orm 包实现
        logFactory.debug("spring-bean -> spring-bean-data 兼容转发");
        return new SpringBeanDataApi().handle(request);
    }
}
