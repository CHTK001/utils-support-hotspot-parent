package com.chua.hotspot.core.support.trace;

import com.chua.hotspot.core.support.log.LogFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 分布式链路追踪上下文
 * <p>
 * 支持跨进程传播的链路追踪信息，兼容 W3C Trace Context 规范。
 * 使用 ThreadLocal 存储当前线程的追踪上下文，支持跨线程传递。
 * </p>
 * <p>
 * HTTP 传播头：
 * <ul>
 *   <li>X-Trace-Id: 全局唯一的链路 ID</li>
 *   <li>X-Span-Id: 当前 Span ID</li>
 *   <li>X-Parent-Span-Id: 父 Span ID</li>
 *   <li>X-Trace-Sampled: 是否采样（1=采样, 0=不采样）</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.34
 */
public class DistributedTraceContext {

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * W3C 标准传播头
     */
    public static final String HEADER_TRACE_ID = "X-Trace-Id";
    public static final String HEADER_SPAN_ID = "X-Span-Id";
    public static final String HEADER_PARENT_SPAN_ID = "X-Parent-Span-Id";
    public static final String HEADER_SAMPLED = "X-Trace-Sampled";

    /**
     * 兼容 Zipkin/SkyWalking 的传播头
     */
    public static final String HEADER_B3_TRACE_ID = "X-B3-TraceId";
    public static final String HEADER_B3_SPAN_ID = "X-B3-SpanId";
    public static final String HEADER_B3_PARENT_SPAN_ID = "X-B3-ParentSpanId";
    public static final String HEADER_B3_SAMPLED = "X-B3-Sampled";

    /**
     * 线程本地存储
     */
    private static final ThreadLocal<DistributedTraceContext> CONTEXT_HOLDER = new ThreadLocal<>();

    /**
     * 全局链路 ID（跨进程唯一）
     */
    private String traceId;

    /**
     * 当前 Span ID
     */
    private String spanId;

    /**
     * 父 Span ID
     */
    private String parentSpanId;

    /**
     * 是否采样
     */
    private boolean sampled = true;

    /**
     * 附加属性（Baggage，用于跨进程传递业务数据）
     */
    private Map<String, String> baggage;

    public DistributedTraceContext() {
        this.traceId = generateTraceId();
        this.spanId = generateSpanId();
        this.parentSpanId = "0";
        this.baggage = new HashMap<>();
    }

    // ==================== 上下文管理 ====================

    /**
     * 获取当前线程的追踪上下文
     *
     * @return 追踪上下文，不存在则返回 null
     */
    public static DistributedTraceContext getCurrent() {
        return CONTEXT_HOLDER.get();
    }

    /**
     * 设置当前线程的追踪上下文
     *
     * @param context 追踪上下文
     */
    public static void setCurrent(DistributedTraceContext context) {
        CONTEXT_HOLDER.set(context);
    }

    /**
     * 创建新的追踪上下文并设置为当前上下文
     *
     * @return 新创建的追踪上下文
     */
    public static DistributedTraceContext createNew() {
        DistributedTraceContext context = new DistributedTraceContext();
        CONTEXT_HOLDER.set(context);
        return context;
    }

    /**
     * 清除当前线程的追踪上下文
     */
    public static void clear() {
        CONTEXT_HOLDER.remove();
    }

    // ==================== 跨进程传播 ====================

    /**
     * 从 HTTP 请求头中提取追踪上下文
     *
     * @param headers HTTP 请求头（headerName → headerValue）
     * @return 追踪上下文，无追踪头则返回 null
     */
    public static DistributedTraceContext fromHeaders(Map<String, String> headers) {
        if (headers == null || headers.isEmpty()) {
            return null;
        }

        String traceId = getHeader(headers, HEADER_TRACE_ID, HEADER_B3_TRACE_ID);
        if (traceId == null || traceId.isEmpty()) {
            return null;
        }

        DistributedTraceContext context = new DistributedTraceContext();
        context.setTraceId(traceId);

        String spanId = getHeader(headers, HEADER_SPAN_ID, HEADER_B3_SPAN_ID);
        if (spanId != null && !spanId.isEmpty()) {
            context.setSpanId(spanId);
        }

        String parentSpanId = getHeader(headers, HEADER_PARENT_SPAN_ID, HEADER_B3_PARENT_SPAN_ID);
        if (parentSpanId != null && !parentSpanId.isEmpty()) {
            context.setParentSpanId(parentSpanId);
        }

        String sampled = getHeader(headers, HEADER_SAMPLED, HEADER_B3_SAMPLED);
        if (sampled != null) {
            context.setSampled("1".equals(sampled) || Boolean.parseBoolean(sampled));
        }

        // 提取 baggage（X-Baggage- 前缀的头部）
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            if (entry.getKey().startsWith("X-Baggage-")) {
                String key = entry.getKey().substring("X-Baggage-".length());
                context.setBaggage(key, entry.getValue());
            }
        }

        CONTEXT_HOLDER.set(context);
        return context;
    }

    /**
     * 将追踪上下文注入 HTTP 请求头
     *
     * @return HTTP 请求头映射
     */
    public Map<String, String> toHeaders() {
        Map<String, String> headers = new HashMap<>();
        if (traceId != null) {
            headers.put(HEADER_TRACE_ID, traceId);
            headers.put(HEADER_B3_TRACE_ID, traceId);
        }
        if (spanId != null) {
            headers.put(HEADER_SPAN_ID, spanId);
            headers.put(HEADER_B3_SPAN_ID, spanId);
        }
        if (parentSpanId != null) {
            headers.put(HEADER_PARENT_SPAN_ID, parentSpanId);
            headers.put(HEADER_B3_PARENT_SPAN_ID, parentSpanId);
        }
        headers.put(HEADER_SAMPLED, sampled ? "1" : "0");
        headers.put(HEADER_B3_SAMPLED, sampled ? "1" : "0");

        // 注入 baggage
        if (baggage != null) {
            for (Map.Entry<String, String> entry : baggage.entrySet()) {
                headers.put("X-Baggage-" + entry.getKey(), entry.getValue());
            }
        }

        return headers;
    }

    /**
     * 创建子 Span（当前 Span 成为新 Span 的父 Span）
     *
     * @return 新的追踪上下文（子 Span）
     */
    public DistributedTraceContext createChildSpan() {
        DistributedTraceContext child = new DistributedTraceContext();
        child.setTraceId(this.traceId);
        child.setParentSpanId(this.spanId);
        child.setSampled(this.sampled);
        // 继承 baggage
        if (this.baggage != null) {
            child.setBaggage(new HashMap<>(this.baggage));
        }
        return child;
    }

    // ==================== Baggage 管理 ====================

    /**
     * 设置 Baggage 属性
     *
     * @param key   属性键
     * @param value 属性值
     */
    public void setBaggage(String key, String value) {
        if (baggage == null) {
            baggage = new HashMap<>();
        }
        baggage.put(key, value);
    }

    /**
     * 获取 Baggage 属性
     *
     * @param key 属性键
     * @return 属性值，不存在返回 null
     */
    public String getBaggage(String key) {
        return baggage != null ? baggage.get(key) : null;
    }

    // ==================== ID 生成 ====================

    /**
     * 生成全局唯一的 Trace ID（32 位十六进制）
     */
    private static String generateTraceId() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 生成 Span ID（16 位十六进制）
     */
    private static String generateSpanId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    // ==================== 工具方法 ====================

    /**
     * 从请求头中获取值（支持多个候选键名）
     */
    private static String getHeader(Map<String, String> headers, String... keys) {
        for (String key : keys) {
            String value = headers.get(key);
            if (value == null) {
                // 尝试小写键名（HTTP 头部不区分大小写）
                value = headers.get(key.toLowerCase());
            }
            if (value != null && !value.isEmpty()) {
                return value;
            }
        }
        return null;
    }

    // ==================== Getters & Setters ====================

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public String getSpanId() {
        return spanId;
    }

    public void setSpanId(String spanId) {
        this.spanId = spanId;
    }

    public String getParentSpanId() {
        return parentSpanId;
    }

    public void setParentSpanId(String parentSpanId) {
        this.parentSpanId = parentSpanId;
    }

    public boolean isSampled() {
        return sampled;
    }

    public void setSampled(boolean sampled) {
        this.sampled = sampled;
    }

    public Map<String, String> getBaggage() {
        return baggage;
    }

    public void setBaggage(Map<String, String> baggage) {
        this.baggage = baggage;
    }

    @Override
    public String toString() {
        return "DistributedTraceContext{" +
                "traceId='" + traceId + '\'' +
                ", spanId='" + spanId + '\'' +
                ", parentSpanId='" + parentSpanId + '\'' +
                ", sampled=" + sampled +
                '}';
    }
}