package com.chua.hotspot.dubbo3x.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * Dubbo 3.x 请求拦截插件
 * 拦截 AbstractClusterInvoker.invokeWithContext 方法，用于链路追踪
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class DubboRequestPlugin extends BytebuddyPlugin {
    @RuntimeType
    public static Object before(@AllArguments Object[] objects, @Origin Method method, @This Object obj, @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        Span span =
                ClassUtils.ifPresent("org.apache.dubbo.rpc.RpcInvocation") ?
                        ClassUtils.invokeStatistic("com.chua.hotspot.dubbo3x.support.orm.DubboRequestWrapper", "before", objects, obj) :
                        ClassUtils.invokeStatistic("com.chua.hotspot.dubbo3x.support.orm.ReflectionDubboRequestWrapper", "before", objects, obj);
        Object invoke = null;
        try {
            invoke = NewTrackManager.invoke(callable);
            return invoke;
        } finally {
            NewTrackManager.costTime(span);
        }
    }

    @Override
    public String name() {
        return "Dubbo3x-Context";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("invokeWithContext")).intercept(MethodDelegation.to(DubboRequestPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.dubbo.rpc.cluster.support.AbstractClusterInvoker");
    }


}
