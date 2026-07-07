package com.chua.hotspot.core.support.transfor;

import com.chua.hotspot.core.support.order.Ordered;
import com.chua.hotspot.core.support.span.Span;

/**
 * 转化
 *
 * @author CH
 */
public interface Transfer extends Ordered {

    /**
     * 处理类
     *
     * @return 处理类
     */
    String type();


    /**
     * 名称
     *
     * @return 名称
     */
    String name();

    /**
     * 转化
     *
     * @param params 参数
     * @param span   链路
     */
    void transfer(Object[] params, Span span);
}
