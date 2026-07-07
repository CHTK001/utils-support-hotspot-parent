package com.chua.hotspot.core.support.link;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.order.Ordered;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 链路解析器工厂
 * 负责管理和调用 LinkResolver 实现类
 * 使用单例模式，在初始化时自动扫描并加载所有 LinkResolver 实现
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class LinkResolverFactory {

    private static final LogFactory LOG = LogFactory.getInstance();
    
    /**
     * 单例实例
     */
    private static final LinkResolverFactory INSTANCE = new LinkResolverFactory();
    
    /**
     * 已忽略的解析器列表（执行时抛出异常的解析器）
     */
    private final List<LinkResolver> ignoredResolvers = new CopyOnWriteArrayList<>();
    
    /**
     * 所有可用的链路解析器
     */
    private final List<LinkResolver> resolvers = new ArrayList<>();

    /**
     * 私有构造函数
     * 扫描并加载所有 LinkResolver 实现类
     */
    LinkResolverFactory() {
        loadResolvers();
    }

    /**
     * 获取工厂单例实例
     *
     * @return LinkResolverFactory 实例
     */
    public static LinkResolverFactory getInstance() {
        return INSTANCE;
    }

    /**
     * 加载所有 LinkResolver 实现类
     */
    private void loadResolvers() {
        List<Class<?>> classes = ClassUtils.getClasses("com.chua.hotspot");
        for (Class<?> clazz : classes) {
            if (!LinkResolver.class.isAssignableFrom(clazz) || clazz.isInterface()) {
                continue;
            }
            try {
                LinkResolver resolver = (LinkResolver) clazz.newInstance();
                resolvers.add(resolver);
                LOG.debug("加载链路解析器: {}", resolver.name());
            } catch (Throwable e) {
                LOG.debug("加载链路解析器失败: {}", clazz.getName());
            }
        }
        // 按优先级排序
        resolvers.sort(Comparator.comparingInt(Ordered::getOrder));
        LOG.debug("共加载 {} 个链路解析器", resolvers.size());
    }

    // ==================== 链路 ID 获取 ====================

    /**
     * 从请求参数中获取链路 ID
     * 会依次调用所有解析器，返回第一个有效的链路 ID
     *
     * @param args 请求参数数组
     * @return 链路 ID，不存在则返回 null
     */
    public String getLinkId(Object[] args) {
        if (args == null) {
            return null;
        }
        for (LinkResolver resolver : resolvers) {
            if (ignoredResolvers.contains(resolver)) {
                continue;
            }
            try {
                String linkId = resolver.getLinkId(args);
                if (!StringUtils.isBlank(linkId)) {
                    return linkId;
                }
            } catch (Throwable e) {
                // 解析器执行异常，加入忽略列表
                ignoredResolvers.add(resolver);
                LOG.debug("链路解析器 [{}] 执行异常，已忽略", resolver.name());
            }
        }
        return null;
    }

    /**
     * 从请求参数中获取父 Span ID
     * 会依次调用所有解析器，返回第一个有效的父 ID
     *
     * @param args 请求参数数组
     * @return 父 Span ID，不存在则返回 null
     */
    public String getLinkParentId(Object[] args) {
        if (args == null) {
            return null;
        }
        for (LinkResolver resolver : resolvers) {
            if (ignoredResolvers.contains(resolver)) {
                continue;
            }
            try {
                String parentId = resolver.getLinkParentId(args);
                if (!StringUtils.isBlank(parentId)) {
                    return parentId;
                }
            } catch (Throwable e) {
                // 解析器执行异常，加入忽略列表
                ignoredResolvers.add(resolver);
                LOG.debug("链路解析器 [{}] 执行异常，已忽略", resolver.name());
            }
        }
        return null;
    }

    // ==================== 响应处理 ====================

    /**
     * 将链路信息注入到响应对象中
     * 调用所有解析器的 sendResponse 方法
     *
     * @param spans    Span 列表
     * @param response 响应对象
     */
    public void sendResponse(List<Span> spans, Object response) {
        if (spans == null || response == null) {
            return;
        }
        for (LinkResolver resolver : resolvers) {
            try {
                resolver.sendResponse(spans, response);
            } catch (Throwable e) {
                LOG.debug("链路解析器 [{}] 发送响应异常", resolver.name());
            }
        }
    }

    // ==================== 辅助方法 ====================

    /**
     * 获取已加载的解析器数量
     *
     * @return 解析器数量
     */
    public int getResolverCount() {
        return resolvers.size();
    }

    /**
     * 重置忽略列表
     * 允许之前失败的解析器重新参与解析
     */
    public void resetIgnored() {
        ignoredResolvers.clear();
    }
}
