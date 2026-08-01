package com.chua.hotspot.core.support.config;

import com.chua.hotspot.core.support.log.LogFactory;

import java.io.File;
import java.nio.file.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 配置文件监视器
 * <p>
 * 基于 WatchService 监视配置文件变更，触发 DynamicConfig 热加载。
 * 当配置文件被修改时，自动重新加载配置并通知所有监听器。
 * </p>
 * <p>
 * 使用方式：
 * <pre>
 *   ConfigWatcher watcher = new ConfigWatcher("/path/to/config.json");
 *   watcher.start();  // 启动监视
 *   watcher.stop();   // 停止监视
 * </pre>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class ConfigWatcher {

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /** 被监视的配置文件 */
    private final String configFilePath;

    /** 监视线程运行标志 */
    private final AtomicBoolean running = new AtomicBoolean(false);

    /** 监视服务 */
    /** 监视服务 */
    private WatchService watchService;

    /** 执行线程池 */
    private ExecutorService executor;

    /** 轮询间隔（毫秒），当 WatchService 不可用时的降级方案 */
    private long pollingIntervalMs;

    /** 是否使用轮询模式（WatchService 不可用时降级） */
    private boolean pollingMode;

    /**
     * 创建配置监视器
     *
     * @param configFilePath 配置文件路径
     */
    public ConfigWatcher(String configFilePath) {
        this(configFilePath, 5000);
    }

    /**
     * 创建配置监视器
     *
     * @param configFilePath     配置文件路径
     * @param pollingIntervalMs  轮询间隔（毫秒），WatchService 不可用时使用
     */
    public ConfigWatcher(String configFilePath, long pollingIntervalMs) {
        this.configFilePath = configFilePath;
        this.pollingIntervalMs = pollingIntervalMs;
    }

    /**
     * 启动配置监视
     */
    public void start() {
        if (!running.compareAndSet(false, true)) {
            LOGGER.warn("ConfigWatcher 已在运行中");
            return;
        }

        // 先设置配置文件路径
        DynamicConfig.getInstance().setConfigFile(configFilePath);

        // 尝试使用 WatchService
        if (tryStartWatchService()) {
            pollingMode = false;
            LOGGER.info("ConfigWatcher 启动成功（WatchService 模式）: {}", configFilePath);
        } else {
            // 降级为轮询模式
            pollingMode = true;
            startPolling();
            LOGGER.info("ConfigWatcher 启动成功（轮询模式, 间隔 {}ms）: {}", pollingIntervalMs, configFilePath);
        }
    }

    /**
     * 尝试使用 WatchService 监视
     */
    private boolean tryStartWatchService() {
        try {
            File file = new File(configFilePath);
            if (!file.exists()) {
                LOGGER.warn("配置文件不存在，将使用轮询模式: {}", configFilePath);
                return false;
            }

            Path dirPath = file.getParentFile().toPath();
            watchService = FileSystems.getDefault().newWatchService();
            dirPath.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);

            executor = Executors.newSingleThreadExecutor(r -> {
                Thread t = new Thread(r, "hotspot-config-watcher");
                t.setDaemon(true);
                return t;
            });

            executor.submit(() -> {
                while (running.get()) {
                    try {
                        WatchKey key = watchService.poll(1, TimeUnit.SECONDS);
                        if (key == null) continue;

                        for (WatchEvent<?> event : key.pollEvents()) {
                            WatchEvent.Kind<?> kind = event.kind();
                            if (kind == StandardWatchEventKinds.OVERFLOW) continue;

                            Path changedFile = (Path) event.context();
                            if (file.getName().equals(changedFile.toString())) {
                                // 防止重复触发（编辑器保存可能触发多次事件）
                                Thread.sleep(100);
                                DynamicConfig.getInstance().reloadFromFile();
                            }
                        }
                        key.reset();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    } catch (Exception e) {
                        LOGGER.warn("ConfigWatcher 事件处理异常", e);
                    }
                }
            });

            return true;
        } catch (Exception e) {
            LOGGER.warn("WatchService 不可用，降级为轮询模式", e);
            return false;
        }
    }

    /**
     * 启动轮询模式
     */
    private void startPolling() {
        executor = Executors.newSingleThreadExecutor(r -> {
            Thread t = new Thread(r, "hotspot-config-poller");
            t.setDaemon(true);
            return t;
        });

        executor.submit(() -> {
            while (running.get()) {
                try {
                    Thread.sleep(pollingIntervalMs);
                    DynamicConfig.getInstance().checkAndReload();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                } catch (Exception e) {
                    LOGGER.warn("ConfigWatcher 轮询异常", e);
                }
            }
        });
    }

    /**
     * 停止配置监视
     */
    public void stop() {
        if (!running.compareAndSet(true, false)) {
            return;
        }

        try {
            if (watchService != null) {
                watchService.close();
            }
        } catch (Exception e) {
            LOGGER.warn("关闭 WatchService 异常", e);
        }

        if (executor != null) {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(3, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
            }
        }

        LOGGER.info("ConfigWatcher 已停止");
    }

    /**
     * 是否正在运行
     */
    public boolean isRunning() {
        return running.get();
    }

    /**
     * 是否为轮询模式
     */
    public boolean isPollingMode() {
        return pollingMode;
    }
}