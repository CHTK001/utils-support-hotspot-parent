package com.chua.hotspot.core.support.server;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 分頁結果
 *
 * @author CH
 */
@Data
@Builder
public class PageResult<T> {
    private static final PageResult EMPTY = PageResult.builder().build();
    /**
     * 页码
     */
    private int pageNo;
    /**
     * 每页数量
     */
    private int pageSize;
    /**
     * 总页数
     */
    private int totalPages;
    /**
     * 总数
     */
    private long total;
    /**
     * 數據
     */
    private List<T> data;

    public static <T> PageResult<T> empty() {
        return EMPTY;
    }
}
