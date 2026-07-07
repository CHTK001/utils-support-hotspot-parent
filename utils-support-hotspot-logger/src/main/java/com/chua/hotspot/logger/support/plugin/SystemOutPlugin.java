package com.chua.hotspot.logger.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.pojo.LogEvent;
import com.chua.hotspot.core.support.server.ServerFactory;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.PrintStream;
import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * System.out/System.err 日志插件
 * 用于检测和追踪 System.out 和 System.err 的输出
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class SystemOutPlugin extends BytebuddyPlugin {

    private static final String WEBSOCKET_EVENT = "AGENT_LOG";
    private static final int MAX_MESSAGE_LENGTH = 1024;

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        
        captureOutput(target, objects);
        return callable.call();
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
            
            ReportFactory.report(ModuleType.LOG, WEBSOCKET_EVENT, logEvent);
        } catch (Exception e) {
            // 忽略捕获过程中的异常，避免影响应用
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

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(
            DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("write")
                        .or(ElementMatchers.named("print"))
                        .or(ElementMatchers.named("println")))
                .intercept(MethodDelegation.to(SystemOutPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("java.io.PrintStream");
    }

    @Override
    public String name() {
        return "SystemOut";
    }
}
