package com.chua.hotspot.core.support.version;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 默认版本选择器实现
 * 根据检测到的框架版本，选择需要加载的 JAR 文件
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class DefaultVersionSelector implements VersionSelector {

    @Override
    public List<File> selectJarFiles(File libDir, Map<String, String> detectedVersions) {
        List<File> selectedJars = new ArrayList<>();

        if (!libDir.exists() || !libDir.isDirectory()) {
            System.err.println("[WARN] lib 目录不存在: " + libDir.getAbsolutePath());
            return selectedJars;
        }

        File[] files = libDir.listFiles();
        if (files == null) {
            return selectedJars;
        }

        // 兜底：当应用框架探测失败（detectedVersions 为空或仅含默认值）时，
        // 跳过版本冲突过滤，全部加载（避免插件全部被过滤掉导致 agent 失效）
        boolean skipVersionFilter = detectedVersions == null || detectedVersions.isEmpty();

        for (File file : files) {
            if (file.isDirectory()) {
                // 递归处理子目录
                selectedJars.addAll(selectJarFilesRecursive(file, detectedVersions));
            } else if (file.isFile() && file.getName().toLowerCase().endsWith(".jar")) {
                // 检查该 JAR 是否应该被加载
                if (skipVersionFilter || shouldLoadJar(file, detectedVersions)) {
                    selectedJars.add(file);
                }
            }
        }

        return selectedJars;
    }

    /**
     * 递归选择 JAR 文件
     *
     * @param dir 目录
     * @param detectedVersions 检测到的版本
     * @return 选中的 JAR 文件列表
     */
    private List<File> selectJarFilesRecursive(File dir, Map<String, String> detectedVersions) {
        List<File> selectedJars = new ArrayList<>();
        
        File[] files = dir.listFiles();
        if (files == null) {
            return selectedJars;
        }

        for (File file : files) {
            if (file.isDirectory()) {
                selectedJars.addAll(selectJarFilesRecursive(file, detectedVersions));
            } else if (file.isFile() && file.getName().toLowerCase().endsWith(".jar")) {
                if (shouldLoadJar(file, detectedVersions)) {
                    selectedJars.add(file);
                }
            }
        }

        return selectedJars;
    }

    /**
     * 判断是否应该加载该 JAR 文件
     * 根据应用检测到的版本选择性加载，避免版本冲突
     *
     * @param jarFile JAR 文件
     * @param detectedVersions 检测到的版本（应用的版本，非 libs 目录）
     * @return 是否应该加载
     */
    private boolean shouldLoadJar(File jarFile, Map<String, String> detectedVersions) {
        String fileName = jarFile.getName().toLowerCase();

        // =============== Tomcat 版本互斥选择 ===============
        // tomcat-embed-core 需要根据应用版本互斥选择
        if (fileName.contains("tomcat-embed-core")) {
            String appTomcatVersion = detectedVersions.get("tomcat");
            if (appTomcatVersion == null || appTomcatVersion.equals("0")) {
                // 应用没有使用 Tomcat，不加载
                System.out.println("[DEBUG] 应用未使用 Tomcat，跳过: " + fileName);
                return false;
            }
            
            // 根据应用的 Tomcat 版本选择对应的 JAR
            boolean isVersion9 = fileName.contains("-9.") || fileName.contains("9.0");
            boolean isVersion10 = fileName.contains("-10.") || fileName.contains("10.0") || fileName.contains("10.1");
            
            if ("10".equals(appTomcatVersion)) {
                if (isVersion10) {
                    System.out.println("[INFO] 加载 Tomcat 10.x JAR: " + fileName);
                    return true;
                } else if (isVersion9) {
                    System.out.println("[INFO] 跳过 Tomcat 9.x JAR (应用使用 10.x): " + fileName);
                    return false;
                }
            } else if ("9".equals(appTomcatVersion)) {
                if (isVersion9) {
                    System.out.println("[INFO] 加载 Tomcat 9.x JAR: " + fileName);
                    return true;
                } else if (isVersion10) {
                    System.out.println("[INFO] 跳过 Tomcat 10.x JAR (应用使用 9.x): " + fileName);
                    return false;
                }
            }
            // 无法确定版本，默认不加载
            return false;
        }
        
        // 其他 Tomcat 相关 JAR（如 tomcat-annotations-api 等）
        if (fileName.contains("tomcat") && !fileName.contains("tomcat-embed-core")) {
            String appTomcatVersion = detectedVersions.get("tomcat");
            if (appTomcatVersion == null || appTomcatVersion.equals("0")) {
                return false;
            }
            // 同样根据版本号过滤
            boolean isVersion9 = fileName.contains("-9.") || fileName.contains("9.0");
            boolean isVersion10 = fileName.contains("-10.") || fileName.contains("10.0") || fileName.contains("10.1");
            if ("10".equals(appTomcatVersion) && isVersion9) return false;
            if ("9".equals(appTomcatVersion) && isVersion10) return false;
            return true;
        }

        // =============== Spring 版本互斥选择 ===============
        if (fileName.contains("spring")) {
            String springVersion = detectedVersions.get("spring");
            if (springVersion != null && !springVersion.equals("0")) {
                return true;
            }
        }

        // =============== Dubbo 版本互斥选择 ===============
        if (fileName.contains("dubbo")) {
            String dubboVersion = detectedVersions.get("dubbo");
            if (dubboVersion == null || dubboVersion.equals("0")) {
                return false;
            }
            // 根据应用的 Dubbo 版本选择
            boolean isVersion2 = fileName.contains("-2.") || fileName.contains("2.7") || fileName.contains("2.6");
            boolean isVersion3 = fileName.contains("-3.") || fileName.contains("3.0") || fileName.contains("3.1") || fileName.contains("3.2");
            if ("3".equals(dubboVersion) && isVersion2) return false;
            if ("2".equals(dubboVersion) && isVersion3) return false;
            return true;
        }

        // =============== Undertow 框架相关 JAR ===============
        if (fileName.contains("undertow")) {
            String undertowVersion = detectedVersions.get("undertow");
            if (undertowVersion != null && !undertowVersion.equals("0")) {
                return true;
            }
            return false;
        }

        // =============== Jetty 框架相关 JAR ===============
        if (fileName.contains("jetty")) {
            String jettyVersion = detectedVersions.get("jetty");
            if (jettyVersion == null || jettyVersion.equals("0")) {
                System.out.println("[DEBUG] 应用未使用 Jetty，跳过: " + fileName);
                return false;
            }
            // Jetty 9.x 使用 javax.servlet, Jetty 10+/11+ 使用 jakarta.servlet
            boolean isVersion9 = fileName.contains("-9.") || fileName.contains("9.4");
            boolean isVersion10Plus = fileName.contains("-10.") || fileName.contains("-11.") || fileName.contains("-12.");
            
            if ("9".equals(jettyVersion)) {
                if (isVersion10Plus) {
                    System.out.println("[INFO] 跳过 Jetty 10+/11+ JAR (应用使用 9.x): " + fileName);
                    return false;
                }
                return true;
            } else {
                // Jetty 10/11/12
                if (isVersion9) {
                    System.out.println("[INFO] 跳过 Jetty 9.x JAR (应用使用 10+): " + fileName);
                    return false;
                }
                return true;
            }
        }

        // =============== HttpClient 相关 JAR ===============
        if (fileName.contains("httpclient")) {
            String httpClientVersion = detectedVersions.get("httpclient");
            if (httpClientVersion != null && !httpClientVersion.equals("0")) {
                return true;
            }
        }

        // =============== Netty 相关 JAR ===============
        if (fileName.contains("netty")) {
            String nettyVersion = detectedVersions.get("netty");
            if (nettyVersion != null && !nettyVersion.equals("0")) {
                return true;
            }
        }

        // =============== RSocket 相关 JAR ===============
        if (fileName.contains("rsocket")) {
            String rsocketVersion = detectedVersions.get("rsocket");
            if (rsocketVersion != null && !rsocketVersion.equals("0")) {
                return true;
            }
        }

        // =============== 通用库（始终加载） ===============
        if (isCommonLibrary(fileName)) {
            return true;
        }

        // 默认不加载
        return false;
    }

    /**
     * 判断是否为通用库（始终需要加载）
     * <p>
     * 注意：这些库由 agent 内部使用，不会与应用产生冲突
     * </p>
     *
     * @param fileName JAR 文件名
     * @return 是否为通用库
     */
    private boolean isCommonLibrary(String fileName) {
        // agent 内部使用的库
        return fileName.contains("slf4j") ||
               fileName.contains("log4j") ||
               fileName.contains("logback") ||
               fileName.contains("commons-io") ||
               fileName.contains("commons-lang");
    }
}
