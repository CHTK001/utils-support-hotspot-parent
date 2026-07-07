package com.chua.hotspot.core.support.utils;

import java.nio.file.Path;

import static com.chua.hotspot.core.support.compiler.JdkCompiler.JAR_URL_SEPARATOR;

/**
 * @author CH
 */
public class FileUtils {
    private static final int INDEX_NOT_FOUND = -1;
    private static final String SYMBOL_DOT = ".";
    private static final String SYMBOL_LEFT_SLASH = "/";
    private static final String SYMBOL_RIGHT_SLASH = "\\";

    /**
     * 获取后缀
     *
     * <pre>
     * foo.txt      --&gt; "txt"
     * a/b/c.jpg    --&gt; "jpg"
     * a/b.txt/c    --&gt; ""
     * a/b/c        --&gt; ""
     * </pre>
     *
     * @param filename the filename to retrieve the extension of.
     * @return the extension of the file or an empty string if none exists or {@code null} if the
     * filename is {@code null}.
     */
    public static String getExtension(String filename) {
        if (filename == null) {
            return null;
        }
        int index1 = filename.indexOf(JAR_URL_SEPARATOR);
        if (index1 > -1) {
            filename = filename.substring(0, index1);
        }
        final int index = indexOfExtension(filename);
        if (index == INDEX_NOT_FOUND) {
            return "";
        } else {
            return filename.substring(index + 1);
        }
    }


    /**
     * 后缀索引
     *
     * @param filename 文件名
     * @return 索引
     */
    public static int indexOfExtension(final String filename) {
        if (filename == null) {
            return INDEX_NOT_FOUND;
        }
        final int extensionPos = filename.lastIndexOf(SYMBOL_DOT);
        final int lastSeparator = indexOfLastSeparator(filename);
        return lastSeparator > extensionPos ? INDEX_NOT_FOUND : extensionPos;
    }

    /**
     * 后缀索引
     *
     * @param filename 文件名
     * @return 索引
     */
    public static int indexOfLastSeparator(final String filename) {
        if (filename == null) {
            return INDEX_NOT_FOUND;
        }
        final int lastUnixPos = filename.lastIndexOf(SYMBOL_LEFT_SLASH);
        final int lastWindowsPos = filename.lastIndexOf(SYMBOL_RIGHT_SLASH);
        return Math.max(lastUnixPos, lastWindowsPos);
    }

    /**
     * 获取指定位置的最后一个子路径部分
     *
     * @param path 路径
     * @return 获取的最后一个子路径
     * @since 3.1.2
     */
    public static Path getLastPathEle(Path path) {
        return getPathEle(path, path.getNameCount() - 1);
    }

    /**
     * 获取指定位置的子路径部分，支持负数，例如index为-1表示从后数第一个节点位置
     *
     * @param path  路径
     * @param index 路径节点位置，支持负数（负数从后向前计数）
     * @return 获取的子路径
     * @since 3.1.2
     */
    public static Path getPathEle(Path path, int index) {
        return subPath(path, index, index == -1 ? path.getNameCount() : index + 1);
    }

    /**
     * 获取指定位置的子路径部分，支持负数，例如起始为-1表示从后数第一个节点位置
     *
     * @param path      路径
     * @param fromIndex 起始路径节点（包括）
     * @param toIndex   结束路径节点（不包括）
     * @return 获取的子路径
     * @since 3.1.2
     */
    public static Path subPath(Path path, int fromIndex, int toIndex) {
        if (null == path) {
            return null;
        }
        final int len = path.getNameCount();

        if (fromIndex < 0) {
            fromIndex = len + fromIndex;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        } else if (fromIndex > len) {
            fromIndex = len;
        }

        if (toIndex < 0) {
            toIndex = len + toIndex;
            if (toIndex < 0) {
                toIndex = len;
            }
        } else if (toIndex > len) {
            toIndex = len;
        }

        if (toIndex < fromIndex) {
            int tmp = fromIndex;
            fromIndex = toIndex;
            toIndex = tmp;
        }

        if (fromIndex == toIndex) {
            return null;
        }
        return path.subpath(fromIndex, toIndex);
    }
}
