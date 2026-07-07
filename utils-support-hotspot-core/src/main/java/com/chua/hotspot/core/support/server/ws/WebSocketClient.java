package com.chua.hotspot.core.support.server.ws;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/**
 * WebSocket 客户端连接
 * <p>
 * 封装单个 WebSocket 客户端的读写操作
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class WebSocketClient {

    private final Socket socket;
    private final InputStream in;
    private final OutputStream out;
    private volatile boolean connected = true;

    /**
     * 构造函数
     *
     * @param socket Socket 连接
     * @param in     输入流
     * @param out    输出流
     */
    public WebSocketClient(Socket socket, InputStream in, OutputStream out) {
        this.socket = socket;
        this.in = in;
        this.out = out;
    }

    /**
     * 读取消息
     *
     * @return 消息内容，如果连接关闭返回 null
     */
    public String readMessage() {
        try {
            // 读取第一个字节（FIN + opcode）
            int firstByte = in.read();
            if (firstByte == -1) {
                return null;
            }

            int opcode = firstByte & 0x0F;

            // 连接关闭帧
            if (opcode == 0x8) {
                return null;
            }

            // 读取第二个字节（MASK + payload length）
            int secondByte = in.read();
            if (secondByte == -1) {
                return null;
            }

            boolean masked = (secondByte & 0x80) != 0;
            int payloadLength = secondByte & 0x7F;

            // 扩展长度
            if (payloadLength == 126) {
                int b1 = in.read();
                int b2 = in.read();
                payloadLength = (b1 << 8) | b2;
            } else if (payloadLength == 127) {
                // 64位长度，简化处理只读取低32位
                for (int i = 0; i < 4; i++) {
                    in.read();
                }
                int b1 = in.read();
                int b2 = in.read();
                int b3 = in.read();
                int b4 = in.read();
                payloadLength = (b1 << 24) | (b2 << 16) | (b3 << 8) | b4;
            }

            // 读取掩码
            byte[] maskKey = new byte[4];
            if (masked) {
                if (in.read(maskKey) != 4) {
                    return null;
                }
            }

            // 读取负载数据
            byte[] payload = new byte[payloadLength];
            int totalRead = 0;
            while (totalRead < payloadLength) {
                int read = in.read(payload, totalRead, payloadLength - totalRead);
                if (read == -1) {
                    return null;
                }
                totalRead += read;
            }

            // 解码
            if (masked) {
                for (int i = 0; i < payload.length; i++) {
                    payload[i] = (byte) (payload[i] ^ maskKey[i % 4]);
                }
            }

            return new String(payload, StandardCharsets.UTF_8);

        } catch (IOException e) {
            connected = false;
            return null;
        }
    }

    /**
     * 发送消息
     *
     * @param message 消息内容
     */
    public synchronized void sendMessage(String message) {
        try {
            byte[] payload = message.getBytes(StandardCharsets.UTF_8);
            int length = payload.length;

            // 写入帧头
            out.write(0x81); // FIN=1, opcode=1 (text)

            // 写入长度
            if (length <= 125) {
                out.write(length);
            } else if (length <= 65535) {
                out.write(126);
                out.write((length >> 8) & 0xFF);
                out.write(length & 0xFF);
            } else {
                out.write(127);
                // 64位长度
                for (int i = 7; i >= 0; i--) {
                    out.write((length >> (i * 8)) & 0xFF);
                }
            }

            // 写入负载
            out.write(payload);
            out.flush();

        } catch (IOException e) {
            connected = false;
        }
    }

    /**
     * 是否已连接
     *
     * @return 是否已连接
     */
    public boolean isConnected() {
        return connected && socket.isConnected() && !socket.isClosed();
    }

    /**
     * 关闭连接
     */
    public void close() {
        connected = false;
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }
}
