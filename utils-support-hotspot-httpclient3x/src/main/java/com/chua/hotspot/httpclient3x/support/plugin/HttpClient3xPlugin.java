package com.chua.hotspot.httpclient3x.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.utils.FastMethodHelper;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
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

/**
 * HttpClient 3.x 插件
 * 支持 Apache Commons HttpClient 3.x 版本的请求拦截
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class HttpClient3xPlugin extends BytebuddyPlugin {

    /**
     * 拦截方法
     *
     * @param target 目标对象
     * @param method 方法
     * @param objects 参数
     * @param delegate 代理
     * @param callable 调用者
     * @return 返回值
     * @throws Exception 异常
     */
    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        BytebuddyPlugin.interceptEnter();
        Span span = createBefore(target, method, objects);
        Object call = null;
        Throwable throwable = null;
        try {
            call = callable.call();
        } catch (Exception e) {
            throwable = e;
            BytebuddyPlugin.interceptError();
            throw new Exception(e);
        } finally {
            after(call, target, method, objects, span, throwable);
            BytebuddyPlugin.interceptExit();
        }
        return call;
    }

    /**
     * 请求后处理
     */
    private static void after(Object result, Object httpClient, Method method, Object[] args, Span span, Throwable throwable) {
        if (null == span) {
            return;
        }

        try {
            // HttpClient 3.x 使用 HttpMethod
            Object httpMethod = args[1];
            String methodName = getHttpMethodName(httpMethod);
            String uri = getHttpMethodUri(httpMethod);

            if (null != throwable) {
                span.setError(throwable.getMessage());
            }

            List<String> stack = new LinkedList<>();
            stack.add(uri);
            stack.add("<strong class='node-details__name collapse-handle'>请求头</strong>");

            // 不要手动设置 ID，NewTrackManager.createEntrySpan 已经设置了
            span.setDescription(methodName + " " + uri);
            span.setMethod(method.getName());
            span.setTypeName(httpClient.getClass().getTypeName());
            span.setTips(stack);
            span.setCategory("HTTP");
            span.setProtocol("HTTP/1.1");
            
            // 计算耗时
            NewTrackManager.costTime(span);
        } catch (Exception ignored) {
        }
    }

    /**
     * 获取 HTTP 方法名
     */
    private static String getHttpMethodName(Object httpMethod) {
        String result = FastMethodHelper.invokeString(httpMethod, "getName");
        return result != null ? result : "UNKNOWN";
    }

    /**
     * 获取请求 URI
     */
    private static String getHttpMethodUri(Object httpMethod) {
        Object uri = FastMethodHelper.invoke(httpMethod, "getURI");
        return uri != null ? uri.toString() : "UNKNOWN";
    }

    /**
     * 请求前处理
     */
    private static Span createBefore(Object target, Method method, Object[] objects) {
        try {
            if ("executeMethod".equals(method.getName())) {
                return doRequest(target, method, objects);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    /**
     * 执行请求
     */
    private static Span doRequest(Object target, Method method, Object[] args) {
        if (args.length < 2) {
            return null;
        }

        Object httpMethod = args[1];
        Span exitSpan = NewTrackManager.createEntrySpan(args);
        String linkId = exitSpan.getLinkId();
        String pid = exitSpan.getId();

        if (linkId != null) {
            try {
                // 添加链路追踪头
                FastMethodHelper.invoke(httpMethod, "addRequestHeader",
                        new Class[]{String.class, String.class}, LINK_ID, linkId);
                FastMethodHelper.invoke(httpMethod, "addRequestHeader",
                        new Class[]{String.class, String.class}, LINK_PID, pid);
            } catch (Exception ignored) {
            }

            try {
                String uri = getHttpMethodUri(httpMethod);
                URI parsedUri = new URI(uri);
                ServiceInstance ss = new ServiceInstance();
                ss.setName("HTTP3");
                ss.setSourceName("HOST");
                ss.setSourceHost(ReportFactory.APP_HOST);
                ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
                ss.setTargetHost(parsedUri.getHost());
                ss.setTargetPort(parsedUri.getPort());
                ReportFactory.sendServiceInstance(ss);
            } catch (Exception ignored) {
            }
        }

        return exitSpan;
    }

    @Override
    public String name() {
        return "HttpClient3x";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.isMethod()
                        .and(ElementMatchers.named("executeMethod")))
                .intercept(MethodDelegation.to(HttpClient3xPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(
                        ElementMatchers.named("org.apache.commons.httpclient.HttpClient"))
                .and(ElementMatchers.not(ElementMatchers.isInterface()));
    }
}
