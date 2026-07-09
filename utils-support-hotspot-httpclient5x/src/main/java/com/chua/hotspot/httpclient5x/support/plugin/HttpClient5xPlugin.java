package com.chua.hotspot.httpclient5x.support.plugin;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.utils.NetAddress;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * HttpClient 5.x 插件
 * 继承自 HttpClient 4.x，覆写 5.x 特有的 API 处理
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class HttpClient5xPlugin extends com.chua.hotspot.httpclient4x.support.plugin.HttpClient4xPlugin {

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        BytebuddyPlugin.interceptEnter();
        try {
            captureRequest(objects);
            return callable.call();
        } catch (Exception e) {
            BytebuddyPlugin.interceptError();
            throw e;
        } finally {
            BytebuddyPlugin.interceptExit();
        }
    }

    /**
     * 捕获 HTTP 请求信息
     *
     * @param objects 方法参数
     */
    private static void captureRequest(Object[] objects) {
        try {
            if (objects == null || objects.length == 0) {
                return;
            }

            // 获取请求信息
            Object request = objects[0];
            String requestUri = extractRequestUri(request);
            
            if (requestUri == null || requestUri.isEmpty()) {
                return;
            }

            // 解析地址
            NetAddress netAddress = NetAddress.of(requestUri);
            
            ServiceInstance ss = new ServiceInstance();
            ss.setName("HTTPCLIENT5X");
            ss.setSourceName("HOST");
            ss.setSourceHost(ReportFactory.APP_HOST);
            ss.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            ss.setTargetHost(netAddress.getHost());
            ss.setTargetPort(netAddress.getPort());
            
            ReportFactory.sendServiceInstance(ss);
            System.out.println("[INFO] 检测到 HttpClient 5.x 请求: " + requestUri);
        } catch (Exception e) {
            System.err.println("[DEBUG] HttpClient 5.x 请求检测失败: " + e.getMessage());
        }
    }

    /**
     * 从请求对象中提取 URI
     *
     * @param request 请求对象
     * @return URI 字符串
     */
    private static String extractRequestUri(Object request) {
        try {
            // 尝试获取 URI 属性
            if (request != null) {
                String requestStr = request.toString();
                if (requestStr.contains("http")) {
                    return requestStr;
                }
                
                // 尝试反射获取 URI
                try {
                    Object uri = request.getClass().getMethod("getUri").invoke(request);
                    if (uri != null) {
                        return uri.toString();
                    }
                } catch (Exception ignored) {
                }
            }
        } catch (Exception e) {
            System.err.println("[DEBUG] 提取 HttpClient 5.x 请求 URI 失败: " + e.getMessage());
        }
        
        return null;
    }

    // ==================== 覆写插件配置 ====================
    
    @Override
    public String name() {
        return "HttpClient5x";
    }
    
    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(
            DynamicType.Builder<?> builder) {
        // HttpClient 5.x 使用 execute 方法
        return builder.method(ElementMatchers.named("execute"))
                .intercept(MethodDelegation.to(HttpClient5xPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        // HttpClient 5.x 包名变为 org.apache.hc.client5
        return ElementMatchers.named("org.apache.hc.client5.http.impl.classic.CloseableHttpClient")
                .or(ElementMatchers.named("org.apache.hc.client5.http.classic.HttpClient"));
    }
}
