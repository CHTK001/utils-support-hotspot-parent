package com.chua.hotspot.core.support.utils;

import javassist.CtClass;

import java.lang.reflect.Array;
import java.util.*;

/**
 * 数组
 *
 * @author CH
 */
public class ArrayUtils {
    private static final int firstPageNo = 0;

    /**
     * 对指定List分页取值
     *
     * @param <T>      集合元素类型
     * @param pageNo   页码
     * @param pageSize 每页的条目数
     * @param list     列表
     * @return 分页后的段落内容
     * @since 4.1.20
     */
    public static <T> List<T> page(int pageNo, int pageSize, List<T> list) {
        if (null == list || list.isEmpty()) {
            return new ArrayList<>(0);
        }

        pageNo = pageNo - 1;

        int resultSize = list.size();
        // 每页条目数大于总数直接返回所有
        if (resultSize <= pageSize) {
            return list;
        }
        // 相乘可能会导致越界 临时用long
        if (((long) pageNo * pageSize) > resultSize) {
            // 越界直接返回空
            return new ArrayList<>(0);
        }

        final int[] startEnd = transToStartEnd(pageNo, pageSize);
        if (startEnd[1] > resultSize) {
            startEnd[1] = resultSize;
            if (startEnd[0] > startEnd[1]) {
                return new ArrayList<>(0);
            }
        }

        return sub(list, startEnd[0], startEnd[1]);
    }


    /**
     * 截取集合的部分
     *
     * @param <T>   集合元素类型
     * @param list  被截取的数组
     * @param start 开始位置（包含）
     * @param end   结束位置（不包含）
     * @return 截取后的数组，当开始位置超过最大时，返回空的List
     */
    public static <T> List<T> sub(List<T> list, int start, int end) {
        return sub(list, start, end, 1);
    }

    /**
     * 截取集合的部分<br>
     * 此方法与{@link List#subList(int, int)} 不同在于子列表是新的副本，操作子列表不会影响原列表。
     *
     * @param <T>   集合元素类型
     * @param list  被截取的数组
     * @param start 开始位置（包含）
     * @param end   结束位置（不包含）
     * @param step  步进
     * @return 截取后的数组，当开始位置超过最大时，返回空的List
     * @since 4.0.6
     */
    public static <T> List<T> sub(List<T> list, int start, int end, int step) {
        if (list == null) {
            return null;
        }

        if (list.isEmpty()) {
            return new ArrayList<>(0);
        }

        final int size = list.size();
        if (start < 0) {
            start += size;
        }
        if (end < 0) {
            end += size;
        }
        if (start == size) {
            return new ArrayList<>(0);
        }
        if (start > end) {
            int tmp = start;
            start = end;
            end = tmp;
        }
        if (end > size) {
            if (start >= size) {
                return new ArrayList<>(0);
            }
            end = size;
        }

        if (step < 1) {
            step = 1;
        }

        final List<T> result = new ArrayList<>();
        for (int i = start; i < end; i += step) {
            result.add(list.get(i));
        }
        return result;
    }


    /**
     * 将页数和每页条目数转换为开始位置和结束位置<br>
     * 此方法用于包括结束位置的分页方法<br>
     * 例如：
     *
     * <pre>
     * 页码：0，每页10 =》 [0, 10]
     * 页码：1，每页10 =》 [10, 20]
     * ……
     * </pre>
     *
     * <p>
     * <pre>
     * 页码：1，每页10 =》 [0, 10]
     * 页码：2，每页10 =》 [10, 20]
     * ……
     * </pre>
     *
     * @param pageNo   页码（从0计数）
     * @param pageSize 每页条目数
     * @return 第一个数为开始位置，第二个数为结束位置
     */
    public static int[] transToStartEnd(int pageNo, int pageSize) {
        final int start = getStart(pageNo, pageSize);
        return new int[]{start, getEndByStart(start, pageSize)};
    }

    /**
     * 根据起始位置获取结束位置
     *
     * @param start    起始位置
     * @param pageSize 每页条目数
     * @return 结束位置
     */
    private static int getEndByStart(int start, int pageSize) {
        if (pageSize < 1) {
            pageSize = 0;
        }
        return start + pageSize;
    }

    /**
     * 将页数和每页条目数转换为开始位置<br>
     * 此方法用于不包括结束位置的分页方法<br>
     * 例如：
     *
     * <pre>
     * 页码：0，每页10 =》 0
     * 页码：1，每页10 =》 10
     * ……
     * </pre>
     *
     * <p>
     * <pre>
     * 页码：1，每页10 =》 0
     * 页码：2，每页10 =》 10
     * ……
     * </pre>
     *
     * @param pageNo   页码（从0计数）
     * @param pageSize 每页条目数
     * @return 开始位置
     */
    public static int getStart(int pageNo, int pageSize) {
        if (pageNo < firstPageNo) {
            pageNo = firstPageNo;
        }

        if (pageSize < 1) {
            pageSize = 0;
        }

        return (pageNo - firstPageNo) * pageSize;
    }

    /**
     * 对象转为数组
     *
     * @param iterable iterable
     * @return 数组
     */
    @SuppressWarnings("unchecked")
    public static <T> T[] toArray(Iterable<? extends T> iterable) {
        List<? extends T> ts = newArrayList(iterable);
        if (null == ts || ts.isEmpty()) {
            return null;
        }
        return ts.toArray((T[]) Array.newInstance(ts.get(0).getClass(), 0));
    }


    /**
     * 返回集合
     *
     * @param elements 数组
     * @param <E>      类型
     * @return 集合
     */
    @SuppressWarnings("all")
    public static <E> List<E> newArrayList(Iterable<? extends E> elements) {
        if (null == elements) {
            return Collections.emptyList();
        }

        if (elements instanceof Collection) {
            return Collections.unmodifiableList(new LinkedList<>((Collection) elements));
        }
        return newArrayList(elements.iterator());
    }

    /**
     * 初始化
     *
     * @param elements 元素
     * @param <E>      类型
     * @return 集合
     */
    public static <E> List<E> newArrayList(Iterator<? extends E> elements) {
        if (!elements.hasNext()) {
            return Collections.emptyList();
        }
        E first = elements.next();
        if (!elements.hasNext()) {
            return Collections.unmodifiableList(addAll(new ArrayList<>(), first));
        }

        List<E> rs = new LinkedList<>();
        rs.add(first);

        while (elements.hasNext()) {
            rs.add(elements.next());
        }
        return Collections.unmodifiableList(rs);
    }

    /**
     * 添加数据
     *
     * @param elements 元数据
     * @param element  元素
     */
    public static <E> List<E> addAll(List<E> elements, E... element) {
        if (null == elements || element.length == 0) {
            return Collections.emptyList();
        }

        for (E e : element) {
            if (null == e) {
                continue;
            }
            elements.add(e);
        }

        return elements;
    }

    public static boolean equals(CtClass[] parameterTypes, Class<?>[] types) {
        if (parameterTypes.length != types.length) {
            return false;
        }
        for (int i = 0; i < parameterTypes.length; i++) {
            if (parameterTypes[i].getName().equals(types[i].getTypeName())) {
                continue;
            }
            return false;
        }
        return true;
    }
}
