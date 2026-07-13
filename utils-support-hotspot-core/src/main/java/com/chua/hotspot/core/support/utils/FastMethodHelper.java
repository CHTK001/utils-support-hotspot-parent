package com.chua.hotspot.core.support.utils;

import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 快速方法调用助手 —— 用 MethodHandle + MethodAccess(ASM) 双引擎替代反射
 * <p>
 * 优化说明：
 * 1. MethodHandle 是 Java 7+ 标准API，JIT 可内联，调用速度接近直接方法调用（比反射快5-10倍）
 * 2. MethodAccess 基于 ASM 字节码生成，调用速度比反射快10-20倍
 * 3. 两种引擎都只在首次调用时做查找/生成，后续调用直接走缓存
 * 4. MethodHandle 优先（不生成新类，metaspace 压力小），失败时降级到 MethodAccess(ASM)
 * <p>
 * 使用场景：
 * - 数据库插件中调用厂商特定方法（getCurrentDatabase、getCatalog 等）
 * - HTTP 客户端插件中调用请求方法（getName、getURI 等）
 * - Spring 插件中调用配置方法（getStandaloneConfiguration 等）
 *
 * @author CH
 * @since 4.0.0.34
 */
public final class FastMethodHelper {

    private FastMethodHelper() {
    }

    /**
     * MethodHandle 缓存：key = className#methodName(paramTypes)
     */
    private static final ConcurrentHashMap<String, MethodHandle> HANDLE_CACHE = new ConcurrentHashMap<>();

    /**
     * 调用失败标记（避免重复查找不存在的方法）
     */
    private static final MethodHandle NULL_HANDLE = MethodHandles.constant(Object.class, null);

    /**
     * 调用无参方法（返回 Object）
     * <p>
     * 替代: Method m = obj.getClass().getMethod("name"); m.setAccessible(true); return m.invoke(obj);
     *
     * @param target     目标对象
     * @param methodName 方法名
     * @return 调用结果，失败返回 null
     */
    public static Object invoke(Object target, String methodName) {
        if (target == null || methodName == null) {
            return null;
        }
        Class<?> targetClass = target.getClass();
        String key = cacheKey(targetClass, methodName);
        MethodHandle handle = HANDLE_CACHE.computeIfAbsent(key, k -> {
            try {
                return MethodHandles.lookup().findVirtual(targetClass, methodName, MethodType.methodType(Object.class));
            } catch (NoSuchMethodException e1) {
                // 可能返回值不是 Object，尝试查找实际返回类型
                try {
                    MethodHandle h = findMethodByReturnType(targetClass, methodName, Object.class);
                    if (h != null) return h.asType(h.type().changeReturnType(Object.class));
                } catch (Exception ignored) {
                }
                return NULL_HANDLE;
            } catch (IllegalAccessException e) {
                return NULL_HANDLE;
            }
        });
        if (handle == NULL_HANDLE) {
            // 降级到 MethodAccess(ASM)
            return ClassUtils.invoke(methodName, targetClass, target);
        }
        try {
            return handle.invoke(target);
        } catch (Throwable e) {
            // MethodHandle 调用失败，降级到 MethodAccess(ASM)
            return ClassUtils.invoke(methodName, targetClass, target);
        }
    }

    /**
     * 调用无参方法（返回 String）
     * <p>
     * 替代: Method m = obj.getClass().getMethod("name"); m.setAccessible(true); return (String) m.invoke(obj);
     *
     * @param target     目标对象
     * @param methodName 方法名
     * @return 调用结果，失败返回 null
     */
    public static String invokeString(Object target, String methodName) {
        Object result = invoke(target, methodName);
        return result != null ? result.toString() : null;
    }

    /**
     * 调用无参方法（返回 int）
     * <p>
     * 替代: Method m = obj.getClass().getMethod("name"); m.setAccessible(true); return (int) m.invoke(obj);
     *
     * @param target     目标对象
     * @param methodName 方法名
     * @return 调用结果，失败返回 0
     */
    public static int invokeInt(Object target, String methodName) {
        Class<?> targetClass = target.getClass();
        String key = cacheKey(targetClass, methodName);
        MethodHandle handle = HANDLE_CACHE.computeIfAbsent(key, k -> {
            try {
                return MethodHandles.lookup().findVirtual(targetClass, methodName, MethodType.methodType(int.class));
            } catch (Exception e) {
                return NULL_HANDLE;
            }
        });
        if (handle == NULL_HANDLE) {
            Object result = ClassUtils.invoke(methodName, targetClass, target);
            if (result instanceof Number) {
                return ((Number) result).intValue();
            }
            return 0;
        }
        try {
            return (int) handle.invoke(target);
        } catch (Throwable e) {
            Object result = ClassUtils.invoke(methodName, targetClass, target);
            if (result instanceof Number) {
                return ((Number) result).intValue();
            }
            return 0;
        }
    }

    /**
     * 调用带参数的方法
     * <p>
     * 替代: Method m = obj.getClass().getMethod("name", paramTypes); m.setAccessible(true); return m.invoke(obj, args);
     *
     * @param target     目标对象
     * @param methodName 方法名
     * @param paramTypes 参数类型
     * @param args       参数值
     * @return 调用结果，失败返回 null
     */
    public static Object invoke(Object target, String methodName, Class<?>[] paramTypes, Object... args) {
        if (target == null || methodName == null) {
            return null;
        }
        Class<?> targetClass = target.getClass();
        String key = cacheKey(targetClass, methodName, paramTypes);
        MethodHandle handle = HANDLE_CACHE.computeIfAbsent(key, k -> {
            try {
                MethodType mt = MethodType.methodType(Object.class, paramTypes);
                return MethodHandles.lookup().findVirtual(targetClass, methodName, mt);
            } catch (NoSuchMethodException e1) {
                // 尝试查找实际返回类型
                try {
                    MethodHandle h = findMethodWithParams(targetClass, methodName, paramTypes);
                    if (h != null) return h.asType(h.type().changeReturnType(Object.class));
                } catch (Exception ignored) {
                }
                return NULL_HANDLE;
            } catch (IllegalAccessException e) {
                return NULL_HANDLE;
            }
        });
        if (handle == NULL_HANDLE) {
            return ClassUtils.invoke(methodName, targetClass, target, args);
        }
        try {
            return handle.invokeWithArguments(target, args);
        } catch (Throwable e) {
            return ClassUtils.invoke(methodName, targetClass, target, args);
        }
    }

    /**
     * 调用静态方法
     *
     * @param clazz      目标类
     * @param methodName 方法名
     * @param paramTypes 参数类型
     * @param args       参数值
     * @return 调用结果，失败返回 null
     */
    public static Object invokeStatic(Class<?> clazz, String methodName, Class<?>[] paramTypes, Object... args) {
        if (clazz == null || methodName == null) {
            return null;
        }
        String key = "static:" + cacheKey(clazz, methodName, paramTypes);
        MethodHandle handle = HANDLE_CACHE.computeIfAbsent(key, k -> {
            try {
                MethodType mt = MethodType.methodType(Object.class, paramTypes);
                return MethodHandles.lookup().findStatic(clazz, methodName, mt);
            } catch (Exception e) {
                return NULL_HANDLE;
            }
        });
        if (handle == NULL_HANDLE) {
            return null;
        }
        try {
            return handle.invokeWithArguments(args);
        } catch (Throwable e) {
            return null;
        }
    }

    // ==================== 内部辅助方法 ====================

    /**
     * 按返回类型查找方法（处理返回值不是 Object 的情况）
     */
    private static MethodHandle findMethodByReturnType(Class<?> targetClass, String methodName, Class<?>... paramTypes) {
        for (java.lang.reflect.Method m : targetClass.getMethods()) {
            if (m.getName().equals(methodName) && m.getParameterCount() == paramTypes.length) {
                try {
                    return MethodHandles.lookup().unreflect(m);
                } catch (IllegalAccessException e) {
                    continue;
                }
            }
        }
        return null;
    }

    /**
     * 按参数类型查找方法（处理返回值不是 Object 的情况）
     */
    private static MethodHandle findMethodWithParams(Class<?> targetClass, String methodName, Class<?>[] paramTypes) {
        try {
            java.lang.reflect.Method m = targetClass.getMethod(methodName, paramTypes);
            return MethodHandles.lookup().unreflect(m);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 生成缓存 key
     */
    private static String cacheKey(Class<?> clazz, String methodName) {
        return clazz.getName() + "#" + methodName;
    }

    /**
     * 生成缓存 key（带参数类型）
     */
    private static String cacheKey(Class<?> clazz, String methodName, Class<?>[] paramTypes) {
        StringBuilder sb = new StringBuilder(clazz.getName()).append('#').append(methodName).append('(');
        if (paramTypes != null) {
            for (int i = 0; i < paramTypes.length; i++) {
                if (i > 0) sb.append(',');
                sb.append(paramTypes[i].getName());
            }
        }
        sb.append(')');
        return sb.toString();
    }
}