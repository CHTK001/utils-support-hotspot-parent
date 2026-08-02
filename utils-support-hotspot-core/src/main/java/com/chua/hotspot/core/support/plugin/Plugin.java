package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.constant.Constant;
import com.chua.hotspot.core.support.log.LogFactory;

/**
 * 插件接口
 * 定义了所有 Hotspot 插件的通用生命周期方法
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public interface Plugin extends Constant {

    /**
     * 日志对象
     */
    LogFactory logFactory = LogFactory.getInstance();

    /**
     * 获取插件名称
     * 用于日志记录和插件标识
     *
     * @return 插件名称
     */
    String name();

    /**
     * 插件初始化
     * 在插件加载时调用，用于执行初始化操作
     */
    void init();

    /**
     * 插件完成
     * 在插件卸载时调用，用于执行清理操作
     */
    void finish();

    /**
     * 插件初始化完成回调
     * 在所有插件初始化完成后调用
     */
    void initComplete();
}
