package com.chua.hotspot.core.support.trace;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.storage.DataRecorder;
import com.chua.hotspot.core.support.transfor.Transfer;
import com.chua.hotspot.core.support.transfor.TransferFactory;
import com.chua.hotspot.core.support.utils.CustomTreeNode;
import com.chua.hotspot.core.support.utils.StringUtils;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

/**
 * 链路追踪辅助工具类
 * <p>
 * 提供各容器插件公共的链路追踪方法，统一管理：
 * - 请求前置处理
 * - 请求后置处理
 * - 链路数据推送
 * - 请求信息刷新
 * </p>
 *
 * @author CH
 * @version 4.0.0.38
 * @since 2024/12/16
 */
public class TraceHelper {

    /**
     * WebSocket 事件名称
     */
    private static final String WS_TRACE_EVENT = "AGENT_TRACE";

    private TraceHelper() {
    }

    /**
     * 请求前置处理
     * <p>
     * 创建 Span 并从请求头中提取链路信息
     * </p>
     *
     * @param method   拦截的方法
     * @param objects  请求参数
     * @param target   目标对象
     * @param protocol 协议类型（HTTP/DUBBO 等）
     * @param category 分类标识（tomcat/undertow/netty 等）
     * @return 新创建的 Span
     */
    public static Span beforeRequest(Method method, Object[] objects, Object target, 
                                     String protocol, String category) {
        Span span = NewTrackManager.createEntrySpan(objects);
        
        // 从请求头中提取链路信息
        String parentId = NewTrackManager.getRequestLinkParentId(objects);
        String linkId = NewTrackManager.getRequestLinkId(objects);
        
        if (!StringUtils.isBlank(parentId)) {
            span.setPid(parentId);
        }
        if (!StringUtils.isBlank(linkId)) {
            span.setLinkId(linkId);
        }
        
        // 设置协议和分类
        span.setProtocol(protocol);
        span.setCategory(category);
        
        NewTrackManager.doRefreshSpan(target, method, objects, span);
        return span;
    }

    /**
     * 请求后置处理
     * <p>
     * 记录耗时、刷新请求信息、推送完整链路
     * </p>
     *
     * @param span    当前 Span
     * @param objects 请求参数（用于刷新请求信息）
     */
    public static void afterRequest(Span span, Object[] objects) {
        if (span != null) {
            span.setArgs(objects);
            NewTrackManager.costTime(span);
            refreshRequestInfo(span);
        }
        publishCompleteTrace();
    }

    /**
     * 刷新请求信息
     * <p>
     * 调用对应的 Transfer 处理器填充 Span 信息
     * </p>
     *
     * @param span 当前 Span
     */
    public static void refreshRequestInfo(Span span) {
        if (span == null) {
            return;
        }
        Transfer transfer = TransferFactory.getInstance().get(span.getCategory());
        if (transfer != null) {
            transfer.transfer(span.getArgs(), span);
        }
    }

    /**
     * 推送完整链路到服务器并保存
     * <p>
     * - ReportFactory: 实时上报到监控服务器
     * - DataRecorder: 持久化存储，前端可查询历史数据
     * </p>
     */
    public static void publishCompleteTrace() {
        List<Span> spans = NewTrackManager.currentSpans();
        if (spans == null || spans.isEmpty()) {
            NewTrackManager.clear();
            return;
        }

        try {
            // 转换为树形结构
            List<Span> spanList = new ArrayList<>(spans);
            CustomTreeNode treeNode = new CustomTreeNode();
            treeNode.add(spanList);
            
            List<?> transferAll = treeNode.transferAll();
            if (transferAll != null && !transferAll.isEmpty()) {
                Object traceTree = transferAll.get(0);
                
                // 上报到监控服务器（实时推送）
                ReportFactory.report(ModuleType.TRACE, WS_TRACE_EVENT, traceTree);
            }
            
            // 保存到持久化存储
            saveTraceToStorage(spanList);
        } catch (Exception ignored) {
            // 忽略推送异常
        } finally {
            NewTrackManager.clear();
        }
    }

    /**
     * 保存链路数据到统一记录器
     */
    private static void saveTraceToStorage(List<Span> spans) {
        if (spans == null || spans.isEmpty()) {
            return;
        }
        
        try {
            DataRecorder.getInstance().recordTraces(spans);
        } catch (Exception ignored) {
            // 忽略存储异常
        }
    }
}
