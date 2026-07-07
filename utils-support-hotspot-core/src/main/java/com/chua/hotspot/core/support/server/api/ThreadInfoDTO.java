package com.chua.hotspot.core.support.server.api;

import lombok.Data;

import java.lang.management.ThreadInfo;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 线程信息 DTO
 * <p>
 * 用于替代直接序列化 {@link ThreadInfo}，避免 Java 模块系统的反射限制
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
@Data
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
