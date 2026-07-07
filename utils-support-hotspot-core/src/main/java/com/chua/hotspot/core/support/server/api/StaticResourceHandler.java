package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.server.http.HttpResponse;
import com.chua.hotspot.core.support.utils.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * 静态资源处理器
 * <p>
 * 处理静态资源请求，包括 HTML、CSS、JS、图片等文件
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class StaticResourceHandler {

    /**
     * MIME 类型映射
     */
    private static final Map<String, String> MIME_TYPES = new HashMap<>();

    static {
        // HTML
        MIME_TYPES.put("html", "text/html; charset=utf-8");
        MIME_TYPES.put("htm", "text/html; charset=utf-8");
        // CSS
        MIME_TYPES.put("css", "text/css; charset=utf-8");
        // JavaScript
        MIME_TYPES.put("js", "application/javascript; charset=utf-8");
        MIME_TYPES.put("mjs", "application/javascript; charset=utf-8");
        // JSON
        MIME_TYPES.put("json", "application/json; charset=utf-8");
        // 图片
        MIME_TYPES.put("png", "image/png");
        MIME_TYPES.put("jpg", "image/jpeg");
        MIME_TYPES.put("jpeg", "image/jpeg");
        MIME_TYPES.put("gif", "image/gif");
        MIME_TYPES.put("svg", "image/svg+xml");
        MIME_TYPES.put("ico", "image/x-icon");
        MIME_TYPES.put("webp", "image/webp");
        // 字体
        MIME_TYPES.put("woff", "font/woff");
        MIME_TYPES.put("woff2", "font/woff2");
        MIME_TYPES.put("ttf", "font/ttf");
        MIME_TYPES.put("eot", "application/vnd.ms-fontobject");
        // 其他
        MIME_TYPES.put("xml", "application/xml");
        MIME_TYPES.put("txt", "text/plain; charset=utf-8");
        MIME_TYPES.put("map", "application/json");
    }

    /**
     * 处理静态资源请求
     *
     * @param request  请求对象
     * @param response 响应对象
     */
    public void handle(HttpRequest request, HttpResponse response) {
        String path = StringUtils.defaultString(request.getPath(), "/");
        
        // 去掉上下文路径
        if (path.startsWith("/agent")) {
            path = path.substring("/agent".length());
        }
        
        // 处理根路径
        if (path.isEmpty() || "/".equals(path)) {
            path = "/index.html";
        }
        
        // 去掉开头的斜杠
        String resourcePath = path.startsWith("/") ? path.substring(1) : path;
        
        LogFactory.getInstance().debug("请求静态资源: {}", resourcePath);
        
        try {
            // 从 classpath 读取资源
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourcePath);
            
            if (inputStream == null) {
                LogFactory.getInstance().debug("静态资源不存在: {}", resourcePath);
                response.notFound();
                return;
            }
            
            // 读取资源内容（兼容 Java 8）
            byte[] content = readAllBytes(inputStream);
            inputStream.close();
            
            // 获取 MIME 类型
            String mimeType = getMimeType(resourcePath);
            
            // 发送响应
            response.staticResource(content, mimeType);
            
        } catch (Exception e) {
            LogFactory.getInstance().error("读取静态资源失败: path={}, error={}", resourcePath, e.getMessage());
            response.error("读取静态资源失败: " + e.getMessage());
        }
    }

    /**
     * 获取 MIME 类型
     *
     * @param path 文件路径
     * @return MIME 类型
     */
    private String getMimeType(String path) {
        int lastDot = path.lastIndexOf('.');
        if (lastDot == -1) {
            return "application/octet-stream";
        }
        
        String extension = path.substring(lastDot + 1).toLowerCase();
        return MIME_TYPES.getOrDefault(extension, "application/octet-stream");
    }

    /**
     * 读取 InputStream 的所有字节（兼容 Java 8）
     *
     * @param inputStream 输入流
     * @return 字节数组
     * @throws Exception 读取异常
     */
    private byte[] readAllBytes(InputStream inputStream) throws Exception {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[4096];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        buffer.flush();
        return buffer.toByteArray();
    }
}
