package com.chua.hotspot.logger.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.pojo.LogEvent;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

/**
 * System.out/System.err 日志插件（Spy 模式）
 * <p>
 * 拦截方式：ByteBuddy Advice + Spy 桥接模式
 * 拦截目标：java.io.PrintStream 的 write/print/println 方法
 * </p>
 *
 * <h3>Spy 模式调用链路：</h3>
 * <pre>
 * PrintStream.write/print/println 方法执行
 *     → Advice 内联代码调用 Spy.before/after
 *     → SpyHandlerImpl 路由到 SystemOutPlugin.spyBefore/spyAfter
 *     → captureOutput() 捕获输出并上报
 * </pre>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.37
 */
public class SystemOutPlugin extends BytebuddyPlugin {

    private static final String WEBSOCKET_EVENT = "AGENT_LOG";
    private static final int MAX_MESSAGE_LENGTH = 1024;

    @Override
    public String name() {
        return "SystemOut";
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("java.io.PrintStream");
    }

    @Override
    public ElementMatcher<? super MethodDescription> methodMatcher() {
        return ElementMatchers.named("write")
                .or(ElementMatchers.named("print"))
                .or(ElementMatchers.named("println"));
    }

    /**
     * Spy 前置回调 - 在 PrintStream 方法执行前调用
     */
    @Override
    public void spyBefore(String className, String methodName, Object target, Object[] args) {
        // 记录计时起点
        super.spyBefore(className, methodName, target, args);
    }

    /**
     * Spy 后置回调 - 在 PrintStream 方法正常返回后调用
     */
    @Override
    public void spyAfter(String className, String methodName, Object target, Object[] args, Object result) {
        try {
            captureOutput(target, args);
        } catch (Exception e) {
            // 忽略捕获过程中的异常，避免影响应用
        }
        super.spyAfter(className, methodName, target, args, result);
    }

    /**
     * Spy 异常回调 - 在 PrintStream 方法抛出异常后调用
     */
    @Override
    public void spyError(String className, String methodName, Object target, Object[] args, Throwable throwable) {
        super.spyError(className, methodName, target, args, throwable);
    }

    /**
     * 捕获 System.out/System.err 的输出
     *
     * @param target PrintStream 对象
     * @param objects 方法参数
     */
    private static void captureOutput(Object target, Object[] objects) {
        try {
            if (objects == null || objects.length == 0) {
                return;
            }

            String message = extractMessage(objects[0]);
            if (message == null || message.isEmpty()) {
                return;
            }

            // 限制消息长度，避免过大的日志
            if (message.length() > MAX_MESSAGE_LENGTH) {
                message = message.substring(0, MAX_MESSAGE_LENGTH) + "...";
            }

            // 判断是 System.out 还是 System.err
            String streamType = isSystemErr(target) ? "STDERR" : "STDOUT";
            String logMessage = "[" + streamType + "] " + message;

            LogEvent logEvent = new LogEvent();
            logEvent.setMessage(logMessage);
            
            // 捕获调用栈，定位 System.out/err 的调用来源
            fillCallerInfo(logEvent);
            
            ReportFactory.report(ModuleType.LOG, WEBSOCKET_EVENT, logEvent);
        } catch (Exception e) {
            // 忽略捕获过程中的异常，避免影响应用
        }
    }

    /**
     * 从当前线程调用栈中提取 System.out/err 的调用者信息
     * 跳过 PrintStream 自身的方法帧和本插件内部帧，定位实际调用 System.out/err 的业务代码
     *
     * @param logEvent 日志事件，填充 className 和 line 字段
     */
    private static void fillCallerInfo(LogEvent logEvent) {
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        // 跳过: getStackTrace -> fillCallerInfo -> captureOutput -> Spy回调帧 -> PrintStream方法帧
        // 找到第一个非 PrintStream、非 Spy、非本插件类的帧即为实际调用者
        for (int i = 3; i < stackTrace.length; i++) {
            StackTraceElement element = stackTrace[i];
            String className = element.getClassName();
            // 跳过 PrintStream 自身、Spy 桥接类、本插件内部类
            if (className.startsWith("java.io.PrintStream")
                    || className.startsWith("java.io.FilterOutputStream")
                    || className.startsWith("java.io.OutputStream")
                    || className.startsWith("com.chua.hotspot.spy.Spy")
                    || className.startsWith("com.chua.hotspot.core.support.spy.SpyHandlerImpl")
                    || className.startsWith("com.chua.hotspot.logger.support.plugin.SystemOutPlugin")) {
                continue;
            }
            logEvent.setClassName(className);
            logEvent.setLine(element.getLineNumber());
            logEvent.setLogger(element.getMethodName());
            return;
        }
    }

    /**
     * 从参数中提取消息
     *
     * @param obj 参数对象
     * @return 消息字符串
     */
    private static String extractMessage(Object obj) {
        if (obj == null) {
            return null;
        }

        if (obj instanceof String) {
            return (String) obj;
        }

        if (obj instanceof byte[]) {
            return new String((byte[]) obj);
        }

        if (obj instanceof char[]) {
            return new String((char[]) obj);
        }

        return obj.toString();
    }

    /**
     * 判断是否为 System.err
     *
     * @param target PrintStream 对象
     * @return 是否为 System.err
     */
    private static boolean isSystemErr(Object target) {
        try {
            return target == System.err;
        } catch (Exception e) {
            return false;
        }
    }
}