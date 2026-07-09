package com.chua.hotspot.httpclient4x.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.HexUtils;
import org.apache.http.HttpRequest;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.Header;
import org.apache.http.util.EntityUtils;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.net.URI;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * HttpClient 4.x 插件
 * <p>
 * 使用 Advice + Spy 模式替代 MethodDelegation 模式，解决 ClassLoader 可见性问题。
 * </p>
 *
 * <h3>ClassLoader 隔离问题：</h3>
 * <pre>
 * MethodDelegation.to(HttpClient4xPlugin.class) 在增强字节码中嵌入对插件类的引用，
 * 运行时应用 ClassLoader (LaunchedURLClassLoader) 无法加载 HotspotPluginClassLoader 中的插件类，
 * 导致 ClassNotFoundException。
 *
 * Advice + Spy 模式：增强字节码只引用 Bootstrap CL 中的 Spy.class，
 * 通过 SpyHandler 接口桥接到 HotspotPluginClassLoader 中的实现，无 ClassLoader 可见性问题。
 * </pre>
 *
 * @author CH
 * @since 4.0.0.34
 * @version 4.0.0.37
 */
public class HttpClient4xPlugin extends com.chua.hotspot.httpclient3x.support.plugin.HttpClient3xPlugin {

    private static final String DO_EXECUTE = "doExecute";
    static Pattern compile = Pattern.compile("\\[(.*?)\\]");

    // ==================== Advice + Spy 模式配置 ====================

    @Override
    public boolean useLegacyMethodDelegation() {
        // 使用 Advice + Spy 模式，避免 MethodDelegation 的 ClassLoader 可见性问题
        return false;
    }

    @Override
    public ElementMatcher<? super MethodDescription> methodMatcher() {
        // 拦截 doExecute 方法（HttpClient 4.x 的核心执行方法）
        return ElementMatchers.isMethod().and(ElementMatchers.named("doExecute"));
    }

    // ==================== Spy 回调方法 ====================

    /**
     * Spy 前置回调 - 在 doExecute 方法执行前调用
     * <p>
     * 创建 Span 并注入链路追踪头到 HttpRequest
     * </p>
     */
    @Override
    public void spyBefore(String className, String methodName, Object target, Object[] args) {
        super.spyBefore(className, methodName, target, args);

        SpyContext ctx = getSpyContext();
        if (ctx == null) {
            return;
        }

        try {
            // 检查是否为 doExecute 方法且参数包含 HttpRequest
            if (!DO_EXECUTE.equals(methodName) || args == null || args.length < 2 || !(args[1] instanceof HttpRequest)) {
                return;
            }

            HttpRequest httpRequest = (HttpRequest) args[1];
            Span exitSpan = NewTrackManager.createEntrySpan(args);
            String linkId = exitSpan.getLinkId();
            String pid = exitSpan.getId();

            if (linkId != null) {
                httpRequest.addHeader(LINK_ID, linkId);
                httpRequest.addHeader(LINK_PID, pid);

                try {
                    URI uri = new URI(httpRequest.getRequestLine().getUri());
                    ServiceInstance ss = new ServiceInstance();
                    ss.setName("HTTP4");
                    ss.setSourceName("HOST");
                    ss.setSourceHost(ReportFactory.APP_HOST);
                    ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                    ss.setTargetHost(uri.getHost());
                    ss.setTargetPort(uri.getPort());
                    ReportFactory.sendServiceInstance(ss);
                } catch (Exception ignored) {
                }
            }

            // 将 Span 存入 SpyContext，供 spyAfter 使用
            ctx.span = exitSpan;
        } catch (Exception e) {
            logFactory.debug("HttpClient4x spyBefore 异常: {}", e.getMessage());
        }
    }

    /**
     * Spy 后置回调 - 在 doExecute 方法正常返回后调用
     * <p>
     * 记录 Span 详情：请求头、响应头、链路信息等
     * </p>
     */
    @Override
    public void spyAfter(String className, String methodName, Object target, Object[] args, Object result) {
        try {
            SpyContext ctx = getSpyContext();
            if (ctx == null) {
                return;
            }

            Span span = ctx.span;
            if (span == null || args == null || args.length < 2 || !(args[1] instanceof HttpRequest)) {
                super.spyAfter(className, methodName, target, args, result);
                return;
            }

            HttpRequest request = (HttpRequest) args[1];
            String httpMethodName = request.getRequestLine().getMethod();
            String uri = request.getRequestLine().getUri();

            List<String> stack = new LinkedList<>();
            stack.add(uri);
            stack.add("<strong class='node-details__name collapse-handle'>请求头</strong>");

            Header[] allHeaders = request.getAllHeaders();
            for (Header header : allHeaders) {
                String s = header.toString();
                if (s.startsWith("x-request")) {
                    continue;
                }
                stack.add(s);
            }

            stack.add("<strong class='node-details__name collapse-handle'>请求体</strong>");
            try {
                if (request instanceof HttpEntityEnclosingRequest) {
                    HttpEntityEnclosingRequest entityRequest = (HttpEntityEnclosingRequest) request;
                    if (entityRequest.getEntity() != null) {
                        stack.add(EntityUtils.toString(entityRequest.getEntity()));
                    }
                }
            } catch (Exception ignored) {
            }
            stack.add("<strong class='node-details__name collapse-handle'>响应头</strong>");

            span.setDescription(httpMethodName + " " + uri);
            span.setMethod(methodName);
            span.setTypeName(target != null ? target.getClass().getTypeName() : className);
            span.setTips(stack);
            span.setCategory("HTTP");
            span.setProtocol("HTTP/1.1");

            // 计算耗时
            NewTrackManager.costTime(span);

            // 从响应中提取跨服务链路信息
            if (null != result) {
                String s = result.toString();
                Matcher matcher = compile.matcher(s);
                if (matcher.find()) {
                    String group = matcher.group();
                    Map<String, String> tpl = new LinkedHashMap<>();
                    for (String s1 : group.split(",")) {
                        String replace = s1.trim().replace("[", "").replace("]", "");
                        String[] split = replace.split(":");
                        try {
                            tpl.put(split[0], split[1]);
                        } catch (Exception ignored) {
                        }
                    }
                    if (tpl.containsKey(LINK_RES_SPAN)) {
                        registerSpanFromResponse(span, args, tpl.get(LINK_RES_SPAN), span.getId());
                    }
                }
            }
        } catch (Exception e) {
            logFactory.debug("HttpClient4x spyAfter 异常: {}", e.getMessage());
        }

        super.spyAfter(className, methodName, target, args, result);
    }

    /**
     * Spy 异常回调 - 在 doExecute 方法抛出异常后调用
     */
    @Override
    public void spyError(String className, String methodName, Object target, Object[] args, Throwable throwable) {
        try {
            SpyContext ctx = getSpyContext();
            if (ctx != null && ctx.span != null) {
                ctx.span.setError(throwable != null ? throwable.getMessage() : "Unknown error");
                NewTrackManager.costTime(ctx.span);
            }
        } catch (Exception e) {
            logFactory.debug("HttpClient4x spyError 异常: {}", e.getMessage());
        }

        super.spyError(className, methodName, target, args, throwable);
    }

    // ==================== 辅助方法 ====================

    private void registerSpanFromResponse(Span span, Object[] args, String s, String pid) {
        try {
            String string = new String(HexUtils.decodeHex(s.trim()));
            List<Span> spans = JSON.parseObject(string, new TypeReference<List<Span>>() {
            });

            spans.get(0).setPid(span.getId());
            NewTrackManager.currentSpans()
                    .addAll(spans);
        } catch (Exception ignored) {
        }
    }

    // ==================== 插件配置 ====================

    @Override
    public String name() {
        return "HttpClient4x";
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        // HttpClient 4.x 使用 CloseableHttpClient
        return ElementMatchers.hasSuperType(ElementMatchers.named("org.apache.http.impl.client.CloseableHttpClient"))
                .and(ElementMatchers.not(ElementMatchers.isInterface()));
    }
}