package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.monitor.AgentSelfMonitor;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;

/**
 * ByteBuddy 插件抽象基类
 * <p>
 * 提供基于 ByteBuddy Advice + Spy 模式的字节码增强插件的通用实现。
 * </p>
 *
 * <h3>Spy 模式调用链路：</h3>
 * <pre>
 * 目标类增强字节码（Advice 内联）
 *     → Spy.before/after/error（Bootstrap CL 中的桥接类）
 *     → SpyHandlerImpl（路由到实际插件）
 *     → 插件的 spyBefore/spyAfter/spyError
 * </pre>
 *
 * <h3>子类实现指南：</h3>
 * <ul>
 *   <li>{@link #type()} - 定义要拦截的类匹配器（必须实现）</li>
 *   <li>{@link #methodMatcher()} - 定义要拦截的方法匹配器（必须实现）</li>
 *   <li>{@link #spyBefore} - 目标方法执行前的回调（可选覆写）</li>
 *   <li>{@link #spyAfter} - 目标方法正常返回后的回调（可选覆写）</li>
 *   <li>{@link #spyError} - 目标方法抛出异常后的回调（可选覆写）</li>
 * </ul>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.37
 */
public abstract class BytebuddyPlugin implements Plugin {

    /**
     * 拦截计时起点（ThreadLocal，避免多线程干扰）
     */
    private static final ThreadLocal<Long> INTERCEPT_START_NANOS = new ThreadLocal<>();

    /**
     * Spy 回调上下文（ThreadLocal，在 spyBefore 和 spyAfter 之间传递数据）
     */
    private static final ThreadLocal<SpyContext> SPY_CONTEXT = new ThreadLocal<>();

    // ==================== Spy 上下文 ====================

    /**
     * Spy 回调上下文，用于在 spyBefore 和 spyAfter 之间传递数据
     */
    public static class SpyContext {
        /** 目标类名 */
        public String className;
        /** 目标方法名 */
        public String methodName;
        /** 目标对象 */
        public Object target;
        /** 方法参数 */
        public Object[] args;
        /** 拦截开始时间（纳秒） */
        public long startNanos;
        /** Span 对象（用于链路追踪） */
        public Span span;

        public SpyContext(String className, String methodName, Object target, Object[] args) {
            this.className = className;
            this.methodName = methodName;
            this.target = target;
            this.args = args;
            this.startNanos = System.nanoTime();
        }
    }

    // ==================== Spy 回调方法 ====================

    /**
     * Spy 前置回调 - 在目标方法执行前调用
     * <p>
     * 默认实现：记录拦截计时起点，创建 Span。
     * 子类可覆写此方法添加自定义前置逻辑。
     * </p>
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     */
    public void spyBefore(String className, String methodName, Object target, Object[] args) {
        INTERCEPT_START_NANOS.set(System.nanoTime());
        SpyContext ctx = new SpyContext(className, methodName, target, args);
        SPY_CONTEXT.set(ctx);
    }

    /**
     * Spy 后置回调 - 在目标方法正常返回后调用
     * <p>
     * 默认实现：上报拦截耗时到自监控。
     * 子类可覆写此方法添加自定义后置逻辑。
     * </p>
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     * @param result     方法返回值（void 方法时为 null）
     */
    public void spyAfter(String className, String methodName, Object target, Object[] args, Object result) {
        SpyContext ctx = SPY_CONTEXT.get();
        if (ctx != null) {
            long costNanos = System.nanoTime() - ctx.startNanos;
            AgentSelfMonitor.getInstance().recordIntercept(costNanos);
        }
        cleanup();
    }

    /**
     * Spy 异常回调 - 在目标方法抛出异常后调用
     * <p>
     * 默认实现：上报拦截异常到自监控。
     * 子类可覆写此方法添加自定义异常处理逻辑。
     * </p>
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     * @param throwable  抛出的异常
     */
    public void spyError(String className, String methodName, Object target, Object[] args, Throwable throwable) {
        AgentSelfMonitor.getInstance().recordInterceptException();
        cleanup();
    }

    /**
     * 清理 ThreadLocal 上下文
     */
    private void cleanup() {
        INTERCEPT_START_NANOS.remove();
        SPY_CONTEXT.remove();
    }

    /**
     * 获取当前线程的 Spy 上下文（子类在 spyAfter/spyError 中使用）
     *
     * @return Spy 上下文，可能为 null
     */
    protected SpyContext getSpyContext() {
        return SPY_CONTEXT.get();
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

    // ==================== 拦截计时便捷方法（兼容旧插件） ====================

    /**
     * 记录拦截方法进入时间（纳秒精度）
     * @deprecated 使用 {@link #spyBefore} 代替
     */
    public static void interceptEnter() {
        INTERCEPT_START_NANOS.set(System.nanoTime());
    }

    /**
     * 记录拦截方法退出，上报耗时到自监控
     * @deprecated 使用 {@link #spyAfter} 代替
     */
    public static void interceptExit() {
        Long startNanos = INTERCEPT_START_NANOS.get();
        if (startNanos != null) {
            long costNanos = System.nanoTime() - startNanos;
            AgentSelfMonitor.getInstance().recordIntercept(costNanos);
            INTERCEPT_START_NANOS.remove();
        }
    }

    /**
     * 记录拦截方法异常，上报到自监控
     * @deprecated 使用 {@link #spyError} 代替
     */
    public static void interceptError() {
        AgentSelfMonitor.getInstance().recordInterceptException();
    }

    // ==================== 旧版兼容方法（MethodDelegation 模式，逐步废弃） ====================

    /**
     * 前置处理：创建并初始化 Span
     * @deprecated 使用 {@link #spyBefore} 代替
     */
    protected static Span before(Object target, Method method, Object[] args) {
        INTERCEPT_START_NANOS.set(System.nanoTime());
        Span span = NewTrackManager.createEntrySpan(args);
        NewTrackManager.doRefreshSpan(target, method, args, span);
        return span;
    }

    /**
     * 后置处理：记录 Span 结束时间
     * @deprecated 使用 {@link #spyAfter} 代替
     */
    protected static void after(Span span) {
        if (span != null) {
            NewTrackManager.registerFinishTime(span);
        }
        Long startNanos = INTERCEPT_START_NANOS.get();
        if (startNanos != null) {
            long costNanos = System.nanoTime() - startNanos;
            AgentSelfMonitor.getInstance().recordIntercept(costNanos);
            INTERCEPT_START_NANOS.remove();
        }
    }

    /**
     * 异常处理：记录异常信息到 Span
     * @deprecated 使用 {@link #spyError} 代替
     */
    protected static void onError(Span span, Throwable throwable) {
        if (span != null && throwable != null) {
            span.setError(throwable.getMessage());
        }
        AgentSelfMonitor.getInstance().recordInterceptException();
    }

    // ==================== 抽象方法 ====================

    /**
     * 定义要拦截的方法匹配器
     * <p>
     * 子类必须实现此方法来指定要拦截的方法。
     * 替代旧版 {@link #transform(DynamicType.Builder)} 方法。
     * </p>
     *
     * <h3>示例：</h3>
     * <pre>
     * // 拦截 write/print/println 方法
     * public ElementMatcher<? super MethodDescription> methodMatcher() {
     *     return ElementMatchers.named("write")
     *         .or(ElementMatchers.named("print"))
     *         .or(ElementMatchers.named("println"));
     * }
     * </pre>
     *
     * @return 方法匹配器
     */
    public ElementMatcher<? super MethodDescription> methodMatcher() {
        // 默认返回 null，子类应覆写此方法
        // 如果返回 null 且 transform() 也返回 null，插件将无法注册
        // 迁移策略：先实现 methodMatcher()，再移除 transform()
        return null;
    }

    /**
     * 配置要拦截的类型匹配器
     * <p>
     * 子类必须实现此方法来指定要拦截的类。
     * </p>
     *
     * @return 类型匹配器
     */
    public abstract ElementMatcher<? super TypeDescription> type();

    /**
     * 配置 Agent 拦截器（旧版 MethodDelegation 模式，逐步废弃）
     * <p>
     * 默认返回 null，表示使用新的 Advice + Spy 模式。
     * 如果子类仍需使用 MethodDelegation 模式，可覆写此方法。
     * </p>
     *
     * @param builder ByteBuddy 构建器
     * @return 配置后的构建器
     * @deprecated 使用 {@link #methodMatcher()} + {@link #spyBefore}/{@link #spyAfter}/{@link #spyError} 代替
     */
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(
            DynamicType.Builder<?> builder) {
        return null;
    }

    /**
     * 配置 AgentBuilder 扩展点（旧版，逐步废弃）
     *
     * @param transform AgentBuilder 扩展点
     * @return 配置后的扩展点
     * @deprecated 不再需要，Advice 模式在 AgentFactory 中统一处理
     */
    public AgentBuilder.Identified.Extendable transforms(AgentBuilder.Identified.Extendable transform) {
        return transform;
    }

    /**
     * 是否使用旧版 MethodDelegation 模式
     * <p>
     * 默认返回 true（使用旧版 MethodDelegation 模式，兼容已有插件的 transform() 实现）。
     * 如果子类实现了新的 Advice + Spy 模式（methodMatcher() + spyBefore/spyAfter/spyError），
     * 可覆写此方法返回 false。
     * </p>
     *
     * @return true 使用旧版 MethodDelegation 模式，false 使用 Advice + Spy 模式
     */
    public boolean useLegacyMethodDelegation() {
        return true;
    }
}