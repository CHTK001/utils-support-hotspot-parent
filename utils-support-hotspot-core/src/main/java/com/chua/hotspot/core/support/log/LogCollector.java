package com.chua.hotspot.core.support.log;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.stream.Collectors;

/**
 * 日志收集器
 * <p>收集应用运行时的日志，支持实时查询</p>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class LogCollector {

    private static final LogCollector INSTANCE = new LogCollector();
    
    /**
     * 日志缓存，使用双端队列保持顺序
     */
    private final ConcurrentLinkedDeque<Map<String, Object>> logQueue = new ConcurrentLinkedDeque<>();
    
    /**
     * 最大缓存日志数量
     */
    private static final int MAX_LOG_SIZE = 10000;

    private LogCollector() {
    }

    public static LogCollector getInstance() {
        return INSTANCE;
    }

    /**
     * 添加日志
     *
     * @param level   日志级别
     * @param logger  日志名称
     * @param message 日志内容
     */
    public void addLog(String level, String logger, String message) {
        Map<String, Object> log = new LinkedHashMap<>();
        log.put("timestamp", System.currentTimeMillis());
        log.put("level", level);
        log.put("logger", logger);
        log.put("message", message);
        log.put("thread", Thread.currentThread().getName());

        logQueue.addLast(log);

        // 超过最大数量时移除最旧的日志
        while (logQueue.size() > MAX_LOG_SIZE) {
            logQueue.pollFirst();
        }
    }

    /**
     * 获取最新的 N 条日志
     *
     * @param limit 数量限制
     * @return 日志列表
     */
    public List<Map<String, Object>> tail(int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        Iterator<Map<String, Object>> iterator = logQueue.descendingIterator();
        while (iterator.hasNext() && result.size() < limit) {
            result.add(iterator.next());
        }
        return result;
    }

    /**
     * 搜索日志
     *
     * @param keyword 关键词
     * @param limit   数量限制
     * @return 匹配的日志列表
     */
    public List<Map<String, Object>> search(String keyword, int limit) {
        String lowerKeyword = keyword.toLowerCase();
        return logQueue.stream()
                .filter(log -> {
                    String message = (String) log.get("message");
                    String logger = (String) log.get("logger");
                    return (message != null && message.toLowerCase().contains(lowerKeyword))
                            || (logger != null && logger.toLowerCase().contains(lowerKeyword));
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * 按日志级别查询
     *
     * @param level 日志级别
     * @param limit 数量限制
     * @return 指定级别的日志列表
     */
    public List<Map<String, Object>> getByLevel(String level, int limit) {
        return logQueue.stream()
                .filter(log -> level.equalsIgnoreCase((String) log.get("level")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * 清空日志缓存
     */
    public void clear() {
        logQueue.clear();
    }

    /**
     * 获取日志缓存大小
     *
     * @return 缓存大小
     */
    public int size() {
        return logQueue.size();
    }
}
