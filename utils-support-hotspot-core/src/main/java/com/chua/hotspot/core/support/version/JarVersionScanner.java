package com.chua.hotspot.core.support.version;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.jar.JarFile;
import java.util.jar.Manifest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * JAR 版本扫描器
 * 快速扫描 lib 目录中支持的框架版本，通过版本特有的类进行快速判断
 *
 * @author CH
 * @since 2024/12/10
 * @version 4.0.0.34
 */
public class JarVersionScanner {

    public static final Map<String, String> VERSION_CACHE = new HashMap<>();
    private static final Pattern VERSION_PATTERN = Pattern.compile("(\\d+)\\.(\\d+)");

    /**
     * 扫描 lib 目录获取所有框架版本
     * 只检查 hotspot 支持的 JAR，通过版本特有的类快速判断
     *
     * @param libPath lib 目录路径
     * @return 框架名称 -> 版本号映射
     */
    public static Map<String, String> scanVersions(String libPath) {
        Map<String, String> versions = new HashMap<>();
        File libDir = new File(libPath);
        
        if (!libDir.exists() || !libDir.isDirectory()) {
            System.err.println("[WARN] lib 目录不存在: " + libPath);
            return versions;
        }

        File[] files = libDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".jar"));
        if (files == null) {
            return versions;
        }

        // 快速扫描：只检查 hotspot 支持的框架
        for (File jarFile : files) {
            try {
                detectFrameworkVersion(jarFile, versions);
            } catch (Exception e) {
                System.err.println("[DEBUG] 扫描 JAR 文件失败: " + jarFile.getName() + ", " + e.getMessage());
            }
        }

        VERSION_CACHE.putAll(versions);
        return versions;
    }

    /**
     * 检测 JAR 文件中的框架版本
     * 通过版本特有的类快速判断，避免逐个扫描
     *
     * @param jarFile JAR 文件
     * @param versions 版本映射（输出参数）
     */
    private static void detectFrameworkVersion(File jarFile, Map<String, String> versions) {
        String fileName = jarFile.getName().toLowerCase();

        try (JarFile jar = new JarFile(jarFile)) {
            // 检测 Spring - 通过版本特有的类快速判断
            if (fileName.contains("spring-core") || fileName.contains("spring-context")) {
                if (hasClassInJar(jar, "org/springframework/core/SpringVersion.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("spring", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 Spring 版本: " + version);
                    }
                }
            }
            // 检测 Tomcat - 通过 Catalina 特有的类
            else if (fileName.contains("tomcat-embed-core") || fileName.contains("catalina")) {
                if (hasClassInJar(jar, "org/apache/catalina/Catalina.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("tomcat", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 Tomcat 版本: " + version);
                    }
                }
            }
            // 检测 Undertow - 通过 Undertow 特有的类
            else if (fileName.contains("undertow-core")) {
                if (hasClassInJar(jar, "io/undertow/Undertow.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("undertow", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 Undertow 版本: " + version);
                    }
                }
            }
            // 检测 Dubbo - 通过 Dubbo 特有的类
            else if (fileName.contains("dubbo")) {
                if (hasClassInJar(jar, "org/apache/dubbo/common/Version.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("dubbo", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 Dubbo 版本: " + version);
                    }
                }
            }
            // 检测 HttpClient 3.x - Apache Commons HttpClient
            else if (fileName.contains("commons-httpclient")) {
                if (hasClassInJar(jar, "org/apache/commons/httpclient/HttpClient.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("httpclient3x", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 HttpClient 3.x 版本: " + version);
                    }
                }
            }
            // 检测 HttpClient 5.x - Apache HttpClient 5.x
            else if (fileName.contains("httpclient5")) {
                if (hasClassInJar(jar, "org/apache/hc/client5/http/classic/HttpClient.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("httpclient5x", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 HttpClient 5.x 版本: " + version);
                    }
                }
            }
            // 检测 HttpClient 4.x - Apache HttpClient 4.x
            else if (fileName.contains("httpclient")) {
                if (hasClassInJar(jar, "org/apache/http/client/HttpClient.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("httpclient4x", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 HttpClient 4.x 版本: " + version);
                    }
                }
            }
            // 检测 Netty - 通过 Netty 特有的类
            else if (fileName.contains("netty-all") || fileName.contains("netty-common")) {
                if (hasClassInJar(jar, "io/netty/util/Version.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("netty", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 Netty 版本: " + version);
                    }
                }
            }
            // 检测 RSocket - 通过 RSocket 特有的类
            else if (fileName.contains("rsocket")) {
                if (hasClassInJar(jar, "io/rsocket/RSocket.class")) {
                    String version = extractVersion(fileName, jar);
                    if (version != null) {
                        versions.put("rsocket", getMajorVersion(version));
                        System.out.println("[INFO] 检测到 RSocket 版本: " + version);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("[DEBUG] 读取 JAR 文件失败: " + jarFile.getName());
        }
    }

    /**
     * 快速检查 JAR 文件中是否存在指定的类
     *
     * @param jar JAR 文件对象
     * @param className 类的路径（如 org/springframework/core/SpringVersion.class）
     * @return 是否存在该类
     */
    private static boolean hasClassInJar(JarFile jar, String className) {
        return jar.getEntry(className) != null;
    }

    /**
     * 从 JAR 文件名或 MANIFEST 中提取版本号
     *
     * @param fileName JAR 文件名
     * @param jar JAR 文件对象
     * @return 版本号
     */
    private static String extractVersion(String fileName, JarFile jar) {
        // 1. 先从文件名提取版本
        Matcher matcher = VERSION_PATTERN.matcher(fileName);
        if (matcher.find()) {
            return matcher.group(0);
        }

        // 2. 从 MANIFEST 提取版本
        try {
            Manifest manifest = jar.getManifest();
            if (manifest != null) {
                String version = manifest.getMainAttributes().getValue("Implementation-Version");
                if (version != null) {
                    return version;
                }
                version = manifest.getMainAttributes().getValue("Bundle-Version");
                if (version != null) {
                    return version;
                }
            }
        } catch (IOException e) {
            // 忽略
        }

        return null;
    }

    /**
     * 获取主版本号
     *
     * @param fullVersion 完整版本号（如 "5.3.23"）
     * @return 主版本号（如 "5"）
     */
    private static String getMajorVersion(String fullVersion) {
        if (fullVersion == null) {
            return "0";
        }
        
        Matcher matcher = VERSION_PATTERN.matcher(fullVersion);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        return fullVersion.split("\\.")[0];
    }

    /**
     * 获取缓存的框架版本
     *
     * @param framework 框架名称（如 "spring", "tomcat"）
     * @return 版本号
     */
    public static String getVersion(String framework) {
        return VERSION_CACHE.getOrDefault(framework.toLowerCase(), "0");
    }

    /**
     * 获取 Spring 主版本号
     *
     * @return 版本号（5, 6 等）
     */
    public static int getSpringMajorVersion() {
        String version = getVersion("spring");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 获取 Tomcat 主版本号
     *
     * @return 版本号（8, 9, 10 等）
     */
    public static int getTomcatMajorVersion() {
        String version = getVersion("tomcat");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 获取 Undertow 主版本号
     *
     * @return 版本号
     */
    public static int getUndertowMajorVersion() {
        String version = getVersion("undertow");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 获取 Dubbo 主版本号
     *
     * @return 版本号
     */
    public static int getDubboMajorVersion() {
        String version = getVersion("dubbo");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 获取 RSocket 主版本号
     *
     * @return 版本号
     */
    public static int getRSocketMajorVersion() {
        String version = getVersion("rsocket");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 获取 HttpClient 3.x 主版本号
     *
     * @return 版本号
     */
    public static int getHttpClient3xMajorVersion() {
        String version = getVersion("httpclient3x");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 获取 HttpClient 4.x 主版本号
     *
     * @return 版本号
     */
    public static int getHttpClient4xMajorVersion() {
        String version = getVersion("httpclient4x");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 获取 HttpClient 5.x 主版本号
     *
     * @return 版本号
     */
    public static int getHttpClient5xMajorVersion() {
        String version = getVersion("httpclient5x");
        try {
            return Integer.parseInt(version);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
