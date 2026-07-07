package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.inst.InstrumentationFactory;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.utils.StringUtils;

import java.lang.instrument.Instrumentation;
import java.util.*;

/**
 * 对象监控 API
 * <p>
 * 提供 JVM 加载的类信息查询接口
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ObjectApi implements ApiEndpoint {

    /**
     * Instrumentation 实例（由 Agent 注入）
     */
    private static Instrumentation instrumentation = InstrumentationFactory.getInstance().instrumentation;

    @Override
    public String name() {
        return "object_info";
    }

    @Override
    public String description() {
        return "获取 JVM 加载的类信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        LogFactory.getInstance().debug("获取对象信息");
        
        String filterName = request.getParam("filterName");
        int page = request.getIntParam("page", 1);
        int size = request.getIntParam("pageSize", 10);
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            // 获取所有已加载的类
            Class<?>[] loadedClasses = getAllLoadedClasses();
            
            // 统计每个类的加载数量
            Map<String, Integer> classCountMap = new LinkedHashMap<>();
            for (Class<?> clazz : loadedClasses) {
                String className = clazz.getName();
                
                // 过滤
                if (!StringUtils.isEmpty(filterName) && !className.toLowerCase().contains(filterName.toLowerCase())) {
                    continue;
                }
                
                classCountMap.merge(className, 1, Integer::sum);
            }
            
            // 转换为列表
            List<Map.Entry<String, Integer>> entries = new ArrayList<>(classCountMap.entrySet());
            
            // 分页
            int total = entries.size();
            int start = (page - 1) * size;
            int end = Math.min(start + size, total);
            
            if (start < total) {
                for (int i = start; i < end; i++) {
                    Map.Entry<String, Integer> entry = entries.get(i);
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", entry.getKey());
                    item.put("name", highlightKeyword(entry.getKey(), filterName));
                    item.put("count", entry.getValue());
                    result.add(item);
                }
            }
            
            // 返回分页结果
            Map<String, Object> response = new HashMap<>();
            response.put("data", result);
            response.put("total", total);
            response.put("page", page);
            response.put("size", size);
            
            return response;
            
        } catch (Exception e) {
            LogFactory.getInstance().error("获取对象信息失败: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("data", result);
            response.put("total", 0);
            response.put("error", e.getMessage());
            return response;
        }
    }

    /**
     * 获取所有已加载的类
     *
     * @return 类数组
     */
    private Class<?>[] getAllLoadedClasses() {
        if (instrumentation != null) {
            return instrumentation.getAllLoadedClasses();
        }
        
        // 如果没有 Instrumentation，使用类加载器获取
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        if (classLoader == null) {
            classLoader = ObjectApi.class.getClassLoader();
        }
        
        // 返回空数组，因为没有 Instrumentation 无法获取所有类
        return new Class<?>[0];
    }

    /**
     * 高亮关键词
     *
     * @param text    文本
     * @param keyword 关键词
     * @return 高亮后的文本
     */
    private String highlightKeyword(String text, String keyword) {
        if (StringUtils.isEmpty(keyword) || StringUtils.isEmpty(text)) {
            return text;
        }
        
        int index = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (index == -1) {
            return text;
        }
        
        String before = text.substring(0, index);
        String match = text.substring(index, index + keyword.length());
        String after = text.substring(index + keyword.length());
        
        return before + "<span style='color:red;font-weight:bold;'>" + match + "</span>" + after;
    }

}
