package com.chua.hotspot.dubbo3x.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.StringUtils;
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
 * Dubbo 3.x 响应插件
 * 注意：由于 Dubbo 2.x 和 3.x 使用不同的 LinkResolver，无法继承
 * 
 * @author CH
 */
public class DubboResponsePlugin extends BytebuddyPlugin {
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
            // 只支持 Dubbo 3.x
            DubboxxLinkResolver.insertResponsePoint(call);
        } finally {
            NewTrackManager.costTime(entrySpan);
        }
        return call;
    }

    @Override
    public String name() {
        return "Dubbo3x-Invoker";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("invoke")).intercept(MethodDelegation.to(DubboResponsePlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.dubbo.rpc.proxy.AbstractProxyInvoker");
    }

}
