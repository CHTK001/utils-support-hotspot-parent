package com.chua.hotspot.core.support.storage;

import com.chua.hotspot.core.support.log.LogFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 数据持久化调度器
 * 
 * 统一管理所有监控模块的数据持久化任务，定时将内存数据保存到 SQLite
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class DataPersistenceScheduler {
    
    private static final LogFactory logger = LogFactory.getInstance();
    private static final DataPersistenceScheduler INSTANCE = new DataPersistenceScheduler();
    
    // 持久化间隔（秒）
    private static final int PERSIST_INTERVAL_SECONDS = 30;
    
    // 定时任务调度器
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "DataPersistenceScheduler");
        t.setDaemon(true);
        return t;
    });
    
    // 注册的持久化任务
    private final List<PersistenceTask> tasks = new ArrayList<>();
    
    // 是否已启动
    private volatile boolean started = false;
    
    private DataPersistenceScheduler() {
    }
    
    /**
     * 获取单例实例
     */
    public static DataPersistenceScheduler getInstance() {
        return INSTANCE;
    }
    
    /**
     * 注册持久化任务
     * 
     * @param task 持久化任务
     */
    public synchronized void register(PersistenceTask task) {
        if (task != null && !tasks.contains(task)) {
            tasks.add(task);
            logger.debug("注册持久化任务: {}", task.getName());
        }
    }
    
    /**
     * 取消注册持久化任务
     * 
     * @param task 持久化任务
     */
    public synchronized void unregister(PersistenceTask task) {
        tasks.remove(task);
        logger.debug("取消注册持久化任务: {}", task.getName());
    }
    
    /**
     * 启动调度器
     */
    public synchronized void start() {
        if (started) {
            return;
        }
        
        scheduler.scheduleAtFixedRate(this::persistAll, 
            PERSIST_INTERVAL_SECONDS, PERSIST_INTERVAL_SECONDS, TimeUnit.SECONDS);
        
        started = true;
        logger.info("数据持久化调度器已启动，间隔: {}秒", PERSIST_INTERVAL_SECONDS);
    }
    
    /**
     * 停止调度器
     */
    public synchronized void stop() {
        if (!started) {
            return;
        }
        
        // 停止前执行最后一次持久化
        persistAll();
        
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
        
        started = false;
        logger.info("数据持久化调度器已停止");
    }
    
    /**
     * 执行所有持久化任务
     */
    private void persistAll() {
        for (PersistenceTask task : tasks) {
            try {
                task.persist();
            } catch (Exception e) {
                logger.debug("持久化任务 {} 执行失败: {}", task.getName(), e.getMessage());
            }
        }
    }
    
    /**
     * 立即执行所有持久化任务（用于手动触发）
     */
    public void persistNow() {
        persistAll();
    }
    
    /**
     * 持久化任务接口
     */
    public interface PersistenceTask {
        /**
         * 获取任务名称
         */
        String getName();
        
        /**
         * 执行持久化
         */
        void persist();
    }
}
