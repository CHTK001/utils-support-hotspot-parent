package com.chua.hotspot.core.support.server;

import com.alibaba.fastjson.JSON;
import lombok.Data;

/**
 * 返回统一结果
 *
 * @author  CH
 * @since  2024/11/11
 * @version  1.0.1
 */
@Data
public class ReturnResult<T> {

    /**
     * http状态码
     */
    protected String code;

    /**
     * 结果
     */
    protected T data;
    /**
     * 信息
     */
    protected String msg;
    /**
     * 时间戳
     */
    private long timestamp = System.currentTimeMillis();

    public ReturnResult(String code, T data, String msg) {
        this.code = code;
        this.data = data;
        this.msg = msg;
    }

    public static <T> ReturnResult<T> ok(T data) {
        return new ReturnResult<>("00000", data, "");
    }

    /**
     * 转换为byte数组
     *
     * @return byte[]
     */
    public byte[] toByteArray() {
        return JSON.toJSONBytes(this);
    }

    /**
     * 判断是否成功
     *
     * @return 是否成功
     */
    public boolean isOk() {
        return "00000".equals(code);
    }

    /**
     * 判断是否失败
     *
     * @return 是否失败
     */
    public boolean isFailure() {
        return !isOk();
    }

    @Override
    public String toString() {
        // 格式: <CODE STATUS STATUS_DESC DATA>
        String status = isOk() ? "OK" : "ERROR";
        String statusDesc = isOk() ? "OK" : (msg != null && !msg.isEmpty() ? msg : "UNKNOWN");
        String dataStr = formatDataForToString();

        return String.format("<%s %s %s %s>",
                            code != null ? code : "UNKNOWN",
                            status,
                            statusDesc,
                            dataStr);
    }

    /**
     * 格式化数据用于 toString 输出
     *
     * @return 格式化后的数据字符串
     */
    private String formatDataForToString() {
        if (data == null) {
            return "null";
        }

        String dataStr = data.toString();

        // 如果数据太长，截断并添加省略号
        if (dataStr.length() > 50) {
            dataStr = dataStr.substring(0, 47) + "...";
        }

        // 移除换行符和多余空格
        dataStr = dataStr.replaceAll("\\s+", " ").trim();

        // 如果包含空格，用引号包围
        if (dataStr.contains(" ")) {
            dataStr = "\"" + dataStr + "\"";
        }

        return dataStr;
    }
}
