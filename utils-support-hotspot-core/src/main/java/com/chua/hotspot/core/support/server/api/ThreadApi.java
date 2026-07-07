package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import java.util.List;

/**
 * 线程信息 API
 * <p>
 * 提供当前 JVM 所有线程信息的查询接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ThreadApi implements ApiEndpoint {

    @Override
    public String name() {
        return "thread";
    }

    @Override
    public String description() {
        return "获取 JVM 线程信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        ThreadInfo[] threadInfos = threadMXBean.dumpAllThreads(false, false);
        return ThreadInfoDTO.fromArray(threadInfos);
    }
}
