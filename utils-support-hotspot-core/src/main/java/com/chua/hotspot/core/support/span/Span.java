package com.chua.hotspot.core.support.span;

import com.alibaba.fastjson.annotation.JSONField;
import com.chua.hotspot.core.support.server.ServiceInstance;

import java.util.ArrayList;
import java.util.List;

/**
 * 链路追踪 Span 实体
 * 表示一次方法调用或操作的追踪信息
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class Span {

    private static final int INITIAL_LIST_CAPACITY = 8;

    // 基础信息
    /**
     * 线程名称
     */
    private final String threadName;

    /**
     * 链路 ID
     */
    private String linkId;

    /**
     * Span ID
     */
    private String id;

    /**
     * 父 Span ID
     */
    private String pid;

    // 时间信息
    /**
     * 进入时间（毫秒）
     */
    private Long enterTime;

    /**
     * 退出时间（毫秒）
     */
    private Long exitTime;

    /**
     * 耗时（毫秒）
     */
    private long costTime;

    // 调用信息
    /**
     * 类名
     */
    private String typeName;

    /**
     * 方法名
     */
    private String method;

    /**
     * 来源
     */
    private String from;

    /**
     * 描述
     */
    private String description;

    /**
     * 分类
     */
    private String category;

    // 连接信息
    /**
     * 数据库
     */
    private String database;

    /**
     * 协议
     */
    private String protocol;

    /**
     * 地址
     */
    private String address;

    /**
     * 状态码
     */
    private String code;

    // 错误信息
    /**
     * 错误信息
     */
    private String error;

    // 集合数据
    /**
     * 提示信息
     */
    private List<String> tips;

    /**
     * 堆栈信息
     */
    private List<String> stackTrace;

    /**
     * 方法参数（不序列化）
     */
    @JSONField(serialize = false)
    private Object[] args;

    /**
     * 参数列表
     */
    private List<String> param;

    /**
     * 查询参数
     */
    private List<String> query;

    /**
     * 请求头
     */
    private List<String> headers;

    /**
     * 位置信息
     */
    private List<String> locations;

    /**
     * 服务实例列表
     */
    private List<ServiceInstance> instances;

    /**
     * 子 Span 列表
     */
    private List<Span> children;

    /**
     * 默认构造函数
     * 初始化基础属性和集合
     */
    public Span() {
        long currentTime = System.currentTimeMillis();
        this.enterTime = currentTime;
        this.threadName = Thread.currentThread().getName();
        this.costTime = 0L;
        
        // 初始化集合
        this.tips = new ArrayList<>(INITIAL_LIST_CAPACITY);
        this.stackTrace = new ArrayList<>(INITIAL_LIST_CAPACITY);
        this.headers = new ArrayList<>(INITIAL_LIST_CAPACITY);
        this.param = new ArrayList<>(INITIAL_LIST_CAPACITY);
        this.query = new ArrayList<>(INITIAL_LIST_CAPACITY);
        this.locations = new ArrayList<>(INITIAL_LIST_CAPACITY);
        this.instances = new ArrayList<>(INITIAL_LIST_CAPACITY);
        this.children = new ArrayList<>(INITIAL_LIST_CAPACITY);
        
        // 记录堆栈信息
        captureStackTrace();
    }

    /**
     * 带链路 ID 的构造函数
     *
     * @param linkId 链路 ID
     */
    public Span(String linkId) {
        this();
        this.linkId = linkId;
    }

    /**
     * 捕获当前堆栈信息
     */
    private void captureStackTrace() {
        StackTraceElement[] elements = Thread.currentThread().getStackTrace();
        setStackTrace(elements);
    }

    // ==================== 静态方法 ====================

    /**
     * 判断是否需要过滤指定的堆栈元素
     * 过滤掉内部框架的堆栈信息
     *
     * @param element 堆栈元素
     * @return 如果需要过滤返回 true
     */
    public static boolean shouldFilter(StackTraceElement element) {
        if (element == null) {
            return true;
        }
        String className = element.getClassName();
        String methodName = element.getMethodName();
        
        // 过滤内部框架类
        if (className.startsWith("com.chua")) {
            return true;
        }
        // 过滤 ByteBuddy 生成的方法
        if (methodName.contains("original") || methodName.contains("auxiliary")) {
            return true;
        }
        return className.contains("auxiliary");
    }

    /**
     * 兼容旧方法名
     * @deprecated 使用 {@link #shouldFilter(StackTraceElement)} 替代
     */
    @Deprecated
    public static boolean pass(StackTraceElement element) {
        return shouldFilter(element);
    }

    // ==================== 堆栈操作 ====================

    /**
     * 设置堆栈信息列表
     *
     * @param stackTrace 堆栈信息列表
     */
    public void setStackTrace(List<String> stackTrace) {
        if (stackTrace != null) {
            this.stackTrace = new ArrayList<>(stackTrace);
        }
    }

    /**
     * 设置堆栈信息，自动过滤内部框架堆栈
     *
     * @param stackTrace 堆栈信息数组
     */
    public void setStackTrace(StackTraceElement[] stackTrace) {
        if (stackTrace == null) {
            return;
        }
        List<String> filtered = new ArrayList<>(stackTrace.length);
        for (StackTraceElement element : stackTrace) {
            if (!shouldFilter(element)) {
                filtered.add(element.toString());
            }
        }
        this.stackTrace = filtered;
    }

    /**
     * 清空堆栈信息
     */
    public void clearStack() {
        this.stackTrace.clear();
    }

    /**
     * 添加堆栈信息
     *
     * @param stack 堆栈信息字符串
     */
    public void addStack(String stack) {
        if (stack != null) {
            this.stackTrace.add(stack);
        }
    }

    /**
     * 添加堆栈元素，自动过滤内部框架堆栈
     *
     * @param element 堆栈元素
     */
    public void addStack(StackTraceElement element) {
        if (element == null) {
            return;
        }
        String className = element.getClassName();
        if (className == null) {
            return;
        }
        // 过滤内部框架类
        if (isInternalClass(className)) {
            return;
        }
        addStack(element.toString());
    }

    /**
     * 判断是否为内部框架类
     *
     * @param className 类名
     * @return 是否为内部类
     */
    private boolean isInternalClass(String className) {
        return className.startsWith("com.chua") 
            || className.contains("$auxiliary$") 
            || className.contains("$original$") 
            || className.startsWith("net.bytebuddy");
    }

    // ==================== 数据添加方法 ====================

    /**
     * 添加提示信息
     *
     * @param tip 提示信息
     * @return 当前 Span 对象（支持链式调用）
     */
    public Span addTip(String tip) {
        if (tip != null) {
            this.tips.add(tip);
        }
        return this;
    }

    /**
     * 添加服务实例
     *
     * @param serviceInstance 服务实例
     */
    public void addServiceInstance(ServiceInstance serviceInstance) {
        if (serviceInstance != null) {
            this.instances.add(serviceInstance);
        }
    }

    /**
     * 添加请求头
     *
     * @param header 请求头信息
     */
    public void addHeader(String header) {
        if (header != null) {
            this.headers.add(header);
        }
    }

    /**
     * 添加位置信息
     *
     * @param location 位置信息
     */
    public void addLocation(String location) {
        if (location != null) {
            this.locations.add(location);
        }
    }

    /**
     * 添加查询参数
     *
     * @param queryParam 查询参数
     */
    public void addQuery(String queryParam) {
        if (queryParam != null) {
            this.query.add(queryParam);
        }
    }

    /**添加参数
     *
     * @param parameter 参数
     */
    public void addParam(String parameter) {
        if (parameter != null) {
            this.param.add(parameter);
        }
    }

    // ==================== 状态判断 ====================

    /**
     * 是否存在异常
     *
     * @return 存在异常返回 true
     */
    public boolean hasException() {
        return error != null;
    }

    /**
     * 是否有子 Span
     *
     * @return 有子 Span 返回 true
     */
    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    /**
     * 添加子 Span
     *
     * @param child 子 Span
     */
    public void addChild(Span child) {
        if (child != null) {
            this.children.add(child);
        }
    }

    // ==================== Getter/Setter ====================

    public String getThreadName() { return threadName; }

    public String getLinkId() { return linkId; }
    public void setLinkId(String linkId) { this.linkId = linkId; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPid() { return pid; }
    public void setPid(String pid) { this.pid = pid; }

    public Long getEnterTime() { return enterTime; }
    public void setEnterTime(Long enterTime) { this.enterTime = enterTime; }

    public Long getExitTime() { return exitTime; }
    public void setExitTime(Long exitTime) { this.exitTime = exitTime; }

    public long getCostTime() { return costTime; }
    public void setCostTime(long costTime) { this.costTime = costTime; }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }

    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public List<String> getTips() { return tips; }
    public void setTips(List<String> tips) { this.tips = tips; }

    public List<String> getStackTrace() { return stackTrace; }

    @JSONField(serialize = false)
    public Object[] getArgs() { return args; }
    public void setArgs(Object[] args) { this.args = args; }

    public List<String> getParam() { return param; }
    public void setParam(List<String> param) { this.param = param; }

    public List<String> getQuery() { return query; }
    public void setQuery(List<String> query) { this.query = query; }

    public List<String> getHeaders() { return headers; }
    public void setHeaders(List<String> headers) { this.headers = headers; }

    public List<String> getLocations() { return locations; }
    public void setLocations(List<String> locations) { this.locations = locations; }

    public List<ServiceInstance> getInstances() { return instances; }
    public void setInstances(List<ServiceInstance> instances) { this.instances = instances; }

    public List<Span> getChildren() { return children; }
    public void setChildren(List<Span> children) { this.children = children; }
}
