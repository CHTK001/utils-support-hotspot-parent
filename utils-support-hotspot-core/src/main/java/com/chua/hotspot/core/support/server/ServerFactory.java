package com.chua.hotspot.core.support.server;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.perf.HttpPerformanceRecorder;
import com.chua.hotspot.core.support.pusher.DataPusher;
import com.chua.hotspot.core.support.server.api.ApiRegistry;
import com.chua.hotspot.core.support.server.http.HttpServer;
import com.chua.hotspot.core.support.server.ws.WebSocketServer;
import com.chua.hotspot.core.support.storage.DataPersistenceScheduler;
import com.chua.hotspot.core.support.storage.SqliteStorage;

/**
 * 服务器工厂
 * <p>
 * 负责 HTTP 和 WebSocket 服务器的初始化、启动和关闭
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ServerFactory {

    private static final ServerFactory INSTANCE = new ServerFactory();

    /**
     * 环境配置
     */
    private final EnvironmentFactory environmentFactory = EnvironmentFactory.getInstance();

    /**
     * HTTP 服务器
     */
    private HttpServer httpServer;

    /**
     * WebSocket 服务器
     */
    private WebSocketServer webSocketServer;

    /**
     * 是否已初始化
     */
    private boolean initialized = false;

    private ServerFactory() {
    }

    /**
     * 获取实例
     *
     * @return ServerFactory 实例
     */
    public static ServerFactory getInstance() {
        return INSTANCE;
    }

    /**
     * 初始化并启动服务器
     */
    public synchronized void init() {
        if (initialized) {
            LogFactory.getInstance().warn("服务器已初始化，跳过重复初始化");
            return;
        }

        // 读取配置
        String host = environmentFactory.getString("protocol.http.host", "0.0.0.0");
        String httpPortStr = environmentFactory.getString("protocol.http.port", "18954");
        int httpPort = Integer.parseInt(httpPortStr);
        
        // WebSocket 端口默认为 HTTP 端口 + 10000
        String wsPortStr = environmentFactory.getString("protocol.websocket.port", String.valueOf(httpPort + 10000));
        int wsPort = Integer.parseInt(wsPortStr);

        LogFactory.getInstance().info("=============================");
        LogFactory.getInstance().info("        Agent 服务器          ");
        LogFactory.getInstance().info("=============================");
        
        // 初始化 SQLite 存储
        SqliteStorage.getInstance();
        
        // 初始化 HTTP 性能记录器（加载历史数据）
        HttpPerformanceRecorder.getInstance().initialize();
        
        // 启动数据持久化调度器
        DataPersistenceScheduler.getInstance().start();
        
        // 启动统一数据推送器（JVM/System/QPS 等）
        DataPusher.getInstance().start();

        // 创建并启动 HTTP 服务器
        httpServer = new HttpServer(host, httpPort);
        ApiRegistry.getInstance().bindToServer(httpServer);
        httpServer.start();
        LogFactory.getInstance().info("HTTP 服务器启动成功: {}:{}", host, httpPort);

        // 创建并启动 WebSocket 服务器
        webSocketServer = new WebSocketServer(wsPort);
        webSocketServer.start();
        LogFactory.getInstance().info("WebSocket 服务器启动成功: {}:{}", host, wsPort);

        // 注册关闭钩子
        registerShutdownHook();

        initialized = true;
    }

    /**
     * 注册关闭钩子
     */
    private void registerShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            LogFactory.getInstance().info("正在关闭 Agent 服务器...");
            stop();
            LogFactory.getInstance().info("Agent 服务器已关闭");
        }));
    }

    /**
     * 停止服务器
     */
    public synchronized void stop() {
        // 停止统一数据推送器
        DataPusher.getInstance().stop();
        
        // 停止数据持久化调度器
        DataPersistenceScheduler.getInstance().stop();
        
        // 关闭 SQLite 连接
        SqliteStorage.getInstance().close();
        
        if (httpServer != null) {
            httpServer.stop();
            httpServer = null;
        }
        if (webSocketServer != null) {
            webSocketServer.stop();
            webSocketServer = null;
        }
        initialized = false;
    }

    /**
     * 通过 WebSocket 推送消息
     *
     * @param moduleType 模块类型
     * @param event      事件名称
     * @param data       数据
     */
    public void publish(ModuleType moduleType, String event, Object data) {
        if (webSocketServer != null) {
            webSocketServer.publish(moduleType, event, data);
        }
    }

    /**
     * 获取 WebSocket 服务器
     *
     * @return WebSocket 服务器
     */
    public WebSocketServer getWebSocketServer() {
        return webSocketServer;
    }

    /**
     * 获取 WebSocket 端口
     *
     * @return WebSocket 端口
     */
    public int getWebSocketPort() {
        return webSocketServer != null ? webSocketServer.getPort() : 0;
    }

    /**
     * 获取 HTTP 服务器
     *
     * @return HTTP 服务器
     */
    public HttpServer getHttpServer() {
        return httpServer;
    }

    /**
     * 是否已初始化
     *
     * @return 是否已初始化
     */
    public boolean isInitialized() {
        return initialized;
    }
}
