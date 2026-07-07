package com.chua.hotspot.tomcat9x.support.transfer;

import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.qps.UrlQps;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.transfor.Transfer;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.DateUtils;
import org.apache.catalina.connector.Request;
import org.apache.catalina.connector.Response;

import java.net.InetAddress;
import java.util.Enumeration;
import java.util.Locale;

/**
 * Tomcat 数据传输器
 * 负责将 Tomcat 请求/响应数据转换为 Span 对象
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class TomcatTransfer implements Transfer {
    private static final String UNKNOWN = "unknown";
    private static final String LOCALHOST = "127.0.0.1";

    /**
     * 获取客户端IP地址
     * 支持多级代理场景
     *
     * @param request Tomcat 请求对象
     * @return 客户端IP地址
     */
    public static String getIpAddress(Request request) {
        String ip = request.getHeader("x-forwarded-for");
        if (isInvalidIp(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (isInvalidIp(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (isInvalidIp(ip)) {
            ip = request.getRemoteAddr();
            if (LOCALHOST.equals(ip)) {
                // 根据网卡取本机配置的IP
                try {
                    ip = InetAddress.getLocalHost().getHostAddress();
                } catch (Exception ignored) {
                    // 获取本机IP失败，保持原值
                }
            }
        }
        // 多个代理的情况，第一个IP为客户端真实IP
        if (ip != null && ip.contains(",")) {
            ip = ip.substring(0, ip.indexOf(","));
        }
        return ip;
    }

    /**
     * 判断IP是否无效
     *
     * @param ip IP地址
     * @return 是否无效
     */
    private static boolean isInvalidIp(String ip) {
        return ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip);
    }

    @Override
    public String type() {
        return "org.apache.catalina.core.StandardHostValve";
    }

    @Override
    public String name() {
        return "tomcat";
    }

    @Override
    public void transfer(Object[] params, Span span) {
        if (null != params && params.length == 2 && "Request".equals(params[0].getClass().getSimpleName())) {
            refreshRequest((Request) params[0], span);
            refreshResponse((Response) params[1], span);
        }
    }

    private void refreshResponse(Response response, Span span) {
        try {
            span.setCode(response.getStatus() + "");
        } catch (Exception ignored) {
        }

    }

    /**
     * 刷新请求信息到 Span
     *
     * @param request Tomcat 请求对象
     * @param span    链路跟踪对象
     */
    private void refreshRequest(Request request, Span span) {
        String uri = request.getRequestURI();
        // 记录 QPS 指标
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("url", uri);
        jsonObject.put("ip", getIpAddress(request));
        jsonObject.put("date", DateUtils.current());
        UrlQps.getInstance().addMetric(uri, jsonObject.toJSONString());

        // 构建描述信息
        String desc = buildDescription(request, uri, span.hasException());
        span.setDescription(desc);
        span.setAddress(request.getRemoteAddr());

        // 添加请求头信息
        addHeaders(request, span);
        // 添加区域信息
        addLocales(request, span);
        // 添加查询参数
        addQueryParams(request, span);
        // 添加表单参数
        addFormParams(request, span);
    }

    /**
     * 构建请求描述信息
     */
    private String buildDescription(Request request, String uri, boolean hasException) {
        StringBuilder sb = new StringBuilder(128);
        sb.append("[Tomcat (").append(request.getProtocol()).append(" ")
                .append(request.getMethod()).append(" ").append(uri)
                .append("] [Content-Type: ")
                .append(request.getContentType() != null ? request.getContentType() : "none")
                .append(" ] [").append(ReportFactory.APP_HOST)
                .append(":").append(ReportFactory.APP_PORT).append("]");
        if (hasException) {
            return "<span style='color:red'>" + sb + "</span>";
        }
        return sb.toString();
    }

    /**
     * 添加请求头信息
     */
    private void addHeaders(Request request, Span span) {
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames != null && headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            String value = request.getHeader(name);
            span.addHeader(name + ": " + (value != null ? value.replace("\"", "'") : ""));
        }
    }

    /**
     * 添加区域信息
     */
    private void addLocales(Request request, Span span) {
        Enumeration<Locale> locales = request.getLocales();
        while (locales != null && locales.hasMoreElements()) {
            span.addLocation("locale: " + locales.nextElement());
        }
    }

    /**
     * 添加查询参数
     */
    private void addQueryParams(Request request, Span span) {
        String queryString = request.getQueryString();
        if (queryString == null) {
            return;
        }
        for (String param : queryString.split("&")) {
            String[] parts = param.split("=", 2);
            if (parts.length == 1) {
                span.addQuery(parts[0]);
            } else {
                span.addQuery(parts[0] + ": " + parts[1]);
            }
        }
    }

    /**
     * 添加表单参数
     */
    private void addFormParams(Request request, Span span) {
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames != null && parameterNames.hasMoreElements()) {
            String name = parameterNames.nextElement();
            span.addParam(name + ": " + request.getParameter(name));
        }
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
