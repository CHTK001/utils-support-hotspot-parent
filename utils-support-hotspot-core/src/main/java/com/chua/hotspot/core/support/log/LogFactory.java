package com.chua.hotspot.core.support.log;

/**
 * 日志工厂
 * 简单的日志实现，用于 Agent 环境
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class LogFactory {

    private static final LogFactory INSTANCE = new LogFactory();
    private static final String LOG_LEVEL = System.getProperty("hotspot.log.level", "INFO");
    private static final boolean CONSOLE_ENABLED = Boolean.parseBoolean(System.getProperty("hotspot.log.console", "true"));

    private LogFactory() {
    }

    /**
     * 获取实例
     *
     * @return LogFactory 实例
     */
    public static LogFactory getInstance() {
        return INSTANCE;
    }

    /**
     * 初始化日志
     */
    public void init() {
    }

    /**
     * 输出 INFO 级别日志
     *
     * @param message 日志消息
     * @param args 参数
     */
    public void info(String message, Object... args) {
        if (shouldLog("INFO")) {
            log("INFO", message, args);
        }
    }

    /**
     * 输出 TRACE 级别日志
     *
     * @param message 日志消息
     * @param args 参数
     */
    public void trace(String message, Object... args) {
        if (shouldLog("TRACE")) {
            log("TRACE", message, args);
        }
    }

    /**
     * 输出 DEBUG 级别日志
     *
     * @param message 日志消息
     * @param args 参数
     */
    public void debug(String message, Object... args) {
        if (shouldLog("DEBUG")) {
            log("DEBUG", message, args);
        }
    }

    /**
     * 输出 WARN 级别日志
     *
     * @param message 日志消息
     * @param args 参数
     */
    public void warn(String message, Object... args) {
        if (shouldLog("WARN")) {
            log("WARN", message, args);
        }
    }

    /**
     * 输出 ERROR 级别日志
     *
     * @param message 日志消息
     * @param args 参数
     */
    public void error(String message, Object... args) {
        if (shouldLog("ERROR")) {
            log("ERROR", message, args);
        }
    }

    /**
     * 判断是否应该输出日志
     *
     * @param level 日志级别
     * @return 是否输出
     */
    private boolean shouldLog(String level) {
        if (!CONSOLE_ENABLED) {
            return false;
        }

        int currentLevel = getLevelValue(LOG_LEVEL);
        int targetLevel = getLevelValue(level);
        return targetLevel >= currentLevel;
    }

    /**
     * 获取日志级别数值
     *
     * @param level 日志级别
     * @return 数值
     */
    private int getLevelValue(String level) {
        switch (level.toUpperCase()) {
            case "TRACE":
                return 0;
            case "DEBUG":
                return 1;
            case "INFO":
                return 2;
            case "WARN":
                return 3;
            case "ERROR":
                return 4;
            default:
                return 2;
        }
    }

    /**
     * 输出日志
     *
     * @param level 日志级别
     * @param message 日志消息
     * @param args 参数
     */
    private void log(String level, String message, Object... args) {
        String formattedMessage = formatMessage(message, args);
        String timestamp = java.time.LocalDateTime.now().toString();
        System.out.println(String.format("[%s] [%s] %s", timestamp, level, formattedMessage));
        
        // 如果最后一个参数是 Throwable，打印堆栈
        if (args != null && args.length > 0 && args[args.length - 1] instanceof Throwable) {
            ((Throwable) args[args.length - 1]).printStackTrace();
        }
    }

    /**
     * 格式化消息
     *
     * @param message 消息模板
     * @param args 参数
     * @return 格式化后的消息
     */
    private String formatMessage(String message, Object... args) {
        if (args == null || args.length == 0) {
            return message;
        }

        String result = message;
        int argIndex = 0;
        
        for (Object arg : args) {
            // 跳过最后一个 Throwable 参数
            if (argIndex == args.length - 1 && arg instanceof Throwable) {
                break;
            }
            
            String placeholder = "{}";
            int index = result.indexOf(placeholder);
            if (index != -1) {
                String argStr = arg == null ? "null" : arg.toString();
                result = result.substring(0, index) + argStr + result.substring(index + placeholder.length());
            }
            argIndex++;
        }
        
        return result;
    }
}
