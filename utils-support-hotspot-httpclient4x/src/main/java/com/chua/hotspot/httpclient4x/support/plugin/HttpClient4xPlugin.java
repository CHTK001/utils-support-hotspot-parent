package com.chua.hotspot.httpclient4x.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.HexUtils;
import org.apache.http.HttpRequest;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.Header;
import org.apache.http.util.EntityUtils;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.net.URI;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * HttpClient 4.x 插件
 * 继承自 HttpClient 3.x，覆写 4.x 特有的 API 处理
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class HttpClient4xPlugin extends com.chua.hotspot.httpclient3x.support.plugin.HttpClient3xPlugin {

    private static final String DO_EXECUTE = "doExecute";
    static Pattern compile = Pattern.compile("\\[(.*?)\\]");

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        Span span = createBefore(target, method, objects);
        Object call = null;
        Throwable throwable = null;
        try {
            call = callable.call();
        } catch (Exception e) {
            throwable = e;
            throw new Exception(e);
        } finally {
            after(call, target, method, objects, span, throwable);
        }
        return call;
    }

    private static void after(Object result, Object httpClient, Method method, Object[] args, Span span, Throwable throwable) {
        if (null == span || !(args[1] instanceof HttpRequest)) {
            return;
        }
        
        try {
            HttpRequest request = (HttpRequest) args[1];
            String methodName = request.getRequestLine().getMethod();
            String uri = request.getRequestLine().getUri();
            
            if (null != throwable) {
                span.setError(throwable.getMessage());
            }

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

            // 不要手动设置 ID，NewTrackManager.createEntrySpan 已经设置了
            span.setDescription(methodName + " " + uri);
            span.setMethod(method.getName());
            span.setTypeName(httpClient.getClass().getTypeName());
            span.setTips(stack);
            span.setCategory("HTTP");
            span.setProtocol("HTTP/1.1");
            
            // 计算耗时
            NewTrackManager.costTime(span);

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
        } catch (Exception ignored) {
        }
    }

    private static void registerSpanFromResponse(Span span, Object[] args, String s, String pid) {
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

    private static Span createBefore(Object target, Method method, Object[] objects) {
        try {
            if (DO_EXECUTE.equals(method.getName())) {
                return beforeHttpClient4x(target, method, objects);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private static Span beforeHttpClient4x(Object target, Method method, Object[] args) {
        return doRequest(target, method, args);
    }

    /**
     * 做请求
     * 分布式链路
     *
     * @param args   参数
     * @param target 目标
     * @param method 方法
     * @return {@link String}
     */
    private static Span doRequest(Object target, Method method, Object[] args) {
        if (!(args[1] instanceof HttpRequest)) {
            return null;
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

        return exitSpan;
    }

    // ==================== 覆写插件配置 ====================
    
    @Override
    public String name() {
        return "HttpClient4x";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        // HttpClient 4.x 使用 doExecute 方法，与 3.x 的 executeMethod 不同
        return builder.method(ElementMatchers.isMethod().and(ElementMatchers.named("doExecute")))
                .intercept(MethodDelegation.to(HttpClient4xPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        // HttpClient 4.x 使用 CloseableHttpClient
        return ElementMatchers.hasSuperType(ElementMatchers.named("org.apache.http.impl.client.CloseableHttpClient"))
                .and(ElementMatchers.not(ElementMatchers.isInterface()));
    }
}
