package com.chua.hotspot.tomcat9x.support.plugin;

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
 * Tomcat 9.x HTTP 请求拦截插件
 * <p>
 * 拦截 StandardHostValve.invoke 方法，实现 HTTP 请求的链路追踪和性能监控
 * </p>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.38
 */
public class TomcatPlugin extends BytebuddyPlugin {

    private static final String CATEGORY = "tomcat";

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        
        HttpContext ctx = HttpInterceptHelper.before(method, objects, target, CATEGORY, HttpInterceptHelper.TOMCAT);
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
        return "Tomcat";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("invoke")).intercept(MethodDelegation.to(TomcatPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.catalina.core.StandardHostValve");
    }
}
