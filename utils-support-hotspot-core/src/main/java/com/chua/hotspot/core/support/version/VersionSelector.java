package com.chua.hotspot.core.support.version;

import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * 版本选择器接口
 * 根据扫描到的框架版本，选择需要加载的 JAR 文件
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public interface VersionSelector {

    /**
     * 根据框架版本选择需要加载的 JAR 文件
     *
     * @param libDir lib 目录
     * @param detectedVersions 检测到的框架版本映射
     * @return 需要加载的 JAR 文件列表
     */
    List<File> selectJarFiles(File libDir, Map<String, String> detectedVersions);
}
