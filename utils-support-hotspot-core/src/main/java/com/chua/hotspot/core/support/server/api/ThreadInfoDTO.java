package com.chua.hotspot.core.support.server.api;

import java.lang.management.ThreadInfo;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 线程信息 DTO
 * <p>
 * 用于替代直接序列化 {@link ThreadInfo}，避免 Java 模块系统反射限制
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class ThreadInfoDTO {

    /**
     * 线程ID
     */
    private long threadId;

    /**
     * 线程名称
     */
    private String threadName;

    /**
     * 线程状态
     */
    private String threadState;

    /**
     * 阻塞次数
     */
    private long blockedCount;

    /**
     * 阻塞时间（毫秒）
     */
    private long blockedTime;

    /**
     * 等待次数
     */
    private long waitedCount;

    /**
     * 等待时间（毫秒）
     */
    private long waitedTime;

    /**
     * 锁名称
     */
    private String lockName;

    /**
     * 锁拥有者ID
     */
    private long lockOwnerId;

    /**
     * 锁拥有者名称
     */
    private String lockOwnerName;

    /**
     * 是否在 native 方法中
     */
    private boolean inNative;

    /**
     * 是否暂停
     */
    private boolean suspended;

    /**
     * 堆栈跟踪
     */
    private List<String> stackTrace;

    public long getThreadId() {
        return threadId;
    }

    public void setThreadId(long threadId) {
        this.threadId = threadId;
    }

    public String getThreadName() {
        return threadName;
    }

    public void setThreadName(String threadName) {
        this.threadName = threadName;
    }

    public String getThreadState() {
        return threadState;
    }

    public void setThreadState(String threadState) {
        this.threadState = threadState;
    }

    public long getBlockedCount() {
        return blockedCount;
    }

    public void setBlockedCount(long blockedCount) {
        this.blockedCount = blockedCount;
    }

    public long getBlockedTime() {
        return blockedTime;
    }

    public void setBlockedTime(long blockedTime) {
        this.blockedTime = blockedTime;
    }

    public long getWaitedCount() {
        return waitedCount;
    }

    public void setWaitedCount(long waitedCount) {
        this.waitedCount = waitedCount;
    }

    public long getWaitedTime() {
        return waitedTime;
    }

    public void setWaitedTime(long waitedTime) {
        this.waitedTime = waitedTime;
    }

    public String getLockName() {
        return lockName;
    }

    public void setLockName(String lockName) {
        this.lockName = lockName;
    }

    public long getLockOwnerId() {
        return lockOwnerId;
    }

    public void setLockOwnerId(long lockOwnerId) {
        this.lockOwnerId = lockOwnerId;
    }

    public String getLockOwnerName() {
        return lockOwnerName;
    }

    public void setLockOwnerName(String lockOwnerName) {
        this.lockOwnerName = lockOwnerName;
    }

    public boolean isInNative() {
        return inNative;
    }

    public void setInNative(boolean inNative) {
        this.inNative = inNative;
    }

    public boolean isSuspended() {
        return suspended;
    }

    public void setSuspended(boolean suspended) {
        this.suspended = suspended;
    }

    public List<String> getStackTrace() {
        return stackTrace;
    }

    public void setStackTrace(List<String> stackTrace) {
        this.stackTrace = stackTrace;
    }

    /**
     * 从 ThreadInfo 创建 DTO
     *
     * @param info ThreadInfo 对象
     * @return ThreadInfoDTO
     */
    public static ThreadInfoDTO from(ThreadInfo info) {
        if (info == null) {
            return null;
        }

        ThreadInfoDTO dto = new ThreadInfoDTO();
        dto.setThreadId(info.getThreadId());
        dto.setThreadName(info.getThreadName());
        dto.setThreadState(info.getThreadState().name());
        dto.setBlockedCount(info.getBlockedCount());
        dto.setBlockedTime(info.getBlockedTime());
        dto.setWaitedCount(info.getWaitedCount());
        dto.setWaitedTime(info.getWaitedTime());
        dto.setLockName(info.getLockName());
        dto.setLockOwnerId(info.getLockOwnerId());
        dto.setLockOwnerName(info.getLockOwnerName());
        dto.setInNative(info.isInNative());
        dto.setSuspended(info.isSuspended());

        // 转换堆栈跟踪为字符串列表
        StackTraceElement[] stackTraceElements = info.getStackTrace();
        if (stackTraceElements != null) {
            dto.setStackTrace(Arrays.stream(stackTraceElements)
                    .map(StackTraceElement::toString)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    /**
     * 批量转换 ThreadInfo 数组
     *
     * @param infos ThreadInfo 数组
     * @return ThreadInfoDTO 列表
     */
    public static List<ThreadInfoDTO> fromArray(ThreadInfo[] infos) {
        if (infos == null) {
            return Collections.emptyList();
        }

        return Arrays.stream(infos)
                .map(ThreadInfoDTO::from)
                .collect(Collectors.toList());
    }
}