package com.chua.hotspot.core.support.utils;

import java.io.File;
import java.net.URL;
import java.net.URLDecoder;

public class JarPathUtils {

    /**
     * 获取类所在的 JAR 文件路径
     *
     * @param clazz 要查询的类
     * @return JAR 文件路径，如果类不在 JAR 文件中，则返回类文件的路径；如果路径无法获取，则返回 null
     */
    public static String getJarPath(Class<?> clazz) {
        try {
            // 获取类的资源路径
            URL url = clazz.getResource(clazz.getSimpleName() + ".class");
            if (url == null) {
                return null;
            }

            String path = url.getPath();
            if (path.startsWith("file:")) {
                path = path.substring("file:".length());
            }

            // 解码路径
            path = URLDecoder.decode(path);

            // 检查是否在 JAR 文件中
            if (path.startsWith("jar:file:")) {
                path = path.substring("jar:file:".length());
                int exclamationMarkIndex = path.indexOf('!');
                if (exclamationMarkIndex != -1) {
                    path = path.substring(0, exclamationMarkIndex);
                }
                return path;
            } else {
                //开发环境
                File file = new File(clazz.getProtectionDomain().getCodeSource().getLocation().getFile() + "/..");
                if (file.exists() && file.isDirectory()) {
                    for (File listFile : file.listFiles()) {
                        if (listFile.getName().endsWith(".jar")) {
                            return listFile.getAbsolutePath();
                        }
                    }
                }
                System.out.println("类不在 JAR 文件中，路径: " + path);
                return path;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}