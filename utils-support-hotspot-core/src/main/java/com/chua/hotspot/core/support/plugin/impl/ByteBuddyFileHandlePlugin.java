package com.chua.hotspot.core.support.plugin.impl;

import com.chua.hotspot.core.support.handler.FileHandlerFactory;
import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.Plugin;
import com.chua.hotspot.core.support.transform.Listener;
import com.chua.hotspot.core.support.transform.Span;
import com.chua.hotspot.core.support.transform.TransformEventHandler;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.description.type.TypeDescription;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.RandomAccessFile;
import java.lang.instrument.Instrumentation;
import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.zip.ZipFile;

import static net.bytebuddy.matcher.ElementMatchers.*;

/**
 * 基于 ByteBuddy Advice 的文件句柄监控插件
 * 使用 ByteBuddy 的 Advice API 替代原有的 ASM 字节码操作方式
 * 
 * <p>监控范围：</p>
 * <ul>
 *   <li>FileInputStream - 文件输入流</li>
 *   <li>FileOutputStream - 文件输出流</li>
 *   <li>RandomAccessFile - 随机访问文件</li>
 *   <li>FileChannel - 文件通道</li>
 *   <li>ZipFile - ZIP 文件</li>
 *   <li>Socket/ServerSocket - 网络套接字</li>
 *   <li>Pipe - 管道</li>
 *   <li>Selector - 选择器</li>
 * </ul>
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.36
 */
public class ByteBuddyFileHandlePlugin implements Plugin, TransformEventHandler {

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 全局句柄注册表（用于 Advice 回调）
     */
    private static final Map<Object, HandleInfo> HANDLE_MAP = new ConcurrentHashMap<>();
    private static final List<HandleInfo> HANDLE_HISTORY = new CopyOnWriteArrayList<>();
    
    // 统计计数器
    private static final AtomicInteger FILE_OPEN_COUNT = new AtomicInteger(0);
    private static final AtomicInteger FILE_CLOSE_COUNT = new AtomicInteger(0);
    private static final AtomicInteger SOCKET_OPEN_COUNT = new AtomicInteger(0);
    private static final AtomicInteger SOCKET_CLOSE_COUNT = new AtomicInteger(0);
    private static final AtomicInteger PIPE_OPEN_COUNT = new AtomicInteger(0);
    private static final AtomicInteger PIPE_CLOSE_COUNT = new AtomicInteger(0);
    
    // 配置参数
    private static final int MAX_HISTORY_SIZE = 1000;
    private static final int MAX_STACK_FRAMES = 50;
    private static final boolean DETAILED_LOGGING = false;

    @Override
    public String name() {
        return "bytebuddy-filehandle";
    }

    @Override
    public void init() {
        LOGGER.info("ByteBuddy 文件句柄监控插件初始化");
    }

    @Override
    public void initComplete() {
        Instrumentation inst = InstrumentationFactory.getInstance().get();
        if (inst == null) {
            LOGGER.error("无法获取 Instrumentation，ByteBuddy 文件句柄监控插件无法启动");
            return;
        }
        
        // 注册事件处理器
        Listener.registerEventHandler(this);
        
        // 安装 ByteBuddy Agent
        installAgent(inst);
        
        // 标记 Agent 已安装
        Listener.AGENT_INSTALLED = true;
        
        LOGGER.info("ByteBuddy 文件句柄监控已启动");
    }

    @Override
    public void finish() {
        Listener.removeEventHandler(this);
        LOGGER.info("ByteBuddy 文件句柄监控已停止");
        LOGGER.info("统计信息: 文件打开={} 关闭={}, Socket打开={} 关闭={}, 管道打开={} 关闭={}",
            FILE_OPEN_COUNT.get(), FILE_CLOSE_COUNT.get(),
            SOCKET_OPEN_COUNT.get(), SOCKET_CLOSE_COUNT.get(),
            PIPE_OPEN_COUNT.get(), PIPE_CLOSE_COUNT.get());
    }
    
    /**
     * 安装 ByteBuddy Agent
     */
    private void installAgent(Instrumentation inst) {
        try {
            // 创建 AgentBuilder
            AgentBuilder agentBuilder = new AgentBuilder.Default()
                // 忽略 ByteBuddy 和 Agent 自身的类
                .ignore(nameStartsWith("net.bytebuddy.")
                    .or(nameStartsWith("com.chua.hotspot.core.support.plugin.impl.ByteBuddyFileHandlePlugin"))
                    .or(isSynthetic()))
                // 启用重转换
                .with(AgentBuilder.RedefinitionStrategy.RETRANSFORMATION)
                // 启用重转换时的类发现
                .with(AgentBuilder.RedefinitionStrategy.DiscoveryStrategy.Reiterating.INSTANCE)
                // 错误监听
                .with(new AgentBuilder.Listener.Adapter() {
                    @Override
                    public void onError(String typeName, ClassLoader classLoader, 
                                       net.bytebuddy.utility.JavaModule module, boolean loaded, Throwable throwable) {
                        if (DETAILED_LOGGING) {
                            LOGGER.debug("ByteBuddy 转换错误: {} - {}", typeName, throwable.getMessage());
                        }
                    }
                    
                    @Override
                    public void onTransformation(TypeDescription typeDescription, ClassLoader classLoader,
                                                net.bytebuddy.utility.JavaModule module, boolean loaded,
                                                net.bytebuddy.dynamic.DynamicType dynamicType) {
                        if (DETAILED_LOGGING) {
                            LOGGER.debug("ByteBuddy 转换成功: {}", typeDescription.getName());
                        }
                    }
                });
            
            // 1. 拦截 FileInputStream
            agentBuilder = agentBuilder
                .type(is(FileInputStream.class))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) -> 
                    builder
                        .visit(Advice.to(FileInputStreamOpenAdvice.class)
                            .on(isConstructor().and(takesArguments(File.class))))
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("close").and(takesNoArguments())))
                );
            
            // 2. 拦截 FileOutputStream  
            agentBuilder = agentBuilder
                .type(is(FileOutputStream.class))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(FileOutputStreamOpenAdvice.class)
                            .on(isConstructor().and(takesArguments(File.class, boolean.class))))
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("close").and(takesNoArguments())))
                );
            
            // 3. 拦截 RandomAccessFile
            agentBuilder = agentBuilder
                .type(is(RandomAccessFile.class))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(RandomAccessFileOpenAdvice.class)
                            .on(isConstructor().and(takesArguments(File.class, String.class))))
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("close").and(takesNoArguments())))
                );
            
            // 4. 拦截 ZipFile
            agentBuilder = agentBuilder
                .type(is(ZipFile.class))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(ZipFileOpenAdvice.class)
                            .on(isConstructor().and(takesArguments(File.class, int.class))))
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("close").and(takesNoArguments())))
                );
            
            // 5. 拦截 FileChannel.open (静态方法)
            agentBuilder = agentBuilder
                .type(is(FileChannel.class))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(FileChannelOpenAdvice.class)
                            .on(named("open").and(isStatic())))
                );
            
            // 6. 拦截 AbstractInterruptibleChannel.close (NIO 通道关闭)
            agentBuilder = agentBuilder
                .type(named("java.nio.channels.spi.AbstractInterruptibleChannel"))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("close").and(takesNoArguments())))
                );
            
            // 7. 拦截 AbstractSelectableChannel (Pipe)
            agentBuilder = agentBuilder
                .type(named("java.nio.channels.spi.AbstractSelectableChannel"))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(PipeOpenAdvice.class)
                            .on(isConstructor()))
                );
            
            // 8. 拦截 AbstractSelector
            agentBuilder = agentBuilder
                .type(named("java.nio.channels.spi.AbstractSelector"))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(SelectorOpenAdvice.class)
                            .on(isConstructor()))
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("close").and(takesNoArguments())))
                );
            
            // 9. 拦截 PlainSocketImpl / AbstractPlainSocketImpl
            agentBuilder = agentBuilder
                .type(nameEndsWith("PlainSocketImpl"))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(SocketOpenAdvice.class)
                            .on(named("create")))
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("socketClose").and(takesNoArguments())))
                );
            
            // 10. 拦截 SocketChannelImpl
            agentBuilder = agentBuilder
                .type(named("sun.nio.ch.SocketChannelImpl"))
                .transform((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder
                        .visit(Advice.to(SocketChannelOpenAdvice.class)
                            .on(isConstructor()))
                        .visit(Advice.to(CloseAdvice.class)
                            .on(named("kill").and(takesNoArguments())))
                );
            
            // 安装到 Instrumentation
            agentBuilder.installOn(inst);
            
            LOGGER.info("ByteBuddy Agent 安装完成");
            
        } catch (Exception e) {
            LOGGER.error("安装 ByteBuddy Agent 失败: {}", e.getMessage(), e);
        }
    }
    
    // ==================== TransformEventHandler 实现 ====================

    @Override
    public void onFileOpen(Object source, File file, Span span) {
        FILE_OPEN_COUNT.incrementAndGet();
        HandleInfo info = new HandleInfo(HandleType.FILE, source, file.getAbsolutePath(), span);
        HANDLE_MAP.put(source, info);
        addToHistory(info);
        FileHandlerFactory.open(this, new Object[]{source, file});
        if (DETAILED_LOGGING) {
            LOGGER.debug("文件打开: {} 线程: {}", file.getAbsolutePath(), span.getThreadName());
        }
    }

    @Override
    public void onFileChannelOpen(Object source, Path path, Span span) {
        FILE_OPEN_COUNT.incrementAndGet();
        HandleInfo info = new HandleInfo(HandleType.FILE_CHANNEL, source, path.toString(), span);
        HANDLE_MAP.put(source, info);
        addToHistory(info);
        if (DETAILED_LOGGING) {
            LOGGER.debug("文件通道打开: {} 线程: {}", path, span.getThreadName());
        }
    }

    @Override
    public void onSocketOpen(Object source, String address, Span span) {
        SOCKET_OPEN_COUNT.incrementAndGet();
        HandleInfo info = new HandleInfo(HandleType.SOCKET, source, address, span);
        HANDLE_MAP.put(source, info);
        addToHistory(info);
        if (DETAILED_LOGGING) {
            LOGGER.debug("Socket 打开: {} 线程: {}", address, span.getThreadName());
        }
    }

    @Override
    public void onPipeOpen(Object source, String type, Span span) {
        PIPE_OPEN_COUNT.incrementAndGet();
        HandleInfo info = new HandleInfo(HandleType.PIPE, source, "Pipe-" + type, span);
        HANDLE_MAP.put(source, info);
        addToHistory(info);
        if (DETAILED_LOGGING) {
            LOGGER.debug("管道打开: {} 线程: {}", type, span.getThreadName());
        }
    }

    @Override
    public void onSelectorOpen(Object source, Span span) {
        PIPE_OPEN_COUNT.incrementAndGet();
        HandleInfo info = new HandleInfo(HandleType.SELECTOR, source, "Selector", span);
        HANDLE_MAP.put(source, info);
        addToHistory(info);
        if (DETAILED_LOGGING) {
            LOGGER.debug("选择器打开: 线程: {}", span.getThreadName());
        }
    }

    @Override
    public void onClose(Object source, Span span) {
        HandleInfo info = HANDLE_MAP.remove(source);
        if (info != null) {
            info.setClosed(true);
            info.setCloseTime(System.currentTimeMillis());
            switch (info.getType()) {
                case FILE:
                case FILE_CHANNEL:
                    FILE_CLOSE_COUNT.incrementAndGet();
                    break;
                case SOCKET:
                    SOCKET_CLOSE_COUNT.incrementAndGet();
                    break;
                case PIPE:
                case SELECTOR:
                    PIPE_CLOSE_COUNT.incrementAndGet();
                    break;
            }
            if (DETAILED_LOGGING) {
                LOGGER.debug("{} 关闭: {} 存活时间: {}ms",
                    info.getType(), info.getResource(),
                    info.getCloseTime() - info.getOpenTime());
            }
        }
    }

    @Override
    public void onOutOfDescriptors(int currentCount) {
        LOGGER.error("文件描述符不足! 当前打开句柄数: {}", currentCount);
    }

    @Override
    public void onThresholdExceeded(int count, int threshold) {
        LOGGER.warn("句柄数量超过阈值! 当前: {} 阈值: {}", count, threshold);
    }

    // ==================== 查询接口 ====================

    public static List<HandleInfo> getCurrentOpenHandles() {
        return new ArrayList<>(HANDLE_MAP.values());
    }

    public static List<HandleInfo> getHandleHistory() {
        return new ArrayList<>(HANDLE_HISTORY);
    }

    public static int getOpenHandleCount() {
        return HANDLE_MAP.size();
    }

    // ==================== 私有方法 ====================

    private void addToHistory(HandleInfo info) {
        if (HANDLE_HISTORY.size() >= MAX_HISTORY_SIZE) {
            HANDLE_HISTORY.remove(0);
        }
        HANDLE_HISTORY.add(info);
    }
    
    /**
     * 创建 Span（供 Advice 使用）
     */
    static Span createSpan(String message) {
        Span span = new Span();
        span.setMessage(message + " by thread:" + Thread.currentThread().getName() 
            + " on " + new Date());
        
        // 捕获调用栈
        StackTraceElement[] stackTrace = new Exception().getStackTrace();
        List<StackTraceElement> filtered = new ArrayList<>();
        for (StackTraceElement element : stackTrace) {
            String className = element.getClassName();
            // 过滤掉 ByteBuddy、Agent 和 JDK 内部类
            if (className.startsWith("net.bytebuddy.") ||
                className.startsWith("com.chua.hotspot.core.support.plugin.impl.ByteBuddyFileHandlePlugin") ||
                className.equals("com.chua.hotspot.core.support.transform.Listener")) {
                continue;
            }
            filtered.add(element);
            if (filtered.size() >= MAX_STACK_FRAMES) {
                break;
            }
        }
        span.setStack(filtered.toArray(new StackTraceElement[0]));
        return span;
    }

    // ==================== Advice 类定义 ====================
    // 注意: ByteBuddy Advice 代码会被内联到目标方法中
    // 因此直接调用 Listener 方法，Listener 内部已有 ThreadLocal 重入保护

    /**
     * FileInputStream 构造器 Advice
     */
    public static class FileInputStreamOpenAdvice {
        @Advice.OnMethodExit(suppress = Throwable.class)
        public static void onExit(@Advice.This Object self, @Advice.Argument(0) File file) {
            // Listener.open 内部有 ThreadLocal 重入保护
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

    // ==================== 内部类 ====================

    /**
     * 句柄类型
     */
    public enum HandleType {
        FILE("文件"),
        FILE_CHANNEL("文件通道"),
        SOCKET("网络连接"),
        PIPE("管道"),
        SELECTOR("选择器");

        private final String description;

        HandleType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 句柄信息
     */
    public static class HandleInfo {
        private final HandleType type;
        private final Object source;
        private final String resource;
        private final long openTime;
        private final String threadName;
        private final List<String> stackTrace;
        private boolean closed;
        private long closeTime;

        public HandleInfo(HandleType type, Object source, String resource, Span span) {
            this.type = type;
            this.source = source;
            this.resource = resource;
            this.openTime = System.currentTimeMillis();
            this.threadName = span.getThreadName();
            this.stackTrace = span.getStack();
            this.closed = false;
            this.closeTime = 0;
        }

        public HandleType getType() { return type; }
        public Object getSource() { return source; }
        public String getResource() { return resource; }
        public long getOpenTime() { return openTime; }
        public String getThreadName() { return threadName; }
        public List<String> getStackTrace() { return stackTrace; }
        public boolean isClosed() { return closed; }
        public void setClosed(boolean closed) { this.closed = closed; }
        public long getCloseTime() { return closeTime; }
        public void setCloseTime(long closeTime) { this.closeTime = closeTime; }

        public long getLifetime() {
            if (closed && closeTime > 0) {
                return closeTime - openTime;
            }
            return System.currentTimeMillis() - openTime;
        }

        @Override
        public String toString() {
            return "HandleInfo{type=" + type + ", resource='" + resource + "', threadName='" 
                + threadName + "', closed=" + closed + ", lifetime=" + getLifetime() + "ms}";
        }
    }
}
