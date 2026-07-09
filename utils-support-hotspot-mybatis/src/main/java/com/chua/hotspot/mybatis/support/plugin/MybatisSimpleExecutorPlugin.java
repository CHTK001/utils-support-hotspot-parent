package com.chua.hotspot.mybatis.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.sql.DmlFormatter;
import com.chua.hotspot.core.support.utils.ClassUtils;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * MyBatis SQL 执行器拦截插件
 * 拦截 SimpleExecutor/BatchExecutor 的 query/update/queryCursor 方法，用于 SQL 链路追踪
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class MybatisSimpleExecutorPlugin extends BytebuddyPlugin {
    /**
     * 将返回值转换成具体的方法返回值类型,加了这个注解 intercept 方法才会被执行
     *
     * @param target   目标
     * @param method   方法
     * @param objects  参数
     * @param delegate 目标对象的一个代理
     * @param callable 方法的调用者对象
     * @return 结果
     * @throws Exception ex
     */
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
        Span span = createBefore(target, method, objects);
        try {
            return callable.call();
        } catch (Exception e) {
            BytebuddyPlugin.interceptError();
            throw e;
        } finally {
            NewTrackManager.costTime(span);
            BytebuddyPlugin.interceptExit();
        }
    }

    private static Span createBefore(Object target, Method method, Object[] objects) {
        try {
            Span entrySpan = NewTrackManager.createRefreshSpan(target, method, objects);
            entrySpan.clearStack();
            entrySpan.addStack(new DmlFormatter().format(ClassUtils.getObject("sql", objects[5]) + ""));
            return entrySpan;
        } catch (Exception ignored) {
        }
        return null;
    }

    @Override
    public String name() {
        return "Mybatis-Executor";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("query")
                .or(ElementMatchers.named("update"))
                .or(ElementMatchers.named("queryCursor"))
        ).intercept(MethodDelegation.to(MybatisSimpleExecutorPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.ibatis.executor.SimpleExecutor")
                .or(ElementMatchers.named("org.apache.ibatis.executor.BatchExecutor"))
                ;
    }
}
