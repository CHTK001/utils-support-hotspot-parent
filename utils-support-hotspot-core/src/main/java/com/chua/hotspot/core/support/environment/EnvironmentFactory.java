package com.chua.hotspot.core.support.environment;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.utils.StringUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * 环境工厂
 *
 * @author CH
 */
public class EnvironmentFactory {

    private static final EnvironmentFactory INSTANCE = new EnvironmentFactory();
    /** 配置JSON对象 */
    private JSONObject jsonObject;

    /** 是否已初始化（幂等保护） */
    private volatile boolean initialized = false;

    private EnvironmentFactory() {
    }

    /**
     * 获取实例
     *
     * @return {@link EnvironmentFactory}
     */
    public static EnvironmentFactory getInstance() {
        return INSTANCE;
    }

    public void init(String args) {
        if (initialized) {
            return;
        }
        args = StringUtils.defaultValue(args, "");
        if (args.startsWith("{")) {
            jsonObject = JSON.parseObject(args);
            check();
            return;
        }

        File file = new File(args);
        if (file.exists()) {
            try (FileInputStream fileInputStream = new FileInputStream(file)) {
                jsonObject = JSON.parseObject(fileInputStream, JSONObject.class);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        check();
        initialized = true;
    }

    private void check() {
        if (null == jsonObject) {
            synchronized (this) {
                if (null == jsonObject) {
                    jsonObject = new JSONObject();
                }
            }
        }
    }

    /**
     * ge字符串
     *
     * @param name         名称
     * @param defaultValue 违约值
     * @return {@link String}
     */
    public String getString(String name, String defaultValue) {
        return StringUtils.defaultValue(jsonObject.getString(name), defaultValue);
    }

    /**
     * get类型
     *
     * @param type 类型
     * @return {@link T}
     */
    public <T> T getType(Class<T> type) {
        return jsonObject.toJavaObject(type);
    }

    public void set(String name, String resolvePlaceholders) {
        jsonObject.put(name, resolvePlaceholders);
    }

    /**
     * 判断配置是否相等
     *
     * @param indicator 键
     * @param aTrue     真
     * @return boolean
     */
    public boolean equalsConfig(String indicator, String aTrue) {
        return getString(indicator, "true").equals(aTrue);
    }
}
