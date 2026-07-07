package com.chua.hotspot.core.support.server.api;

import com.alibaba.fastjson.JSON;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.storage.SqliteStorage;
import com.chua.hotspot.core.support.utils.CustomTreeNode;

import java.util.*;

/**
 * 链路追踪 API
 * <p>
 * 提供链路追踪数据的查询接口，支持当前链路和历史链路
 * </p>
 *
 * @author CH
 * @version 4.0.0.35
 * @since 2024/12/12
 */
public class TraceApi implements ApiEndpoint {

    @Override
    public String name() {
        return "trace";
    }

    @Override
    public String description() {
        return "获取链路追踪数据（支持当前/历史查询）";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "current");
        
        if ("history".equals(action)) {
            return getHistoryTraces(request);
        } else if ("detail".equals(action)) {
            return getTraceDetail(request);
        }
        
        // 默认返回当前链路
        return getCurrentTrace();
    }
    
    /**
     * 获取当前链路追踪（内存中）
     */
    private Object getCurrentTrace() {
        List<Span> spans = NewTrackManager.currentSpans();
        if (spans == null || spans.isEmpty()) {
            return Collections.emptyList();
        }
        return spans;
    }
    
    /**
     * 获取历史链路追踪（从 SQLite）
     * 
     * 参数：
     * - startTime: 开始时间戳（默认 24 小时前）
     * - endTime: 结束时间戳（默认现在）
     * - limit: 返回条数（默认 100）
     */
    private Object getHistoryTraces(HttpRequest request) {
        long endTime = System.currentTimeMillis();
        long startTime = endTime - (24 * 60 * 60 * 1000); // 默认最近 24 小时
        int limit = 100;
        
        try {
            String startTimeParam = request.getParam("startTime");
            if (startTimeParam != null && !startTimeParam.isEmpty()) {
                startTime = Long.parseLong(startTimeParam);
            }
            
            String endTimeParam = request.getParam("endTime");
            if (endTimeParam != null && !endTimeParam.isEmpty()) {
                endTime = Long.parseLong(endTimeParam);
            }
            
            String limitParam = request.getParam("limit");
            if (limitParam != null && !limitParam.isEmpty()) {
                limit = Integer.parseInt(limitParam);
            }
        } catch (Exception ignored) {
        }
        
        List<Map<String, Object>> traces = SqliteStorage.getInstance()
                .queryTraceRecords(startTime, endTime, limit);
        
        // 按 linkId 分组，每个 linkId 对应一条完整链路
        Map<String, List<Map<String, Object>>> groupedTraces = new LinkedHashMap<>();
        for (Map<String, Object> trace : traces) {
            String linkId = (String) trace.get("linkId");
            groupedTraces.computeIfAbsent(linkId, k -> new ArrayList<>()).add(trace);
        }
        
        // 返回结果：每条链路的概要信息
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : groupedTraces.entrySet()) {
            String linkId = entry.getKey();
            List<Map<String, Object>> spans = entry.getValue();
            
            if (!spans.isEmpty()) {
                Map<String, Object> summary = new HashMap<>();
                summary.put("linkId", linkId);
                summary.put("spanCount", spans.size());
                summary.put("timestamp", spans.get(0).get("timestamp"));
                result.add(summary);
            }
        }
        
        return result;
    }
    
    /**
     * 获取链路详情（树形结构）
     * 
     * 参数：
     * - linkId: 链路 ID
     */
    private Object getTraceDetail(HttpRequest request) {
        String linkId = request.getParam("linkId");
        if (linkId == null || linkId.isEmpty()) {
            return Collections.emptyMap();
        }
        
        List<Map<String, Object>> traces = SqliteStorage.getInstance()
                .queryTraceByLinkId(linkId);
        
        if (traces.isEmpty()) {
            return Collections.emptyMap();
        }
        
        // 解析 spanData JSON 并构建树形结构
        try {
            List<Span> spans = new ArrayList<>();
            for (Map<String, Object> trace : traces) {
                String spanData = (String) trace.get("spanData");
                if (spanData != null && !spanData.isEmpty()) {
                    Span span = JSON.parseObject(spanData, Span.class);
                    spans.add(span);
                }
            }
            
            // 使用 CustomTreeNode 构建树形结构
            CustomTreeNode treeNode = new CustomTreeNode();
            treeNode.add(spans);
            
            List<Span> treeList = treeNode.transferAll();
            if (!treeList.isEmpty()) {
                return treeList.get(0);
            }
        } catch (Exception e) {
            // 解析失败，返回原始数据
            return traces;
        }
        
        return Collections.emptyMap();
    }
}
