package com.chua.hotspot.dubbo2x.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

/**
 * Dubbo 2.x 监控插件
 * 支持 com.alibaba.dubbo 包名的 Dubbo 2.x 版本
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.33
 */
public class Dubbo2xPlugin extends BytebuddyPlugin {

    @Override
    public String name() {
        return "Dubbo2x";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        // Dubbo 2.x 使用 com.alibaba.dubbo 包名
        // 目前仅作为占位符，后续实现具体监控逻辑
        return builder.method(net.bytebuddy.matcher.ElementMatchers.any())
                .intercept(net.bytebuddy.implementation.SuperMethodCall.INSTANCE);
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        // 匹配 Dubbo 2.x 的 AbstractProxyInvoker
        return ElementMatchers.named("com.alibaba.dubbo.rpc.proxy.AbstractProxyInvoker");
    }
}
