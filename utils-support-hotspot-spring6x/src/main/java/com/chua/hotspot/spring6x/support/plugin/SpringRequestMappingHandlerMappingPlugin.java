package com.chua.hotspot.spring6x.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.spring6x.support.factory.SpringFactory;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * @author CH
 * @since 2024/11/11
 */
public class SpringRequestMappingHandlerMappingPlugin extends BytebuddyPlugin {

    @RuntimeType
    public static Object before(@Origin Method method,
                                @This Object obj,
                                @AllArguments Object[] allArguments,
                                @SuperCall Callable<?> callable) throws Exception {
        SpringFactory.getInstance().registerRequestMappingHandlerMapping(obj);
        return callable.call();
    }

    @Override
    public String name() {
        return "Spring-RequestMappingHandlerMappingPlugin";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(
                ElementMatchers.any()
        ).intercept(MethodDelegation.to(SpringRequestMappingHandlerMappingPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping")
                .or(ElementMatchers.named("org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping")));
    }
}
