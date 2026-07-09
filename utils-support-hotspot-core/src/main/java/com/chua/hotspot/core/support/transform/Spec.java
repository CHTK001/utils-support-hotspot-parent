package com.chua.hotspot.core.support.transform;

import net.bytebuddy.jar.asm.Label;
import net.bytebuddy.jar.asm.MethodVisitor;
import net.bytebuddy.jar.asm.Type;

import java.io.*;
import java.nio.channels.FileChannel;
import java.nio.channels.SeekableByteChannel;
import java.nio.channels.spi.AbstractInterruptibleChannel;
import java.nio.channels.spi.AbstractSelectableChannel;
import java.nio.channels.spi.AbstractSelector;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipFile;

import static net.bytebuddy.jar.asm.Opcodes.*;

/**
 * 转换规格定义类
 * 定义文件/Socket/管道等资源的拦截规则
 *
 * @author CH
 * @since 2022-02-11
 */
public class Spec {

    /**
     * ASM 版本号，根据 Java 版本动态选择
     */
    private static final int ASM_VERSION = determineAsmVersion();

    /**
     * 创建字节码转换规格列表
     * <p>
     * 整合自 file-leak-detector，包含以下拦截：
     * <ul>
     *   <li>FileInputStream/FileOutputStream/RandomAccessFile/ZipFile 构造函数拦截</li>
     *   <li>FileChannel.open 静态方法拦截</li>
     *   <li>Files.newByteChannel/newDirectoryStream 静态方法拦截（整合自 file-leak-detector）</li>
     *   <li>FileChannelImpl.open 静态方法拦截（整合自 file-leak-detector）</li>
     *   <li>Pipe 构造函数拦截</li>
     *   <li>AbstractInterruptibleChannel.close 拦截</li>
     *   <li>DirectoryStream.close 拦截（OS特定，整合自 file-leak-detector）</li>
     *   <li>Selector 构造函数和 close 拦截</li>
     *   <li>SocketImpl/SocketChannel 拦截（Java 19 以下）</li>
     * </ul>
     * </p>
     *
     * @return 转换规格列表
     */
    public static List<ClassTransformSpec> createSpec() {
        List<ClassTransformSpec> spec = new ArrayList<>();

        // ==================== 文件类句柄拦截 ====================
        spec.add(newSpec(FileOutputStream.class, "(Ljava/io/File;Z)V"));
        spec.add(newSpec(FileInputStream.class, "(Ljava/io/File;)V"));
        spec.add(newSpec(RandomAccessFile.class, "(Ljava/io/File;Ljava/lang/String;)V"));
        spec.add(newSpec(ZipFile.class, "(Ljava/io/File;I)V"));

        /*
         * Detect the files opened via FileChannel.open(...) calls
         */
        spec.add(new ClassTransformSpec(FileChannel.class,
                new ReturnFromStaticMethodInterceptor("open",
                        "(Ljava/nio/file/Path;Ljava/util/Set;[Ljava/nio/file/attribute/FileAttribute;)Ljava/nio/channels/FileChannel;",
                        4, "open_filechannel", FileChannel.class, Path.class)));

        /*
         * Detect instances opened via static methods in class java.nio.file.Files
         * 整合自 file-leak-detector: 支持 SeekableByteChannel 和 DirectoryStream 的跟踪
         */
        spec.add(new ClassTransformSpec(Files.class,
                // SeekableByteChannel newByteChannel(Path path, Set<? extends OpenOption> options, FileAttribute<?>... attrs)
                new ReturnFromStaticMethodInterceptor("newByteChannel",
                        "(Ljava/nio/file/Path;Ljava/util/Set;[Ljava/nio/file/attribute/FileAttribute;)Ljava/nio/channels/SeekableByteChannel;",
                        4, "openFileChannel", SeekableByteChannel.class, Path.class),
                // DirectoryStream<Path> newDirectoryStream(Path dir)
                new ReturnFromStaticMethodInterceptor("newDirectoryStream",
                        "(Ljava/nio/file/Path;)Ljava/nio/file/DirectoryStream;",
                        2, "openDirectoryStream", DirectoryStream.class, Path.class),
                // DirectoryStream<Path> newDirectoryStream(Path dir, String glob)
                new ReturnFromStaticMethodInterceptor("newDirectoryStream",
                        "(Ljava/nio/file/Path;Ljava/lang/String;)Ljava/nio/file/DirectoryStream;",
                        6, "openDirectoryStream", DirectoryStream.class, Path.class),
                // DirectoryStream<Path> newDirectoryStream(Path dir, DirectoryStream.Filter<? super Path> filter)
                new ReturnFromStaticMethodInterceptor("newDirectoryStream",
                        "(Ljava/nio/file/Path;Ljava/nio/file/DirectoryStream$Filter;)Ljava/nio/file/DirectoryStream;",
                        3, "openDirectoryStream", DirectoryStream.class, Path.class)
        ));

        /*
         * Detect new Pipes
         */
        spec.add(new ClassTransformSpec(AbstractSelectableChannel.class,
                new ConstructorInterceptor("(Ljava/nio/channels/spi/SelectorProvider;)V", "openPipe")));

        /*
         * AbstractInterruptibleChannel is used by FileChannel and Pipes
         */
        spec.add(new ClassTransformSpec(AbstractInterruptibleChannel.class,
                new CloseInterceptor("close")));

        /*
         * We need to see closing of DirectoryStream instances,
         * however they are OS-specific, so we need to list them via String-name
         * 整合自 file-leak-detector: 支持 OS 特定的 DirectoryStream 关闭拦截
         */
        if (!System.getProperty("os.name").startsWith("Windows")) {
            spec.add(new ClassTransformSpec("sun/nio/fs/UnixDirectoryStream", new CloseInterceptor("close")));
            spec.add(new ClassTransformSpec("sun/nio/fs/UnixSecureDirectoryStream", new CloseInterceptor("close")));
        } else {
            spec.add(new ClassTransformSpec("sun/nio/fs/WindowsDirectoryStream", new CloseInterceptor("close")));
        }
        spec.add(new ClassTransformSpec("jdk/internal/jrtfs/JrtDirectoryStream", new CloseInterceptor("close")));
        spec.add(new ClassTransformSpec("jdk/nio/zipfs/ZipDirectoryStream", new CloseInterceptor("close")));

        /*
         * Detect selectors, which may open native pipes and anonymous inodes for event polling.
         */
        spec.add(new ClassTransformSpec(AbstractSelector.class,
                new ConstructorInterceptor("(Ljava/nio/channels/spi/SelectorProvider;)V", "openSelector"),
                new CloseInterceptor("close")));

        /*
         * java.net.Socket/ServerSocket uses SocketImpl, and this is where FileDescriptors
         * are actually managed.
         *
         * SocketInputStream/SocketOutputStream does not maintain a separate FileDescriptor.
         * They just all piggy back on the same SocketImpl instance.
         *
         * 整合自 file-leak-detector: Java 19+ 不再需要拦截 PlainSocketImpl
         */
        if (Runtime.version().feature() < 19) {
            spec.add(new ClassTransformSpec("java/net/PlainSocketImpl",
                    // this is where a new file descriptor is allocated.
                    // it'll occupy a socket even before it gets connected
                    new OpenSocketInterceptor("create", "(Z)V"),
                    // When a socket is accepted, it goes to "accept(SocketImpl s)"
                    // where 's' is the new socket and 'this' is the server socket
                    new AcceptInterceptor("accept", "(Ljava/net/SocketImpl;)V"),
                    // file descriptor actually get closed in socketClose()
                    new CloseInterceptor("socketClose")
            ));
            // Later versions of the JDK abstracted out the parts of PlainSocketImpl above into a super class
            spec.add(new ClassTransformSpec("java/net/AbstractPlainSocketImpl",
                    new OpenSocketInterceptor("create", "(Z)V"),
                    new AcceptInterceptor("accept", "(Ljava/net/SocketImpl;)V"),
                    new CloseInterceptor("socketClose")
            ));
        }

        spec.add(new ClassTransformSpec("sun/nio/ch/SocketChannelImpl",
                new OpenSocketInterceptor("<init>", "(Ljava/nio/channels/spi/SelectorProvider;Ljava/io/FileDescriptor;Ljava/net/InetSocketAddress;)V"),
                new OpenSocketInterceptor("<init>", "(Ljava/nio/channels/spi/SelectorProvider;)V"),
                new CloseInterceptor("kill")));

        /*
         * 整合自 file-leak-detector: 支持 FileChannelImpl.open 的字符串路径跟踪
         * sun.nio.ch.FileChannelImpl 有两个 open 静态方法（Java 8/11/17 参数不同）
         */
        spec.add(new ClassTransformSpec("sun/nio/ch/FileChannelImpl",
                new ReturnFromStaticMethodInterceptor("open",
                        "(Ljava/io/FileDescriptor;Ljava/lang/String;ZZZLjava/io/Closeable;)Ljava/nio/channels/FileChannel;",
                        4, "openFileString", Object.class, FileDescriptor.class, String.class),
                // Java 11/17 使用 Object 而非 Closeable 作为最后一个参数
                new ReturnFromStaticMethodInterceptor("open",
                        "(Ljava/io/FileDescriptor;Ljava/lang/String;ZZZLjava/lang/Object;)Ljava/nio/channels/FileChannel;",
                        4, "openFileString", Object.class, FileDescriptor.class, String.class)));

        return spec;
    }

    /**
     * Creates {@link ClassTransformSpec} that intercepts
     * a constructor and the close method.
     */
    private static ClassTransformSpec newSpec(final Class<?> c, String constructorDesc) {
        final String binName = c.getName().replace('.', '/');
        return new ClassTransformSpec(binName,
                new ConstructorOpenInterceptor(constructorDesc, binName),
                new CloseInterceptor("close")
        );
    }

    /**
     * Intercepts a void method used to close a handle and calls Listener.close in the end.
     */
    private static class CloseInterceptor extends MethodAppender {
        public CloseInterceptor(String methodName) {
            super(methodName, "()V");
        }

        @Override
        protected void append(CodeGenerator g) {
            // 通过反射调用 Listener.close
            g.invokeAppStatic(Listener.class, "close",
                    new Class[]{Object.class},
                    new int[]{0});
        }
    }

    /**
     * Intercepts a constructor invocation and calls the given method on Listener at the end of the constructor.
     */
    private static class ConstructorInterceptor extends MethodAppender {
        private final String hookMethod;

        public ConstructorInterceptor(String constructorDesc, String hookMethod) {
            super("<init>", constructorDesc);
            this.hookMethod = hookMethod;
        }

        @Override
        protected void append(CodeGenerator g) {
            // 通过反射调用 Listener 方法
            g.invokeAppStatic(Listener.class, hookMethod,
                    new Class[]{Object.class},
                    new int[]{0});
        }
    }

    private static class OpenSocketInterceptor extends MethodAppender {
        public OpenSocketInterceptor(String name, String desc) {
            super(name, desc);
        }

        @Override
        public MethodVisitor newAdapter(MethodVisitor base, int access, String name, String desc, String signature, String[] exceptions) {
            final MethodVisitor b = super.newAdapter(base, access, name, desc, signature, exceptions);
            return new OpenInterceptionAdapter(b, access, desc) {
                @Override
                protected boolean toIntercept(String owner, String name) {
                    return "socketCreate".equals(name);
                }
            };
        }

        @Override
        protected void append(CodeGenerator g) {
            // 通过反射调用 Listener.openSocket
            g.invokeAppStatic(Listener.class, "openSocket",
                    new Class[]{Object.class},
                    new int[]{0});
        }
    }

    /**
     * Used to intercept
     * java.net.PlainSocketImpl#accept(SocketImpl)
     */
    private static class AcceptInterceptor extends MethodAppender {
        public AcceptInterceptor(String name, String desc) {
            super(name, desc);
        }

        @Override
        public MethodVisitor newAdapter(MethodVisitor base, int access, String name, String desc, String signature, String[] exceptions) {
            final MethodVisitor b = super.newAdapter(base, access, name, desc, signature, exceptions);
            return new OpenInterceptionAdapter(b, access, desc) {
                @Override
                protected boolean toIntercept(String owner, String name) {
                    return "socketAccept".equals(name);
                }
            };
        }

        @Override
        protected void append(CodeGenerator g) {
            // the 's' parameter is the new socket that will own the socket
            // 通过反射调用 Listener.openSocket
            g.invokeAppStatic(Listener.class, "openSocket",
                    new Class[]{Object.class},
                    new int[]{1});
        }
    }

    /**
     * Rewrites a method that includes a call to a native method that actually opens a file descriptor
     * (therefore it can throw "too many open files" exception.)
     * <p>
     * surround the call with try/catch, and if "too many open files" exception is thrown
     * call {@link Listener#outOfDescriptors()}.
     */
    private static abstract class OpenInterceptionAdapter extends MethodVisitor {
        private final LocalVariablesSorter lvs;
        private final MethodVisitor base;

        private OpenInterceptionAdapter(MethodVisitor base, int access, String desc) {
            super(ASM_VERSION);
            lvs = new LocalVariablesSorter(access, desc, base);
            mv = lvs;
            this.base = base;
        }

        /**
         * Decide if this is the method that needs interception.
         */
        protected abstract boolean toIntercept(String owner, String name);

        protected Class<? extends Exception> getExpectedException() {
            return IOException.class;
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String desc, boolean itf) {
            if (toIntercept(owner, name)) {
                Type exceptionType = Type.getType(getExpectedException());

                CodeGenerator g = new CodeGenerator(mv);
                Label s = new Label(); // start of the try block
                Label e = new Label();  // end of the try block
                Label h = new Label();  // handler entry point
                Label tail = new Label();   // where the execution continue

                g.visitTryCatchBlock(s, e, h, exceptionType.getInternalName());
                g.visitLabel(s);
                super.visitMethodInsn(opcode, owner, name, desc, itf);
                g.doGoto(tail);

                g.visitLabel(e);
                g.visitLabel(h);
                // [RESULT]
                // catch(E ex) {
                //    boolean b = ex.getMessage().contains("Too many open files");
                int ex = lvs.newLocal(exceptionType);
                g.dup();
                base.visitVarInsn(ASTORE, ex);
                g.invokeVirtual(exceptionType.getInternalName(), "getMessage", "()Ljava/lang/String;");
                g.ldc("Too many open files");
                g.invokeVirtual("java/lang/String", "contains", "(Ljava/lang/CharSequence;)Z");

                // too many open files detected
                //    if (b) { Listener.outOfDescriptors() }
                Label rethrow = new Label();
                g.ifFalse(rethrow);

                // 通过反射调用 Listener.outOfDescriptors
                g.invokeAppStatic(Listener.class, "outOfDescriptors",
                        new Class[0], new int[0]);

                // rethrow the FileNotFoundException
                g.visitLabel(rethrow);
                base.visitVarInsn(ALOAD, ex);
                g.athrow();

                // normal execution continues here
                g.visitLabel(tail);
            } else
            // no processing
            {
                super.visitMethodInsn(opcode, owner, name, desc, itf);
            }
        }
    }

    /**
     * Intercepts the this.open(...) call in the constructor.
     */
    private static class ConstructorOpenInterceptor extends MethodAppender {
        /**
         * Binary name of the class being transformed.
         */
        private final String binName;

        public ConstructorOpenInterceptor(String constructorDesc, String binName) {
            super("<init>", constructorDesc);
            this.binName = binName;
        }

        @Override
        public MethodVisitor newAdapter(MethodVisitor base, int access, String name, String desc, String signature, String[] exceptions) {
            final MethodVisitor b = super.newAdapter(base, access, name, desc, signature, exceptions);
            return new OpenInterceptionAdapter(b, access, desc) {
                @Override
                protected boolean toIntercept(String owner, String name) {
                    return owner.equals(binName) && name.startsWith("open");
                }

                @Override
                protected Class<? extends Exception> getExpectedException() {
                    return FileNotFoundException.class;
                }
            };
        }

        @Override
        protected void append(CodeGenerator g) {
            // 通过反射调用 Listener.open
            g.invokeAppStatic(Listener.class, "open",
                    new Class[]{Object.class, File.class},
                    new int[]{0, 1});
        }
    }

    private static class ReturnFromStaticMethodInterceptor extends MethodAppender {
        private final String listenerMethod;
        private final Class<?>[] listenerMethodArgs;
        private final int returnLocalVarIndex;

        public ReturnFromStaticMethodInterceptor(String methodName, String methodDesc, int returnLocalVarIndex,
                                                 String listenerMethod, Class<?>... listenerMethodArgs) {
            super(methodName, methodDesc);
            this.returnLocalVarIndex = returnLocalVarIndex;
            this.listenerMethod = listenerMethod;
            if (listenerMethodArgs.length == 0) {
                this.listenerMethodArgs = new Class[]{Object.class};
            } else {
                this.listenerMethodArgs = listenerMethodArgs;
            }
        }

        @Override
        protected void append(CodeGenerator g) {
            int[] index = new int[listenerMethodArgs.length];
            // first parameter is from the additional local variable, that holds
            // the return value of the intercepted method
            index[0] = returnLocalVarIndex;
            // remaining parameters
            for (int i = 1; i < index.length; i++) {
                index[i] = i - 1;
            }

            Label start = new Label();
            Label end = new Label();
            g.visitLocalVariable("result", "java/lang/Object", null, start, end, returnLocalVarIndex);
            g.visitLabel(start);

            // return value is currently on top of the stack
            // result = {return value}
            g.astore(returnLocalVarIndex);

            g.invokeAppStatic(Listener.class, listenerMethod, listenerMethodArgs, index);

            g.visitLabel(end);

            // restore the stack so that the ARETURN has something to return
            g.aload(returnLocalVarIndex);
        }
    }

    /**
     * 根据当前 Java 版本确定 ASM 版本
     * 
     * @return ASM 版本常量
     */
    private static int determineAsmVersion() {
        int javaMajorVersion = Listener.getJavaMajorVersion();
        if (javaMajorVersion >= 17) {
            return ASM9;
        } else if (javaMajorVersion >= 14) {
            return ASM8;
        } else if (javaMajorVersion >= 11) {
            return ASM7;
        } else if (javaMajorVersion >= 9) {
            return ASM6;
        } else {
            return ASM5;
        }
    }
}
