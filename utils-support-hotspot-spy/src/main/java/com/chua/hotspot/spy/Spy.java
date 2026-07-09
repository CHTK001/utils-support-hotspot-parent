package com.chua.hotspot.spy;

/**
 * Spy 桥接类 - 注入 Bootstrap ClassLoader 的最小桥接层
 * <p>
 * 此类是整个 Spy 模式的核心，被注入到 Bootstrap ClassLoader 中，
 * 使所有被 ByteBuddy 增强的目标类都能访问到它。
 * </p>
 *
 * <h3>设计原则：</h3>
 * <ul>
 *   <li>零依赖：不依赖任何第三方类，仅使用 JDK 核心类</li>
 *   <li>最小化：只包含静态回调和注册方法</li>
 *   <li>线程安全：使用 volatile 保证 HANDLER 的可见性</li>
 * </ul>
 *
 * <h3>调用链路：</h3>
 * <pre>
 * 目标类增强字节码（Advice 内联的代码）
 *     → Spy.before/after/error（静态方法，Bootstrap CL 可见）
 *     → SpyHandler.HANDLER（接口派发）
 *     → SpyHandlerImpl（HotspotPluginClassLoader 中）
 *     → 实际插件的 spyBefore/spyAfter/spyError
 * </pre>
 *
 * <h3>与 Arthas Spy 的对比：</h3>
 * <pre>
 * Arthas:  目标字节码 → Spy.atBeforeInvoke/atAfterInvoke/atThrow → AdviceListener（反射回调）
 * 本项目:  目标字节码 → Spy.before/after/error → SpyHandler → 插件方法（直接调用）
 * </pre>
 * 本项目使用直接调用而非反射，性能更好。
 *
 * @author CH
 * @since 4.0.0.37
 */
public class Spy {

    /**
     * 全局回调处理器（由 agent core 初始化时设置）
     * <p>
     * 使用 volatile 保证多线程可见性。
     * HANDLER 实例在 HotspotPluginClassLoader 中创建，
     * 但 SpyHandler 接口在 Bootstrap CL 中，所以引用可以跨 ClassLoader 传递。
     * </p>
     */
    private static volatile SpyHandler HANDLER;

    /**
     * 注册回调处理器
     * <p>
     * 由 agent core 在初始化时调用，将 SpyHandlerImpl 实例注册到 Spy。
     * 此方法只需调用一次，重复调用会覆盖之前的处理器。
     * </p>
     *
     * @param handler 回调处理器实现
     */
    public static void setHandler(SpyHandler handler) {
        HANDLER = handler;
    }

    /**
     * 获取当前回调处理器（用于测试和内部使用）
     *
     * @return 当前注册的回调处理器，可能为 null
     */
    public static SpyHandler getHandler() {
        return HANDLER;
    }

    /**
     * 目标方法执行前的回调
     * <p>
     * 由 ByteBuddy Advice 内联的代码在目标方法入口处调用。
     * </p>
     *
     * @param className  目标类全限定名（由 @Advice.Origin("#t") 提供）
     * @param methodName 目标方法名（由 @Advice.Origin("#m") 提供）
     * @param target     目标对象（由 @Advice.This 提供，静态方法时为 null）
     * @param args       方法参数（由 @Advice.AllArguments 提供）
     */
    public static void before(String className, String methodName, Object target, Object[] args) {
        SpyHandler h = HANDLER;
        if (h != null) {
            try {
                h.onBefore(className, methodName, target, args);
            } catch (Throwable ignored) {
                // 回调异常不能影响目标方法执行
            }
        }
    }

    /**
     * 目标方法正常返回后的回调
     * <p>
     * 由 ByteBuddy Advice 内联的代码在目标方法正常返回后调用。
     * </p>
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     * @param result     方法返回值（void 方法时为 null）
     */
    public static void after(String className, String methodName, Object target, Object[] args, Object result) {
        SpyHandler h = HANDLER;
        if (h != null) {
            try {
                h.onAfter(className, methodName, target, args, result);
            } catch (Throwable ignored) {
                // 回调异常不能影响目标方法执行
            }
        }
    }

    /**
     * 目标方法抛出异常后的回调
     * <p>
     * 由 ByteBuddy Advice 内联的代码在目标方法抛出异常后调用。
     * </p>
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     * @param throwable  抛出的异常
     */
    public static void error(String className, String methodName, Object target, Object[] args, Throwable throwable) {
        SpyHandler h = HANDLER;
        if (h != null) {
            try {
                h.onError(className, methodName, target, args, throwable);
            } catch (Throwable ignored) {
                // 回调异常不能影响目标方法执行
            }
        }
    }
}