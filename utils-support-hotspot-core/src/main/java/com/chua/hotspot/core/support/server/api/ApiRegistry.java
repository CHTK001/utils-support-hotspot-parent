package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpHandler;
import com.chua.hotspot.core.support.server.http.HttpServer;
import com.chua.hotspot.core.support.utils.ClassUtils;
import lombok.Getter;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * API 注册中心
 * <p>
 * 管理所有 API 端点的注册和发现
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ApiRegistry {

    private static final ApiRegistry INSTANCE = new ApiRegistry();

    /**
     * 已注册的端点
     */
    @Getter
    private final Map<String, ApiEndpoint> endpoints = new ConcurrentHashMap<>();

    /**
     * 端点类映射
     */
    private final Map<String, Class<? extends ApiEndpoint>> endpointClasses = new ConcurrentHashMap<>();

    private ApiRegistry() {
        // 自动发现并注册内置端点
        registerBuiltinEndpoints();
    }

    /**
     * 获取实例
     *
     * @return ApiRegistry 实例
     */
    public static ApiRegistry getInstance() {
        return INSTANCE;
    }

    /**
     * 注册端点类
     *
     * @param endpointClass 端点类
     */
    public void register(Class<? extends ApiEndpoint> endpointClass) {
        try {
            ApiEndpoint endpoint = endpointClass.newInstance();
            register(endpoint);
            endpointClasses.put(endpoint.name(), endpointClass);
        } catch (Exception e) {
            LogFactory.getInstance().error("注册 API 端点失败: {}", endpointClass.getName(), e);
        }
    }

    /**
     * 注册端点实例
     *
     * @param endpoint 端点实例
     */
    public void register(ApiEndpoint endpoint) {
        String name = endpoint.name();
        endpoints.put(name, endpoint);
        LogFactory.getInstance().debug("注册 API 端点: {}", name);
    }

    /**
     * 获取端点
     *
     * @param name 端点名称
     * @return 端点实例
     */
    public ApiEndpoint get(String name) {
        return endpoints.get(name);
    }

    /**
     * 获取所有端点名称
     *
     * @return 端点名称列表
     */
    public List<String> getEndpointNames() {
        return new ArrayList<>(endpoints.keySet());
    }

    /**
     * 将所有端点注册到 HTTP 服务器
     *
     * @param server HTTP 服务器
     */
    public void bindToServer(HttpServer server) {
        endpoints.forEach((name, endpoint) -> {
            HttpHandler handler = (request, response) -> {
                try {
                    Object result = endpoint.handle(request);
                    response.success(result);
                } catch (Exception e) {
                    LogFactory.getInstance().error("API 端点执行失败: name={}, error={}", name, e.getMessage());
                    response.error("执行失败: " + e.getMessage());
                }
            };
            
            // 注册路由（同时支持带 /agent 前缀和不带前缀）
            server.route("/" + name, handler);
            server.route("/api/" + name, handler);
            server.route("/agent/" + name, handler);
            server.route("/agent/api/" + name, handler);
            LogFactory.getInstance().debug("绑定 API 路由: /{}, /api/{}, /agent/{}, /agent/api/{}", name, name, name, name);
        });

        // 注册端点列表接口
        server.route("/api/endpoints", (request, response) -> {
            List<Map<String, String>> list = new ArrayList<>();
            endpoints.forEach((name, endpoint) -> {
                Map<String, String> item = new HashMap<>();
                item.put("name", name);
                item.put("description", endpoint.description());
                item.put("path", "/agent/api/" + name);
                list.add(item);
            });
            response.success(list);
        });
        server.route("/agent/api/endpoints", (request, response) -> {
            List<Map<String, String>> list = new ArrayList<>();
            endpoints.forEach((name, endpoint) -> {
                Map<String, String> item = new HashMap<>();
                item.put("name", name);
                item.put("description", endpoint.description());
                item.put("path", "/agent/api/" + name);
                list.add(item);
            });
            response.success(list);
        });

        // 注册静态资源处理器
        StaticResourceHandler staticHandler = new StaticResourceHandler();
        
        // 注册主页面路由
        server.route("/", (request, response) -> staticHandler.handle(request, response));
        server.route("/index.html", (request, response) -> staticHandler.handle(request, response));
        
        // 注册静态资源路由（CSS、JS、图片等）
        server.route("/static", (request, response) -> staticHandler.handle(request, response));
        server.route("/assets", (request, response) -> staticHandler.handle(request, response));
        server.route("/favicon.ico", (request, response) -> staticHandler.handle(request, response));
        server.route("/logo.svg", (request, response) -> staticHandler.handle(request, response));
        server.route("/vite.svg", (request, response) -> staticHandler.handle(request, response));
        server.route("/platform-config.json", (request, response) -> staticHandler.handle(request, response));
        
        LogFactory.getInstance().info("静态资源路由已注册");
    }

    /**
     * 注册内置端点
     */
    private void registerBuiltinEndpoints() {
        // 通过 SPI 或手动注册内置端点
        Set<Class<? extends ApiEndpoint>> builtinClasses = new HashSet<>(Arrays.asList(
                ThreadApi.class,
                TraceApi.class,
                LogApi.class,
                ProcessApi.class,
                ServerDataApi.class,
                HandleApi.class,
                ObjectApi.class,
                CfrApi.class
        ));

        registerOther(builtinClasses);
        for (Class<? extends ApiEndpoint> clazz : builtinClasses) {
            try {
                register(clazz);
            } catch (Exception e) {
                LogFactory.getInstance().warn("注册内置端点失败: {}", clazz.getSimpleName());
            }
        }
    }

    private void registerOther(Set<Class<? extends ApiEndpoint>> builtinClasses) {
        List<Class<?>> classes = ClassUtils.getClasses("com.chua.hotspot.core.support.server.api");
        for (Class<?> clazz : classes) {
            if (ApiEndpoint.class.isAssignableFrom(clazz) && !clazz.isInterface()) {
                builtinClasses.add((Class<? extends ApiEndpoint>) clazz);
            }
        }
       classes = ClassUtils.getClasses("com.chua.hotspot.spring.support.server.api");
        for (Class<?> clazz : classes) {
            if (ApiEndpoint.class.isAssignableFrom(clazz)&& !clazz.isInterface()) {
                builtinClasses.add((Class<? extends ApiEndpoint>) clazz);
            }
        }
        // 扫描 profiler 模块 API
        try {
            classes = ClassUtils.getClasses("com.chua.hotspot.profiler.support");
            for (Class<?> clazz : classes) {
                if (ApiEndpoint.class.isAssignableFrom(clazz) && !clazz.isInterface()) {
                    builtinClasses.add((Class<? extends ApiEndpoint>) clazz);
                }
            }
        } catch (Throwable ignore) {
            // profiler 模块可能不存在于 classpath，忽略
        }
        // 扫描 JFR 模块 API
        try {
            classes = ClassUtils.getClasses("com.chua.hotspot.jfr.support.api");
            for (Class<?> clazz : classes) {
                if (ApiEndpoint.class.isAssignableFrom(clazz) && !clazz.isInterface()) {
                    builtinClasses.add((Class<? extends ApiEndpoint>) clazz);
                }
            }
        } catch (Throwable ignore) {
            // JFR 模块可能不存在于 classpath，忽略
        }
    }
}
