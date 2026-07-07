package com.chua.hotspot.core.support.plugin.impl;

import com.chua.hotspot.core.support.annotations.Transform;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.plugin.BasePlugin;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtConstructor;
import javassist.LoaderClassPath;

import java.lang.reflect.Method;

/**
 * @author CH
 */
public class ExceptionPlugin extends BasePlugin {
    @Override
    public String name() {
        return "Exception";
    }


    @Transform(Exception.class)
    public byte[] transform() {
        ClassPool classPool = ClassPool.getDefault();
        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        classPool.importPackage(Method.class.getTypeName());
        classPool.importPackage(Throwable.class.getTypeName());
        classPool.insertClassPath(new LoaderClassPath(contextClassLoader));
        try {
            CtClass ctClass = classPool.get("java.lang.Exception");
            CtConstructor[] constructors = ctClass.getConstructors();
            for (CtConstructor constructor : constructors) {
                constructor.insertAfter("{try{" +
                        "Class type = ClassLoader.getSystemClassLoader().loadClass(\"" + this.getClass().getTypeName() + "\");" +
                        "Method method = type.getDeclaredMethod(\"register\", new Class[]{Object.class, Object[].class});" +
                        "method.setAccessible(true);" +
                        "method.invoke(null, new Object[]{this, $args});}catch(Throwable ignore){}}");

//                constructor.insertAfter(this.getClass().getTypeName()+".register(this, $args);");
            }
            byte[] bytes = ctClass.toBytecode();
            ctClass.detach();
            return bytes;
        } catch (Exception e) {
            return null;
        }
    }


    @Override
    public void finish() {
        try {
            InstrumentationFactory.getInstance().get().retransformClasses(Exception.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
