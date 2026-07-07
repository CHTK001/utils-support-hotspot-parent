package com.chua.hotspot.mybatis.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
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
 */
public class MybatisPluginConfigurationPlugin extends BytebuddyPlugin {
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
        return callable.call();
    }

    @Override
    public String name() {
        return "Mybatis-XMLConfigBuilder";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.any()).intercept(MethodDelegation.to(MybatisPluginConfigurationPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.baomidou.mybatisplus.core.MybatisXMLConfigBuilder")
                .or(ElementMatchers.hasSuperType(ElementMatchers.named("com.baomidou.mybatisplus.core.MybatisXMLConfigBuilder")));
    }

}
