package com.chua.hotspot.spring.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.spring.support.factory.SpringFactory;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * spring 上下文
 *
 * @author CH
 */
public class SpringApplicationPlugin extends BytebuddyPlugin {

    public static Object applicationContextObject;

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
            @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        applicationContextObject = objects[0];
        SpringFactory.getInstance().registerApplicationContext(objects[0]);
        return NewTrackManager.invoke(callable);
    }

    @Override
    public String name() {
        return "Spring-Application";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("setApplicationContext")).intercept(MethodDelegation.to(SpringApplicationPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("org.springframework.context.ApplicationContextAware"));
    }
}
