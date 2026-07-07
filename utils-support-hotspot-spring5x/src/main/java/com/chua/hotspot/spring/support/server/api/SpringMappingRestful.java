package com.chua.hotspot.spring.support.server.api;

import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import static com.chua.hotspot.core.support.plugin.Plugin.logFactory;
import static com.chua.hotspot.core.support.utils.ClassUtils.invokeStatistic;
import static com.chua.hotspot.core.support.utils.ClassUtils.isPresent;

/**
 * Spring Mapping 数据 API
 *
 * @author CH
 * @since 2024/11/7
 */
public class SpringMappingRestful implements ApiEndpoint {

    @Override
    public String name() {
        return "spring-mapping";
    }

    @Override
    public String description() {
        return "Spring Mapping 数据";
    }

    @Override
    public Object handle(HttpRequest request) {
        // 向后兼容：委托给新的 SpringMappingDataApi，避免依赖已移除的 orm 包实现
        logFactory.debug("spring-mapping -> spring-mapping-data 兼容转发");
        return new SpringMappingDataApi().handle(request);
    }
}
