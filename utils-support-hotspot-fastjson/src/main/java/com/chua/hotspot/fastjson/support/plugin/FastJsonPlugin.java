package com.chua.hotspot.fastjson.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import lombok.Data;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 快速json插件
 *
 * @author CH
 */
public class FastJsonPlugin extends BytebuddyPlugin {


    static Map<String, FastJsonCache> caches = new ConcurrentHashMap<>();

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
        BytebuddyPlugin.interceptEnter();
        try {
            return callable.call();
        } catch (Exception e) {
            BytebuddyPlugin.interceptError();
            throw e;
        } finally {
            BytebuddyPlugin.interceptExit();
        }
    }

    @Override
    public String name() {
        return "Fastjson-Serialize";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("get")).intercept(MethodDelegation.to(FastJsonPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.alibaba.fastjson.serializer.SerializeConfig");
    }

    @Data
    static
    class FastJsonCache {

        private final Object target;
        private final Method method;

        public FastJsonCache(Object target, Method method) {
            this.target = target;
            this.method = method;
        }
    }
}
