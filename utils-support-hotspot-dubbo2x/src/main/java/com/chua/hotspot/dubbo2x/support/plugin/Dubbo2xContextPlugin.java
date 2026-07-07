package com.chua.hotspot.dubbo2x.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.dubbo2x.support.link.Dubbo2xLinkResolver;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * Dubbo 2.x 上下文插件
 * 
 * @author CH
 * @since 2024/12/11
 */
public class Dubbo2xContextPlugin extends BytebuddyPlugin {
    
    @RuntimeType
    public static Object before(@AllArguments Object[] args, @Origin Method method, @This Object obj, @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        // 直接调用 Dubbo2xLinkResolver
        Dubbo2xLinkResolver.insertPoint(NewTrackManager.getLastSpan(), args);
        
        Object invoke;
        try {
            invoke = NewTrackManager.invoke(callable);
        } finally {
            if ("waitForResultIfSync".equals(method.getName())) {
                Dubbo2xLinkResolver.receivePoint(args[0]);
            }
        }
        return invoke;
    }

    @Override
    public String name() {
        return "Dubbo2x-Context";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("doInvokeAndReturn")
                        .or(ElementMatchers.named("waitForResultIfSync")))
                .intercept(MethodDelegation.to(Dubbo2xContextPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.alibaba.dubbo.rpc.protocol.AbstractInvoker");
    }
}
