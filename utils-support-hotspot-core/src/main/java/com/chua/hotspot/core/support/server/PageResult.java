package com.chua.hotspot.core.support.server;

import java.util.List;

/**
 * 分頁結果
 *
 * @author CH
 */
public class PageResult<T> {
    private static final PageResult EMPTY = new PageResult<>();
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

    public PageResult() {}

    public PageResult(int pageNo, int pageSize, int totalPages, long total, List<T> data) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.total = total;
        this.data = data;
    }

    public static <T> PageResult<T> empty() {
        return EMPTY;
    }

    public static <T> Builder<T> builder() {
        return new Builder<>();
    }

    public int getPageNo() { return pageNo; }
    public void setPageNo(int pageNo) { this.pageNo = pageNo; }

    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public static class Builder<T> {
        private int pageNo;
        private int pageSize;
        private int totalPages;
        private long total;
        private List<T> data;

        public Builder<T> pageNo(int pageNo) { this.pageNo = pageNo; return this; }
        public Builder<T> pageSize(int pageSize) { this.pageSize = pageSize; return this; }
        public Builder<T> totalPages(int totalPages) { this.totalPages = totalPages; return this; }
        public Builder<T> total(long total) { this.total = total; return this; }
        public Builder<T> data(List<T> data) { this.data = data; return this; }

        public PageResult<T> build() {
            return new PageResult<>(pageNo, pageSize, totalPages, total, data);
        }
    }
}
