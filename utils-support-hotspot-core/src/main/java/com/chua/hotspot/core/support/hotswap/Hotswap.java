package com.chua.hotspot.core.support.hotswap;

/**
 * 热加载
 * <p>
 * 实现类应覆写 {@link #targetType()} 方法显式声明目标类型，
 * 避免运行时通过泛型反射提取类型参数带来的性能开销。
 * </p>
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

    /**
     * 获取热部署的目标类型
     * <p>
     * 推荐实现类覆写此方法显式返回目标类型，避免运行时泛型反射提取。
     * 默认返回 null，此时 PluginFactory 会降级使用泛型反射提取。
     * </p>
     *
     * @return 目标类型 Class，未显式声明时返回 null
     */
    default Class<?> targetType() {
        return null;
    }
}
