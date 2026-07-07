package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;

import java.lang.reflect.Method;

/**
 * ByteBuddy 插件抽象基类
 * 提供基于 ByteBuddy 的字节码增强插件的通用实现
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public abstract class BytebuddyPlugin implements Plugin {

    // ==================== 拦截钩子方法 ====================

    /**
     * 前置处理：创建并初始化 Span
     * 在目标方法执行前调用
     *
     * @param target  目标对象
     * @param method  被拦截的方法
     * @param args    方法参数
     * @return 新创建的 Span 对象
     */
    protected static Span before(Object target, Method method, Object[] args) {
        Span span = NewTrackManager.createEntrySpan(args);
        NewTrackManager.doRefreshSpan(target, method, args, span);
        return span;
    }

    /**
     * 后置处理：记录 Span 结束时间
     * 在目标方法执行后调用
     *
     * @param span 要结束的 Span
     */
    protected static void after(Span span) {
        if (span != null) {
            NewTrackManager.registerFinishTime(span);
        }
    }

    /**
     * 异常处理：记录异常信息到 Span
     *
     * @param span      Span 对象
     * @param throwable 异常对象
     */
    protected static void onError(Span span, Throwable throwable) {
        if (span != null && throwable != null) {
            span.setError(throwable.getMessage());
        }
    }

    // ==================== 生命周期方法 ====================

    @Override
    public void init() {
        // 默认空实现，子类可覆写
    }

    @Override
    public void finish() {
        // 默认空实现，子类可覆写
    }

    @Override
    public void initComplete() {
    }

    // ==================== 抽象方法 ====================

    /**
     * 配置方法拦截器
     * 子类必须实现此方法来定义要拦截的方法
     *
     * @param builder ByteBuddy 构建器
     * @return 配置后的构建器
     */
    public abstract DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(
            DynamicType.Builder<?> builder);

    /**
     * 配置 Agent 拦截器
     * 子类可覆写此方法进行额外配置
     *
     * @param transform AgentBuilder 扩展点
     * @return 配置后的扩展点
     */
    public AgentBuilder.Identified.Extendable transforms(AgentBuilder.Identified.Extendable transform) {
        return transform;
    }

    /**
     * 定义要拦截的类型匹配器
     * 子类必须实现此方法来指定要拦截的类
     *
     * @return 类型匹配器
     */
    public abstract ElementMatcher<? super TypeDescription> type();
}
