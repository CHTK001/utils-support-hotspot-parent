package com.chua.hotspot.core.support.http;

import com.chua.hotspot.core.support.perf.HttpPerformanceRecorder;
import com.chua.hotspot.core.support.recorder.MappingQpsRecorder;
import com.chua.hotspot.core.support.monitor.AgentSelfMonitor;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.trace.TraceHelper;
import com.chua.hotspot.core.support.utils.ClassUtils;

import java.lang.reflect.Method;

/**
 * HTTP 拦截统一辅助类
 * <p>
 * 为 Tomcat、Undertow、Jetty 等 HTTP 服务器插件提供统一的拦截入口，
 * 避免重复代码，统一记录链路追踪和性能数据。
 * </p>
 *
 * @author CH
 * @version 4.0.0.33
 */
public class HttpInterceptHelper {

    private static final String PROTOCOL = "HTTP";

    /**
     * HTTP 拦截上下文
     */
    public static class HttpContext {
        public Span span;
        public String url;
        public String httpMethod;
        public long startTime;
        public String category;
        public boolean hasError;
        
        private HttpContext() {}
    }

    /**
     * 请求开始前调用
     *
     * @param method    被拦截的方法
     * @param args      方法参数
     * @param target    目标对象
     * @param category  类别（tomcat/undertow/jetty）
     * @param extractor 请求信息提取器
     * @return HTTP 上下文
     */
    public static HttpContext before(Method method, Object[] args, Object target, 
                                     String category, RequestExtractor extractor) {
        HttpContext ctx = new HttpContext();
        ctx.category = category;
        ctx.startTime = System.currentTimeMillis();
        
        // 创建 Span
        ctx.span = TraceHelper.beforeRequest(method, args, target, PROTOCOL, category);
        
        // 提取 HTTP 请求信息
        try {
            if (extractor != null) {
                ctx.url = extractor.extractUrl(args, target);
                ctx.httpMethod = extractor.extractMethod(args, target);
            }
            
            if (ctx.url != null && ctx.httpMethod != null && !"null".equals(ctx.url)) {
                HttpPerformanceRecorder.getInstance().recordRequestStart(ctx.url, ctx.httpMethod);
                String mappingId = ctx.httpMethod + "#" + ctx.url;
                MappingQpsRecorder.getInstance().recordRequestStart(mappingId, ctx.url, ctx.httpMethod, category);
            }
        } catch (Exception ignored) {
        }
        
        return ctx;
    }

    /**
     * 请求结束后调用
     *
     * @param ctx  HTTP 上下文
     * @param args 方法参数（用于 TraceHelper）
     */
    public static void after(HttpContext ctx, Object[] args) {
        if (ctx == null) return;
        
        // 上报拦截耗时到 AgentSelfMonitor
        long costNanos = (System.currentTimeMillis() - ctx.startTime) * 1_000_000L;
        AgentSelfMonitor.getInstance().recordIntercept(costNanos);
        
        try {
            if (ctx.url != null && ctx.httpMethod != null && !"null".equals(ctx.url)) {
                HttpPerformanceRecorder.getInstance().recordRequestEnd(ctx.url, ctx.httpMethod, ctx.startTime, ctx.hasError);
                String mappingId = ctx.httpMethod + "#" + ctx.url;
                long duration = System.currentTimeMillis() - ctx.startTime;
                MappingQpsRecorder.getInstance().recordRequestEnd(mappingId, duration, ctx.hasError);
            }
        } catch (Exception ignored) {
        }
        
        TraceHelper.afterRequest(ctx.span, args);
    }

    /**
     * 标记请求出错
     */
    public static void markError(HttpContext ctx) {
        if (ctx != null) {
            ctx.hasError = true;
        }
    }

    // ==================== 内置请求提取器 ====================

    /**
     * 请求信息提取器接口
     */
    @FunctionalInterface
    public interface RequestExtractor {
        String extractUrl(Object[] args, Object target);
        
        default String extractMethod(Object[] args, Object target) {
            return "GET";
        }
    }

    /**
     * Tomcat 请求提取器
     * 从 Request 对象（第一个参数）提取
     */
    public static final RequestExtractor TOMCAT = new RequestExtractor() {
        @Override
        public String extractUrl(Object[] args, Object target) {
            if (args != null && args.length > 0) {
                return String.valueOf(ClassUtils.invoke("getRequestURI", args[0]));
            }
            return null;
        }
        
        @Override
        public String extractMethod(Object[] args, Object target) {
            if (args != null && args.length > 0) {
                return String.valueOf(ClassUtils.invoke("getMethod", args[0]));
            }
            return "GET";
        }
    };

    /**
     * Undertow 请求提取器
     * 从 HttpServerExchange 对象（第一个参数）提取
     */
    public static final RequestExtractor UNDERTOW = new RequestExtractor() {
        @Override
        public String extractUrl(Object[] args, Object target) {
            if (args != null && args.length > 0) {
                Object exchange = args[0];
                String url = String.valueOf(ClassUtils.invoke("getRequestURI", exchange));
                if (url == null || "null".equals(url)) {
                    url = String.valueOf(ClassUtils.invoke("getRequestPath", exchange));
                }
                return url;
            }
            return null;
        }
        
        @Override
        public String extractMethod(Object[] args, Object target) {
            if (args != null && args.length > 0) {
                Object requestMethod = ClassUtils.invoke("getRequestMethod", args[0]);
                return requestMethod != null ? requestMethod.toString() : "GET";
            }
            return "GET";
        }
    };

    /**
     * Jetty 请求提取器
     * 从 HttpChannel（target）的 getRequest() 获取
     */
    public static final RequestExtractor JETTY = new RequestExtractor() {
        @Override
        public String extractUrl(Object[] args, Object target) {
            Object request = ClassUtils.invoke("getRequest", target);
            if (request != null) {
                return String.valueOf(ClassUtils.invoke("getRequestURI", request));
            }
            return null;
        }
        
        @Override
        public String extractMethod(Object[] args, Object target) {
            Object request = ClassUtils.invoke("getRequest", target);
            if (request != null) {
                return String.valueOf(ClassUtils.invoke("getMethod", request));
            }
            return "GET";
        }
    };
}
