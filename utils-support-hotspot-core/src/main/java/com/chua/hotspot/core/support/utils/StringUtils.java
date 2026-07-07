package com.chua.hotspot.core.support.utils;

import com.alibaba.fastjson.JSON;
import com.chua.hotspot.core.support.span.Span;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.util.*;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * @author CH
 */
public class StringUtils {

    public static final char SYMBOL_LEFT_BIG_PARANTHESES_CHAR = '{';
    public static final char SYMBOL_RIGHT_BIG_PARANTHESES_CHAR = '}';
    private static final String EMPTY_JSON = "{}";
    private static final char SYMBOL_RIGHT_SLASH_CHAR = '\\';

    public static List<String> toLines(String text) {
        List<String> result = new ArrayList<String>();
        BufferedReader reader = new BufferedReader(new StringReader(text));
        try {
            String line = reader.readLine();
            while (line != null) {
                result.add(line);
                line = reader.readLine();
            }
        } catch (IOException exc) {

        } finally {
            try {
                reader.close();
            } catch (IOException e) {

            }
        }
        return result;
    }

    /**
     * 判断是否为空
     *
     * @param value 字符串
     * @return 是否为空
     */

    public static String defaultString(String value, String defaultValue) {
        return null == value || value.trim().isEmpty() ? defaultValue : value;
    }

    /**
     * 格式化文本, {} 表示占位符<br>
     * 此方法只是简单将占位符 {} 按照顺序替换为参数<br>
     * 如果想输出 {} 使用 \\转义 { 即可，如果想输出 {} 之前的 \ 使用双转义符 \\\\ 即可<br>
     * 例：<br>
     * 通常使用：format("this is {} for {}", "a", "b") =》 this is a for b<br>
     * 转义{}： format("this is \\{} for {}", "a", "b") =》 this is \{} for a<br>
     * 转义\： format("this is \\\\{} for {}", "a", "b") =》 this is \a for b<br>
     *
     * @param template 文本模板，被替换的部分用 {} 表示
     * @param params   参数值
     * @return 格式化后的文本
     */
    public static String format(CharSequence template, Object... params) {
        if (null == template) {
            return null;
        }
        if (null == params || params.length == 0) {
            return template.toString();
        }
        return format(template.toString(), params);
    }

    /**
     * 格式化字符串<br>
     * 此方法只是简单将占位符 {} 按照顺序替换为参数<br>
     * 如果想输出 {} 使用 \\转义 { 即可，如果想输出 {} 之前的 \ 使用双转义符 \\\\ 即可<br>
     * 例：<br>
     * 通常使用：format("this is {} for {}", "a", "b") =》 this is a for b<br>
     * 转义{}： format("this is \\{} for {}", "a", "b") =》 this is \{} for a<br>
     * 转义\： format("this is \\\\{} for {}", "a", "b") =》 this is \a for b<br>
     *
     * @param strPattern 字符串模板
     * @param argArray   参数列表
     * @return 结果
     */
    public static String format(final String strPattern, final Object... argArray) {
        if (isEmpty(strPattern) || null == argArray || argArray.length == 0) {
            return strPattern;
        }
        final int strPatternLength = strPattern.length();
        StringBuilder sbuf = new StringBuilder(strPatternLength + 50);
        int handledPosition = 0;
        int delimindex;
        for (int argIndex = 0; argIndex < argArray.length; argIndex++) {
            delimindex = strPattern.indexOf(EMPTY_JSON, handledPosition);
            if (delimindex == -1) {

                if (handledPosition == 0) {
                    return strPattern;
                }

                sbuf.append(strPattern, handledPosition, strPatternLength);
                return sbuf.toString();
            }


            if (delimindex > 0 && strPattern.charAt(delimindex - 1) == SYMBOL_RIGHT_SLASH_CHAR) {

                if (delimindex > 1 && strPattern.charAt(delimindex - 2) == SYMBOL_RIGHT_SLASH_CHAR) {

                    sbuf.append(strPattern, handledPosition, delimindex - 1);
                    sbuf.append(utf8Str(argArray[argIndex]));
                    handledPosition = delimindex + 2;
                } else {

                    argIndex--;
                    sbuf.append(strPattern, handledPosition, delimindex - 1);
                    sbuf.append(SYMBOL_LEFT_BIG_PARANTHESES_CHAR);
                    handledPosition = delimindex + 1;
                }

            } else {
                sbuf.append(strPattern, handledPosition, delimindex);
                sbuf.append(utf8Str(createValue(argArray[argIndex])));
                handledPosition = delimindex + 2;
            }
        }


        sbuf.append(strPattern, handledPosition, strPattern.length());

        return sbuf.toString();
    }

    /**
     * 将对象转为字符串<br>
     *
     * <pre>
     * 1、Byte数组和ByteBuffer会被转换为对应字符串的数组
     * 2、对象数组会调用Arrays.toString方法
     * </pre>
     *
     * @param obj 对象
     * @return 字符串
     */
    public static String utf8Str(Object obj) {
        return str(obj, UTF_8);
    }

    /**
     * 将对象转为字符串
     *
     * <pre>
     * 1、Byte数组和ByteBuffer会被转换为对应字符串的数组
     * 2、对象数组会调用Arrays.toString方法
     * </pre>
     *
     * @param obj         对象
     * @param charsetName 字符集
     * @return 字符串
     * @deprecated 请使用 {@link #str(Object, Charset)}
     */
    @Deprecated
    public static String str(Object obj, String charsetName) {
        return str(obj, Charset.forName(charsetName));
    }

    /**
     * 将对象转为字符串
     * <pre>
     * 	 1、Byte数组和ByteBuffer会被转换为对应字符串的数组
     * 	 2、对象数组会调用Arrays.toString方法
     * </pre>
     *
     * @param obj     对象
     * @param charset 字符集
     * @return 字符串
     */
    public static String str(Object obj, Charset charset) {
        if (null == obj) {
            return null;
        }

        if (obj instanceof String) {
            return (String) obj;
        } else if (obj instanceof byte[]) {
            return str(obj, charset);
        } else if (obj instanceof Byte[]) {
            return str(obj, charset);
        } else if (obj instanceof ByteBuffer) {
            return str(obj, charset);
        }

        return obj.toString();
    }

    /**
     * 初始化值
     *
     * @param o 值
     * @return 值
     */
    private static Object createValue(Object o) {
        if (null == o) {
            return "NULL";
        }

        if (o instanceof String) {
            return o.toString();
        }

        return o;
    }

    /**
     * 为空
     *
     * @param strPattern str模式
     * @return boolean
     */
    public static boolean isEmpty(String strPattern) {
        return null == strPattern;
    }


    /**
     * 为空白
     *
     * @param endpointUrl 端点url
     * @return boolean
     */
    public static boolean isBlank(String endpointUrl) {
        return null == endpointUrl || endpointUrl.trim().isEmpty();
    }


    /**
     * 压缩
     *
     * @param toJSONBytes 字节
     * @return gzip
     */
    public static String gzip(byte[] toJSONBytes) {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
             GZIPOutputStream gzipOutputStream = new GZIPOutputStream(byteArrayOutputStream)
        ) {
            gzipOutputStream.write(toJSONBytes, 0, toJSONBytes.length);
            gzipOutputStream.finish();
            return new String(Base64.getEncoder().encode(byteArrayOutputStream.toByteArray()), UTF_8);
        } catch (IOException e) {
            return new String(Base64.getEncoder().encode(toJSONBytes), UTF_8);
        }
    }

    public static List<Span> unGzip(String trim) {
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(Base64.getDecoder().decode(trim.trim().getBytes(UTF_8)));
             GZIPInputStream gzipOutputStream = new GZIPInputStream(inputStream);
             ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()
        ) {
            byte[] buf = new byte[4096];
            int line = 0;
            while ((line = gzipOutputStream.read(buf)) > 0) {
                byteArrayOutputStream.write(buf, 0, line);
            }

            return JSON.parseArray(byteArrayOutputStream.toString(), Span.class);
        } catch (Exception ignored) {
        }
        return Collections.emptyList();
    }

    public static String defaultValue(String value, String defaultValue) {
        return null == value || value.trim().length() == 0 ? defaultValue : value;
    }

    /**
     * 包含
     *
     * @param lastPathEleStr 最后一条路径ele-str
     * @param c              c
     * @return boolean
     */
    public static boolean contains(String lastPathEleStr, String c) {
        return !isBlank(lastPathEleStr) && lastPathEleStr.contains(c);
    }

    /**
     * 以结尾
     *
     * @param lastPathEleStr 最后一条路径ele-str
     * @param s              s
     * @return boolean
     */
    public static boolean endsWith(String lastPathEleStr, String s) {
        return !isBlank(lastPathEleStr) && lastPathEleStr.endsWith(s);
    }


    /**
     * 切分字符串为字符串数组
     *
     * @param str         被切分的字符串
     * @param separator   分隔符字符
     * @param limit       限制分片数，小于等于0表示无限制
     * @param isTrim      是否去除切分字符串后每个元素两边的空格
     * @param ignoreEmpty 是否忽略空串
     * @return 切分后的集合
     * @since 3.0.8
     */
    public static String[] splitToArray(CharSequence str, String separator, int limit, boolean isTrim, boolean ignoreEmpty) {
        return Optional.ofNullable(ArrayUtils.toArray(split(str, separator, limit, isTrim, ignoreEmpty))).orElse(new String[0]);
    }

    /**
     * 切分字符串，不忽略大小写
     *
     * @param str         被切分的字符串
     * @param separator   分隔符字符串
     * @param limit       限制分片数，小于等于0表示无限制
     * @param isTrim      是否去除切分字符串后每个元素两边的空格
     * @param ignoreEmpty 是否忽略空串
     * @return 切分后的集合
     * @since 3.0.8
     */
    public static List<String> split(CharSequence str, String separator, int limit, boolean isTrim, boolean ignoreEmpty) {
        return split(str, separator, limit, isTrim, ignoreEmpty, false);
    }

    /**
     * 切分字符串<br>
     * 如果为空字符串或者null 则返回空集合
     *
     * @param text        被切分的字符串
     * @param separator   分隔符字符串
     * @param limit       限制分片数，小于等于0表示无限制
     * @param isTrim      是否去除切分字符串后每个元素两边的空格
     * @param ignoreEmpty 是否忽略空串
     * @param ignoreCase  是否忽略大小写
     * @return 切分后的集合
     * @since 3.2.1
     */
    public static List<String> split(CharSequence text, String separator, int limit, boolean isTrim, boolean ignoreEmpty, boolean ignoreCase) {
        if (null == text) {
            return new ArrayList<>(0);
        }
        Splitter splitter = Splitter.on(separator);
        if (ignoreEmpty) {
            splitter = splitter.omitEmptyStrings();
        }

        if (isTrim) {
            splitter = splitter.trimResults();
        }


        if (limit > 0) {
            return splitter.limit(limit).splitToList(String.valueOf(text));
        }

        return splitter.splitToList(String.valueOf(text));
    }

    /**
     * <p>
     * Splits the provided text into an array, separator specified. This is an
     * alternative to using StringTokenizer.
     * </p>
     *
     * <p>
     * The separator is not included in the returned String array. Adjacent
     * separators are treated as one separator. For more control over the split use
     * the StrTokenizer class.
     * </p>
     *
     * <p>
     * A {@code null} input String returns {@code null}.
     * </p>
     *
     * <pre>
     * StringUtils.split(null, *)         = null
     * StringUtils.split("", *)           = []
     * StringUtils.split("a.b.c", '.')    = ["a", "b", "c"]
     * StringUtils.split("a..b.c", '.')   = ["a", "b", "c"]
     * StringUtils.split("a:b:c", '.')    = ["a:b:c"]
     * StringUtils.split("a b c", ' ')    = ["a", "b", "c"]
     * </pre>
     *
     * @param str           the String to parse, may be null
     * @param separatorChar the character used as the delimiter
     * @return an array of parsed Strings, {@code null} if null String input
     * @since 2.0
     */
    public static String[] split(final String str, final char separatorChar) {
        return splitWorker(str, separatorChar, false);
    }

    /**
     * <p>
     * Splits the provided text into an array, separator specified. This is an
     * alternative to using StringTokenizer.
     * </p>
     *
     * <p>
     * The separator is not included in the returned String array. Adjacent
     * separators are treated as one separator. For more control over the split use
     * the StrTokenizer class.
     * </p>
     *
     * <p>
     * A {@code null} input String returns {@code null}.
     * </p>
     *
     * <pre>
     * StringUtils.split(null, *)         = null
     * StringUtils.split("", *)           = []
     * StringUtils.split("a.b.c", '.')    = ["a", "b", "c"]
     * StringUtils.split("a..b.c", '.')   = ["a", "b", "c"]
     * StringUtils.split("a:b:c", '.')    = ["a:b:c"]
     * StringUtils.split("a b c", ' ')    = ["a", "b", "c"]
     * </pre>
     *
     * @param list       the String to parse, may be null
     * @param separators the character used as the delimiter
     * @return an array of parsed Strings, {@code null} if null String input
     * @since 2.0
     */
    public static String[] split(String separators, String list) {
        return split(separators, list, false);
    }

    /**
     * <p>
     * Splits the provided text into an array, separator specified. This is an
     * alternative to using StringTokenizer.
     * </p>
     *
     * <p>
     * The separator is not included in the returned String array. Adjacent
     * separators are treated as one separator. For more control over the split use
     * the StrTokenizer class.
     * </p>
     *
     * <p>
     * A {@code null} input String returns {@code null}.
     * </p>
     *
     * <pre>
     * StringUtils.split(null, *)         = null
     * StringUtils.split("", *)           = []
     * StringUtils.split("a.b.c", '.')    = ["a", "b", "c"]
     * StringUtils.split("a..b.c", '.')   = ["a", "b", "c"]
     * StringUtils.split("a:b:c", '.')    = ["a:b:c"]
     * StringUtils.split("a b c", ' ')    = ["a", "b", "c"]
     * </pre>
     *
     * @param list       the String to parse, may be null
     * @param separators the character used as the delimiter
     * @return an array of parsed Strings, {@code null} if null String input
     * @since 2.0
     */
    public static String[] split(String separators, String list, boolean include) {
        StringTokenizer tokens = new StringTokenizer(list, separators, include);
        String[] result = new String[tokens.countTokens()];
        int i = 0;
        while (tokens.hasMoreTokens()) {
            result[i++] = tokens.nextToken();
        }
        return result;
    }

    /**
     * Performs the logic for the {@code split} and {@code splitPreserveAllTokens}
     * methods that do not return a maximum array length.
     *
     * @param str               the String to parse, may be {@code null}
     * @param separatorChar     the separate character
     * @param preserveAllTokens if {@code true}, adjacent separators are treated as empty token
     *                          separators; if {@code false}, adjacent separators are treated as
     *                          one separator.
     * @return an array of parsed Strings, {@code null} if null String input
     */
    private static String[] splitWorker(final String str, final char separatorChar, final boolean preserveAllTokens) {


        if (str == null) {
            return new String[0];
        }
        final int len = str.length();
        if (len == 0) {
            return new String[0];
        }
        final List<String> list = new ArrayList<String>();
        int i = 0;
        int start = 0;
        boolean match = false;
        boolean lastMatch = false;
        while (i < len) {
            if (str.charAt(i) == separatorChar) {
                if (match || preserveAllTokens) {
                    list.add(str.substring(start, i));
                    match = false;
                    lastMatch = true;
                }
                start = ++i;
                continue;
            }
            lastMatch = false;
            match = true;
            i++;
        }
        if (match || preserveAllTokens) {
            list.add(str.substring(start, i));
        }
        return list.toArray(new String[0]);
    }

}
