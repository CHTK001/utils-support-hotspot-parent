package com.chua.hotspot.undertow.support.transfer;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.qps.UrlQps;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.transfor.Transfer;
import com.chua.hotspot.core.support.utils.DateUtils;
import io.undertow.server.HttpServerExchange;
import io.undertow.util.HeaderMap;
import io.undertow.util.HttpString;

import java.net.InetAddress;
import java.util.*;

/**
 * tomcat
 *
 * @author CH
 */
public class UndertowV1Transfer implements Transfer {
    /**
     * 获取客户端IP地址
     *
     * @return 获取客户端IP地址
     */
    public static String getIpAddress(Object requestObj) {
        if (!(requestObj instanceof HttpServerExchange)) {
            return "";
        }
        
        HttpServerExchange exchange = (HttpServerExchange) requestObj;
        HeaderMap headers = exchange.getRequestHeaders();
        
        String ip = headers.getFirst("x-forwarded-for");
        if (ip == null || ip.isEmpty() || "unknow".equalsIgnoreCase(ip)) {
            ip = headers.getFirst("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = headers.getFirst("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            InetAddress sourceAddress = exchange.getSourceAddress().getAddress();
            ip = sourceAddress.getHostAddress();
            if ("127.0.0.1".equals(ip)) {
                try {
                    InetAddress inet = InetAddress.getLocalHost();
                    ip = inet.getHostAddress();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        // 多个代理的情况，第一个IP为客户端真实IP
        if (ip != null && ip.length() > 15 && ip.indexOf(",") > 0) {
            ip = ip.substring(0, ip.indexOf(","));
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
            refreshRequest(params[0], span);
            refreshResponse(params[0], span);
        }
    }

    private void refreshResponse(Object responseObj, Span span) {
        if (!(responseObj instanceof HttpServerExchange)) {
            return;
        }
        
        HttpServerExchange exchange = (HttpServerExchange) responseObj;
        try {
            span.setCode(String.valueOf(exchange.getStatusCode()));
        } catch (Exception ignored) {
        }
    }

    private void refreshRequest(Object requestObj, Span span) {
        if (!(requestObj instanceof HttpServerExchange)) {
            return;
        }
        
        HttpServerExchange exchange = (HttpServerExchange) requestObj;
        String method = exchange.getRequestMethod().toString();
        String protocol = exchange.getProtocol().toString();
        String requestURI = exchange.getRequestURI();
        
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("url", requestURI);
        jsonObject.put("ip", getIpAddress(exchange));
        jsonObject.put("date", DateUtils.current());

        UrlQps.getInstance().addMetric(requestURI, jsonObject.toJSONString());
        
        HeaderMap requestHeaders = exchange.getRequestHeaders();
        String contentType = requestHeaders.getFirst("Content-Type");

        String desc = "[Undertow (" + method + ") " + protocol + " " + requestURI +
                "] [Content-Type: " + (contentType == null ? "none" : contentType) + " ]" +
                " [" + ReportFactory.APP_HOST + ":" + 
                ReportFactory.APP_PORT + "]";
        
        if (span.hasException()) {
            desc = "<span style='color:red'>" + desc + "</span>";
        }
        
        try {
            span.setAddress(exchange.getSourceAddress().getAddress().getHostAddress());
        } catch (Exception ignored) {
        }

        for (HttpString headerName : requestHeaders.getHeaderNames()) {
            String element = headerName.toString();
            String header = requestHeaders.getFirst(element);
            span.addHeader(element + ": " + (header == null ? "" : header.replace("\"", "'")));
        }

        String queryString = exchange.getQueryString();
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
        
        Map<String, Deque<String>> queryParameters = exchange.getQueryParameters();
        if (queryParameters != null) {
            for (Map.Entry<String, Deque<String>> entry : queryParameters.entrySet()) {
                span.addParam(entry.getKey() + ": " + entry.getValue());
            }
        }
        
        desc += "]";
        span.setDescription(desc);
    }

    @Override
    public int getOrder() {
        return 999;
    }
}
