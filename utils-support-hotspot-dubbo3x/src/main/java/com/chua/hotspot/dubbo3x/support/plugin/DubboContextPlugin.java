package com.chua.hotspot.dubbo3x.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.dubbo3x.support.link.DubboxxLinkResolver;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * Dubbo 3.x 上下文插件
 * 注意：由于 Dubbo 2.x 和 3.x 使用不同的 LinkResolver，无法继承
 * 
 * @author CH
 */
public class DubboContextPlugin extends BytebuddyPlugin {
    @RuntimeType
    public static Object before(@AllArguments Object[] args, @Origin Method method, @This Object obj, @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        // 直接调用 DubboxxLinkResolver（Dubbo 3.x）
        DubboxxLinkResolver.insertPoint(NewTrackManager.getLastSpan(), args);
        
        Object invoke;
        try {
            invoke = NewTrackManager.invoke(callable);
        } finally {
            if ("waitForResultIfSync".equals(method.getName())) {
                DubboxxLinkResolver.receivePoint(args[0]);
            }
        }
        return invoke;
    }

    @Override
    public String name() {
        return "Dubbo3x";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("doInvokeAndReturn")
                        .or(ElementMatchers.named("waitForResultIfSync")))
                .intercept(MethodDelegation.to(DubboContextPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.dubbo.rpc.protocol.AbstractInvoker");
    }
}
