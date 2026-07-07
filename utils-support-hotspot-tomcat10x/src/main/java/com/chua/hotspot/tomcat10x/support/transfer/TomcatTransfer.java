package com.chua.hotspot.tomcat10x.support.transfer;

import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.qps.UrlQps;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.transfor.Transfer;
import com.chua.hotspot.core.support.utils.DateUtils;
import org.apache.catalina.connector.Request;
import org.apache.catalina.connector.Response;

import java.net.InetAddress;
import java.util.Enumeration;
import java.util.Locale;
import java.util.StringJoiner;

/**
 * Tomcat 10.x 数据传输器
 * 用于处理 Tomcat 10.x 环境下的请求和响应数据
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class TomcatTransfer implements Transfer {

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
        if (params == null || params.length < 2) {
            return;
        }

        if (!"Request".equals(params[0].getClass().getSimpleName())) {
            return;
        }

        if (params[0] instanceof Request) {
            refreshRequest((Request) params[0], span);
        }

        if (params[1] instanceof Response) {
            refreshResponse((Response) params[1], span);
        }
    }

    /**
     * 刷新响应信息
     *
     * @param response 响应对象
     * @param span     Span 对象
     */
    private void refreshResponse(Response response, Span span) {
        try {
            span.setCode(String.valueOf(response.getStatus()));
        } catch (Exception ignored) {
        }
    }

    /**
     * 刷新请求信息
     *
     * @param request 请求对象
     * @param span    Span 对象
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
        String method = request.getMethod();
        String protocol = request.getProtocol();
        String contentType = request.getContentType();

        StringBuilder desc = new StringBuilder();
        desc.append("[Tomcat (")
            .append(protocol).append(" ")
            .append(method).append(" ")
            .append(uri)
            .append("] [Content-Type: ")
            .append(contentType == null ? "none" : contentType)
            .append(" ] [")
            .append(ReportFactory.APP_HOST)
            .append(":")
            .append(ReportFactory.APP_PORT)
            .append("]");

        if (span.hasException()) {
            desc.insert(0, "<span style='color:red'>").append("</span>");
        }

        // 设置地址
        try {
            span.setAddress(request.getRemoteAddr());
        } catch (Exception ignored) {
        }

        // 添加请求头
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames != null && headerNames.hasMoreElements()) {
            String element = headerNames.nextElement();
            String header = request.getHeader(element);
            span.addHeader(element + ": " + (header == null ? "" : header.replace("\"", "'")));
        }

        // 添加 Locale 信息
        Enumeration<Locale> locales = request.getLocales();
        while (locales != null && locales.hasMoreElements()) {
            Locale locale = locales.nextElement();
            span.addLocation("locale: " + locale.toString());
        }

        // 添加查询参数
        String queryString = request.getQueryString();
        if (queryString != null) {
            String[] split = queryString.split("&");
            for (String s : split) {
                String[] split1 = s.split("=");
                if (split1.length == 1) {
                    span.addQuery(split1[0]);
                } else if (split1.length == 2) {
                    span.addQuery(split1[0] + ": " + split1[1]);
                } else {
                    StringJoiner stringJoiner = new StringJoiner("=");
                    for (int i = 1; i < split1.length; i++) {
                        stringJoiner.add(split1[i]);
                    }
                    span.addQuery(split1[0] + ": " + stringJoiner);
                }
            }
        }

        // 添加请求参数
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames != null && parameterNames.hasMoreElements()) {
            String element = parameterNames.nextElement();
            span.addParam(element + ": " + request.getParameter(element));
        }

        desc.append("]");
        span.setDescription(desc.toString());
    }

    /**
     * 获取客户端 IP 地址
     *
     * @param request 请求对象
     * @return IP 地址
     */
    public static String getIpAddress(Request request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
            if ("127.0.0.1".equals(ip)) {
                try {
                    InetAddress inet = InetAddress.getLocalHost();
                    ip = inet.getHostAddress();
                } catch (Exception e) {
                    // 忽略异常
                }
            }
        }
        // 多个代理的情况，第一个 IP 为客户端真实 IP
        if (ip != null && ip.length() > 15 && ip.contains(",")) {
            ip = ip.substring(0, ip.indexOf(","));
        }
        return ip;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
