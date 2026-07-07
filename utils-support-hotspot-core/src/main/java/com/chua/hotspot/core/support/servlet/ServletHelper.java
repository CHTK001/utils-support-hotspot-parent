package com.chua.hotspot.core.support.servlet;

import com.chua.hotspot.core.support.recorder.ContainerQpsRecorder;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;

import java.lang.reflect.Method;
import java.util.Enumeration;
import java.util.LinkedList;
import java.util.List;

/**
 * Servlet 辅助工具类
 * <p>
 * 提供 Servlet 相关的公共方法，统一管理容器插件的公共逻辑
 * 支持 javax.servlet 和 jakarta.servlet 两种 API
 * </p>
 *
 * @author CH
 * @version 4.0.0.38
 * @since 2024/12/16
 */
public class ServletHelper {

    private static final ServletHelper INSTANCE = new ServletHelper();

    private ServletHelper() {
    }

    public static ServletHelper getInstance() {
        return INSTANCE;
    }

    /**
     * 检测容器类型
     *
     * @param target 目标对象
     * @return 容器类型
     */
    public static String detectContainerType(Object target) {
        if (target == null) {
            return "TOMCAT";
        }

        String className = target.getClass().getName().toLowerCase();
        if (className.contains("tomcat")) {
            return "TOMCAT";
        } else if (className.contains("undertow")) {
            return "UNDERTOW";
        } else if (className.contains("jetty")) {
            return "JETTY";
        } else if (className.contains("netty")) {
            return "NETTY";
        }

        return "TOMCAT";
    }

    /**
     * 记录请求开始
     *
     * @param target 目标对象
     */
    public static void recordRequestStart(Object target) {
        String containerType = detectContainerType(target);
        ContainerQpsRecorder.getInstance().recordRequestStart(containerType);
    }

    /**
     * 记录请求结束
     *
     * @param target 目标对象
     */
    public static void recordRequestEnd(Object target) {
        try {
            String containerType = detectContainerType(target);
            ContainerQpsRecorder.getInstance().recordRequestEnd(containerType);
        } catch (Exception ignored) {
        }
    }

    /**
     * 获取客户端 IP 地址（通过反射支持 javax 和 jakarta）
     *
     * @param request HttpServletRequest 对象
     * @return 客户端 IP 地址
     */
    public static String getClientIpAddress(Object request) {
        if (request == null) {
            return "unknown";
        }

        try {
            String ip = getHeader(request, "x-forwarded-for");
            if (isEmptyOrUnknown(ip)) {
                ip = getHeader(request, "Proxy-Client-IP");
            }
            if (isEmptyOrUnknown(ip)) {
                ip = getHeader(request, "WL-Proxy-Client-IP");
            }
            if (isEmptyOrUnknown(ip)) {
                ip = getHeader(request, "HTTP_CLIENT_IP");
            }
            if (isEmptyOrUnknown(ip)) {
                ip = getHeader(request, "HTTP_X_FORWARDED_FOR");
            }
            if (isEmptyOrUnknown(ip)) {
                ip = (String) ClassUtils.invoke("getRemoteAddr", request);
            }

            // 多个代理的情况，取第一个 IP
            if (ip != null && ip.contains(",")) {
                ip = ip.substring(0, ip.indexOf(",")).trim();
            }

            return ip != null ? ip : "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * 创建并初始化 Span
     *
     * @param target  目标对象
     * @param method  方法
     * @param objects 参数
     * @return Span 对象
     */
    public static Span createAndInitSpan(Object target, Method method, Object[] objects) {
        Span span = NewTrackManager.createEntrySpan(objects);
        NewTrackManager.doRefreshSpan(target, method, objects, span);
        return span;
    }

    /**
     * 填充 Span 的 HTTP 请求信息
     *
     * @param span    Span 对象
     * @param request HttpServletRequest 对象
     */
    public static void fillHttpSpanInfo(Span span, Object request) {
        if (span == null || request == null) {
            return;
        }

        try {
            // 收集请求头
            List<String> headers = collectHeaders(request);
            span.setTips(headers);

            // 构建请求 URI 描述
            String requestURI = buildRequestUri(request);
            span.setDescription(requestURI);

            // 设置协议和分类
            span.setCategory("HTTP");
            span.setProtocol("HTTP/1.1");
        } catch (Exception ignored) {
        }
    }

    /**
     * 处理 Spring DispatcherServlet 的服务实例上报
     *
     * @param target  目标对象
     * @param request HttpServletRequest 对象
     */
    public static void reportServiceInstance(Object target, Object request) {
        if (target == null) {
            return;
        }

        try {
            if ("org.springframework.web.servlet.DispatcherServlet".equals(target.getClass().getName())) {
                ServiceInstance serviceInstance = new ServiceInstance();
                serviceInstance.setName("HOST");
                serviceInstance.setSourceHost(getClientIpAddress(request));
                serviceInstance.setSourceName("CLIENT");
                serviceInstance.setTargetHost(ReportFactory.APP_HOST);
                serviceInstance.setTargetPort(Integer.parseInt(ReportFactory.APP_PORT));

                ReportFactory.sendServiceInstance(serviceInstance);
            }
        } catch (Exception ignored) {
        }
    }

    /**
     * 收集请求头
     */
    @SuppressWarnings("unchecked")
    private static List<String> collectHeaders(Object request) {
        List<String> headers = new LinkedList<>();
        try {
            Enumeration<String> headerNames = (Enumeration<String>) ClassUtils.invoke("getHeaderNames", request);
            if (headerNames != null) {
                while (headerNames.hasMoreElements()) {
                    String name = headerNames.nextElement();
                    String value = getHeader(request, name);
                    headers.add(name + ":" + value);
                }
            }
        } catch (Exception ignored) {
        }
        return headers;
    }

    /**
     * 构建请求 URI 描述
     */
    private static String buildRequestUri(Object request) {
        try {
            String method = String.valueOf(ClassUtils.invoke("getMethod", request));
            String serverName = String.valueOf(ClassUtils.invoke("getServerName", request));
            Object serverPort = ClassUtils.invoke("getServerPort", request);
            String contextPath = String.valueOf(ClassUtils.invoke("getContextPath", request));
            String requestURI = String.valueOf(ClassUtils.invoke("getRequestURI", request));

            return method + " " + serverName + ":" + serverPort + contextPath + requestURI;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取请求头
     */
    private static String getHeader(Object request, String name) {
        try {
            return (String) ClassUtils.invoke("getHeader", request, name);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 检查字符串是否为空或 unknown
     */
    private static boolean isEmptyOrUnknown(String str) {
        return str == null || str.isEmpty() || "unknown".equalsIgnoreCase(str);
    }
}
