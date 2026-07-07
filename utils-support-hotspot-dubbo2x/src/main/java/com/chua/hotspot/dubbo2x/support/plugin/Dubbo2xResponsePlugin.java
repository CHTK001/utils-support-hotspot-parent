package com.chua.hotspot.dubbo2x.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.StringUtils;
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
 * Dubbo 2.x 响应插件
 * 
 * @author CH
 * @since 2024/12/11
 */
public class Dubbo2xResponsePlugin extends BytebuddyPlugin {
    
    @RuntimeType
    public static Object before(@AllArguments Object[] objects, @Origin Method method, @This Object obj, @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        Span entrySpan = NewTrackManager.createEntrySpan(objects);
        String pId = NewTrackManager.getRequestLinkParentId(objects);
        if (!StringUtils.isBlank(pId)) {
            entrySpan.setPid(pId);
        }
        NewTrackManager.doRefreshSpan(obj, method, objects, entrySpan);
        entrySpan.setFrom("DUBBO-SERVER");
        entrySpan.setProtocol("DUBBO");
        Object call = null;
        try {
            call = NewTrackManager.invoke(callable);
            // 只支持 Dubbo 2.x
            Dubbo2xLinkResolver.insertResponsePoint(call);
        } finally {
            NewTrackManager.costTime(entrySpan);
        }
        return call;
    }

    @Override
    public String name() {
        return "Dubbo2x-Response";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("invoke"))
                .intercept(MethodDelegation.to(Dubbo2xResponsePlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.alibaba.dubbo.rpc.proxy.AbstractProxyInvoker");
    }
}
