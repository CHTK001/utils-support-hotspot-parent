package com.chua.hotspot.core.support.agent;

import com.chua.hotspot.spy.Spy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.implementation.bytecode.assign.Assigner;

/**
 * Spy Advice 内联通知类
 * <p>
 * 由 ByteBuddy Advice 内联到目标方法中，调用 Spy 桥接类的静态方法。
 * 内联后的字节码只引用 Bootstrap CL 中的 Spy.class，不引用任何 agent/core 类。
 * </p>
 *
 * @author CH
 * @since 4.0.0.37
 */
public class SpyAdvice {

    /**
     * 方法进入通知 - 在目标方法执行前调用
     */
    public static class Enter {
        @Advice.OnMethodEnter(suppress = Throwable.class)
        public static void onEnter(
                @Advice.Origin("#t") String className,
                @Advice.Origin("#m") String methodName,
                @Advice.This(optional = true, readOnly = true) Object target,
                @Advice.AllArguments Object[] args) {
            if (className.contains("StandardHostValve")) {
                System.out.println("[SPY] SpyAdvice.Enter: " + className + "." + methodName);
            }
            Spy.before(className, methodName, target, args);
        }
    }

    /**
     * 方法退出通知 - 在目标方法执行后调用（正常返回或抛出异常）
     */
    public static class Exit {
        @Advice.OnMethodExit(suppress = Throwable.class, onThrowable = Throwable.class)
        public static void onExit(
                @Advice.Origin("#t") String className,
                @Advice.Origin("#m") String methodName,
                @Advice.This(optional = true, readOnly = true) Object target,
                @Advice.AllArguments Object[] args,
                @Advice.Thrown(readOnly = true) Throwable throwable,
                @Advice.Return(typing = Assigner.Typing.DYNAMIC, readOnly = true) Object result) {
            if (throwable != null) {
                Spy.error(className, methodName, target, args, throwable);
            } else {
                Spy.after(className, methodName, target, args, result);
            }
        }
    }
}