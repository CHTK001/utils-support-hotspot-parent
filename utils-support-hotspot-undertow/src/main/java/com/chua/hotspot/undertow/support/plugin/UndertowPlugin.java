package com.chua.hotspot.undertow.support.plugin;

import com.chua.hotspot.core.support.http.HttpInterceptHelper;
import com.chua.hotspot.core.support.http.HttpInterceptHelper.HttpContext;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;

/**
 * Undertow HTTP 请求拦截插件
 * <p>
 * 拦截 ServletInitialHandler.handleRequest 方法，实现 HTTP 请求的链路追踪和性能监控。
 * 使用 Advice + Spy 模式，避免 MethodDelegation 的 ClassLoader 可见性问题。
 * </p>
 *
 * @author CH
 * @version 4.0.0.40
 */
public class UndertowPlugin extends BytebuddyPlugin {

    private static final String CATEGORY = "undertow";

    @Override
    public String name() {
        return "Undertow";
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("io.undertow.servlet.handlers.ServletInitialHandler");
    }

    @Override
    public ElementMatcher<? super MethodDescription> methodMatcher() {
        return ElementMatchers.named("handleRequest");
    }

    @Override
    public boolean useLegacyMethodDelegation() {
        return false;
    }

    @Override
    public void spyBefore(String className, String methodName, Object target, Object[] args) {
        super.spyBefore(className, methodName, target, args);
        try {
            Method method = findMethod(target, methodName, args);
            HttpContext ctx = HttpInterceptHelper.before(method, args, target, CATEGORY, HttpInterceptHelper.UNDERTOW);
            if (ctx != null) {
                SpyContext spyCtx = getSpyContext();
                if (spyCtx != null) {
                    spyCtx.span = ctx.span;
                    spyCtx.args = new Object[]{ctx};
                }
            }
        } catch (Exception e) {
            // spy 回调不得抛出异常，忽略以免影响目标方法
        }
    }

    @Override
    public void spyAfter(String className, String methodName, Object target, Object[] args, Object result) {
        try {
            SpyContext spyCtx = getSpyContext();
            if (spyCtx != null && spyCtx.args != null && spyCtx.args.length > 0
                    && spyCtx.args[0] instanceof HttpContext) {
                HttpContext ctx = (HttpContext) spyCtx.args[0];
                HttpInterceptHelper.after(ctx, args);
            }
        } catch (Exception e) {
            // spy 回调不得抛出异常，忽略以免影响目标方法
        }
        super.spyAfter(className, methodName, target, args, result);
    }

    @Override
    public void spyError(String className, String methodName, Object target, Object[] args, Throwable throwable) {
        try {
            SpyContext spyCtx = getSpyContext();
            if (spyCtx != null && spyCtx.args != null && spyCtx.args.length > 0
                    && spyCtx.args[0] instanceof HttpContext) {
                HttpContext ctx = (HttpContext) spyCtx.args[0];
                HttpInterceptHelper.markError(ctx);
                HttpInterceptHelper.after(ctx, args);
            }
        } catch (Exception e) {
            // spy 回调不得抛出异常，忽略以免影响目标方法
        }
        super.spyError(className, methodName, target, args, throwable);
    }

    /**
     * 从目标对象查找方法
     */
    private Method findMethod(Object target, String methodName, Object[] args) {
        if (target == null) return null;
        for (Method m : target.getClass().getMethods()) {
            if (m.getName().equals(methodName)) {
                return m;
            }
        }
        return null;
    }
}