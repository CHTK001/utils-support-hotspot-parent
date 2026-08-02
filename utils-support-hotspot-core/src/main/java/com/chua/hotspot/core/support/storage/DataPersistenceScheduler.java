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
    
    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 单例实例
     */
    private static final DataPersistenceScheduler INSTANCE = new DataPersistenceScheduler();

    /**
     * 持久化任务初始延迟（秒）
     */
    private static final int PERSIST_INITIAL_DELAY_SECONDS = 30;

    /**
     * 持久化任务执行间隔（秒）
     */
    private static final int PERSIST_INTERVAL_SECONDS = 30;

    /**
     * 调度器关闭等待超时（秒）
     */
    private static final int SHUTDOWN_TIMEOUT_SECONDS = 5;

    /**
     * 定时任务调度器（单线程、守护线程）
     */
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "DataPersistenceScheduler");
        t.setDaemon(true);
        return t;
    });

    /**
     * 已注册的持久化任务列表
     */
    private final List<PersistenceTask> tasks = new ArrayList<>();

    /**
     * 调度器是否已启动（volatile 保证多线程可见性）
     */
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
            LOGGER.debug("注册持久化任务: {}", task.getName());
        }
    }

    /**
     * 取消注册持久化任务
     *
     * @param task 持久化任务
     */
    public synchronized void unregister(PersistenceTask task) {
        tasks.remove(task);
        LOGGER.debug("取消注册持久化任务: {}", task.getName());
    }
    
    /**
     * 启动调度器
     */
    public synchronized void start() {
        if (started) {
            return;
        }
        
        scheduler.scheduleAtFixedRate(this::persistAll,
                PERSIST_INITIAL_DELAY_SECONDS, PERSIST_INTERVAL_SECONDS, TimeUnit.SECONDS);

        started = true;
        LOGGER.info("数据持久化调度器已启动，间隔: {}秒", PERSIST_INTERVAL_SECONDS);
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
            if (!scheduler.awaitTermination(SHUTDOWN_TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }

        started = false;
        LOGGER.info("数据持久化调度器已停止");
    }
    
    /**
     * 执行所有持久化任务
     */
    private void persistAll() {
        for (PersistenceTask task : tasks) {
            try {
                task.persist();
            } catch (Exception e) {
                LOGGER.debug("持久化任务 {} 执行失败: {}", task.getName(), e.getMessage());
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
