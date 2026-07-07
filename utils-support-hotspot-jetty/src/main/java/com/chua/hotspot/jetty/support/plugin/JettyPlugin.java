package com.chua.hotspot.jetty.support.plugin;

import com.chua.hotspot.core.support.http.HttpInterceptHelper;
import com.chua.hotspot.core.support.http.HttpInterceptHelper.HttpContext;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * Jetty HTTP 请求拦截插件
 * <p>
 * 拦截 Jetty 的 HttpChannel.handle() 方法，实现 HTTP 请求的链路追踪和性能监控
 * </p>
 *
 * @author CH
 * @version 4.0.0.33
 */
public class JettyPlugin extends BytebuddyPlugin {

    private static final String CATEGORY = "jetty";

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        
        HttpContext ctx = HttpInterceptHelper.before(method, objects, target, CATEGORY, HttpInterceptHelper.JETTY);
        try {
            return callable.call();
        } catch (Exception e) {
            HttpInterceptHelper.markError(ctx);
            throw e;
        } finally {
            HttpInterceptHelper.after(ctx, objects);
        }
    }

    @Override
    public String name() {
        return "Jetty";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("handle")).intercept(MethodDelegation.to(JettyPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        // 拦截 Jetty 的 HttpChannel 类
        return ElementMatchers.named("org.eclipse.jetty.server.HttpChannel");
    }
}
