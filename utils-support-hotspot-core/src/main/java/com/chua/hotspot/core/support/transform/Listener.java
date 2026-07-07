package com.chua.hotspot.core.support.transform;


import java.io.*;
import java.lang.reflect.Field;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketImpl;
import java.nio.channels.FileChannel;
import java.nio.channels.Pipe;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.nio.file.Path;
import java.util.*;
import java.util.zip.ZipFile;

/**
 * Intercepted JDK calls land here.
 *
 * @author Kohsuke Kawaguchi
 */
public class Listener {

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
    
    /**
     * ThreadLocal 重入保护，防止在执行 Listener 方法时递归调用
     * 当增强的 JDK 类（如 FileInputStream）在 Listener 内部被使用时，防止无限递归
     */
    private static final ThreadLocal<Boolean> IN_PROGRESS = ThreadLocal.withInitial(() -> Boolean.FALSE);
    private static Field SOCKETIMPL_SOCKET, SOCKETIMPL_SERVER_SOCKET;

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
                    SOCKETIMPL_SOCKET = SocketImpl.class.getDeclaredField("socket");
                    SOCKETIMPL_SERVER_SOCKET = SocketImpl.class.getDeclaredField("serverSocket");
                    SOCKETIMPL_SOCKET.setAccessible(true);
                    SOCKETIMPL_SERVER_SOCKET.setAccessible(true);
                }
            } catch (NoSuchFieldException e) {
                System.err.println("无法获取 SocketImpl 字段: " + e.getMessage());
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
            // 触发文件打开事件
            fireFileOpenEvent(o, f, span);
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
                // 触发管道打开事件
                firePipeOpenEvent(o, "Source", span);
            }
            if (o instanceof Pipe.SinkChannel) {
                Span span = new Span();
                span.setMessage("Opened Pipe Sink Channel by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                put1(o, span);
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
                fireSocketOpenEvent(o, "unknown", span);
            } else {
                try {
                    SocketImpl si = (SocketImpl) o;
                    Socket s = (Socket) SOCKETIMPL_SOCKET.get(si);
                    if (s != null) {
                        String address = s.getRemoteSocketAddress() != null ? s.getRemoteSocketAddress().toString() : "unknown";
                        Span span = new Span();
                        span.setMessage("Opened socket to " + address + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                        put1(o, span);
                        fireSocketOpenEvent(o, address, span);
                    }
                    ServerSocket ss = (ServerSocket) SOCKETIMPL_SERVER_SOCKET.get(si);
                    if (ss != null) {
                        String address = ss.getLocalSocketAddress() != null ? ss.getLocalSocketAddress().toString() : "unknown";
                        Span span = new Span();
                        span.setMessage("Opened server socket at " + address + " by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
                        put1(o, span);
                        fireSocketOpenEvent(o, address, span);
                    }
                } catch (IllegalAccessException e) {
                    System.err.println("访问 SocketImpl 字段失败: " + e.getMessage());
                }
            }
        }
        if (o instanceof SocketChannel) {
            Span span = new Span();
            span.setMessage("Opened socket channel by thread:" + Thread.currentThread().getName() + " on " + format(System.currentTimeMillis()));
            put1(o, span);
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
}
