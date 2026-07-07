package com.chua.hotspot.core.support.transform;

import net.bytebuddy.jar.asm.Label;
import net.bytebuddy.jar.asm.MethodVisitor;
import net.bytebuddy.jar.asm.Type;

import static net.bytebuddy.jar.asm.Opcodes.*;

/**
 * Convenience method to generate bytecode.
 *
 * @author Kohsuke Kawaguchi
 */
public class CodeGenerator extends MethodVisitor {
    public CodeGenerator(MethodVisitor mv) {
        super(ASM6, mv);
    }

    public void println(String msg) {
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        ldc(msg);
        invokeVirtual("java/io/PrintStream", "println", "(Ljava/lang/String;)V");
    }

    public void doNull() {
        super.visitInsn(ACONST_NULL);
    }

    public void newArray(String type, int size) {
        iconst(size);
        super.visitTypeInsn(ANEWARRAY, type);
    }

    public void iconst(int i) {
        if (i <= 5) {
            super.visitInsn(ICONST_0 + i);
        } else {
            super.visitLdcInsn(i);
        }
    }

    public void dup() {
        super.visitInsn(DUP);
    }

    public void aastore() {
        super.visitInsn(AASTORE);
    }

    public void aload(int i) {
        super.visitIntInsn(ALOAD, i);
    }

    public void astore(int i) {
        super.visitIntInsn(ASTORE, i);
    }

    public void pop() {
        super.visitInsn(POP);
    }

    public void ldc(Object o) {
        if (o.getClass() == Class.class) {
            o = Type.getType((Class<?>) o);
        }
        super.visitLdcInsn(o);
    }

    public void invokeVirtual(String owner, String name, String desc) {
        super.visitMethodInsn(INVOKEVIRTUAL, owner, name, desc, false);
    }

    /**
     * Invokes a static method on the class in the system classloader.
     * <p>
     * This is used for instrumenting classes in the bootstrap classloader,
     * which cannot see the classes in the system classloader.
     */
//    public void invokeAppStatic(String userClassName, String userMethodName, Class[] argTypes, int[] localIndex) {
//        visitMethodInsn(INVOKESTATIC,"java/lang/ClassLoader","getSystemClassLoader","()Ljava/lang/ClassLoader;");
//        ldc(userClassName);
//        invokeVirtual("java/lang/ClassLoader","loadClass","(Ljava/lang/String;)Ljava/lang/Class;");
//        ldc(userMethodName);
//        newArray("java/lang/Class",0);

    /// /        for (int i = 0; i < argTypes.length; i++)
    /// /            storeConst(i, argTypes[i]);
//
//        invokeVirtual("java/lang/Class","getDeclaredMethod","(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;");
//        pop();
//    }
    /**
     * 直接调用 Bootstrap ClassLoader 可见的静态方法（无反射，避免递归）
     * 用于增强 JDK 核心类时调用回调方法
     * 
     * @param className 类名（必须在 Bootstrap ClassLoader 中可见）
     * @param methodName 方法名
     * @param argTypes 参数类型
     * @param localIndex 局部变量索引
     */
    public void invokeBootstrapStatic(String className, String methodName, Class<?>[] argTypes, int[] localIndex) {
        // 将类名转换为内部格式（如 com/chua/hotspot/bootstrap/FileHandleHook）
        String internalClassName = className.replace('.', '/');
        
        // 构建方法描述符（如 (Ljava/lang/Object;)V）
        StringBuilder desc = new StringBuilder("(");
        for (Class<?> argType : argTypes) {
            desc.append(Type.getDescriptor(argType));
        }
        desc.append(")V");
        
        // 加载参数到栈
        for (int i = 0; i < localIndex.length; i++) {
            aload(localIndex[i]);
        }
        
        // 直接调用静态方法（INVOKESTATIC）
        visitMethodInsn(INVOKESTATIC, internalClassName, methodName, desc.toString(), false);
    }
    
    public void invokeAppStatic(Class<?> userClass, String userMethodName, Class<?>[] argTypes, int[] localIndex) {
        invokeAppStatic(userClass.getName(), userMethodName, argTypes, localIndex);
    }

    /**
     * 直接调用静态方法（无反射，避免递归导致的 StackOverflowError）
     * <p>
     * 注意：被调用的类必须在 Bootstrap ClassLoader 中可见，
     * 需要通过 Instrumentation.appendToBootstrapClassLoaderSearch() 添加
     * </p>
     */
    public void invokeAppStatic(String userClassName, String userMethodName, Class<?>[] argTypes, int[] localIndex) {
        // 将类名转换为内部格式
        String internalClassName = userClassName.replace('.', '/');
        
        // 构建方法描述符
        StringBuilder desc = new StringBuilder("(");
        for (Class<?> argType : argTypes) {
            desc.append(Type.getDescriptor(argType));
        }
        desc.append(")V");
        
        // 使用 try-catch 包装整个调用，防止类未加载时抛出异常导致原方法失败
        Label s = new Label();
        Label e = new Label();
        Label h = new Label();
        Label tail = new Label();
        visitTryCatchBlock(s, e, h, "java/lang/Throwable");
        
        visitLabel(s);
        // 加载参数到栈（在 try 块内）
        for (int idx : localIndex) {
            aload(idx);
        }
        // 直接调用静态方法（INVOKESTATIC）- 无反射，避免递归
        visitMethodInsn(INVOKESTATIC, internalClassName, userMethodName, desc.toString(), false);
        visitLabel(e);
        doGoto(tail);
        
        visitLabel(h);
        // 忽略任何异常，防止影响原方法执行
        pop();
        
        visitLabel(tail);
    }

    /**
     * When the stack top is an array, store a constant to the known index of the array.
     * <p>
     * ..., array => ..., array
     */
    private void storeConst(int idx, Object type) {
        dup();
        iconst(idx);
        ldc(type);
        aastore();
    }

    public void doGoto(Label l) {
        visitJumpInsn(GOTO, l);
    }

    public void ifFalse(Label label) {
        visitJumpInsn(IFEQ, label);
    }

    public void athrow() {
        visitInsn(ATHROW);
    }
}
