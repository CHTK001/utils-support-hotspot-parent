package com.chua.hotspot.core.support.config;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.environment.EnvironmentFactory;
import com.chua.hotspot.core.support.log.LogFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 动态配置管理器
 * <p>
 * 支持运行时配置热更新，无需重启 Agent。
 * 核心能力：
 * <ul>
 *   <li>包装 EnvironmentFactory，提供类型安全的配置读取</li>
 *   <li>支持配置变更监听器（按 key 精确监听 / 全局监听）</li>
 *   <li>支持从文件热加载配置（配合 ConfigWatcher）</li>
 *   <li>线程安全的配置读写</li>
 * </ul>
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class DynamicConfig {

    /**
     * 单例实例
     */
    private static final DynamicConfig INSTANCE = new DynamicConfig();

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /** 当前配置快照（线程安全） */
    private volatile JSONObject configSnapshot;

    /** 配置文件路径（可为 null，表示纯内存模式） */
    private volatile String configFilePath;

    /** 配置文件最后修改时间，用于判断是否需要重新加载 */
    private volatile long lastModified;

    /** 全局监听器（监听所有配置变更） */
    private final List<ConfigChangeListener> globalListeners = new CopyOnWriteArrayList<>();

    /** 按 key 精确监听的监听器 */
    private final Map<String, List<ConfigChangeListener>> keyListeners = new ConcurrentHashMap<>();

    private DynamicConfig() {
        // 从 EnvironmentFactory 初始化配置快照
        EnvironmentFactory envFactory = EnvironmentFactory.getInstance();
        this.configSnapshot = new JSONObject();
        // 将 EnvironmentFactory 中的配置同步过来
        try {
            String json = envFactory.getString("config", null);
            if (json != null) {
                this.configSnapshot = JSON.parseObject(json);
            }
        } catch (Exception ignored) {
        }
    }

    /**
     * 获取单例实例
     */
    public static DynamicConfig getInstance() {
        return INSTANCE;
    }

    // ==================== 配置读取 ====================

    /**
     * 获取字符串配置
     *
     * @param key          配置键
     * @param defaultValue 默认值
     * @return 配置值
     */
    public String getString(String key, String defaultValue) {
        String value = configSnapshot.getString(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取整数配置
     */
    public int getInt(String key, int defaultValue) {
        Integer value = configSnapshot.getInteger(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取长整数配置
     */
    public long getLong(String key, long defaultValue) {
        Long value = configSnapshot.getLong(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取布尔配置
     */
    public boolean getBoolean(String key, boolean defaultValue) {
        Boolean value = configSnapshot.getBoolean(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取双精度配置
     */
    public double getDouble(String key, double defaultValue) {
        Double value = configSnapshot.getDouble(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取配置类型
     */
    public <T> T getType(Class<T> type) {
        return configSnapshot.toJavaObject(type);
    }

    /**
     * 获取所有配置键
     */
    public Set<String> getKeys() {
        return configSnapshot.keySet();
    }

    /**
     * 获取配置快照（只读副本）
     */
    public Map<String, Object> getAll() {
        return new LinkedHashMap<>(configSnapshot);
    }

    // ==================== 配置写入 ====================

    /**
     * 设置配置值（触发监听器）
     *
     * @param key   配置键
     * @param value 配置值
     */
    public void set(String key, String value) {
        String oldValue = configSnapshot.getString(key);
        configSnapshot.put(key, value);
        // 同步到 EnvironmentFactory
        EnvironmentFactory.getInstance().set(key, value);
        // 触发监听器
        fireChange(key, oldValue, value);
        LOGGER.info("配置变更: {} = {} -> {}", key, oldValue, value);
    }

    /**
     * 批量设置配置（合并更新）
     *
     * @param newConfig 新配置
     */
    public void setAll(Map<String, String> newConfig) {
        for (Map.Entry<String, String> entry : newConfig.entrySet()) {
            set(entry.getKey(), entry.getValue());
        }
    }

    /**
     * 移除配置项
     */
    public void remove(String key) {
        String oldValue = configSnapshot.getString(key);
        configSnapshot.remove(key);
        fireChange(key, oldValue, null);
        LOGGER.info("配置移除: {} = {}", key, oldValue);
    }

    // ==================== 监听器管理 ====================

    /**
     * 添加全局监听器（监听所有配置变更）
     */
    public void addListener(ConfigChangeListener listener) {
        globalListeners.add(listener);
    }

    /**
     * 添加指定 key 的监听器
     */
    public void addListener(String key, ConfigChangeListener listener) {
        keyListeners.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>()).add(listener);
    }

    /**
     * 移除全局监听器
     */
    public void removeListener(ConfigChangeListener listener) {
        globalListeners.remove(listener);
    }

    /**
     * 移除指定 key 的监听器
     */
    public void removeListener(String key, ConfigChangeListener listener) {
        List<ConfigChangeListener> listeners = keyListeners.get(key);
        if (listeners != null) {
            listeners.remove(listener);
        }
    }

    /**
     * 触发配置变更事件
     */
    private void fireChange(String key, String oldValue, String newValue) {
        // 避免相同值触发
        if (Objects.equals(oldValue, newValue)) {
            return;
        }
        // 通知 key 精确监听器
        List<ConfigChangeListener> keySpecific = keyListeners.get(key);
        if (keySpecific != null) {
            for (ConfigChangeListener listener : keySpecific) {
                try {
                    listener.onChanged(key, oldValue, newValue);
                } catch (Exception e) {
                    LOGGER.warn("配置监听器执行异常: key={}", key, e);
                }
            }
        }
        // 通知全局监听器
        for (ConfigChangeListener listener : globalListeners) {
            try {
                listener.onChanged(key, oldValue, newValue);
            } catch (Exception e) {
                LOGGER.warn("全局配置监听器执行异常: key={}", key, e);
            }
        }
    }

    // ==================== 文件热加载 ====================

    /**
     * 设置配置文件路径并加载
     *
     * @param filePath 配置文件路径
     */
    public void setConfigFile(String filePath) {
        this.configFilePath = filePath;
        reloadFromFile();
    }

    /**
     * 从文件重新加载配置
     *
     * @return 是否成功加载
     */
    public boolean reloadFromFile() {
        if (configFilePath == null) {
            return false;
        }
        File file = new File(configFilePath);
        if (!file.exists()) {
            LOGGER.warn("配置文件不存在: {}", configFilePath);
            return false;
        }

        try (FileInputStream fis = new FileInputStream(file)) {
            JSONObject newConfig = JSON.parseObject(fis, JSONObject.class);
            if (newConfig == null) {
                LOGGER.warn("配置文件内容为空: {}", configFilePath);
                return false;
            }
            // 合并配置（保留运行时动态设置的值，文件中的值覆盖）
            mergeConfig(newConfig);
            this.lastModified = file.lastModified();
            LOGGER.info("配置文件加载成功: {}, 配置项数: {}", configFilePath, newConfig.size());
            return true;
        } catch (IOException e) {
            LOGGER.warn("加载配置文件失败: {}", configFilePath, e);
            return false;
        }
    }

    /**
     * 检查文件是否被修改，若修改则自动重新加载
     *
     * @return 是否触发了重新加载
     */
    public boolean checkAndReload() {
        if (configFilePath == null) {
            return false;
        }
        File file = new File(configFilePath);
        if (!file.exists()) {
            return false;
        }
        long currentModified = file.lastModified();
        if (currentModified > lastModified) {
            LOGGER.info("检测到配置文件变更，重新加载: {}", configFilePath);
            return reloadFromFile();
        }
        return false;
    }

    /**
     * 合并配置（文件配置覆盖内存配置，但保留仅存在于内存中的配置）
     */
    private void mergeConfig(JSONObject newConfig) {
        JSONObject merged = new JSONObject();
        // 先放入当前配置
        merged.putAll(configSnapshot);
        // 文件配置覆盖
        for (Map.Entry<String, Object> entry : newConfig.entrySet()) {
            String key = entry.getKey();
            Object newValue = entry.getValue();
            String oldValue = configSnapshot.getString(key);
            String newStrValue = newValue != null ? newValue.toString() : null;
            merged.put(key, newValue);
            // 触发变更监听
            fireChange(key, oldValue, newStrValue);
        }
        this.configSnapshot = merged;
    }

    /**
     * 获取配置文件路径
     */
    public String getConfigFilePath() {
        return configFilePath;
    }

    /**
     * 获取配置项数量
     */
    public int size() {
        return configSnapshot.size();
    }
}