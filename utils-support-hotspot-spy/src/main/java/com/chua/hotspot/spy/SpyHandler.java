package com.chua.hotspot.spy;

/**
 * Spy 回调处理器接口
 * <p>
 * 由 agent core 实现（SpyHandlerImpl），注册到 Spy.HANDLER。
 * 此接口必须保持在 Bootstrap ClassLoader 中，零依赖。
 * </p>
 *
 * <h3>调用链路：</h3>
 * <pre>
 * 目标类增强字节码 → Spy.before/after/error → SpyHandler.HANDLER → SpyHandlerImpl → 实际插件
 * </pre>
 *
 * @author CH
 * @since 4.0.0.37
 */
public interface SpyHandler {

    /**
     * 目标方法执行前的回调
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     */
    void onBefore(String className, String methodName, Object target, Object[] args);

    /**
     * 目标方法正常返回后的回调
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     * @param result     方法返回值（void 方法时为 null）
     */
    void onAfter(String className, String methodName, Object target, Object[] args, Object result);

    /**
     * 目标方法抛出异常后的回调
     *
     * @param className  目标类全限定名
     * @param methodName 目标方法名
     * @param target     目标对象（静态方法时为 null）
     * @param args       方法参数
     * @param throwable  抛出的异常
     */
    void onError(String className, String methodName, Object target, Object[] args, Throwable throwable);
}