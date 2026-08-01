package com.chua.hotspot.core.support.server.http;

import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.Server;
import com.chua.hotspot.core.support.utils.StringUtils;
import lombok.Getter;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * HTTP 服务器
 * <p>
 * 基于 {@link com.sun.net.httpserver.HttpServer} 的轻量级 HTTP 服务器封装，
 * 支持路由注册、请求处理、CORS 等功能
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
@Getter
public class HttpServer implements Server {

    /**
     * 默认上下文路径
     */
    public static final String DEFAULT_CONTEXT = "/agent";

    /**
     * 默认队列大小
     */
    private static final int DEFAULT_BACKLOG = 100;

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 主机地址
     */
    private final String host;

    /**
     * 端口
     */
    private final int port;

    /**
     * 路由表
     */
    private final Map<String, HttpHandler> routes = new ConcurrentHashMap<>();

    /**
     * 内部 HTTP 服务器
     */
    private com.sun.net.httpserver.HttpServer server;

    /**
     * 是否已启动
     */
    private boolean running = false;

    /**
     * 是否启用认证
     */
    private boolean authEnabled = false;

    /**
     * 认证用户名
     */
    private String authUsername;

    /**
     * 认证密码
     */
    private String authPassword;

    /**
     * 构造函数
     *
     * @param host 主机地址
     * @param port 端口
     */
    public HttpServer(String host, int port) {
        this.host = host;
        this.port = port;
        initAuth();
    }

    /**
     * 初始化认证配置
     */
    private void initAuth() {
        EnvironmentFactory env = EnvironmentFactory.getInstance();
        String enabled = env.getString("protocol.http.auth.enabled", "false");
        this.authEnabled = !"false".equalsIgnoreCase(enabled);
        
        if (this.authEnabled) {
            this.authUsername = env.getString("protocol.http.auth.username", "admin");
            this.authPassword = env.getString("protocol.http.auth.password", "admin");
            LOGGER.info("HTTP Basic Auth 已启用，用户名: {}", authUsername);
        }
    }

    /**
     * 注册路由
     *
     * @param path    路径
     * @param handler 处理器
     * @return this
     */
    public HttpServer route(String path, HttpHandler handler) {
        routes.put(normalizePath(path), handler);
        return this;
    }

    /**
     * 注册 GET 路由
     *
     * @param path    路径
     * @param handler 处理器
     * @return this
     */
    public HttpServer get(String path, HttpHandler handler) {
        return route(path, (req, res) -> {
            if ("GET".equalsIgnoreCase(req.getMethod())) {
                handler.handle(req, res);
            } else {
                res.error(405, "方法不允许");
            }
        });
    }

    /**
     * 注册 POST 路由
     *
     * @param path    路径
     * @param handler 处理器
     * @return this
     */
    public HttpServer post(String path, HttpHandler handler) {
        return route(path, (req, res) -> {
            if ("POST".equalsIgnoreCase(req.getMethod())) {
                handler.handle(req, res);
            } else {
                res.error(405, "方法不允许");
            }
        });
    }

    @Override
    public void start() {
        if (running) {
            LOGGER.warn("HTTP 服务器已在运行中");
            return;
        }

        try {
            server = com.sun.net.httpserver.HttpServer.create(
                    new InetSocketAddress(host, port), DEFAULT_BACKLOG);
            
            // 使用线程池执行器
            server.setExecutor(new ThreadPoolExecutor(
                    4, 32, 60L, TimeUnit.SECONDS,
                    new LinkedBlockingQueue<>(100),
                    r -> {
                        Thread t = new Thread(r, "agent-http-" + System.currentTimeMillis());
                        t.setDaemon(true);
                        return t;
                    }
            ));

            // 注册根上下文处理所有请求
            server.createContext("/", exchange -> {
                HttpRequest request = new HttpRequest(exchange);
                HttpResponse response = new HttpResponse(exchange);

                // 处理 OPTIONS 请求（CORS 预检）
                if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                    response.options();
                    return;
                }

                // Basic Auth 认证
                if (authEnabled && !checkAuth(request, response)) {
                    return;
                }

                // 查找路由
                String path = request.getPath();
                HttpHandler handler = findHandler(path);

                if (handler != null) {
                    try {
                        handler.handle(request, response);
                    } catch (Exception e) {
                        LOGGER.error("处理请求失败: path={}, error={}", path, e.getMessage());
                        response.error("服务器内部错误: " + e.getMessage());
                    }
                } else {
                    response.notFound();
                }
            });

            server.start();
            running = true;
            LOGGER.info("HTTP 服务器启动成功: {}:{}", host, port);
        } catch (IOException e) {
            LOGGER.error("HTTP 服务器启动失败: {}", e.getMessage());
            throw new RuntimeException("HTTP 服务器启动失败", e);
        }
    }

    @Override
    public void stop() {
        if (!running || server == null) {
            return;
        }

        server.stop(0);
        running = false;
        LOGGER.info("HTTP 服务器已停止");
    }

    /**
     * 查找处理器
     *
     * @param path 请求路径
     * @return 处理器
     */
    private HttpHandler findHandler(String path) {
        String normalizedPath = StringUtils.defaultString(path, "/");
        
        // 去掉上下文路径
        if (normalizedPath.startsWith(DEFAULT_CONTEXT)) {
            normalizedPath = normalizedPath.substring(DEFAULT_CONTEXT.length());
            if (normalizedPath.isEmpty()) {
                normalizedPath = "/";
            }
        }
        
        // 精确匹配
        HttpHandler handler = routes.get(normalizedPath);
        if (handler != null) {
            return handler;
        }

        // 前缀匹配（用于静态资源）
        for (Map.Entry<String, HttpHandler> entry : routes.entrySet()) {
            String routePath = entry.getKey();
            // 检查是否是静态资源前缀
            if (isStaticResourcePrefix(routePath) && normalizedPath.startsWith(routePath)) {
                return entry.getValue();
            }
        }

        // 去掉开头的 / 后匹配
        if (normalizedPath.startsWith("/")) {
            handler = routes.get(normalizedPath.substring(1));
            if (handler != null) {
                return handler;
            }
        }

        return handler;
    }

    /**
     * 判断是否为静态资源前缀
     *
     * @param path 路径
     * @return 是否为静态资源前缀
     */
    private boolean isStaticResourcePrefix(String path) {
        return "/static".equals(path) || "/assets".equals(path) 
                || "/static/".equals(path) || "/assets/".equals(path);
    }

    /**
     * 规范化路径
     *
     * @param path 路径
     * @return 规范化后的路径
     */
    private String normalizePath(String path) {
        if (path == null || path.isEmpty()) {
            return "/";
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return path;
    }

    /**
     * 检查 Basic Auth 认证
     *
     * @param request  请求
     * @param response 响应
     * @return 是否认证通过
     */
    private boolean checkAuth(HttpRequest request, HttpResponse response) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            sendUnauthorized(response);
            return false;
        }

        try {
            String base64Credentials = authHeader.substring(6);
            String credentials = new String(Base64.getDecoder().decode(base64Credentials), StandardCharsets.UTF_8);
            String[] parts = credentials.split(":", 2);
            
            if (parts.length == 2 && authUsername.equals(parts[0]) && authPassword.equals(parts[1])) {
                return true;
            }
        } catch (Exception e) {
            LOGGER.debug("解析认证头失败: {}", e.getMessage());
        }

        sendUnauthorized(response);
        return false;
    }

    /**
     * 发送 401 未授权响应
     *
     * @param response 响应
     */
    private void sendUnauthorized(HttpResponse response) {
        response.setHeader("WWW-Authenticate", "Basic realm=\"Agent API\"");
        response.setStatus(401);
        response.text("请输入用户名和密码");
    }

    /**
     * 设置认证信息
     *
     * @param enabled  是否启用
     * @param username 用户名
     * @param password 密码
     */
    public void setAuth(boolean enabled, String username, String password) {
        this.authEnabled = enabled;
        this.authUsername = username;
        this.authPassword = password;
    }
}
