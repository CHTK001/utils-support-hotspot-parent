package com.chua.hotspot.core.support.health;

/**
 * 健康状态
 * <p>
 * 表示单个健康检查项的结果
 * </p>
 *
 * @author CH
 * @since 4.0.0.38
 */
public class HealthStatus {

    /**
     * 健康状态枚举
     */
    public enum State {
        /** 健康 */
        UP,
        /** 不健康 */
        DOWN,
        /** 降级运行 */
        DEGRADED
    }

    /** 检查项名称 */
    private final String name;

    /** 状态 */
    private final State state;

    /** 详情消息 */
    private final String message;

    /** 响应时间（毫秒） */
    private final long responseTimeMs;

    /** 错误信息（状态非 UP 时） */
    private final String error;

    private HealthStatus(String name, State state, String message, long responseTimeMs, String error) {
        this.name = name;
        this.state = state;
        this.message = message;
        this.responseTimeMs = responseTimeMs;
        this.error = error;
    }

    /**
     * 创建健康状态
     */
    public static HealthStatus up(String name, String message, long responseTimeMs) {
        return new HealthStatus(name, State.UP, message, responseTimeMs, null);
    }

    /**
     * 创建不健康状态
     */
    public static HealthStatus down(String name, String error, long responseTimeMs) {
        return new HealthStatus(name, State.DOWN, null, responseTimeMs, error);
    }

    /**
     * 创建降级状态
     */
    public static HealthStatus degraded(String name, String message, long responseTimeMs) {
        return new HealthStatus(name, State.DEGRADED, message, responseTimeMs, null);
    }

    public String getName() { return name; }
    public State getState() { return state; }
    public String getMessage() { return message; }
    public long getResponseTimeMs() { return responseTimeMs; }
    public String getError() { return error; }

    public boolean isUp() { return state == State.UP; }
    public boolean isDown() { return state == State.DOWN; }
    public boolean isDegraded() { return state == State.DEGRADED; }

    @Override
    public String toString() {
        return "HealthStatus{" + name + "=" + state +
               (message != null ? ", msg=" + message : "") +
               (error != null ? ", err=" + error : "") +
               ", rt=" + responseTimeMs + "ms}";
    }
}