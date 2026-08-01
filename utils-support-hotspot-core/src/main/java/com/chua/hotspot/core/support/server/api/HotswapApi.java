package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.PluginFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.lang.instrument.Instrumentation;
import java.lang.management.ClassLoadingMXBean;
import java.lang.management.ManagementFactory;
import java.util.*;

/**
 * 热重载 API
 * <p>
 * 提供类热重载功能，包括查看已加载类、重载类等
 * </p>
 *
 * @author CH
 * @version 4.0.0.38
 * @since 2024/12/16
 */
public class HotswapApi implements ApiEndpoint {

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();
    
    /**
     * 获取 Instrumentation
     */
    private static Instrumentation getInstrumentation() {
        return InstrumentationFactory.getInstance().get();
    }

    @Override
    public String name() {
        return "hotswap";
    }

    @Override
    public String description() {
        return "热重载管理";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "status");
        
        switch (action) {
            case "status":
                return getStatus();
            case "list":
                return listClasses(request);
            case "reload":
                return reloadClass(request);
            case "reloadFile":
                return reloadFromFile(request);
            default:
                return errorResult("未知操作: " + action);
        }
    }
    
    /**
     * 获取热重载状态
     */
    private Map<String, Object> getStatus() {
        Map<String, Object> result = new HashMap<>();
        Instrumentation inst = getInstrumentation();
        
        ClassLoadingMXBean classLoadingMXBean = ManagementFactory.getClassLoadingMXBean();
        
        result.put("loadedClassCount", classLoadingMXBean.getLoadedClassCount());
        result.put("totalLoadedClassCount", classLoadingMXBean.getTotalLoadedClassCount());
        result.put("unloadedClassCount", classLoadingMXBean.getUnloadedClassCount());
        result.put("instrumentation", inst != null);
        result.put("enabled", inst != null);
        
        // 检查是否支持类重定义
        if (inst != null) {
            result.put("redefineSupported", inst.isRedefineClassesSupported());
            result.put("retransformSupported", inst.isRetransformClassesSupported());
        } else {
            result.put("redefineSupported", false);
            result.put("retransformSupported", false);
        }
        
        // 热部署插件数量
        result.put("hotswapPluginCount", PluginFactory.getInstance().toList().size());
        
        return result;
    }
    
    /**
     * 列出已加载的类
     */
    private Map<String, Object> listClasses(HttpRequest request) {
        Map<String, Object> result = new HashMap<>();
        Instrumentation inst = getInstrumentation();
        
        String pattern = request.getParam("pattern", "");
        int limit = Integer.parseInt(request.getParam("limit", "100"));
        
        List<Map<String, Object>> classList = new ArrayList<>();
        
        if (inst != null) {
            Class<?>[] allLoadedClasses = inst.getAllLoadedClasses();
            int count = 0;
            
            for (Class<?> clazz : allLoadedClasses) {
                String className = clazz.getName();
                
                // 过滤系统类
                if (className.startsWith("java.") || 
                    className.startsWith("javax.") ||
                    className.startsWith("sun.") ||
                    className.startsWith("jdk.") ||
                    className.startsWith("com.sun.")) {
                    continue;
                }
                
                // 模式匹配
                if (!pattern.isEmpty() && !className.toLowerCase().contains(pattern.toLowerCase())) {
                    continue;
                }
                
                Map<String, Object> classInfo = new HashMap<>();
                classInfo.put("className", className);
                classInfo.put("classLoader", clazz.getClassLoader() != null ? 
                    clazz.getClassLoader().getClass().getSimpleName() : "Bootstrap");
                classInfo.put("modifiable", inst.isModifiableClass(clazz));
                
                classList.add(classInfo);
                
                if (++count >= limit) {
                    break;
                }
            }
        }
        
        result.put("classes", classList);
        result.put("total", classList.size());
        
        return result;
    }
    
    /**
     * 重载指定类
     */
    private Map<String, Object> reloadClass(HttpRequest request) {
        String className = request.getParam("className", "");
        Instrumentation inst = getInstrumentation();
        
        if (className.isEmpty()) {
            return errorResult("类名不能为空");
        }
        
        if (inst == null) {
            return errorResult("Instrumentation 不可用");
        }
        
        try {
            // 查找已加载的类
            Class<?> targetClass = null;
            for (Class<?> clazz : inst.getAllLoadedClasses()) {
                if (clazz.getName().equals(className)) {
                    targetClass = clazz;
                    break;
                }
            }
            
            if (targetClass == null) {
                return errorResult("类未找到: " + className);
            }
            
            if (!inst.isModifiableClass(targetClass)) {
                return errorResult("类不可修改: " + className);
            }
            
            // 触发重新转换
            inst.retransformClasses(targetClass);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "类重载成功: " + className);
            return result;
            
        } catch (Exception e) {
            LOGGER.error("重载类失败: {}", e.getMessage());
            return errorResult("重载失败: " + e.getMessage());
        }
    }
    
    /**
     * 从文件重载类
     */
    private Map<String, Object> reloadFromFile(HttpRequest request) {
        String filePath = request.getParam("filePath", "");
        String className = request.getParam("className", "");
        Instrumentation inst = getInstrumentation();
        
        if (filePath.isEmpty() || className.isEmpty()) {
            return errorResult("文件路径和类名不能为空");
        }
        
        if (inst == null) {
            return errorResult("Instrumentation 不可用");
        }
        
        try {
            // 读取 class 文件
            java.io.File file = new java.io.File(filePath);
            if (!file.exists()) {
                return errorResult("文件不存在: " + filePath);
            }
            
            byte[] classBytes = java.nio.file.Files.readAllBytes(file.toPath());
            
            // 查找已加载的类
            Class<?> targetClass = null;
            for (Class<?> clazz : inst.getAllLoadedClasses()) {
                if (clazz.getName().equals(className)) {
                    targetClass = clazz;
                    break;
                }
            }
            
            if (targetClass == null) {
                return errorResult("类未找到: " + className);
            }
            
            // 重定义类
            java.lang.instrument.ClassDefinition definition = 
                new java.lang.instrument.ClassDefinition(targetClass, classBytes);
            inst.redefineClasses(definition);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "类重载成功: " + className);
            return result;
            
        } catch (Exception e) {
            LOGGER.error("从文件重载类失败: {}", e.getMessage());
            return errorResult("重载失败: " + e.getMessage());
        }
    }
    
    private Map<String, Object> errorResult(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("error", message);
        return result;
    }
}
