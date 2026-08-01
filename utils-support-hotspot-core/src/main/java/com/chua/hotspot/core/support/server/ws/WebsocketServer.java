package com.chua.hotspot.core.support.server.ws;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.log.LogFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * WebSocket 服务器
 * <p>
 * 轻量级 WebSocket 服务器实现，支持消息推送
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class WebsocketServer {

    /**
     * WebSocket 握手魔术字符串（RFC 6455）
     */
    private static final String WS_MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

    /**
     * JSON 序列化器
     */
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    private final int port;
    private final Set<WebSocketClient> clients = ConcurrentHashMap.newKeySet();
    private final ExecutorService executor = Executors.newCachedThreadPool();
    private final AtomicBoolean running = new AtomicBoolean(false);

    private ServerSocket serverSocket;
    private Thread acceptThread;

    /**
     * 构造函数
     *
     * @param port 端口号
     */
    public WebsocketServer(int port) {
        this.port = port;
    }

    /**
     * 启动服务器
     */
    public void start() {
        if (running.get()) {
            return;
        }

        try {
            serverSocket = new ServerSocket(port);
            running.set(true);

            acceptThread = new Thread(this::acceptConnections, "WebSocket-Accept");
            acceptThread.setDaemon(true);
            acceptThread.start();

            LOGGER.info("WebSocket 服务器启动成功，端口: {}", port);
        } catch (IOException e) {
            LOGGER.error("WebSocket 服务器启动失败: {}", e.getMessage());
        }
    }

    /**
     * 接受连接
     */
    private void acceptConnections() {
        while (running.get()) {
            try {
                Socket socket = serverSocket.accept();
                executor.submit(() -> handleClient(socket));
            } catch (IOException e) {
                if (running.get()) {
                    LOGGER.debug("接受连接异常: {}", e.getMessage());
                }
            }
        }
    }

    /**
     * 处理客户端连接
     *
     * @param socket 客户端 Socket
     */
    private void handleClient(Socket socket) {
        try {
            InputStream in = socket.getInputStream();
            OutputStream out = socket.getOutputStream();

            // 读取握手请求
            byte[] buffer = new byte[4096];
            int len = in.read(buffer);
            if (len <= 0) {
                socket.close();
                return;
            }

            String request = new String(buffer, 0, len, StandardCharsets.UTF_8);

            // 解析 WebSocket Key
            String wsKey = extractWebSocketKey(request);
            if (wsKey == null) {
                socket.close();
                return;
            }

            // 解析 Origin（用于 CORS）
            String origin = extractHeader(request, "origin");
            
            // 解析 Sec-WebSocket-Protocol（如果客户端发送）
            String protocol = extractHeader(request, "sec-websocket-protocol");

            // 发送握手响应
            String acceptKey = generateAcceptKey(wsKey);
            StringBuilder response = new StringBuilder();
            response.append("HTTP/1.1 101 Switching Protocols\r\n");
            response.append("Upgrade: websocket\r\n");
            response.append("Connection: Upgrade\r\n");
            response.append("Sec-WebSocket-Accept: ").append(acceptKey).append("\r\n");
            
            // 添加 CORS 支持
            if (origin != null && !origin.isEmpty()) {
                response.append("Access-Control-Allow-Origin: ").append(origin).append("\r\n");
                response.append("Access-Control-Allow-Credentials: true\r\n");
            }
            
            // 如果客户端请求了子协议，回应第一个
            if (protocol != null && !protocol.isEmpty()) {
                String[] protocols = protocol.split(",");
                if (protocols.length > 0) {
                    response.append("Sec-WebSocket-Protocol: ").append(protocols[0].trim()).append("\r\n");
                }
            }
            
            response.append("\r\n");
            out.write(response.toString().getBytes(StandardCharsets.UTF_8));
            out.flush();

            // 创建客户端对象并添加到集合
            WebSocketClient client = new WebSocketClient(socket, in, out);
            clients.add(client);

            LOGGER.debug("WebSocket 客户端已连接: {}", socket.getRemoteSocketAddress());

            // 处理消息
            handleMessages(client);

        } catch (Exception e) {
            LOGGER.debug("处理客户端异常: {}", e.getMessage());
        }
    }

    /**
     * 处理客户端消息
     *
     * @param client 客户端
     */
    private void handleMessages(WebSocketClient client) {
        try {
            while (running.get() && client.isConnected()) {
                String message = client.readMessage();
                if (message == null) {
                    break;
                }

                // 心跳响应
                if ("ping".equals(message)) {
                    client.sendMessage("pong");
                }
            }
        } catch (Exception e) {
            LOGGER.debug("读取消息异常: {}", e.getMessage());
        } finally {
            clients.remove(client);
            client.close();
            LOGGER.debug("WebSocket 客户端已断开");
        }
    }

    /**
     * 提取 WebSocket Key
     *
     * @param request 请求内容
     * @return WebSocket Key
     */
    private String extractWebSocketKey(String request) {
        return extractHeader(request, "sec-websocket-key");
    }
    
    /**
     * 提取 HTTP 请求头
     *
     * @param request 请求内容
     * @param headerName 头名称（不区分大小写）
     * @return 头值，如果不存在返回 null
     */
    private String extractHeader(String request, String headerName) {
        String lowerHeaderName = headerName.toLowerCase();
        for (String line : request.split("\r\n")) {
            String lowerLine = line.toLowerCase();
            if (lowerLine.startsWith(lowerHeaderName + ":")) {
                return line.substring(headerName.length() + 1).trim();
            }
        }
        return null;
    }

    /**
     * 生成 Accept Key
     *
     * @param wsKey WebSocket Key
     * @return Accept Key
     */
    private String generateAcceptKey(String wsKey) {
        try {
            String combined = wsKey + WS_MAGIC_STRING;
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            byte[] hash = sha1.digest(combined.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-1 算法不可用", e);
        }
    }

    /**
     * 推送消息到所有客户端
     *
     * @param moduleType 模块类型
     * @param event      事件名称
     * @param data       数据
     */
    public void publish(ModuleType moduleType, String event, Object data) {
        if (clients.isEmpty()) {
            return;
        }

        try {
            Map<String, Object> message = new HashMap<>();
            message.put("module", moduleType.name());
            message.put("event", event);
            message.put("data", data);
            message.put("timestamp", System.currentTimeMillis());

            String json = OBJECT_MAPPER.writeValueAsString(message);

            for (WebSocketClient client : clients) {
                try {
                    client.sendMessage(json);
                } catch (Exception e) {
                    LOGGER.debug("推送消息失败: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            LOGGER.debug("序列化消息失败: {}", e.getMessage());
        }
    }

    /**
     * 停止服务器
     */
    public void stop() {
        running.set(false);

        // 关闭所有客户端
        for (WebSocketClient client : clients) {
            client.close();
        }
        clients.clear();

        // 关闭服务器 Socket
        if (serverSocket != null) {
            try {
                serverSocket.close();
            } catch (IOException e) {
                LOGGER.debug("关闭服务器 Socket 异常: {}", e.getMessage());
            }
        }

        // 关闭线程池
        executor.shutdownNow();

        LOGGER.info("WebSocket 服务器已停止");
    }

    /**
     * 获取端口
     *
     * @return 端口号
     */
    public int getPort() {
        return port;
    }

    /**
     * 获取客户端数量
     *
     * @return 客户端数量
     */
    public int getClientCount() {
        return clients.size();
    }
}
