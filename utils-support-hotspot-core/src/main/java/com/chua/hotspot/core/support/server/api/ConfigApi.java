package com.chua.hotspot.core.support.server.api;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.config.DynamicConfig;
import com.chua.hotspot.core.support.server.http.HttpRequest;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 配置管理 API
 * <p>
 * 提供运行时配置的查看、修改、热加载能力。
 * 支持的操作：
 * <ul>
 *   <li>list - 列出所有配置项</li>
 *   <li>get - 获取指定配置项</li>
 *   <li>set - 设置配置项（立即生效）</li>
 *   <li>remove - 移除配置项</li>
 *   <li>reload - 从文件重新加载配置</li>
 *   <li>history - 获取配置变更历史（近期）</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class ConfigApi implements ApiEndpoint {

    @Override
    public String name() {
        return "config";
    }

    @Override
    public String description() {
        return "配置管理 - 运行时配置查看、修改、热加载";
    }

    @Override
    public Object handle(HttpRequest request) {
        String action = request.getParam("action", "list");
        switch (action) {
            case "list":
                return listConfig();
            case "get":
                return getConfig(request);
            case "set":
                return setConfig(request);
            case "remove":
                return removeConfig(request);
            case "reload":
                return reloadConfig();
            case "info":
                return configInfo();
            default:
                return error("未知操作: " + action);
        }
    }

    /**
     * 列出所有配置项
     */
    private Object listConfig() {
        Map<String, Object> result = new LinkedHashMap<>();
        DynamicConfig config = DynamicConfig.getInstance();
        result.put("count", config.size());
        result.put("config", config.getAll());
        return result;
    }

    /**
     * 获取指定配置项
     */
    private Object getConfig(HttpRequest request) {
        String key = request.getParam("key");
        if (key == null || key.isEmpty()) {
            return error("缺少参数: key");
        }
        DynamicConfig config = DynamicConfig.getInstance();
        String value = config.getString(key, null);
        if (value == null) {
            return error("配置项不存在: " + key);
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("key", key);
        result.put("value", value);
        return result;
    }

    /**
     * 设置配置项
     */
    private Object setConfig(HttpRequest request) {
        String key = request.getParam("key");
        String value = request.getParam("value");
        if (key == null || key.isEmpty()) {
            return error("缺少参数: key");
        }
        DynamicConfig config = DynamicConfig.getInstance();
        String oldValue = config.getString(key, null);
        config.set(key, value != null ? value : "");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("key", key);
        result.put("oldValue", oldValue);
        result.put("newValue", value);
        result.put("success", true);
        return result;
    }

    /**
     * 移除配置项
     */
    private Object removeConfig(HttpRequest request) {
        String key = request.getParam("key");
        if (key == null || key.isEmpty()) {
            return error("缺少参数: key");
        }
        DynamicConfig config = DynamicConfig.getInstance();
        String oldValue = config.getString(key, null);
        config.remove(key);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("key", key);
        result.put("oldValue", oldValue);
        result.put("removed", oldValue != null);
        return result;
    }

    /**
     * 从文件重新加载配置
     */
    private Object reloadConfig() {
        DynamicConfig config = DynamicConfig.getInstance();
        boolean success = config.reloadFromFile();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", success);
        result.put("configFile", config.getConfigFilePath());
        result.put("configCount", config.size());
        if (success) {
            result.put("message", "配置重新加载成功");
        } else {
            result.put("message", config.getConfigFilePath() != null
                    ? "配置重新加载失败" : "未设置配置文件路径");
        }
        return result;
    }

    /**
     * 配置信息概览
     */
    private Object configInfo() {
        DynamicConfig config = DynamicConfig.getInstance();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("configFile", config.getConfigFilePath());
        result.put("configCount", config.size());
        result.put("keys", config.getKeys());
        return result;
    }

    /**
     * 错误响应
     */
    private Map<String, Object> error(String message) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", false);
        result.put("error", message);
        return result;
    }
}