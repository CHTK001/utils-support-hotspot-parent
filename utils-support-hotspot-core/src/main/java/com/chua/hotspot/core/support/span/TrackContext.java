package com.chua.hotspot.core.support.span;

/**
 * 链路追踪上下文
 * 使用 ThreadLocal 存储当前线程的链路 ID，支持跨线程传递
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class TrackContext {

    /**
     * 链路 ID 线程本地存储
     */
    private static final ThreadLocal<String> THREAD_LOCAL = new ThreadLocal<>();

    /**
     * 清除当前线程的链路 ID
     * 在请求结束后应该调用此方法，避免内存泄漏
     */
    public static void clear() {
        THREAD_LOCAL.remove();
    }

    /**
     * 获取当前线程的链路 ID
     *
     * @return 链路 ID，不存在则返回 null
     */
    public static String getLinkId() {
        return THREAD_LOCAL.get();
    }

    /**
     * 设置当前线程的链路 ID
     *
     * @param linkId 链路 ID
     */
    public static void setLinkId(String linkId) {
        THREAD_LOCAL.set(linkId);
    }
}