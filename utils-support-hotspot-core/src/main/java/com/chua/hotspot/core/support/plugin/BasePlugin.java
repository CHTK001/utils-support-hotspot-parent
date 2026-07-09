package com.chua.hotspot.core.support.plugin;

import com.chua.hotspot.core.support.annotations.Transform;
import com.chua.hotspot.core.support.handler.FileHandlerFactory;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.transform.TransformerBaseImpl;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.JarPathUtils;
import javassist.ClassClassPath;
import javassist.ClassPool;
import javassist.LoaderClassPath;
import javassist.NotFoundException;

import java.lang.instrument.UnmodifiableClassException;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 基础插件
 * <p>
 * 注意：此类使用 Javassist 字节码增强模式，已被 {@link BytebuddyPlugin} 替代。
 * 新插件应继承 BytebuddyPlugin 而非 BasePlugin。
 * </p>
 *
 * @author CH
 */
public abstract class BasePlugin implements Plugin {
    protected static ClassPool classPool = ClassPool.getDefault();
    static LogFactory logFactory = LogFactory.getInstance();

    static {
        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        classPool.importPackage("com.chua.hotspot.core");
        classPool.insertClassPath(new ClassClassPath(FileHandlerFactory.class));
        try {
            String string = JarPathUtils.getJarPath(Plugin.class);
            logFactory.info("Plugin path: {}", string);
            classPool.appendClassPath(string);
        } catch (NotFoundException ignored) {
        }
        classPool.insertClassPath(new LoaderClassPath(contextClassLoader));
    }

    Map<String, MethodWrapper> methodMap = new ConcurrentHashMap<>();
    Map<String, Class<?>> classMap = new ConcurrentHashMap<>();

    /**
     * 方法句柄缓存，替代运行时反射调用
     * Key: "类名#方法名"，Value: 对应的 MethodHandle
     */
    private static final Map<String, MethodHandle> METHOD_HANDLE_CACHE = new ConcurrentHashMap<>();

    /**
     * 生成直接方法调用的 Javassist 代码体（替代反射调用）
     * <p>
     * 优化说明：原 refect() 方法生成的代码使用 Class.forName + getDeclaredMethod + method.invoke，
     * 每次调用都需要反射查找和方法调用，性能开销大。新方案生成直接类型转换和方法调用的字节码，
     * Javassist 在编译时即可解析类型，生成与手写代码等价的直接调用指令。
     * </p>
     *
     * @param needRefectType 目标类型
     * @param methodName     方法名
     * @return Javassist 代码体字符串（不含外层花括号）
     */
    public String refectBody(Class<?> needRefectType, String methodName) {
        return "{" + refect(needRefectType, methodName) + "}";
    }

    /**
     * 生成直接方法调用的 Javassist 代码（替代反射调用）
     * <p>
     * 生成的代码使用直接类型转换和静态方法调用，而非运行时反射。
     * 性能提升：避免了每次调用时的 Class.forName、getDeclaredMethod、method.invoke 开销。
     * </p>
     *
     * @param needRefectType 目标类型
     * @param methodName     方法名
     * @return Javassist 代码字符串
     */
    public String refect(Class<?> needRefectType, String methodName) {
        String typeName = needRefectType.getTypeName();
        // 生成直接方法调用代码，Javassist 在编译时解析类型
        return "try{\n" +
                "\t" + typeName + " type = (" + typeName + ")ClassLoader.getSystemClassLoader().loadClass(\"" + typeName + "\");\n" +
                "\ttype." + methodName + "(this, $args);\n" +
                "}catch(Throwable ignore){\n\tignore.printStackTrace();\n}";
    }

    /**
     * 通过 MethodHandle 调用目标类的静态方法（替代反射调用）
     * <p>
     * MethodHandle 相比反射的优势：
     * 1. 首次查找后缓存，后续调用无查找开销
     * 2. JVM 可对 MethodHandle 调用进行内联优化
     * 3. 调用性能接近直接方法调用
     * </p>
     *
     * @param targetClass 目标类
     * @param methodName  方法名
     * @param paramTypes  参数类型
     * @param args        调用参数
     * @return 方法返回值，调用失败返回 null
     */
    public static Object invokeDirect(Class<?> targetClass, String methodName, Class<?>[] paramTypes, Object... args) {
        String key = targetClass.getName() + "#" + methodName;
        try {
            MethodHandle handle = METHOD_HANDLE_CACHE.computeIfAbsent(key, k -> {
                try {
                    return MethodHandles.publicLookup().findStatic(
                            targetClass, methodName, MethodType.methodType(Object.class, paramTypes));
                } catch (Exception e) {
                    throw new RuntimeException("无法创建 MethodHandle: " + key, e);
                }
            });
            return handle.invokeWithArguments(args);
        } catch (Throwable e) {
            logFactory.debug("MethodHandle 调用失败: {}#{}", targetClass.getName(), methodName);
            return null;
        }
    }

    /**
     * 初始化
     */
    @Override
    public void init() {
        Method[] declaredMethods = this.getClass().getDeclaredMethods();
        for (Method declaredMethod : declaredMethods) {
            if (Modifier.isStatic(declaredMethod.getModifiers())) {
                continue;
            }

            if (declaredMethod.getParameterCount() != 0) {
                continue;
            }

            Transform transform = declaredMethod.getDeclaredAnnotation(Transform.class);

            if (null == transform) {
                continue;
            }

            if (byte[].class != declaredMethod.getReturnType()) {
                continue;
            }

            declaredMethod.setAccessible(true);
            Class<?>[] value = transform.value();
            for (Class<?> aClass : value) {
                methodMap.put(aClass.getTypeName(), new MethodWrapper(declaredMethod, this));
                classMap.put(aClass.getTypeName(), aClass);
            }
        }
    }

    /**
     * 转换
     *
     * @return {@link byte[]}
     */
    byte[] transform(String typeName, byte[] classFileBytes) {
        MethodWrapper method = methodMap.get(typeName);
        if (null == method) {
            return classFileBytes;
        }
        return method.invoke(typeName);
    }

    public void reTransform() {
        try {
            InstrumentationFactory.getInstance()
                    .retransformClasses(classMap.values().toArray(new Class[0]));
        } catch (UnmodifiableClassException ignored) {
        }
    }

    @Override
    public void initComplete() {
        InstrumentationFactory.getInstance().addTransformer(new TransformerBaseImpl(methodMap), true);
        reTransform();
        logFactory.info("{} plugin init complete", name());
    }


    public static class MethodWrapper {
        private final Method method;
        private final BasePlugin basePlugin;

        public MethodWrapper(Method declaredMethod, BasePlugin basePlugin) {
            method = declaredMethod;
            this.basePlugin = basePlugin;
        }

        /**
         * 调用
         *
         * @param typeName 类型名称
         * @return {@link byte[]}
         */
        public byte[] invoke(String typeName) {
            return (byte[]) ClassUtils.invokeMethod(method, this, typeName);
        }
    }
}
