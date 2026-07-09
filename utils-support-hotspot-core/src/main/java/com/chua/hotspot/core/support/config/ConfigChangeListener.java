package com.chua.hotspot.core.support.config;

/**
 * 配置变更监听器
 * <p>
 * 当配置项发生变更时回调，支持按 key 精确监听或全局监听
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
@FunctionalInterface
public interface ConfigChangeListener {

    /**
     * 配置变更回调
     *
     * @param key      配置键
     * @param oldValue 旧值（可能为 null，表示新增配置）
     * @param newValue 新值（可能为 null，表示删除配置）
     */
    void onChanged(String key, String oldValue, String newValue);
}