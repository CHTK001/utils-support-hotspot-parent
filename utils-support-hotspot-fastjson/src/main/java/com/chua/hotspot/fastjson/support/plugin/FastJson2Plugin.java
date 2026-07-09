package com.chua.hotspot.fastjson.support.plugin;

import com.chua.hotspot.core.support.entity.ClassSource;
import com.chua.hotspot.core.support.hotswap.Hotswap;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.FastMethodHelper;
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


    static Class<?> beanUtilsClass;
    static Class<?> writerClass;
    static Class<?> readerClass;

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
        BytebuddyPlugin.interceptEnter();
        try {
            register(target);
            return callable.call();
        } catch (Exception e) {
            BytebuddyPlugin.interceptError();
            throw e;
        } finally {
            BytebuddyPlugin.interceptExit();
        }
    }

    private static void register(Object target) {
        if (null == writerClass && target.getClass().getTypeName().equals("com.alibaba.fastjson2.writer.ObjectWriterProvider")) {
            writer = target;
            writerCache = (Map) ClassUtils.getObject("cache", writer);
            writerCacheFieldBased = (Map) ClassUtils.getObject("cacheFieldBased", writer);
            writerClass = target.getClass();
            refresh();
        }


        if (null == readerClass && target.getClass().getTypeName().equals("com.alibaba.fastjson2.writer.ObjectReaderProvider")) {
            reader = target;
            readerCache = (Map) ClassUtils.getObject("cache", reader);
            readerCacheFieldBased = (Map) ClassUtils.getObject("cacheFieldBased", reader);
            readerClass = target.getClass();
            refresh();
        }
    }

    private static void refresh() {
        beanUtilsClass = InstrumentationFactory.getInstance().getType("com.alibaba.fastjson2.util.BeanUtils");
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
        if (beanUtilsClass != null) {
            FastMethodHelper.invokeStatic(beanUtilsClass, "cleanupCache", new Class[]{Class.class}, type);
        }
        if (readerClass != null) {
            FastMethodHelper.invokeStatic(readerClass, "cleanup", new Class[]{Class.class}, type);
        }
    }

    private void writerMethodCleaup(Class<?> type) {
        if (beanUtilsClass != null) {
            FastMethodHelper.invokeStatic(beanUtilsClass, "cleanupCache", new Class[]{Class.class}, type);
        }
        if (writerClass != null) {
            FastMethodHelper.invokeStatic(writerClass, "cleanup", new Class[]{Class.class}, type);
        }
    }

    @Override
    public void reload(ClassSource classSource) {
        cleaupWriter(classSource.getType());
        cleaupReader(classSource.getType());
    }
}
