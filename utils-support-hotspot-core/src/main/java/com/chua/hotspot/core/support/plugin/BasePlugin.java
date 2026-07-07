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
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 基础插件
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

    public String refectBody(Class<?> needRefectType, String methodName) {
        return "{" + refect(needRefectType, methodName) + "}";
    }

    public String refect(Class<?> needRefectType, String methodName) {
        return "try{\n" +
                "\tClass type = ClassLoader.getSystemClassLoader().loadClass(\"" + needRefectType.getTypeName() + "\");\n" +
                "\tjava.lang.reflect.Method method = type.getDeclaredMethod(\"" + methodName + "\", new Class[]{Object.class, Object[].class});\n" +
                "\tmethod.setAccessible(true);\n" +
                "\tmethod.invoke(null, new Object[]{this, $args});\n}catch(Throwable ignore){\n\tignore.printStackTrace();\n}";
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
