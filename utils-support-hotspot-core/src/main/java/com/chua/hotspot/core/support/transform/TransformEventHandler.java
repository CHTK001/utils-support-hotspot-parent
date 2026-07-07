package com.chua.hotspot.core.support.transform;

import java.io.File;
import java.nio.file.Path;

/**
 * 转换事件处理器接口
 * 用于处理文件、Socket、管道等资源的打开/关闭事件
 *
 * @author CH
 * @since 2024/12/11
 */
public interface TransformEventHandler {

    /**
     * 文件打开事件
     *
     * @param source 打开的对象
     * @param file   文件
     * @param span   跟踪信息
     */
    default void onFileOpen(Object source, File file, Span span) {
    }

    /**
     * 文件通道打开事件
     *
     * @param source 打开的对象
     * @param path   文件路径
     * @param span   跟踪信息
     */
    default void onFileChannelOpen(Object source, Path path, Span span) {
    }

    /**
     * Socket打开事件
     *
     * @param source  打开的对象
     * @param address 地址信息
     * @param span    跟踪信息
     */
    default void onSocketOpen(Object source, String address, Span span) {
    }

    /**
     * 管道打开事件
     *
     * @param source 打开的对象
     * @param type   管道类型（Source/Sink）
     * @param span   跟踪信息
     */
    default void onPipeOpen(Object source, String type, Span span) {
    }

    /**
     * 选择器打开事件
     *
     * @param source 打开的对象
     * @param span   跟踪信息
     */
    default void onSelectorOpen(Object source, Span span) {
    }

    /**
     * 资源关闭事件
     *
     * @param source 关闭的对象
     * @param span   跟踪信息（可能为null，如果资源未被追踪）
     */
    default void onClose(Object source, Span span) {
    }

    /**
     * 文件描述符不足事件
     *
     * @param currentCount 当前打开的文件数量
     */
    default void onOutOfDescriptors(int currentCount) {
    }

    /**
     * 阈值超出事件
     *
     * @param count     当前句柄数量
     * @param threshold 阈值
     */
    default void onThresholdExceeded(int count, int threshold) {
    }
}
