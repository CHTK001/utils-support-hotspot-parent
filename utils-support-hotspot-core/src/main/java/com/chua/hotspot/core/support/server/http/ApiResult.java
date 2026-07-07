package com.chua.hotspot.core.support.server.http;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * API 统一响应结果
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResult<T> {

    /**
     * 状态码
     */
    private String code;

    /**
     * 消息
     */
    private String message;

    /**
     * 数据
     */
    private T data;

    /**
     * 时间戳
     */
    private long timestamp;

    /**
     * 成功响应
     *
     * @param data 数据
     * @param <T>  数据类型
     * @return ApiResult
     */
    public static <T> ApiResult<T> success(T data) {
        return new ApiResult<>("00000", "success", data, System.currentTimeMillis());
    }

    /**
     * 成功响应（带消息）
     *
     * @param message 消息
     * @param data    数据
     * @param <T>     数据类型
     * @return ApiResult
     */
    public static <T> ApiResult<T> success(String message, T data) {
        return new ApiResult<>("00000", message, data, System.currentTimeMillis());
    }

    /**
     * 错误响应
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return ApiResult
     */
    public static <T> ApiResult<T> error(String message) {
        return new ApiResult<>("50000", message, null, System.currentTimeMillis());
    }

    /**
     * 错误响应
     *
     * @param code    错误码
     * @param message 错误消息
     * @param <T>     数据类型
     * @return ApiResult
     */
    public static <T> ApiResult<T> error(int code, String message) {
        return new ApiResult<>("50000", message, null, System.currentTimeMillis());
    }
}
