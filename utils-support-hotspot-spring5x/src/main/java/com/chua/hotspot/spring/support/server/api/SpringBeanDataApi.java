package com.chua.hotspot.spring.support.server.api;

import com.chua.hotspot.core.support.server.api.ApiEndpoint;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.spring.support.factory.SpringFactory;
import org.springframework.context.ApplicationContext;

import java.util.*;

import static com.chua.hotspot.core.support.plugin.Plugin.logFactory;

/**
 * Spring Bean 数据 API
 * <p>
 * 直接使用 ApplicationContext，避免反射调用
 * </p>
 *
 * @author CH
 * @version 4.0.0.35
 * @since 2024/12/13
 */
public class SpringBeanDataApi implements ApiEndpoint {

    @Override
    public String name() {
        return "spring-bean-data";
    }

    @Override
    public String description() {
        return "获取 Spring Bean 信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        logFactory.debug("获取 Spring Bean 信息");
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            Object appContext = SpringFactory.getInstance().applicationContext;
            
            if (appContext == null) {
                logFactory.warn("Spring ApplicationContext 未初始化");
                return createResponse(result, "Spring ApplicationContext 未初始化");
            }
            
            if (!(appContext instanceof ApplicationContext)) {
                logFactory.warn("ApplicationContext 类型不匹配");
                return createResponse(result, "ApplicationContext 类型不匹配");
            }
            
            ApplicationContext applicationContext = (ApplicationContext) appContext;
            String[] beanNames = applicationContext.getBeanDefinitionNames();
            
            int id = 1;
            for (String beanName : beanNames) {
                try {
                    Class<?> beanType = applicationContext.getType(beanName);
                    
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", id++);
                    item.put("name", beanName);
                    item.put("className", beanType != null ? beanType.getName() : "unknown");
                    item.put("resource", getResource(beanType));
                    
                    result.add(item);
                } catch (Exception e) {
                    logFactory.debug("获取 Bean 信息失败: {}", beanName);
                }
            }
            
        } catch (Exception e) {
            logFactory.error("获取 Spring Bean 信息失败: {}", e.getMessage());
            return createResponse(result, e.getMessage());
        }
        
        return createResponse(result, null);
    }

    /**
     * 创建响应对象
     *
     * @param data  数据
     * @param error 错误信息
     * @return 响应对象
     */
    private Map<String, Object> createResponse(List<Map<String, Object>> data, String error) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("total", data.size());
        if (error != null) {
            response.put("error", error);
        }
        return response;
    }

    /**
     * 获取资源路径
     *
     * @param clazz 类
     * @return 资源路径
     */
    private String getResource(Class<?> clazz) {
        if (clazz == null) {
            return null;
        }
        
        try {
            java.security.ProtectionDomain pd = clazz.getProtectionDomain();
            if (pd != null && pd.getCodeSource() != null && pd.getCodeSource().getLocation() != null) {
                String path = pd.getCodeSource().getLocation().getPath();
                int lastSlash = path.lastIndexOf('/');
                if (lastSlash > 0) {
                    return path.substring(lastSlash + 1);
                }
                return path;
            }
        } catch (Exception e) {
            // 忽略
        }
        
        return null;
    }
}
