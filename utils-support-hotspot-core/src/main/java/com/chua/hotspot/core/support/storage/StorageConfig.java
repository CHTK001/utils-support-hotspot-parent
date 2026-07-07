package com.chua.hotspot.core.support.storage;

import com.chua.hotspot.core.support.log.LogFactory;

/**
 * 存储配置管理
 * 
 * 支持通过系统属性或环境变量配置存储行为
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.37
 */
public class StorageConfig {
    
    private static final LogFactory logger = LogFactory.getInstance();
    
    /**
     * 存储模式
     */
    public enum Mode {
        /** 每次启动重置数据库（删除旧数据） */
        RESET,
        /** 持久化模式（保留历史数据） */
        PERSISTENT
    }
    
    private static final StorageConfig INSTANCE = new StorageConfig();
    
    private final Mode mode;
    private final int retentionDays; // 数据保留天数（仅persistent模式）
    private final int batchSize; // 批量写入大小
    private final int flushIntervalSeconds; // 刷新间隔（秒）
    
    private StorageConfig() {
        // 读取存储模式配置
        // 优先级：系统属性 > 环境变量 > 默认值
        String modeStr = System.getProperty("hotspot.storage.mode",
                        System.getenv("HOTSPOT_STORAGE_MODE"));
        
        if ("reset".equalsIgnoreCase(modeStr)) {
            this.mode = Mode.RESET;
        } else {
            this.mode = Mode.PERSISTENT; // 默认持久化
        }
        
        // 数据保留天数（默认7天）
        String retentionStr = System.getProperty("hotspot.storage.retention.days",
                              System.getenv("HOTSPOT_STORAGE_RETENTION_DAYS"));
        this.retentionDays = parseIntOrDefault(retentionStr, 7);
        
        // 批量写入大小（默认1000条）
        String batchSizeStr = System.getProperty("hotspot.storage.batch.size",
                              System.getenv("HOTSPOT_STORAGE_BATCH_SIZE"));
        this.batchSize = parseIntOrDefault(batchSizeStr, 1000);
        
        // 刷新间隔秒数（默认30秒）
        String flushIntervalStr = System.getProperty("hotspot.storage.flush.interval",
                                   System.getenv("HOTSPOT_STORAGE_FLUSH_INTERVAL"));
        this.flushIntervalSeconds = parseIntOrDefault(flushIntervalStr, 30);
        
        logger.info("Storage配置: mode={}, retentionDays={}, batchSize={}, flushInterval={}s",
                    mode, retentionDays, batchSize, flushIntervalSeconds);
    }
    
    public static StorageConfig getInstance() {
        return INSTANCE;
    }
    
    /**
     * 获取存储模式
     */
    public Mode getMode() {
        return mode;
    }
    
    /**
     * 是否重置模式
     */
    public boolean isResetMode() {
        return mode == Mode.RESET;
    }
    
    /**
     * 是否持久化模式
     */
    public boolean isPersistentMode() {
        return mode == Mode.PERSISTENT;
    }
    
    /**
     * 获取数据保留天数
     */
    public int getRetentionDays() {
        return retentionDays;
    }
    
    /**
     * 获取批量写入大小
     */
    public int getBatchSize() {
        return batchSize;
    }
    
    /**
     * 获取刷新间隔（秒）
     */
    public int getFlushIntervalSeconds() {
        return flushIntervalSeconds;
    }
    
    /**
     * 获取数据保留时间戳（用于清理旧数据）
     */
    public long getRetentionTimestamp() {
        return System.currentTimeMillis() - (retentionDays * 24L * 60 * 60 * 1000);
    }
    
    /**
     * 解析整数，失败返回默认值
     */
    private int parseIntOrDefault(String value, int defaultValue) {
        if (value == null || value.trim().isEmpty()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            logger.warn("无法解析整数值: {}, 使用默认值: {}", value, defaultValue);
            return defaultValue;
        }
    }
}
