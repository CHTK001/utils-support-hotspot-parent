package com.chua.hotspot.core.support.link;

import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.chua.hotspot.core.support.constant.Constant.LINK_ID;

/**
 * HTTP Servlet LinkResolver
 * <p>
 * 通用的 HTTP Servlet 链路解析器，支持 javax.servlet 和 jakarta.servlet
 * 通过反射方式获取请求头，无需依赖具体的 Servlet API
 * </p>
 *
 * @author CH
 * @version 4.0.0.38
 * @since 2024/12/16
 */
public class HttpServletLinkResolver implements LinkResolver {

    /**
     * javax.servlet.http.HttpServletRequest 类名
     */
    private static final String JAVAX_HTTP_SERVLET_REQUEST = "javax.servlet.http.HttpServletRequest";

    /**
     * jakarta.servlet.http.HttpServletRequest 类名
     */
    private static final String JAKARTA_HTTP_SERVLET_REQUEST = "jakarta.servlet.http.HttpServletRequest";

    @Override
    public String name() {
        // 返回通用名称，同时支持 javax 和 jakarta
        return "HttpServletRequest";
    }

    @Override
    public String getLinkId(Object[] args) {
        return getHeader(args, LINK_ID);
    }

    @Override
    public String getLinkParentId(Object[] args) {
        return getHeader(args, LINK_ID);
    }

    @Override
    public void sendResponse(List<Span> spans, Object response) {
        // 暂不处理响应
    }

    @Override
    public Map<String, String> extractHeaders(Object[] args) {
        Map<String, String> headers = new HashMap<>();
        if (args == null || args.length == 0) {
            return headers;
        }

        Object arg = args[0];
        if (arg == null || !isHttpServletRequest(arg)) {
            return headers;
        }

        // 提取分布式追踪相关请求头
        String[] traceHeaders = {
            "X-Trace-Id", "X-Span-Id", "X-Parent-Span-Id", "X-Trace-Sampled",
            "X-B3-TraceId", "X-B3-SpanId", "X-B3-ParentSpanId", "X-B3-Sampled",
            LINK_ID
        };

        for (String headerName : traceHeaders) {
            try {
                String value = (String) ClassUtils.invoke("getHeader", arg, headerName);
                if (value != null && !value.isEmpty()) {
                    headers.put(headerName, value);
                }
            } catch (Exception ignored) {
                // 忽略单个请求头提取异常
            }
        }

        // 提取所有 X-Baggage- 前缀的请求头
        try {
            Object enumeration = ClassUtils.invoke("getHeaders", arg, "X-Baggage-");
            if (enumeration != null) {
                java.util.Iterator<?> it = (java.util.Iterator<?>) ClassUtils.invoke("asIterator", enumeration);
                // 简化处理：仅提取已知前缀的 baggage 头
            }
        } catch (Exception ignored) {
            // 忽略 baggage 提取异常
        }

        return headers;
    }

    @Override
    public int getOrder() {
        return 0;
    }

    /**
     * 获取请求头
     */
    private String getHeader(Object[] args, String headerName) {
        if (args == null || args.length == 0) {
            return null;
        }

        Object arg = args[0];
        if (arg == null) {
            return null;
        }

        // 检查是否是 HttpServletRequest
        if (!isHttpServletRequest(arg)) {
            return null;
        }

        try {
            return (String) ClassUtils.invoke("getHeader", arg, headerName);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 检查对象是否是 HttpServletRequest（支持 javax 和 jakarta）
     */
    private boolean isHttpServletRequest(Object obj) {
        if (obj == null) {
            return false;
        }

        String className = obj.getClass().getName();

        // 直接匹配
        if (JAVAX_HTTP_SERVLET_REQUEST.equals(className) ||
                JAKARTA_HTTP_SERVLET_REQUEST.equals(className)) {
            return true;
        }

        // 检查接口
        for (Class<?> iface : obj.getClass().getInterfaces()) {
            String ifaceName = iface.getName();
            if (JAVAX_HTTP_SERVLET_REQUEST.equals(ifaceName) ||
                    JAKARTA_HTTP_SERVLET_REQUEST.equals(ifaceName)) {
                return true;
            }
        }

        // 检查父类和父接口
        return isAssignableFromHttpServletRequest(obj.getClass());
    }

    /**
     * 递归检查是否实现了 HttpServletRequest 接口
     */
    private boolean isAssignableFromHttpServletRequest(Class<?> clazz) {
        if (clazz == null || clazz == Object.class) {
            return false;
        }

        // 检查所有接口
        for (Class<?> iface : clazz.getInterfaces()) {
            String ifaceName = iface.getName();
            if (JAVAX_HTTP_SERVLET_REQUEST.equals(ifaceName) ||
                    JAKARTA_HTTP_SERVLET_REQUEST.equals(ifaceName)) {
                return true;
            }
            // 递归检查接口的父接口
            if (isAssignableFromHttpServletRequest(iface)) {
                return true;
            }
        }

        // 检查父类
        return isAssignableFromHttpServletRequest(clazz.getSuperclass());
    }
}
