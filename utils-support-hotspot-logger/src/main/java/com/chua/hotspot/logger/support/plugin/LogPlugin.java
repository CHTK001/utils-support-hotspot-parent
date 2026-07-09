package com.chua.hotspot.logger.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.pojo.LogEvent;
import com.chua.hotspot.core.support.server.ServerFactory;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.LoaderClassPath;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Callable;

/**
 * 日志插件
 * 支持 Logback、Log4j、System.out/System.err 日志检测
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class LogPlugin extends BytebuddyPlugin {

    private static final String LOGBACK = "ch.qos.logback.core.rolling.RollingFileAppender";
    private static final Set<String> IGNORE = new HashSet<>();
    static String WEBSOCKET_EVENT = "AGENT_LOG";

    static {
        IGNORE.add("org.apache.coyote.http11.Http11OutputBuffer");
        IGNORE.add("com.alibaba.druid.support.json.JSONWriter");
        IGNORE.add("org.apache.tomcat.util.net.NioChannel");
        IGNORE.add("org.apache.catalina.connector.CoyoteWriter");
        IGNORE.add("ch.qos.logback.core.FileAppender");
    }

    public static void register(Object target, Object[] args) throws Exception {
        Class<?> aClass = target.getClass();

        String name = aClass.getTypeName();
        if (LOGBACK.equals(name) || ignore(aClass)) {
            return;
        }

        if (args.length == 0) {
            return;
        }

        toEndpoint(args);

//         NewTrackManager.invoke(callable, target, method, objects);
    }

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
            @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        BytebuddyPlugin.interceptEnter();
        try {
            register(target, objects);
            return callable.call();
        } catch (Exception e) {
            BytebuddyPlugin.interceptError();
            throw e;
        } finally {
            BytebuddyPlugin.interceptExit();
        }
    }

    /**
     * 注册slf4j
     *
     * @param allArguments 所有论点
     */
    public static void toEndpoint(Object[] allArguments) {
        String message = getMessage(allArguments);
        if (null == message) {
            return;
        }

        LogEvent logEvent = new LogEvent();
        logEvent.setMessage(message);
        ReportFactory.report(ModuleType.LOG, "AGENT_LOG", logEvent);
    }

    private static String getMessage(Object[] allArguments) {
        Object value = allArguments[0];
        if (null != value) {
            String msg = null;
            if (value instanceof byte[]) {
                return new String((byte[]) value);
            }
            if (value instanceof String) {
                if (!"".equals(value)) {
                    return value.toString();
                }
            }
            if (value instanceof StringBuilder) {
                return value.toString();
            }

        }

        return null;
    }

    /**
     * 是否忽略
     *
     * @param cls 对象
     * @return 是否忽略
     */
    private static boolean ignore(Class<?> cls) {
        return IGNORE.contains(cls.getName());
    }

    @Override
    public String name() {
        return "Logback";
    }

    @Override
    public void initComplete() {
        try {
            Class<?> type = InstrumentationFactory.getInstance().getType("ch.qos.logback.core.OutputStreamAppender");
            if (null != type) {
                logFactory.info("重构 ch.qos.logback.core.OutputStreamAppender");
                InstrumentationFactory.getInstance().rebase(type, createOutputStreamAppender(type.getName(), type, null));
            }
        } catch (Exception ignored) {
        }
        try {
            Class<?> type1 = InstrumentationFactory.getInstance().getType("org.apache.log4j.helpers.QuietWriter");
            if (null != type1) {
                logFactory.info("重构 org.apache.log4j.helpers.QuietWriter");
                InstrumentationFactory.getInstance().rebase(type1, createQuietWriter(type1.getName(), type1, null));
            }
        } catch (Exception ignored) {
        }
        super.initComplete();
    }

    private byte[] createQuietWriter(String name, Class<?> type, byte[] classfileBuffer) {
        ClassPool classPool = ClassPool.getDefault();
        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        classPool.importPackage(Method.class.getTypeName());
        classPool.importPackage(Throwable.class.getTypeName());
        classPool.importPackage(LogPlugin.class.getTypeName());
        classPool.insertClassPath(new LoaderClassPath(contextClassLoader));
        try {
            CtClass ctClass = classPool.get(name);
            CtMethod method = ctClass.getDeclaredMethod("write", new CtClass[]{classPool.get(byte[].class.getTypeName())});
            method.insertAfter(this.getClass().getTypeName() + ".register(this, $args);");
            byte[] bytes = ctClass.toBytecode();
            ctClass.detach();
            return bytes;
        } catch (Exception e) {
            return classfileBuffer;
        }
    }

    private byte[] createOutputStreamAppender(String name, Class<?> type, byte[] classfileBuffer) {
        ClassPool classPool = ClassPool.getDefault();
        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        classPool.importPackage(Method.class.getTypeName());
        classPool.importPackage(Throwable.class.getTypeName());
        classPool.importPackage(LogPlugin.class.getTypeName());
        classPool.insertClassPath(new LoaderClassPath(contextClassLoader));
        try {
            CtClass ctClass = classPool.get(name);
            CtMethod method = ctClass.getDeclaredMethod("writeBytes", new CtClass[]{classPool.get(byte[].class.getTypeName())});
//            method.insertAfter("{try{" +
//                    "Class type = ClassLoader.getSystemClassLoader().loadClass(\""+ this.getClass().getTypeName()+"\");" +
//                    "Method method = type.getDeclaredMethod(\"register\", new Class[]{Object.class, Object[].class});" +
//                    "method.setAccessible(true);" +
//                    "method.invoke(null, new Object[]{this, $args});}catch(Throwable ignore){}}");
            method.insertAfter(this.getClass().getTypeName() + ".register(this, $args);");
            byte[] bytes = ctClass.toBytecode();
            ctClass.detach();
            return bytes;
        } catch (Exception e) {
            return classfileBuffer;
        }
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("writeBytes")
                        .or(ElementMatchers.named("write"))
                        .or(ElementMatchers.named("encode")))
                .intercept(MethodDelegation.to(LogPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.hasSuperType(ElementMatchers.named("ch.qos.logback.core.OutputStreamAppender"))
                .or(ElementMatchers.named("org.apache.logging.log4j.core.layout.StringBuilderEncoder"))
                .or(ElementMatchers.named("org.apache.log4j.helpers.QuietWriter"));
    }
}
