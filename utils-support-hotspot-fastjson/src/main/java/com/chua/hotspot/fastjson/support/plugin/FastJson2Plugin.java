package com.chua.hotspot.fastjson.support.plugin;

import com.chua.hotspot.core.support.entity.ClassSource;
import com.chua.hotspot.core.support.hotswap.Hotswap;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.utils.ClassUtils;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @author CH
 */
@SuppressWarnings("ALL")
public class FastJson2Plugin extends BytebuddyPlugin implements Hotswap<ClassSource> {


    static Method beanUtilsCleanupMethod;
    static Method writerCleanupMethod;
    static Method readerCleanupMethod;

    static Map writerCache;
    static AtomicBoolean stauts = new AtomicBoolean(false);
    private static Map writerCacheFieldBased;
    private static Object writer;
    private static Map readerCacheFieldBased;
    private static Map readerCache;
    private static Object reader;

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
        if (null == writerCleanupMethod && target.getClass().getTypeName().equals("com.alibaba.fastjson2.writer.ObjectWriterProvider")) {
            writer = target;
            writerCache = (Map) ClassUtils.getObject("cache", writer);
            writerCacheFieldBased = (Map) ClassUtils.getObject("cacheFieldBased", writer);
            try {
                writerCleanupMethod = target.getClass().getDeclaredMethod("cleanup", Class.class);
                writerCleanupMethod.setAccessible(true);
            } catch (NoSuchMethodException e) {
            }
            refresh();
        }


        if (null == readerCleanupMethod && target.getClass().getTypeName().equals("com.alibaba.fastjson2.writer.ObjectReaderProvider")) {
            reader = target;
            readerCache = (Map) ClassUtils.getObject("cache", reader);
            readerCacheFieldBased = (Map) ClassUtils.getObject("cacheFieldBased", reader);
            try {
                readerCleanupMethod = target.getClass().getDeclaredMethod("cleanup", Class.class);
                readerCleanupMethod.setAccessible(true);
            } catch (NoSuchMethodException e) {
            }
            refresh();
        }
    }

    private static void refresh() {
        Class<?> aClass = InstrumentationFactory.getInstance().getType("com.alibaba.fastjson2.util.BeanUtils");
        try {
            beanUtilsCleanupMethod = aClass.getMethod("cleanupCache", Class.class);
            beanUtilsCleanupMethod.setAccessible(true);
        } catch (NoSuchMethodException e) {
        }
    }

    @Override
    public String name() {
        return "Fastjson2";
    }

    @Override
    public void init() {

    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("getObjectWriterFromCache")
                .or(ElementMatchers.named("getObjectWriter"))
                .or(ElementMatchers.named("getObjectWriterInternal"))
        ).intercept(MethodDelegation.to(FastJson2Plugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("com.alibaba.fastjson2.writer.ObjectWriterProvider");
    }

    private void cleaupReader(Class<?> type) {
        if (null != readerCache && readerCache.containsKey(type)) {
            readerCache.remove(type);
            readerMethodCleaup(type);
        }

        if (null != readerCacheFieldBased && readerCacheFieldBased.containsKey(type)) {
            readerCacheFieldBased.remove(type);
            readerMethodCleaup(type);
        }
    }

    private void cleaupWriter(Class<?> type) {
        if (null != writerCache && writerCache.containsKey(type)) {
            writerCache.remove(type);
            writerMethodCleaup(type);
        }

        if (null != writerCacheFieldBased && writerCacheFieldBased.containsKey(type)) {
            writerCacheFieldBased.remove(type);
            writerMethodCleaup(type);
        }
    }

    private void readerMethodCleaup(Class<?> type) {
        try {
            beanUtilsCleanupMethod.invoke(null, type);
        } catch (Exception e) {
        }
        try {
            readerCleanupMethod.invoke(null, type);
        } catch (Exception e) {
        }
    }

    private void writerMethodCleaup(Class<?> type) {
        try {
            beanUtilsCleanupMethod.invoke(null, type);
        } catch (Exception e) {
        }
        try {
            writerCleanupMethod.invoke(null, type);
        } catch (Exception e) {
        }
    }

    @Override
    public void reload(ClassSource classSource) {
        cleaupWriter(classSource.getType());
        cleaupReader(classSource.getType());
    }
}
