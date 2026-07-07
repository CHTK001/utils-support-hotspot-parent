package com.chua.hotspot.core.support.server;

import com.alibaba.fastjson.JSON;
import lombok.Data;

/**
 * 返回分页结果
 *
 * @author  CH
 * @since  2024/11/11
 * @version  1.0.1
 */
@Data
public class ReturnPageResult<T> {
    /**
     * http状态码
     */
    protected String code;

    /**
     * 结果
     */
    private PageResult<T> data;
    /**
     * 信息
     */
    private String msg;
    /**
     * 时间戳
     */
    private long timestamp = System.currentTimeMillis();

    public ReturnPageResult(String code, PageResult<T> data, String msg) {
        this.code = code;
        this.data = data;
        this.msg = msg;
    }

    public static <T> ReturnPageResult<T> ok(PageResult<T> pageResult) {
        return new ReturnPageResult<>("00000", pageResult, "");
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
     * 是否成功
     *
     * @return 是否成功
     */
    public boolean isOk() {
        return "00000".equals(code);
    }

    /**
     * 是否为空
     *
     * @return 是否为空
     */
    public boolean isEmpty() {
        if (data == null || data.getData() == null) {
            return true;
        }
        return data.getData().isEmpty();
    }

    @Override
    public String toString() {
        String status = isOk() ? "OK" : "ERROR";
        String statusDesc = isOk() ? "OK" : (msg != null && !msg.isEmpty() ? msg : "UNKNOWN");
        String meta = data == null ? "-/-/0 0" :
                String.format("%d/%d/%d %d",
                        data.getPageNo(), data.getPageSize(), data.getTotal(),
                        data.getData() == null ? 0 : data.getData().size());
        return String.format("<%s %s %s %s>",
                code != null ? code : "UNKNOWN",
                status,
                statusDesc,
                meta);
    }
}
