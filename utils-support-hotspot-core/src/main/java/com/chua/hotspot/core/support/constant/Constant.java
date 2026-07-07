package com.chua.hotspot.core.support.constant;

/**
 * 链路追踪常量定义
 * 包含 HTTP 头名称、WebSocket 指令等常量
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public interface Constant {

    // ==================== HTTP 请求头常量 ====================

    /**
     * 链路 ID 请求头名称
     */
    String LINK_ID = "x-request-link-id";

    /**
     * 父 Span ID 请求头名称
     */
    String LINK_PID = "x-request-pid";

    /**
     * 响应 Span 数据头名称
     */
    String LINK_RES_SPAN = "x-response-span";

    // ==================== WebSocket 指令常量 ====================

    /**
     * WebSSH 操作指令：连接
     */
    String WEBSSH_OPERATE_CONNECT = "connect";

    /**
     * WebSSH 操作指令：命令
     */
    String WEBSSH_OPERATE_COMMAND = "command";
}
