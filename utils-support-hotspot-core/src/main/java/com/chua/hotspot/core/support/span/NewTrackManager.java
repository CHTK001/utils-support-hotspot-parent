package com.chua.hotspot.core.support.span;

import com.chua.hotspot.core.support.link.LinkResolverFactory;
import com.chua.hotspot.core.support.log.LogFactory;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;

/**
 * 链路追踪管理器
 * 负责管理当前线程的 Span 集合，提供 Span 的创建、注册、获取和清理操作
 * <p>
 * 使用 ThreadLocal 保证线程安全，每个线程拥有独立的 Span 集合
 * </p>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public final class NewTrackManager {

    private static final LogFactory LOG = LogFactory.getInstance();
    
    /**
     * 链路追踪集合缓存（线程局部变量）
     */
    private static final ThreadLocal<List<Span>> SPAN_STACK = new ThreadLocal<>();
    
    /**
     * 默认链路 ID
     */
    private static final String DEFAULT_LINK_ID = "nvl";
    
    /**
     * 根 Span 的父 ID
     */
    private static final String ROOT_PARENT_ID = "0";

    private NewTrackManager() {
        // 私有构造函数，禁止实例化
    }

    // ==================== 链路 ID 获取 ====================

    /**
     * 从请求参数中获取链路 ID
     *
     * @param args 请求参数
     * @return 链路 ID
     */
    public static String getRequestLinkId(Object[] args) {
        return LinkResolverFactory.getInstance().getLinkId(args);
    }

    /**
     * 从请求参数中获取父 Span ID
     *
     * @param args 请求参数
     * @return 父 Span ID
     */
    public static String getRequestLinkParentId(Object[] args) {
        return LinkResolverFactory.getInstance().getLinkParentId(args);
    }

    // ==================== Span 获取 ====================

    /**
     * 获取当前线程的 Span 集合
     *
     * @return Span 集合（可能为 null）
     */
    public static List<Span> currentSpans() {
        return SPAN_STACK.get();
    }

    /**
     * 获取当前 Span（最后一个）
     *
     * @return 当前 Span，如果集合为空则返回 null
     */
    public static Span getCurrentSpan() {
        List<Span> list = SPAN_STACK.get();
        if (list == null || list.isEmpty()) {
            return null;
        }
        return list.get(list.size() - 1);
    }

    /**
     * 获取第一个 Span
     *
     * @return 第一个 Span，如果集合为空则返回 null
     */
    public static Span getFirstSpan() {
        List<Span> list = SPAN_STACK.get();
        if (list == null || list.isEmpty()) {
            TrackContext.clear();
            return null;
        }
        return list.get(0);
    }

    /**
     * 兼容旧方法名
     * @deprecated 使用 {@link #getFirstSpan()} 替代
     */
    @Deprecated
    public static Span getFisrtSpan() {
        return getFirstSpan();
    }

    /**
     * 获取最后一个 Span
     *
     * @return 最后一个 Span，如果集合为空则返回 null
     */
    public static Span getLastSpan() {
        List<Span> list = SPAN_STACK.get();
        if (list == null || list.isEmpty()) {
            TrackContext.clear();
            return null;
        }
        return list.get(list.size() - 1);
    }

    // ==================== Span 创建 ====================

    /**
     * 创建入口 Span
     *
     * @return 新创建的 Span
     */
    public static Span createEntrySpan() {
        Span span = doCreateSpan();
        List<Span> list = SPAN_STACK.get();
        span.setEnterTime(System.currentTimeMillis());
        
        if (list.isEmpty()) {
            span.setId(span.getLinkId());
        } else {
            span.setId(UUID.randomUUID().toString());
            span.setPid(list.get(list.size() - 1).getId());
        }
        list.add(span);
        return span;
    }

    /**
     * 创建入口 Span，并从参数中提取链路信息
     *
     * @param args 请求参数
     * @return 新创建的 Span
     */
    public static Span createEntrySpan(Object[] args) {
        Span currentSpan = getCurrentSpan();

        // 修复：先决定 linkId，再调用 doCreateSpan
        String resolvedLinkId = null;
        if (currentSpan == null) {
            resolvedLinkId = getRequestLinkId(args);
            if (resolvedLinkId == null) {
                resolvedLinkId = UUID.randomUUID().toString();
            }
            TrackContext.setLinkId(resolvedLinkId);
        }

        Span span = doCreateSpan();
        if (resolvedLinkId != null) {
            span.setLinkId(resolvedLinkId);
        }

        List<Span> list = SPAN_STACK.get();
        if (list.isEmpty()) {
            span.setId(span.getLinkId());
            span.setPid(ROOT_PARENT_ID);
        } else {
            span.setId(UUID.randomUUID().toString());
            span.setPid(list.get(list.size() - 1).getId());
        }
        list.add(span);
        return span;
    }

    /**
     * 创建并刷新 Span 信息
     *
     * @param target  目标对象
     * @param method  方法
     * @param args    参数
     * @return 新创建的 Span
     */
    public static Span createRefreshSpan(Object target, Method method, Object[] args) {
        Span span = createEntrySpan(args);
        refreshSpanInfo(target, method, args, span);
        return span;
    }

    /**
     * 创建 Span 内部方法
     *
     * @return 新创建的 Span
     */
    private static Span doCreateSpan() {
        List<Span> list = SPAN_STACK.get();
        if (list == null) {
            list = new ArrayList<>();
            SPAN_STACK.set(list);
        }

        String linkId;
        if (list.isEmpty()) {
            linkId = TrackContext.getLinkId();
            if (linkId == null) {
                linkId = DEFAULT_LINK_ID;
                TrackContext.setLinkId(linkId);
            }
        } else {
            linkId = list.get(list.size() - 1).getLinkId();
            TrackContext.setLinkId(linkId);
        }
        return new Span(linkId);
    }

    // ==================== Span 注册与清理 ====================

    /**
     * 注册 Span 到当前线程的集合
     *
     * @param span 要注册的 Span
     */
    public static void registerSpan(Span span) {
        if (span == null) {
            return;
        }
        List<Span> list = SPAN_STACK.get();
        if (list == null) {
            list = new ArrayList<>();
            SPAN_STACK.set(list);
        }
        list.add(span);
    }

    /**
     * 清除当前线程的 Span 栈
     */
    public static void clear() {
        SPAN_STACK.remove();
    }

    // ==================== Span 更新 ====================

    /**
     * 刷新 Span 的方法信息
     *
     * @param target 目标对象
     * @param method 方法
     * @param args   参数
     * @param span   要刷新的 Span
     */
    public static void doRefreshSpan(Object target, Method method, Object[] args, Span span) {
        refreshSpanInfo(target, method, args, span);
    }

    /**
     * 刷新 Span 信息内部方法
     */
    private static void refreshSpanInfo(Object target, Method method, Object[] args, Span span) {
        if (method == null || span == null) {
            return;
        }
        String className = target.getClass().getName();
        String methodName = method.getName();
        
        span.setFrom(className + "." + methodName);
        span.setDescription("链路追踪(MQ)：" + className + "." + methodName);
        span.setMethod(methodName);
        span.setTypeName(className);
        
        LOG.debug(span.getDescription());
    }

    /**
     * 计算并设置 Span 耗时
     *
     * @param span Span 对象
     */
    public static void costTime(Span span) {
        if (span == null || span.getEnterTime() == null) {
            return;
        }
        span.setCostTime(System.currentTimeMillis() - span.getEnterTime());
    }

    /**
     * 注册 Span 结束时间
     *
     * @param span Span 对象
     */
    public static void registerFinishTime(Span span) {
        if (span == null) {
            return;
        }
        long now = System.currentTimeMillis();
        span.setExitTime(now);
        if (span.getEnterTime() != null) {
            span.setCostTime(now - span.getEnterTime());
        }
    }

    // ==================== 响应处理 ====================

    /**
     * 执行 Callable 并返回结果
     *
     * @param callable 要执行的 Callable
     * @return 执行结果
     * @throws Exception 执行异常
     */
    public static Object invoke(Callable<?> callable) throws Exception {
        return callable.call();
    }

    /**
     * 发送响应链路信息
     *
     * @param spans    Span 列表
     * @param response 响应对象
     */
    public static void sendResponse(List<Span> spans, Object response) {
        LinkResolverFactory.getInstance().sendResponse(spans, response);
    }
}