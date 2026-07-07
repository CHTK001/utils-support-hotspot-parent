package com.chua.hotspot.agent.support.agent;

import com.chua.hotspot.agent.support.transform.TransformFactory;
import com.chua.hotspot.agent.support.transform.VersionTransform;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.plugin.Plugin;
import com.chua.hotspot.core.support.plugin.PluginFactory;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.transform.Listener;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.util.zip.ZipFile;

import static net.bytebuddy.matcher.ElementMatchers.*;

/**
 * @author CH
 */
public class AgentFactory {

    static AgentFactory INSTANCE = new AgentFactory();
    final PluginFactory pluginFactory = PluginFactory.getInstance();
    final LogFactory logFactory = LogFactory.getInstance();

    AgentFactory() {

    }


    public static AgentFactory getInstance() {
        return INSTANCE;
    }


    public void init() {
        AgentBuilder.Default agentBuilder = new AgentBuilder.Default();
        AgentBuilder builder = agentBuilder
                .ignore(ElementMatchers.isSubTypeOf(Span.class))
                .ignore(ElementMatchers.isSubTypeOf(com.chua.hotspot.core.support.transform.Span.class))
                .ignore(ElementMatchers.nameStartsWith("com.chua.hotspot"))
                .ignore(ElementMatchers.nameStartsWith("io.micrometer.core"))
                .ignore(ElementMatchers.nameContainsIgnoreCase("GeneratedMethodAccessor"))
                .with(AgentBuilder.RedefinitionStrategy.RETRANSFORMATION)
                .with(AgentBuilder.TypeStrategy.Default.REBASE)
                .with(new AgentBuilder.InitializationStrategy.SelfInjection.Eager());
        AgentBuilder.Identified.Extendable transform = null;
        for (Plugin plugin : pluginFactory.toList()) {
            String name = plugin.name();
            if (null == name) {
                continue;
            }
            if (pluginFactory.isPass(name)) {
                if (plugin instanceof BytebuddyPlugin) {
                    BytebuddyPlugin bytebuddyPlugin = (BytebuddyPlugin) plugin;
                    ElementMatcher<? super TypeDescription> type = bytebuddyPlugin.type();
                    if (null != type) {
                        VersionTransform versionTransform = TransformFactory.getInstance().init(bytebuddyPlugin);
                        if (null == versionTransform) {
                            return;
                        }
                        if (null == transform) {
                            transform = builder.type(type).transform(versionTransform);
                        }

                        transform = transform.type(type).transform(versionTransform);
                    }
                    transform = bytebuddyPlugin.transforms(transform);
                }
                plugin.initComplete();
            }
        }

        // 合并 ByteBuddy 文件句柄监控
        transform = installFileHandleMonitor(builder, transform);

        if (null == transform) {
            return;
        }

        transform.with(new AgentListener())
                .installOn(InstrumentationFactory.getInstance().get());

        // 标记 Agent 已安装
        Listener.AGENT_INSTALLED = true;

        PluginFactory.getInstance().finish();
    }

    /**
     * 安装文件句柄监控
     * 原 ByteBuddyFileHandlePlugin.installAgent 逻辑
     */
    private AgentBuilder.Identified.Extendable installFileHandleMonitor(
            AgentBuilder builder, AgentBuilder.Identified.Extendable transform) {
        try {
            // 1. 拦截 FileInputStream
            if (transform == null) {
                transform = builder
                        .type(is(FileInputStream.class))
                        .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                                b.visit(Advice.to(FileInputStreamOpenAdvice.class)
                                                .on(isConstructor().and(takesArguments(File.class))))
                                        .visit(Advice.to(CloseAdvice.class)
                                                .on(named("close").and(takesNoArguments()))));
            } else {
                transform = transform
                        .type(is(FileInputStream.class))
                        .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                                b.visit(Advice.to(FileInputStreamOpenAdvice.class)
                                                .on(isConstructor().and(takesArguments(File.class))))
                                        .visit(Advice.to(CloseAdvice.class)
                                                .on(named("close").and(takesNoArguments()))));
            }

            // 2. 拦截 FileOutputStream
            transform = transform
                    .type(is(FileOutputStream.class))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(FileOutputStreamOpenAdvice.class)
                                            .on(isConstructor().and(takesArguments(File.class, boolean.class))))
                                    .visit(Advice.to(CloseAdvice.class)
                                            .on(named("close").and(takesNoArguments()))));

            // 3. 拦截 RandomAccessFile
            transform = transform
                    .type(is(RandomAccessFile.class))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(RandomAccessFileOpenAdvice.class)
                                            .on(isConstructor().and(takesArguments(File.class, String.class))))
                                    .visit(Advice.to(CloseAdvice.class)
                                            .on(named("close").and(takesNoArguments()))));

            // 4. 拦截 ZipFile
            transform = transform
                    .type(is(ZipFile.class))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(ZipFileOpenAdvice.class)
                                            .on(isConstructor().and(takesArguments(File.class, int.class))))
                                    .visit(Advice.to(CloseAdvice.class)
                                            .on(named("close").and(takesNoArguments()))));

            // 5. 拦截 FileChannel.open (静态方法)
            transform = transform
                    .type(is(FileChannel.class))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(FileChannelOpenAdvice.class)
                                    .on(named("open").and(isStatic()))));

            // 6. 拦截 AbstractInterruptibleChannel.close (NIO 通道关闭)
            transform = transform
                    .type(named("java.nio.channels.spi.AbstractInterruptibleChannel"))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(CloseAdvice.class)
                                    .on(named("close").and(takesNoArguments()))));

            // 7. 拦截 AbstractSelectableChannel (Pipe)
            transform = transform
                    .type(named("java.nio.channels.spi.AbstractSelectableChannel"))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(PipeOpenAdvice.class)
                                    .on(isConstructor())));

            // 8. 拦截 AbstractSelector
            transform = transform
                    .type(named("java.nio.channels.spi.AbstractSelector"))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(SelectorOpenAdvice.class)
                                            .on(isConstructor()))
                                    .visit(Advice.to(CloseAdvice.class)
                                            .on(named("close").and(takesNoArguments()))));

            // 9. 拦截 PlainSocketImpl / AbstractPlainSocketImpl
            transform = transform
                    .type(nameEndsWith("PlainSocketImpl"))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(SocketOpenAdvice.class)
                                            .on(named("create")))
                                    .visit(Advice.to(CloseAdvice.class)
                                            .on(named("socketClose").and(takesNoArguments()))));

            // 10. 拦截 SocketChannelImpl
            transform = transform
                    .type(named("sun.nio.ch.SocketChannelImpl"))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(SocketChannelOpenAdvice.class)
                                            .on(isConstructor()))
                                    .visit(Advice.to(CloseAdvice.class)
                                            .on(named("kill").and(takesNoArguments()))));

            logFactory.info("文件句柄监控已安装");

        } catch (Exception e) {
            logFactory.error("安装文件句柄监控失败: {}", e.getMessage(), e);
        }
        return transform;
    }

    // ==================== Advice 类定义 ====================

    /**
     * FileInputStream 构造器 Advice
     */
    public static class FileInputStreamOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * FileOutputStream 构造器 Advice
     */
    public static class FileOutputStreamOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * RandomAccessFile 构造器 Advice
     */
    public static class RandomAccessFileOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * ZipFile 构造器 Advice
     */
    public static class ZipFileOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * FileChannel.open 静态方法 Advice
     */
    public static class FileChannelOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.Return FileChannel channel, @Advice.Argument(0) Path path) {
            if (channel != null) {
                Listener.open_filechannel(channel, path);
            }
        }
    }

    /**
     * 通用 close 方法 Advice
     */
    public static class CloseAdvice {
        @Advice.OnMethodEnter(suppress = Throwable.class)
        public static void onEnter(@Advice.This Object self) {
            Listener.close(self);
        }
    }

    /**
     * Pipe 通道 Advice
     */
    public static class PipeOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openPipe(self);
        }
    }

    /**
     * Selector Advice
     */
    public static class SelectorOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openSelector(self);
        }
    }

    /**
     * Socket 创建 Advice
     */
    public static class SocketOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openSocket(self);
        }
    }

    /**
     * SocketChannel 构造器 Advice
     */
    public static class SocketChannelOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openSocket(self);
        }
    }


}
