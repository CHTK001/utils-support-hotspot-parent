package com.chua.hotspot.jackson.support;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.Set;
import java.util.WeakHashMap;
import java.util.concurrent.Callable;

/**
 * jackson插件
 *
 * @author CH
 */
public class JacksonPlugin extends BytebuddyPlugin {
    private static Object _incompleteDeserializers;
    private static Object _sharedMap;
    private final Set<Object> needToClearCacheObjects = Collections.synchronizedSet(Collections.newSetFromMap(new WeakHashMap<>()));

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
        register(target);
        return callable.call();
    }

    private static void register(Object target) {
        Class<?> aClass = target.getClass();
        if ("com.fasterxml.jackson.databind.deser.DeserializerCache".equals(aClass.getTypeName())) {
            registerDeserializer(target, aClass);
        }
        if ("com.fasterxml.jackson.databind.ser.SerializerCache".equals(aClass.getTypeName())) {
            registerSerializer(target, aClass);
        }
    }

    private static void registerSerializer(Object target, Class<?> aClass) {
        if (null == _sharedMap) {
            try {
                Field declaredField = aClass.getDeclaredField("_sharedMap");
                declaredField.setAccessible(true);
                _sharedMap = declaredField.get(target);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private static void registerDeserializer(Object target, Class<?> aClass) {
        if (null == _incompleteDeserializers) {
            try {
                Field declaredField = aClass.getDeclaredField("_cachedDeserializers");
                declaredField.setAccessible(true);
                _incompleteDeserializers = declaredField.get(target);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public String name() {
        return "Jackson";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.any()).intercept(MethodDelegation.to(JacksonPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
//        return ElementMatchers.named("com.fasterxml.jackson.databind.ObjectMapper")
        return
                //flush
                ElementMatchers.named("com.fasterxml.jackson.databind.ser.SerializerCache")
                        //flushCachedDeserializers
                        .or(ElementMatchers.named("com.fasterxml.jackson.databind.deser.DeserializerCache"))
                        .or(ElementMatchers.named("com.fasterxml.jackson.databind.util.LRUMap"))
                ;
    }

    public void registerNeedToClearCacheObjects(Object objectMapper) {
        needToClearCacheObjects.add(objectMapper);
    }
}
