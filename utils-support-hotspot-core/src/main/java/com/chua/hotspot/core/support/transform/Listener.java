package com.chua.hotspot.core.support.transform;


import java.io.FileDescriptor;
import java.io.*;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.reflect.Field;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketImpl;
import java.nio.channels.FileChannel;
import java.nio.channels.Pipe;
import java.nio.channels.SeekableByteChannel;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.nio.file.DirectoryStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.zip.ZipFile;

/**
 * Intercepted JDK calls land here.
 * <p>
 * 增强功能（参考 file-leak-detector）：
 * <ul>
 *   <li>句柄分类统计 - 按类型（文件/Socket/管道/选择器/文件通道）统计开闭数量</li>
 *   <li>泄漏检测 - 检测长时间未关闭的句柄，支持可配置的泄漏阈值</li>
 *   <li>阈值告警 - 句柄数量超过阈值时触发告警事件</li>
 *   <li>历史峰值 - 记录各类型句柄的历史峰值数量</li>
 * </ul>
 *
 * @author Kohsuke Kawaguchi
 */
public class Listener {

    /**
     * 句柄类型枚举
     */
    public enum HandleType {
        /** 文件句柄 (FileInputStream/FileOutputStream/RandomAccessFile/ZipFile) */
        FILE("文件句柄"),
        /** Socket 连接 (SocketImpl/SocketChannel) */
        SOCKET("Socket连接"),
        /** 管道 (Pipe.SourceChannel/Pipe.SinkChannel) */
        PIPE("管道"),
        /** 选择器 (Selector) */
        SELECTOR("选择器"),
        /** 文件通道 (FileChannel) */
        FILE_CHANNEL("文件通道"),
        /** 未知类型 */
        UNKNOWN("未知");

        private final String displayName;

        HandleType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    /**
     * 句柄统计信息
     */
    public static class HandleStatistics {
        /** 各类型当前打开数量 */
        public final Map<HandleType, Integer> currentCounts = new EnumMap<>(HandleType.class);
        /** 各类型历史峰值 */
        public final Map<HandleType, Integer> peakCounts = new EnumMap<>(HandleType.class);
        /** 各类型总打开次数 */
        public final Map<HandleType, Long> totalOpenCounts = new EnumMap<>(HandleType.class);
        /** 各类型总关闭次数 */
        public final Map<HandleType, Long> totalCloseCounts = new EnumMap<>(HandleType.class);
        /** 当前总句柄数 */
        public int totalCurrent = 0;
        /** 历史总句柄峰值 */
        public int totalPeak = 0;
        /** 泄漏告警阈值（毫秒），句柄打开超过此时间视为潜在泄漏 */
        public long leakThresholdMs = 300_000; // 默认5分钟
        /** 句柄数量告警阈值 */
        public int handleCountThreshold = 1000;

        public HandleStatistics() {
            for (HandleType type : HandleType.values()) {
                currentCounts.put(type, 0);
                peakCounts.put(type, 0);
                totalOpenCounts.put(type, 0L);
                totalCloseCounts.put(type, 0L);
            }
        }
    }

    /**
     * 事件处理器列表
     */
    private static final List<TransformEventHandler> EVENT_HANDLERS = new ArrayList<>();

    /**
     * Allows to provide stacktrace-lines which cause the element to be excluded
     */
    public static final List<String> EXCLUDES = new ArrayList<String>();
    public static final String[] IGNORES = new String[]{
            "sun.",
            "com.sun.",
            "org.java",
            "org.apache.",
            "ch.qos.logback.",
            "org.slf4j.",
            "org.springframework.",
            "java.",
    };
    /**
     * Trace the open/close op
     */
    public static PrintWriter TRACE = null;
    /**
     * Trace the "too many open files" error here
     */
    public static PrintWriter ERROR = new PrintWriter(System.err);
    /**
     * If the table size grows beyond this, report the table
     */
    public static int THRESHOLD = 999999;
    /**
     * Is the agent actually transforming the class files?
     */
    public static boolean AGENT_INSTALLED = false;
    /**
     * Files that are currently open, keyed by the owner object (like {@link FileInputStream}.
     */
    private static Map<Object, Span> TABLE = new WeakHashMap<>();
    /**
     * Tracing may cause additional files to be opened.
     * In such a case, avoid infinite recursion.
     */
    private static boolean tracing = false;

    // ==================== 句柄分类统计 ====================

    /** 句柄统计信息 */
    private static final HandleStatistics STATISTICS = new HandleStatistics();

    /** 各句柄对象到类型的映射 */
    private static final Map<Object, HandleType> HANDLE_TYPE_MAP = Collections.synchronizedMap(new WeakHashMap<>());

    /** 各句柄对象的打开时间戳（毫秒） */
    private static final Map<Object, Long> OPEN_TIMESTAMP_MAP = Collections.synchronizedMap(new WeakHashMap<>());

    /** 各类型句柄的打开计数器 */
    private static final Map<HandleType, AtomicLong> OPEN_COUNTERS = new EnumMap<>(HandleType.class);
    /** 各类型句柄的关闭计数器 */
    private static final Map<HandleType, AtomicLong> CLOSE_COUNTERS = new EnumMap<>(HandleType.class);

    static {
        for (HandleType type : HandleType.values()) {
            OPEN_COUNTERS.put(type, new AtomicLong(0));
            CLOSE_COUNTERS.put(type, new AtomicLong(0));
        }
    }
    
    /**
     * ThreadLocal 重入保护，防止在执行 Listener 方法时递归调用
     * 当增强的 JDK 类（如 FileInputStream）在 Listener 内部被使用时，防止无限递归
     */
    private static final ThreadLocal<Boolean> IN_PROGRESS = ThreadLocal.withInitial(() -> Boolean.FALSE);
    /**
     * SocketImpl 内部字段 MethodHandle 访问器（Java 8 使用，替代反射 Field.get）
     * MethodHandle 相比反射 Field.get 具有以下优势：
     * 1. 调用无需每次进行访问权限检查
     * 2. JIT 可对 MethodHandle 调用进行内联优化
     * 3. 调用开销接近直接方法调用
     */
    private static MethodHandle SOCKETIMPL_SOCKET_GETTER, SOCKETIMPL_SERVER_SOCKET_GETTER;

    /**
     * 当前 Java 主版本号
     */
    private static final int JAVA_MAJOR_VERSION;

    static {
        // 在 static 初始化期间阻止拦截，防止 StackOverflowError
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            String version = System.getProperty("java.version");
            JAVA_MAJOR_VERSION = getMajorVersion(version);
            try {
                if (JAVA_MAJOR_VERSION < 9) {
                    // 使用 MethodHandle 替代反射 Field 访问 SocketImpl 内部字段
                    // MethodHandle 优势：1) 无需每次访问权限检查 2) JIT 可内联优化 3) 调用开销接近直接调用
                    Field socketField = SocketImpl.class.getDeclaredField("socket");
                    Field serverSocketField = SocketImpl.class.getDeclaredField("serverSocket");
                    socketField.setAccessible(true);
                    serverSocketField.setAccessible(true);
                    // 通过 MethodHandles.Lookup 将 Field 转为 MethodHandle getter
                    // unreflectGetter 生成的方法句柄等价于 Field.get() 但性能更优
                    SOCKETIMPL_SOCKET_GETTER = MethodHandles.lookup().unreflectGetter(socketField);
                    SOCKETIMPL_SERVER_SOCKET_GETTER = MethodHandles.lookup().unreflectGetter(serverSocketField);
                }
            } catch (IllegalAccessException | NoSuchFieldException e) {
                System.err.println("无法获取 SocketImpl 字段 MethodHandle: " + e.getMessage());
            }
        } finally {
            // 初始化完成后恢复正常状态
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    /**
     * 注册事件处理器
     *
     * @param handler 事件处理器
     */
    public static synchronized void registerEventHandler(TransformEventHandler handler) {
        if (handler != null && !EVENT_HANDLERS.contains(handler)) {
            EVENT_HANDLERS.add(handler);
        }
    }

    /**
     * 移除事件处理器
     *
     * @param handler 事件处理器
     */
    public static synchronized void removeEventHandler(TransformEventHandler handler) {
        EVENT_HANDLERS.remove(handler);
    }

    /**
     * 获取当前 Java 主版本号
     *
     * @return 主版本号
     */
    public static int getJavaMajorVersion() {
        return JAVA_MAJOR_VERSION;
    }

    /**
     * Returns true if the leak detector agent is running.
     */
    public static boolean isAgentInstalled() {
        return AGENT_INSTALLED;
    }

    public static synchronized void makeStrong() {
        TABLE = new LinkedHashMap<Object, Span>(TABLE);
    }

    /**
     * Called when a new file is opened.
     *
     * @param o {@link FileInputStream}, {@link FileOutputStream}, {@link RandomAccessFile}, or {@link ZipFile}.
     * @param f File being opened.
     */
    public static synchronized void open(Object o, File f) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            Span span = new Span();
            span.setMessage("Opened " + f + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
            put1(o, span);
            // 记录句柄类型和打开时间
            recordHandleOpen(o, HandleType.FILE);
            // 触发文件打开事件
            fireFileOpenEvent(o, f, span);
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    /**
     * Called when a new path is opened.
     * <p>
     * 整合自 file-leak-detector: 支持 Path 级别的文件打开跟踪
     * </p>
     *
     * @param o {@link FileInputStream}, {@link FileOutputStream}, {@link RandomAccessFile}, or {@link ZipFile}.
     * @param p Path being opened.
     */
    public static synchronized void open(Object o, Path p) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            Span span = new Span();
            span.setMessage("Opened " + p + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
            put1(o, span);
            // 记录句柄类型和打开时间
            recordHandleOpen(o, HandleType.FILE);
            // 触发文件打开事件（Path 版本）
            firePathOpenEvent(o, p, span);
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    /**
     * Called when FileChannelImpl.open with string path is invoked.
     * <p>
     * 整合自 file-leak-detector: 支持 FileChannelImpl 的字符串路径打开跟踪
     * </p>
     *
     * @param _this          the FileChannel instance
     * @param fileDescriptor the file descriptor
     * @param path           the file path string
     */
    public static synchronized void openFileString(Object _this, FileDescriptor fileDescriptor, String path) {
        open(_this, Paths.get(path));
    }

    /**
     * Called when a SeekableByteChannel is opened via Files.newByteChannel.
     * <p>
     * 整合自 file-leak-detector: 支持 SeekableByteChannel 的文件通道跟踪
     * </p>
     *
     * @param byteChannel the SeekableByteChannel instance
     * @param path        the Path being opened
     */
    public static synchronized void openFileChannel(SeekableByteChannel byteChannel, Path path) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            Span span = new Span();
            span.setMessage("Opened SeekableByteChannel " + path + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
            put1(byteChannel, span);
            recordHandleOpen(byteChannel, HandleType.FILE_CHANNEL);
            fireFileChannelOpenEvent(byteChannel, path, span);
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    /**
     * Called when a DirectoryStream is opened via Files.newDirectoryStream.
     * <p>
     * 整合自 file-leak-detector: 支持 DirectoryStream 的目录流跟踪
     * </p>
     *
     * @param directoryStream the DirectoryStream instance
     * @param path            the Path being opened
     */
    public static synchronized void openDirectoryStream(DirectoryStream<?> directoryStream, Path path) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            Span span = new Span();
            span.setMessage("Opened DirectoryStream " + path + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
            put1(directoryStream, span);
            recordHandleOpen(directoryStream, HandleType.FILE);
            firePathOpenEvent(directoryStream, path, span);
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    public static synchronized void openPipe(Object o) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            if (o instanceof Pipe.SourceChannel) {
                Span span = new Span();
                span.setMessage("Opened Pipe Source Channel by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                put1(o, span);
                recordHandleOpen(o, HandleType.PIPE);
                // 触发管道打开事件
                firePipeOpenEvent(o, "Source", span);
            }
            if (o instanceof Pipe.SinkChannel) {
                Span span = new Span();
                span.setMessage("Opened Pipe Sink Channel by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                put1(o, span);
                recordHandleOpen(o, HandleType.PIPE);
                // 触发管道打开事件
                firePipeOpenEvent(o, "Sink", span);
            }
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    public static synchronized void open_filechannel(FileChannel fileChannel, Path path) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            Span span = new Span();
            span.setMessage("Opened FileChannel " + path + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
            put1(fileChannel, span);
            recordHandleOpen(fileChannel, HandleType.FILE_CHANNEL);
            // 触发文件通道打开事件
            fireFileChannelOpenEvent(fileChannel, path, span);
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    public static synchronized void openSelector(Object o) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            if (o instanceof Selector) {
                Span span = new Span();
                span.setMessage("Opened selector by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                put1(o, span);
                recordHandleOpen(o, HandleType.SELECTOR);
                // 触发选择器打开事件
                fireSelectorOpenEvent(o, span);
            }
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    /**
     * Called when a socket is opened.
     */
    public static synchronized void openSocket(Object o) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            openSocketInternal(o);
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }
    
    private static void openSocketInternal(Object o) {
        // 拦截 SocketImpl
        if (o instanceof SocketImpl) {
            // Java 9+ 无法直接访问 SocketImpl 的内部字段
            if (JAVA_MAJOR_VERSION >= 9) {
                Span span = new Span();
                span.setMessage("Opened socket by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                put1(o, span);
                recordHandleOpen(o, HandleType.SOCKET);
                fireSocketOpenEvent(o, "unknown", span);
            } else {
                try {
                    SocketImpl si = (SocketImpl) o;
                    // 使用 MethodHandle 访问 SocketImpl 内部字段（替代反射 Field.get）
                    // MethodHandle.invokeExact 性能接近直接字段访问，远优于反射
                    Socket s = (Socket) SOCKETIMPL_SOCKET_GETTER.invoke(si);
                    if (s != null) {
                        String address = s.getRemoteSocketAddress() != null ? s.getRemoteSocketAddress().toString() : "unknown";
                        Span span = new Span();
                        span.setMessage("Opened socket to " + address + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                        put1(o, span);
                        recordHandleOpen(o, HandleType.SOCKET);
                        fireSocketOpenEvent(o, address, span);
                    }
                    ServerSocket ss = (ServerSocket) SOCKETIMPL_SERVER_SOCKET_GETTER.invoke(si);
                    if (ss != null) {
                        String address = ss.getLocalSocketAddress() != null ? ss.getLocalSocketAddress().toString() : "unknown";
                        Span span = new Span();
                        span.setMessage("Opened server socket at " + address + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                        put1(o, span);
                        recordHandleOpen(o, HandleType.SOCKET);
                        fireSocketOpenEvent(o, address, span);
                    }
                } catch (Throwable e) {
                    // MethodHandle.invoke 抛出 Throwable，需捕获 Throwable
                    System.err.println("访问 SocketImpl 字段失败: " + e.getMessage());
                }
            }
        }
        if (o instanceof SocketChannel) {
            Span span = new Span();
            span.setMessage("Opened socket channel by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
            put1(o, span);
            recordHandleOpen(o, HandleType.SOCKET);
            fireSocketOpenEvent(o, "channel", span);
        }
    }

    public static synchronized List<Span> getCurrentOpenFiles() {
        return new ArrayList<Span>(TABLE.values());
    }

    private static synchronized void put1(Object o, Span r) {
        StackTraceElement[] stackTrace = new Exception().getStackTrace();
        List<StackTraceElement> item = new LinkedList<>();
        for (StackTraceElement stackTraceElement : stackTrace) {
            if (
                    (null != stackTraceElement.getFileName()
                            && "Listener.java".equals(stackTraceElement.getFileName())) ||
                            (null != stackTraceElement.getClassName() &&
                                    (stackTraceElement.getClassName().startsWith("com.chua.hotspot") ||
                                            stackTraceElement.getClassName().startsWith("net.bytebuddy")))
            ) {
                continue;
            }
            item.add(stackTraceElement);
        }
        r.setStack(item.toArray(new StackTraceElement[0]));
        TABLE.put(o, r);
        if (TABLE.size() > THRESHOLD) {
            THRESHOLD = 999999;
            dump(ERROR);
        }
        if (TRACE != null && !tracing) {
            tracing = true;
            dump("Opened ", TRACE, r);
            tracing = false;
        }
    }

    public static void dump(String prefix, PrintWriter pw, Span r) {
        Exception stackTrace = new Exception();
        StackTraceElement[] trace = stackTrace.getStackTrace();
        int i = 0;
        // skip until we find the Method.invoke() that called us
        for (; i < trace.length; i++) {
            if ("java.lang.reflect.Method".equals(trace[i].getClassName())) {
                i++;
                break;
            }
        }
        // print the rest
        for (; i < trace.length; i++) {
            pw.println("\tat " + trace[i]);
        }
        pw.flush();
    }

    /**
     * Called when a file is closed.
     * <p>
     * This method tolerates a double-close where a close method is called on an already closed object.
     *
     * @param o {@link FileInputStream}, {@link FileOutputStream}, {@link RandomAccessFile}, {@link Socket}, {@link ServerSocket}, or {@link ZipFile}.
     */
    public static synchronized void close(Object o) {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            Span r = TABLE.remove(o);
            if (r != null) {
                // 记录句柄关闭
                recordHandleClose(o);
                // 触发关闭事件
                fireCloseEvent(o, r);
                if (TRACE != null && !tracing) {
                    tracing = true;
                    dump("Closed ", TRACE, r);
                    tracing = false;
                }
            }
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    /**
     * Dumps all files that are currently open.
     */
    public static synchronized void dump(OutputStream out) {
        dump(new OutputStreamWriter(out));
    }

    /**
     * Dumps all files that are currently open.
     */
    public static synchronized String title() {
        StringBuilder sb = new StringBuilder();
        Span[] records = TABLE.values().toArray(new Span[0]);
        for (Span r1 : records) {
            String message = r1.getMessage();
            int index = message.indexOf(" by ");
            if (index > -1) {
                sb.append(message.substring(0, index).replace("Opened", "").trim());
            } else {
                sb.append(message);
            }
            sb.append("\r\n");
        }
        return sb.toString();
    }

    /**
     * Dumps all files that are currently open.
     */
    public static synchronized String dump() {
        StringBuilder sb = new StringBuilder();
        Span[] records = TABLE.values().toArray(new Span[0]);

        sb.append(" <h3>发现句柄数: <span style='color:red;'>").append(records.length).append("</span></h3>----\r\n").append(records.length).append(" descriptors are open----\r\n");

        for (Span r1 : records) {
            List<String> stack = r1.getStack();
            sb.append(
                            r1.getMessage()
                                    .replace("Opened ", "Opend <span style='color:red;'>")
                                    .replace(" by ", " </span>by ")
                                    .replace(" thread:", " thread:[<span style='color:blue;'>")
                                    .replace(" on ", "</span>]  on ")
                    )
                    .append("\r\n");
            for (int i = 0; i < stack.size(); i++) {
                sb.append("\tat ").append(analysis(stack.get(i))).append("\r\n");
            }
            sb.append("----\r\n");
        }

        return sb.toString();

    }

    private static String analysis(String s) {
        for (String ignore : IGNORES) {
            if (s.startsWith(ignore)) {
                return s;
            }
        }
        return "<span style='color:red'>" + s + "</span>";
    }

    public static synchronized void dump(Writer w) {
        PrintWriter pw = new PrintWriter(w);
        Span[] records = TABLE.values().toArray(new Span[0]);

        pw.println(records.length + " descriptors are open");
        int i = 0;
        for (Span r1 : records) {
            List<String> stack = r1.getStack();
            for (; i < stack.size(); i++) {
                pw.println("\tat " + stack.get(0));
            }
            pw.println("----");
        }
        pw.flush();
    }

    /**
     * Called when the system has too many open files.
     */
    public static synchronized void outOfDescriptors() {
        // 重入保护
        if (IN_PROGRESS.get()) {
            return;
        }
        IN_PROGRESS.set(Boolean.TRUE);
        try {
            // 触发文件描述符不足事件
            fireOutOfDescriptorsEvent(TABLE.size());
            if (ERROR != null && !tracing) {
                tracing = true;
                ERROR.println("Too many open files");
                dump(ERROR);
                tracing = false;
            }
        } finally {
            IN_PROGRESS.set(Boolean.FALSE);
        }
    }

    public static String format(long time) {
        try {
            return new Date(time).toString();
        } catch (Exception e) {
            return Long.toString(time);
        }
    }

    /**
     * 将Java版本字符串转换为主要版本号
     *
     * @param version 版本字符串
     * @return 主要版本号
     */
    public static int getMajorVersion(String version) {
        // 分割版本字符串，提取主要版本号
        String[] parts = version.split("\\.");
        if (parts.length > 0) {
            try {
                // 对于Java 9及以上版本，直接返回第一个部分
                if ("1".equals(parts[0])) {
                    // 对于Java 8及以下版本，返回第二个部分
                    return Integer.parseInt(parts[1]);
                } else {
                    return Integer.parseInt(parts[0]);
                }
            } catch (NumberFormatException e) {
                // 处理非法版本号的情况
                System.err.println("无法解析版本号: " + version);
                return -1;
            }
        }
        return -1;
    }

    private static String getType(StackTraceElement[] stackTrace) {
        boolean isFind = false;
        for (StackTraceElement stackTraceElement : stackTrace) {
            String className = stackTraceElement.getClassName();
            if ("java.io.PrintStream".equals(className)) {
                isFind = true;
                continue;
            }

            if (!isFind) {
                continue;
            }
            String methodName = stackTraceElement.getMethodName();
            if (methodName.contains("$")) {
                methodName = methodName.substring(0, methodName.indexOf("$"));
            }
            return className + "." + methodName + ":" + stackTraceElement.getLineNumber();
        }
        return "";
    }

    // ==================== 事件触发方法 ====================

    /**
     * 触发文件打开事件
     */
    private static void fireFileOpenEvent(Object source, File file, Span span) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onFileOpen(source, file, span);
            } catch (Exception e) {
                System.err.println("执行文件打开事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发 Path 文件打开事件
     * <p>
     * 整合自 file-leak-detector: 支持 Path 级别的文件打开事件通知
     * </p>
     */
    private static void firePathOpenEvent(Object source, Path path, Span span) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onFileOpen(source, path.toFile(), span);
            } catch (Exception e) {
                System.err.println("执行 Path 文件打开事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发文件通道打开事件
     */
    private static void fireFileChannelOpenEvent(Object source, Path path, Span span) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onFileChannelOpen(source, path, span);
            } catch (Exception e) {
                System.err.println("执行文件通道打开事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发 Socket 打开事件
     */
    private static void fireSocketOpenEvent(Object source, String address, Span span) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onSocketOpen(source, address, span);
            } catch (Exception e) {
                System.err.println("执行 Socket 打开事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发管道打开事件
     */
    private static void firePipeOpenEvent(Object source, String type, Span span) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onPipeOpen(source, type, span);
            } catch (Exception e) {
                System.err.println("执行管道打开事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发选择器打开事件
     */
    private static void fireSelectorOpenEvent(Object source, Span span) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onSelectorOpen(source, span);
            } catch (Exception e) {
                System.err.println("执行选择器打开事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发关闭事件
     */
    private static void fireCloseEvent(Object source, Span span) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onClose(source, span);
            } catch (Exception e) {
                System.err.println("执行关闭事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发文件描述符不足事件
     */
    private static void fireOutOfDescriptorsEvent(int count) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onOutOfDescriptors(count);
            } catch (Exception e) {
                System.err.println("执行文件描述符不足事件处理器失败: " + e.getMessage());
            }
        }
    }

    /**
     * 触发阈值超出事件
     */
    private static void fireThresholdExceededEvent(int count, int threshold) {
        for (TransformEventHandler handler : EVENT_HANDLERS) {
            try {
                handler.onThresholdExceeded(count, threshold);
            } catch (Exception e) {
                System.err.println("执行阈值超出事件处理器失败: " + e.getMessage());
            }
        }
    }

    // ==================== 句柄分类统计方法 ====================

    /**
     * 记录句柄打开
     *
     * @param obj  句柄对象
     * @param type 句柄类型
     */
    private static void recordHandleOpen(Object obj, HandleType type) {
        HANDLE_TYPE_MAP.put(obj, type);
        OPEN_TIMESTAMP_MAP.put(obj, System.currentTimeMillis());
        OPEN_COUNTERS.get(type).incrementAndGet();

        // 更新统计
        synchronized (STATISTICS) {
            int current = STATISTICS.currentCounts.getOrDefault(type, 0) + 1;
            STATISTICS.currentCounts.put(type, current);
            STATISTICS.totalOpenCounts.put(type, OPEN_COUNTERS.get(type).get());

            // 更新峰值
            int peak = STATISTICS.peakCounts.getOrDefault(type, 0);
            if (current > peak) {
                STATISTICS.peakCounts.put(type, current);
            }

            // 更新总计
            STATISTICS.totalCurrent = TABLE.size();
            if (STATISTICS.totalCurrent > STATISTICS.totalPeak) {
                STATISTICS.totalPeak = STATISTICS.totalCurrent;
            }

            // 检查句柄数量阈值
            if (STATISTICS.totalCurrent >= STATISTICS.handleCountThreshold) {
                fireThresholdExceededEvent(STATISTICS.totalCurrent, STATISTICS.handleCountThreshold);
            }
        }
    }

    /**
     * 记录句柄关闭
     *
     * @param obj 句柄对象
     */
    private static void recordHandleClose(Object obj) {
        HandleType type = HANDLE_TYPE_MAP.remove(obj);
        OPEN_TIMESTAMP_MAP.remove(obj);
        if (type == null) {
            type = HandleType.UNKNOWN;
        }
        CLOSE_COUNTERS.get(type).incrementAndGet();

        // 更新统计
        synchronized (STATISTICS) {
            int current = STATISTICS.currentCounts.getOrDefault(type, 0);
            if (current > 0) {
                STATISTICS.currentCounts.put(type, current - 1);
            }
            STATISTICS.totalCloseCounts.put(type, CLOSE_COUNTERS.get(type).get());
            STATISTICS.totalCurrent = TABLE.size();
        }
    }

    /**
     * 获取句柄分类统计信息
     *
     * @return 统计信息
     */
    public static HandleStatistics getStatistics() {
        synchronized (STATISTICS) {
            // 刷新当前总数
            STATISTICS.totalCurrent = TABLE.size();
            return STATISTICS;
        }
    }

    /**
     * 获取分类统计的 Map 表示（便于 JSON 序列化）
     *
     * @return 统计信息 Map
     */
    public static Map<String, Object> getStatisticsMap() {
        HandleStatistics stats = getStatistics();
        Map<String, Object> result = new LinkedHashMap<>();

        result.put("totalCurrent", stats.totalCurrent);
        result.put("totalPeak", stats.totalPeak);
        result.put("leakThresholdMs", stats.leakThresholdMs);
        result.put("handleCountThreshold", stats.handleCountThreshold);
        result.put("agentInstalled", AGENT_INSTALLED);

        // 各类型统计
        List<Map<String, Object>> typeStats = new ArrayList<>();
        for (HandleType type : HandleType.values()) {
            Map<String, Object> typeMap = new LinkedHashMap<>();
            typeMap.put("type", type.name());
            typeMap.put("displayName", type.getDisplayName());
            typeMap.put("currentCount", stats.currentCounts.getOrDefault(type, 0));
            typeMap.put("peakCount", stats.peakCounts.getOrDefault(type, 0));
            typeMap.put("totalOpen", stats.totalOpenCounts.getOrDefault(type, 0L));
            typeMap.put("totalClose", stats.totalCloseCounts.getOrDefault(type, 0L));
            typeStats.add(typeMap);
        }
        result.put("typeStatistics", typeStats);

        return result;
    }

    /**
     * 获取潜在泄漏的句柄列表
     * <p>
     * 句柄打开时间超过泄漏阈值（默认5分钟）视为潜在泄漏
     * </p>
     *
     * @return 泄漏句柄列表
     */
    public static synchronized List<Map<String, Object>> getLeakedHandles() {
        List<Map<String, Object>> leaks = new ArrayList<>();
        long now = System.currentTimeMillis();
        long threshold = STATISTICS.leakThresholdMs;

        for (Map.Entry<Object, Span> entry : TABLE.entrySet()) {
            Long openTime = OPEN_TIMESTAMP_MAP.get(entry.getKey());
            if (openTime != null) {
                long duration = now - openTime;
                if (duration > threshold) {
                    Map<String, Object> leakInfo = new LinkedHashMap<>();
                    HandleType type = HANDLE_TYPE_MAP.getOrDefault(entry.getKey(), HandleType.UNKNOWN);
                    leakInfo.put("type", type.name());
                    leakInfo.put("typeDisplayName", type.getDisplayName());
                    leakInfo.put("message", entry.getValue().getMessage());
                    leakInfo.put("stack", entry.getValue().getStack());
                    leakInfo.put("openTimestamp", openTime);
                    leakInfo.put("openDurationMs", duration);
                    leakInfo.put("openDurationHuman", formatDuration(duration));
                    leakInfo.put("leakSeverity", getLeakSeverity(duration, threshold));
                    leaks.add(leakInfo);
                }
            }
        }

        // 按持续时间降序排序
        leaks.sort((a, b) -> Long.compare((Long) b.get("openDurationMs"), (Long) a.get("openDurationMs")));
        return leaks;
    }

    /**
     * 获取按类型分类的当前打开句柄
     *
     * @param type 句柄类型
     * @return 该类型的句柄列表
     */
    public static synchronized List<Map<String, Object>> getHandlesByType(HandleType type) {
        List<Map<String, Object>> handles = new ArrayList<>();
        long now = System.currentTimeMillis();

        for (Map.Entry<Object, Span> entry : TABLE.entrySet()) {
            HandleType handleType = HANDLE_TYPE_MAP.getOrDefault(entry.getKey(), HandleType.UNKNOWN);
            if (handleType == type) {
                Map<String, Object> handleInfo = new LinkedHashMap<>();
                Long openTime = OPEN_TIMESTAMP_MAP.get(entry.getKey());
                handleInfo.put("type", handleType.name());
                handleInfo.put("typeDisplayName", handleType.getDisplayName());
                handleInfo.put("message", entry.getValue().getMessage());
                handleInfo.put("stack", entry.getValue().getStack());
                handleInfo.put("openTimestamp", openTime);
                if (openTime != null) {
                    long duration = now - openTime;
                    handleInfo.put("openDurationMs", duration);
                    handleInfo.put("openDurationHuman", formatDuration(duration));
                }
                handles.add(handleInfo);
            }
        }
        return handles;
    }

    /**
     * 设置泄漏检测阈值
     *
     * @param thresholdMs 阈值（毫秒）
     */
    public static void setLeakThreshold(long thresholdMs) {
        STATISTICS.leakThresholdMs = thresholdMs;
    }

    /**
     * 设置句柄数量告警阈值
     *
     * @param threshold 阈值数量
     */
    public static void setHandleCountThreshold(int threshold) {
        STATISTICS.handleCountThreshold = threshold;
    }

    /**
     * 格式化持续时间
     *
     * @param ms 毫秒数
     * @return 人类可读的持续时间字符串
     */
    private static String formatDuration(long ms) {
        long seconds = ms / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;

        if (days > 0) {
            return days + "天" + (hours % 24) + "小时";
        } else if (hours > 0) {
            return hours + "小时" + (minutes % 60) + "分钟";
        } else if (minutes > 0) {
            return minutes + "分钟" + (seconds % 60) + "秒";
        } else {
            return seconds + "秒";
        }
    }

    /**
     * 获取泄漏严重程度
     *
     * @param durationMs 持续时间（毫秒）
     * @param thresholdMs 阈值（毫秒）
     * @return 严重程度 (LOW/MEDIUM/HIGH/CRITICAL)
     */
    private static String getLeakSeverity(long durationMs, long thresholdMs) {
        double ratio = (double) durationMs / thresholdMs;
        if (ratio >= 10) {
            return "CRITICAL";
        } else if (ratio >= 5) {
            return "HIGH";
        } else if (ratio >= 2) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }
}
