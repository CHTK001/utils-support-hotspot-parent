package com.chua.hotspot.undertow.support.transfer;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.qps.UrlQps;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.transfor.Transfer;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.DateUtils;
import io.undertow.server.HttpServerExchange;
import io.undertow.util.HeaderMap;
import io.undertow.util.HttpString;

import java.net.InetAddress;
import java.net.URLDecoder;
import java.util.Deque;
import java.util.Map;
import java.util.StringJoiner;

/**
 * tomcat
 *
 * @author CH
 */
public class UndertowV2Transfer implements Transfer {
    /**
     * 获取客户端IP地址
     *
     * @return 获取客户端IP地址
     */
    public static String getIpAddress(HttpServerExchange request) {
        String ip = request.getRequestHeaders().getFirst("x-forwarded-for");
        if (ip == null || ip.isEmpty() || "unknow".equalsIgnoreCase(ip)) {
            ip = request.getRequestHeaders().getFirst("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRequestHeaders().getFirst("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getSourceAddress().getAddress().toString();
            if ("127.0.0.1".equals(ip)) {
                //根据网卡取本机配置的IP
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                ip = inet.getHostAddress();
            }
        }
        // 多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        if (ip != null && ip.length() > 15) {
            if (ip.indexOf(",") > 0) {
                ip = ip.substring(0, ip.indexOf(","));
            }
        }
        return ip;


    }

    @Override
    public String type() {
        return "io.undertow.servlet.handlers.security.ServletConfidentialityConstraintHandler";
    }

    @Override
    public String name() {
        return "undertow";
    }

    @Override
    public void transfer(Object[] params, Span span) {
        if (null != params && params.length == 1) {
            HttpServerExchange exchange = (HttpServerExchange) params[0];
            refreshRequest(exchange, span);
            refreshResponse(exchange, span);
        }
    }

    private void refreshResponse(HttpServerExchange response, Span span) {
        try {
            span.setCode(response.getStatusCode() + "");
        } catch (Exception ignored) {
        }

    }

    private void refreshRequest(HttpServerExchange request, Span span) {
        String desc = "[Undertow (";
        String method = request.getRequestMethod().toString();
        String protocol = request.getProtocol().toString();
        String requestURI = request.getRequestURI();
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("url", URLDecoder.decode(desc, "utf-8"));
        } catch (Exception e) {
            jsonObject.put("url", URLDecoder.decode(desc));
        }
        jsonObject.put("ip", getIpAddress(request));
        jsonObject.put("date", DateUtils.current());

        UrlQps.getInstance().addMetric(requestURI, jsonObject.toJSONString());
        HeaderMap requestHeaders = request.getRequestHeaders();
        String contentType = requestHeaders.getFirst("Content-Type");

        desc += method + ") ";
        desc += protocol + " " + requestURI;
        desc += "] [Content-Type: " + (null == contentType ? "none" : contentType) + " ]";
        desc += " [" + ReportFactory.APP_HOST + ":" + ReportFactory.APP_PORT + "]";
        if (span.hasException()) {
            desc = "<span style='color:red'>" + desc + "</span>";
        }
        try {
            span.setAddress(ClassUtils.getObject("remoteAddr", request) + "");
        } catch (Exception ignored) {
        }


        for (HttpString requestHeader : requestHeaders.getHeaderNames()) {
            String element = requestHeader.toString();
            String header = requestHeaders.getFirst(element);
            span.addHeader(element + ": " + (null == header ? "" : header.replace("\"", "'")));
        }

        String queryString = request.getQueryString();
        if (null != queryString) {
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
                        String s1 = split1[i];
                        stringJoiner.add(s1);
                    }
                    span.addQuery(split1[0] + ": " + stringJoiner);
                }
            }
        }
        Map<String, Deque<String>> queryParameters = request.getQueryParameters();
        if (null != queryParameters) {
            for (Map.Entry<String, Deque<String>> entry : queryParameters.entrySet()) {
                String element = entry.getKey();
                span.addParam(element + ": " + entry.getValue());
            }
            desc += "]";
            span.setDescription(desc);
        }
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
