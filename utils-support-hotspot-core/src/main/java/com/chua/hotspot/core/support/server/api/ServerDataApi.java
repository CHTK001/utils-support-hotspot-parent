package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;

/**
 * 服务数据 API
 * <p>
 * 提供服务实例列表查询接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ServerDataApi implements ApiEndpoint {

    @Override
    public String name() {
        return "server";
    }

    @Override
    public String description() {
        return "获取服务实例列表";
    }

    @Override
    public Object handle(HttpRequest request) {
        // 返回 ReportFactory 中的服务实例列表
        return ReportFactory.getServiceList();
    }
}
