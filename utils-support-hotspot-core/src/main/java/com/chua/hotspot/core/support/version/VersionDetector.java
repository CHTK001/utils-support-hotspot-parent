package com.chua.hotspot.core.support.version;

/**
 * 版本检测工具
 * 用于检测框架版本并选择对应的实现
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class VersionDetector {

    /**
     * 检测 Spring 版本
     *
     * @return 版本号（5 或 6）
     */
    public static int detectSpringVersion() {
        try {
            Class.forName("org.springframework.core.env.Environment");
            // 检查是否存在 Spring 6 特有的类
            try {
                Class.forName("org.springframework.aot.AotDetector");
                return 6;
            } catch (ClassNotFoundException e) {
                return 5;
            }
        } catch (ClassNotFoundException e) {
            return 0;
        }
    }

    /**
     * 检测 Tomcat 版本
     *
     * @return 版本号（8, 9, 10）
     */
    public static int detectTomcatVersion() {
        try {
            Class<?> versionClass = Class.forName("org.apache.catalina.util.ServerInfo");
            String version = (String) versionClass.getMethod("getServerNumber").invoke(null);
            if (version.startsWith("8.")) {
                return 8;
            } else if (version.startsWith("9.")) {
                return 9;
            } else if (version.startsWith("10.")) {
                return 10;
            }
        } catch (Exception e) {
            // 忽略
        }
        return 0;
    }

    /**
     * 检测 Undertow 版本
     *
     * @return 版本号
     */
    public static int detectUndertowVersion() {
        try {
            Class.forName("io.undertow.Undertow");
            return 2; // 默认 2.x
        } catch (ClassNotFoundException e) {
            return 0;
        }
    }

    /**
     * 检测 Dubbo 版本
     *
     * @return 版本号
     */
    public static int detectDubboVersion() {
        try {
            Class.forName("org.apache.dubbo.rpc.RpcContext");
            return 3; // Dubbo 3.x
        } catch (ClassNotFoundException e) {
            return 0;
        }
    }

    /**
     * 检测类是否存在
     *
     * @param className 类名
     * @return 是否存在
     */
    public static boolean classExists(String className) {
        try {
            Class.forName(className);
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }
}
