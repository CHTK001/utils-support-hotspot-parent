package com.chua.hotspot.core.support.indicator;

/**
 * 指标
 *
 * @author CH
 * @since 2024/11/13
 */
public interface Indicator<T> {


    /**
     * 在当前上下文中添加一个指标
     * <p>
     * 此方法用于动态地向系统中添加一个新的指标这个指标用Indicator类型对象表示，
     * 其中包含了指标的名称和具体数据这样，系统可以跟踪和记录各种性能或状态指标，
     * 以便于监控和分析
     *
     * @param name 指标的名称，用于唯一标识该指标不应为空或重复已有的指标名称
     * @param data 指标的数据，泛型类型T允许传递各种类型的指标数据，如整数、浮点数等
     * @return 返回一个Indicator对象，表示新添加的指标这允许调用者进一步操作或引用该指标
     */
    Indicator<T> addMetric(String name, T data);
}
