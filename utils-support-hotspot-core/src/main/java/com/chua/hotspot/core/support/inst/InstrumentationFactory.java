package com.chua.hotspot.core.support.inst;

import java.lang.instrument.ClassDefinition;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.lang.instrument.UnmodifiableClassException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.jar.JarFile;

/**
 * @author CH
 */
public class InstrumentationFactory {

    static final InstrumentationFactory INSTANCE = new InstrumentationFactory();
    private final Map<String, Class<?>> cache = new ConcurrentHashMap<>();
    public Instrumentation instrumentation;

    private InstrumentationFactory() {
    }

    /**
     * 获取实例
     *
     * @return {@link InstrumentationFactory}
     */
    public static InstrumentationFactory getInstance() {
        return INSTANCE;
    }

    /**
     * 刷新
     */
    public void refresh() {
        Class[] allLoadedClasses = instrumentation.getAllLoadedClasses();
        for (Class allLoadedClass : allLoadedClasses) {
            cache.put(allLoadedClass.getTypeName(), allLoadedClass);
        }
    }

    /**
     * get类型
     *
     * @param name 名称
     * @return {@link Class}<{@link ?}>
     */
    public Class<?> getType(String name) {
        if (cache.containsKey(name)) {
            return cache.get(name);
        }

        refresh();
        for (Map.Entry<String, Class<?>> entry : cache.entrySet()) {
            String entryKey = entry.getKey();
            if (name.equals(entryKey) || entryKey.endsWith(name)) {
                return entry.getValue();
            }
        }

        return null;
    }

    public void init(Instrumentation instrumentation) {
        this.instrumentation = instrumentation;
    }

    /**
     * get
     *
     * @return {@link Instrumentation}
     */
    public Instrumentation get() {
        return instrumentation;
    }

    /**
     * 重定义
     *
     * @param type  类型
     * @param bytes 字节
     * @throws Exception 异常
     */
    public void rebase(Class<?> type, byte[] bytes) throws Exception {
        if (null == type) {
            return;
        }
        ClassDefinition classDefinition = new ClassDefinition(type, bytes);
        instrumentation.redefineClasses(classDefinition);
    }

    public void retransformClasses(Class[] array) throws UnmodifiableClassException {
        instrumentation.retransformClasses(array);
    }

    public void addTransformer(ClassFileTransformer transformer, boolean b) {
        instrumentation.addTransformer(transformer, b);
    }
    
    /**
     * 将 JAR 文件添加到 Bootstrap ClassLoader 搜索路径
     * <p>
     * 这样 JDK 核心类（如 FileInputStream）增强后就能看到我们的回调类
     * </p>
     *
     * @param jarFile JAR 文件
     */
    public void appendToBootstrapClassLoaderSearch(JarFile jarFile) {
        instrumentation.appendToBootstrapClassLoaderSearch(jarFile);
    }
}
