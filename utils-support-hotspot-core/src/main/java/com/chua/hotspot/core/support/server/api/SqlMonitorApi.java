package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * SQL 监控 API 端点
 * <p>
 * 提供 SQL 实时监控接口，不存储到数据库，仅保留最近的 SQL 记录
 * </p>
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class SqlMonitorApi implements ApiEndpoint {
    
    /**
     * SQL 记录队列（最多保留 1000 条）
     */
    private static final ConcurrentLinkedQueue<Map<String, Object>> sqlQueue = new ConcurrentLinkedQueue<>();
    private static final int MAX_SQL_RECORDS = 1000;
    
    @Override
    public String name() {
        return "sql_monitor";
    }
    
    @Override
    public String description() {
        return "SQL 实时监控接口";
    }
    
    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "query");
        
        switch (action) {
            case "query":
                return querySqlRecords(request);
            case "clear":
                return clearSqlRecords();
            case "stats":
                return getSqlStats();
            default:
                return error("未知的操作: " + action);
        }
    }
    
    /**
     * 查询 SQL 记录
     */
    private Object querySqlRecords(HttpRequest request) {
        int limit = request.getIntParam("limit", 100);
        String keyword = request.getParam("keyword");
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        // 从队列中获取记录
        Iterator<Map<String, Object>> iterator = sqlQueue.iterator();
        while (iterator.hasNext() && result.size() < limit) {
            Map<String, Object> record = iterator.next();
            
            // 关键字过滤
            if (keyword != null && !keyword.isEmpty()) {
                String sql = (String) record.get("sql");
                if (sql == null || !sql.toLowerCase().contains(keyword.toLowerCase())) {
                    continue;
                }
            }
            
            result.add(record);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("total", sqlQueue.size());
        response.put("limit", limit);
        response.put("keyword", keyword);
        response.put("data", result);
        
        return response;
    }
    
    /**
     * 清空 SQL 记录
     */
    private Object clearSqlRecords() {
        int size = sqlQueue.size();
        sqlQueue.clear();
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("cleared", size);
        
        return result;
    }
    
    /**
     * 获取 SQL 统计信息
     */
    private Object getSqlStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRecords", sqlQueue.size());
        stats.put("maxRecords", MAX_SQL_RECORDS);
        stats.put("timestamp", System.currentTimeMillis());
        
        // 统计 SQL 类型分布
        Map<String, Integer> typeCount = new HashMap<>();
        for (Map<String, Object> record : sqlQueue) {
            String sql = (String) record.get("sql");
            if (sql != null) {
                String type = detectSqlType(sql);
                typeCount.put(type, typeCount.getOrDefault(type, 0) + 1);
            }
        }
        stats.put("typeDistribution", typeCount);
        
        return stats;
    }
    
    /**
     * 检测 SQL 类型
     */
    private static String detectSqlType(String sql) {
        String upperSql = sql.trim().toUpperCase();
        if (upperSql.startsWith("SELECT")) {
            return "SELECT";
        } else if (upperSql.startsWith("INSERT")) {
            return "INSERT";
        } else if (upperSql.startsWith("UPDATE")) {
            return "UPDATE";
        } else if (upperSql.startsWith("DELETE")) {
            return "DELETE";
        } else {
            return "OTHER";
        }
    }
    
    /**
     * 添加 SQL 记录
     * 
     * @param sql SQL 语句
     * @param duration 执行时长（毫秒）
     * @param error 错误信息（如果有）
     */
    public static void addSqlRecord(String sql, long duration, String error) {
        addSqlRecord(sql, duration, error, null, null);
    }
    
    /**
     * 添加 SQL 记录（带数据库信息）
     * 
     * @param sql SQL 语句
     * @param duration 执行时长（毫秒）
     * @param error 错误信息（如果有）
     * @param address 数据库地址
     * @param database 数据库名
     */
    public static void addSqlRecord(String sql, long duration, String error, String address, String database) {
        Map<String, Object> record = new HashMap<>();
        record.put("sql", sql);
        record.put("duration", duration);
        record.put("timestamp", System.currentTimeMillis());
        record.put("thread", Thread.currentThread().getName());
        
        if (error != null) {
            record.put("error", error);
        }
        if (address != null) {
            record.put("address", address);
        }
        if (database != null) {
            record.put("database", database);
        }
        
        // 检测 SQL 类型
        record.put("type", detectSqlType(sql));
        
        sqlQueue.offer(record);
        
        // 保持队列大小
        while (sqlQueue.size() > MAX_SQL_RECORDS) {
            sqlQueue.poll();
        }
        
        // 实时推送到 WebSocket
        ReportFactory.report(ModuleType.SQL, "SQL_RECORD", record);
    }
    
    /**
     * 返回错误信息
     */
    private Object error(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}
