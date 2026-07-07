package com.chua.hotspot.p6spy.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.sql.DmlFormatter;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * p6spy
 *
 * @author CH
 */
public class P6SpyPlugin extends BytebuddyPlugin {
    /**
     * 将返回值转换成具体的方法返回值类型,加了这个注解 intercept 方法才会被执行
     *
     * @param target   目标
     * @param method   方法
     * @param objects  参数
     * @param delegate 目标对象的一个代理
     * @param callable 方法的调用者对象
     * @return 结果
     * @throws Exception ex
     */
    @RuntimeType
    public static Object intercept(
            // 被拦截的目标对象 （动态生成的目标对象）
            @This Object target,
            // 正在执行的方法Method 对象（目标对象父类的Method）
            @Origin Method method,
            // 正在执行的方法的全部参数
            @AllArguments Object[] objects,
            // 目标对象的一个代理
            @Super Object delegate,
            // 方法的调用者对象 对原始方法的调用依靠它
            @SuperCall Callable<?> callable) throws Exception {
        Span span = createBefore(target, method, objects);
        try {
            return callable.call();
        } finally {
            NewTrackManager.costTime(span);
        }

    }

    /**
     * 创建span
     *
     * @param target  目标
     * @param method  方法
     * @param objects 参数
     * @return 结果
     */
    private static Span createBefore(Object target, Method method, Object[] objects) {
        Span entrySpan = before(target, method, objects);
        try {
            entrySpan.setDescription(new DmlFormatter().format(objects[5] + ""));
        } catch (Exception ignored) {
        }
        return entrySpan;
    }

    @Override
    public String name() {
        return "P6spy";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("formatMessage")).intercept(MethodDelegation.to(P6SpyPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("com.p6spy.engine.spy.appender.MessageFormattingStrategy"));
    }


}
