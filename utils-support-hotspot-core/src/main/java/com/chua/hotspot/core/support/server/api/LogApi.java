package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * 日志 API
 * <p>
 * 提供日志级别查询和修改接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class LogApi implements ApiEndpoint {

    @Override
    public String name() {
        return "log";
    }

    @Override
    public String description() {
        return "日志级别管理";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "list");
        
        if ("set".equals(action)) {
            return setLogLevel(request);
        }
        return getLoggerInfo();
    }

    /**
     * 获取日志信息
     *
     * @return 日志信息
     */
    private Map<String, Object> getLoggerInfo() {
        Map<String, Object> result = new HashMap<>();
        Logger rootLogger = Logger.getLogger("");
        
        result.put("rootLevel", rootLogger.getLevel() != null ? rootLogger.getLevel().getName() : "INFO");
        result.put("availableLevels", new String[]{"SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST"});
        
        return result;
    }

    /**
     * 设置日志级别
     *
     * @param request 请求
     * @return 结果
     */
    private Map<String, Object> setLogLevel(HttpRequest request) {
        String loggerName = request.getParam("logger", "");
        String levelName = request.getParam("level", "INFO");
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            Logger logger = Logger.getLogger(loggerName);
            Level level = Level.parse(levelName.toUpperCase());
            logger.setLevel(level);
            
            result.put("success", true);
            result.put("logger", loggerName.isEmpty() ? "root" : loggerName);
            result.put("level", level.getName());
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }
}
