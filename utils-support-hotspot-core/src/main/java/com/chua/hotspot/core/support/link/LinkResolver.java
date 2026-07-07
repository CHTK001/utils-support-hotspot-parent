package com.chua.hotspot.core.support.link;

import com.chua.hotspot.core.support.order.Ordered;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.StringUtils;

import java.util.List;

/**
 * 链路解析器接口
 * 用于从请求中提取链路追踪信息，并将链路信息注入到响应中
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public interface LinkResolver extends Ordered {

    /**
     * 获取解析器名称
     *
     * @return 解析器名称
     */
    String name();

    /**
     * 从请求参数中提取链路 ID
     *
     * @param args 请求参数数组
     * @return 链路 ID，不存在则返回 null
     */
    String getLinkId(Object[] args);

    /**
     * 检查请求中是否包含链路 ID
     *
     * @param args 请求参数数组
     * @return 包含链路 ID 返回 true
     */
    default boolean hasLinkId(Object[] args) {
        return !StringUtils.isBlank(getLinkId(args));
    }

    /**
     * 从请求参数中提取父 Span ID
     *
     * @param args 请求参数数组
     * @return 父 Span ID，不存在则返回 null
     */
    String getLinkParentId(Object[] args);

    /**
     * 检查请求中是否包含父 Span ID
     *
     * @param args 请求参数数组
     * @return 包含父 Span ID 返回 true
     */
    default boolean hasLinkParentId(Object[] args) {
        return !StringUtils.isBlank(getLinkParentId(args));
    }

    /**
     * 将链路信息注入到响应对象中
     * 用于跨服务传递链路信息
     *
     * @param spans    当前链路的 Span 列表
     * @param response 响应对象
     */
    void sendResponse(List<Span> spans, Object response);
}
