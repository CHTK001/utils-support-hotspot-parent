package com.chua.hotspot.core.support.agent;

import com.chua.hotspot.core.support.agent.transform.TransformFactory;
import com.chua.hotspot.core.support.agent.transform.VersionTransform;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.plugin.Plugin;
import com.chua.hotspot.core.support.plugin.PluginFactory;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.spy.SpyHandlerImpl;
import com.chua.hotspot.core.support.transform.Listener;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;
import java.security.ProtectionDomain;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.util.zip.ZipFile;

import static net.bytebuddy.matcher.ElementMatchers.*;

/**
 * Agent 工厂 - 构建和安装 ByteBuddy AgentBuilder
 * <p>
 * 支持 Advice + Spy 模式和旧版 MethodDelegation 模式：
 * <ul>
 *   <li>Advice + Spy 模式（默认）：使用 Spy 桥接类，目标字节码只引用 Bootstrap CL 中的 Spy</li>
 *   <li>MethodDelegation 模式（兼容）：插件设置 useLegacyMethodDelegation=true 时使用</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @version 4.0.0.37
 */
public class AgentFactory {

    static AgentFactory INSTANCE = new AgentFactory();
    final PluginFactory pluginFactory = PluginFactory.getInstance();
    final LogFactory logFactory = LogFactory.getInstance();

    /** SpyHandler 实例，用于注册 className → pluginName 映射 */
    private SpyHandlerImpl spyHandler;

    /** 是否已初始化（幂等保护） */
    private volatile boolean initialized = false;

    AgentFactory() {
    }

    public static AgentFactory getInstance() {
        return INSTANCE;
    }

    /**
     * 设置 SpyHandler 实例（由 AgentBootstrap 在初始化时调用）
     *
     * @param spyHandler SpyHandler 实例
     */
    public void setSpyHandler(SpyHandlerImpl spyHandler) {
        this.spyHandler = spyHandler;
    }

    public void init() {
        init(false);
    }

    /**
     * 初始化 Agent 字节码增强
     *
     * @param isAttachMode 是否为 attach 模式（运行时加载）
     */
    public void init(boolean isAttachMode) {
        if (initialized) {
            logFactory.warn("AgentFactory 已初始化，跳过重复初始化");
            return;
        }

        // 1. 构建 AgentBuilder
        AgentBuilder.Default agentBuilder = new AgentBuilder.Default();
        AgentBuilder builder = agentBuilder
                .ignore(ElementMatchers.isSubTypeOf(Span.class))
                .ignore(ElementMatchers.isSubTypeOf(com.chua.hotspot.core.support.transform.Span.class))
                .ignore(ElementMatchers.nameStartsWith("com.chua.hotspot"))
                .ignore(ElementMatchers.nameStartsWith("io.micrometer.core"))
                .ignore(ElementMatchers.nameContainsIgnoreCase("GeneratedMethodAccessor"))
                .with(AgentBuilder.RedefinitionStrategy.RETRANSFORMATION)
                .with(AgentBuilder.TypeStrategy.Default.REBASE)
                .with(new AgentBuilder.InitializationStrategy.SelfInjection.Eager())
                // attach 模式下：对已加载类也进行 retransform
                .with(isAttachMode
                        ? AgentBuilder.RedefinitionStrategy.RETRANSFORMATION
                        : AgentBuilder.RedefinitionStrategy.DISABLED);

        // 2. 注册插件拦截
        AgentBuilder.Identified.Extendable transform = null;
        for (Plugin plugin : pluginFactory.toList()) {
            String name = plugin.name();
            if (null == name) {
                continue;
            }
            if (pluginFactory.isPass(name)) {
                if (plugin instanceof BytebuddyPlugin) {
                    BytebuddyPlugin bytebuddyPlugin = (BytebuddyPlugin) plugin;

                    if (bytebuddyPlugin.useLegacyMethodDelegation()) {
                        // 旧版 MethodDelegation 模式（兼容）
                        transform = registerLegacyPlugin(builder, transform, bytebuddyPlugin);
                    } else {
                        // 新版 Advice + Spy 模式
                        transform = registerSpyPlugin(builder, transform, bytebuddyPlugin);
                    }
                }
                plugin.initComplete();
            }
        }

        // 3. 合并 ByteBuddy 文件句柄监控
        transform = installFileHandleMonitor(builder, transform);

        if (null == transform) {
            return;
        }

        transform.with(new AgentListener())
                .installOn(InstrumentationFactory.getInstance().get());

        // 标记 Agent 已安装
        Listener.AGENT_INSTALLED = true;

        PluginFactory.getInstance().finish();
        initialized = true;
    }

    /**
     * 注册 Advice + Spy 模式的插件
     */
    private AgentBuilder.Identified.Extendable registerSpyPlugin(
            AgentBuilder builder,
            AgentBuilder.Identified.Extendable transform,
            BytebuddyPlugin plugin) {

        ElementMatcher<? super TypeDescription> typeMatcher = plugin.type();
        ElementMatcher<? super net.bytebuddy.description.method.MethodDescription> methodMatcher = plugin.methodMatcher();

        if (typeMatcher == null || methodMatcher == null) {
            logFactory.warn("插件 {} 的 type() 或 methodMatcher() 返回 null，跳过注册", plugin.name());
            return transform;
        }

        final String pluginName = plugin.name();

        logFactory.debug("注册 Spy 插件: {}, type={}, methodMatcher={}", pluginName, typeMatcher, methodMatcher);

        // 创建 Spy Advice Transformer
        AgentBuilder.Transformer spyTransformer = new AgentBuilder.Transformer() {
            @Override
            public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder,
                                                     TypeDescription typeDescription,
                                                     ClassLoader classLoader,
                                                     net.bytebuddy.utility.JavaModule module,
                                                     java.security.ProtectionDomain protectionDomain) {
                // 在类被转换时，注册 className → pluginName 映射到 SpyHandlerImpl
                // 这样 Spy 回调时可以快速路由到正确的插件
                String className = typeDescription.getName();
                spyHandler.registerClassMapping(className, pluginName);
                logFactory.debug("Spy 类名映射: {} → {}", className, pluginName);

                return builder
                        .visit(Advice.to(SpyAdvice.Enter.class).on(methodMatcher))
                        .visit(Advice.to(SpyAdvice.Exit.class).on(methodMatcher));
            }
        };

        AgentBuilder.Identified.Extendable newTransform = builder
                .type(typeMatcher)
                .transform(spyTransformer);

        return transform == null ? newTransform : transform.type(typeMatcher).transform(spyTransformer);
    }

    /**
     * 注册旧版 MethodDelegation 模式的插件（兼容）
     */
    private AgentBuilder.Identified.Extendable registerLegacyPlugin(
            AgentBuilder builder,
            AgentBuilder.Identified.Extendable transform,
            BytebuddyPlugin plugin) {

        ElementMatcher<? super TypeDescription> type = plugin.type();
        if (null != type) {
            VersionTransform versionTransform = TransformFactory.getInstance().init(plugin);
            if (null == versionTransform) {
                return transform;
            }
            if (null == transform) {
                transform = builder.type(type).transform(versionTransform);
            }
            transform = transform.type(type).transform(versionTransform);
        }
        transform = plugin.transforms(transform);
        return transform;
    }



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

            // 5. 拦截 FileChannel.open
            transform = transform
                    .type(is(FileChannel.class))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(FileChannelOpenAdvice.class)
                                    .on(named("open").and(isStatic()))));

            // 6. 拦截 AbstractInterruptibleChannel.close
            transform = transform
                    .type(named("java.nio.channels.spi.AbstractInterruptibleChannel"))
                    .transform((b, typeDescription, classLoader, module, protectionDomain) ->
                            b.visit(Advice.to(CloseAdvice.class)
                                    .on(named("close").and(takesNoArguments()))));

            // 7. 拦截 AbstractSelectableChannel
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
     * FileInputStream 打开通知
     */
    public static class FileInputStreamOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * FileOutputStream 打开通知
     */
    public static class FileOutputStreamOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * RandomAccessFile 打开通知
     */
    public static class RandomAccessFileOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * ZipFile 打开通知
     */
    public static class ZipFileOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            Listener.open(self, file);
        }
    }

    /**
     * FileChannel 打开通知
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
     * 关闭通知
     */
    public static class CloseAdvice {
        @Advice.OnMethodEnter(suppress = Throwable.class)
        public static void onEnter(@Advice.This Object self) {
            Listener.close(self);
        }
    }

    /**
     * Pipe 打开通知
     */
    public static class PipeOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openPipe(self);
        }
    }

    /**
     * Selector 打开通知
     */
    public static class SelectorOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openSelector(self);
        }
    }

    /**
     * Socket 打开通知
     */
    public static class SocketOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openSocket(self);
        }
    }

    /**
     * SocketChannel 打开通知
     */
    public static class SocketChannelOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self) {
            Listener.openSocket(self);
        }
    }
}