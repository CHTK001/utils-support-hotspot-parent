package com.chua.hotspot.core.support.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * @author CH
 */
public class ReflectionHelper {
    /**
     * 根据反射获取Configuration对象中属性
     *
     * @param bean   object
     * @param aClass type
     * @param field  field
     * @return Exception    e
     */
    public static Object getFieldValue(Object bean, Class<?> aClass, String field) throws Exception {
        Field resultMapsField = aClass.getDeclaredField(field);
        if (!resultMapsField.isAccessible()) {
            resultMapsField.setAccessible(true);
        }
        return resultMapsField.get(bean);
    }

    /**
     * Convenience orm to reflection method invoke API. Invoke the method and hide checked exceptions.
     *
     * @param target         object to invoke the method on (or null for static methods)
     * @param clazz          class name
     * @param methodName     method name
     * @param parameterTypes parameter types to resolve method name
     * @param args           actual arguments
     * @return invocation result or null
     * @throws IllegalArgumentException if method not found
     * @throws IllegalStateException    for InvocationTargetException (exception in invoked method)
     */
    public static Object invoke(Object target, Class<?> clazz, String methodName, Class<?>[] parameterTypes,
                                Object... args) {
        try {
            Method method = null;
            try {
                method = clazz.getMethod(methodName, parameterTypes);
            } catch (NoSuchMethodException e) {
                method = clazz.getDeclaredMethod(methodName, parameterTypes);
            }
            if (!method.isAccessible()) {
                method.setAccessible(true);
            }

            return method.invoke(target, args);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(String.format("Illegal arguments method %s.%s(%s) on %s, params %s", clazz.getName(), methodName,
                    Arrays.toString(parameterTypes), target, Arrays.toString(args)), e);
        } catch (InvocationTargetException e) {
            throw new IllegalStateException(String.format("Error invoking method %s.%s(%s) on %s, params %s", clazz.getName(), methodName,
                    Arrays.toString(parameterTypes), target, Arrays.toString(args)), e);
        } catch (NoSuchMethodException e) {
            throw new IllegalArgumentException(String.format("No such method %s.%s(%s) on %s, params %s", clazz.getName(), methodName,
                    Arrays.toString(parameterTypes), target, Arrays.toString(args)), e);
        } catch (IllegalAccessException e) {
            throw new IllegalArgumentException(String.format("No such method %s.%s(%s) on %s, params %s", clazz.getName(), methodName,
                    Arrays.toString(parameterTypes), target, Arrays.toString(args)), e);
        }
    }

    /**
     * Convenience orm to reflection method invoke API. Invoke the method and
     * swallow exceptions due to missing methods. Use this method if you have
     * multiple framework support and the method may not exist in current version.
     *
     * @param target         object to invoke the method on (or null for static
     *                       methods)
     * @param clazz          className name
     * @param cl             Classloader to load the class
     * @param methodName     method name
     * @param parameterTypes parameter types to resolve method name
     * @param args           actual arguments
     * @return invocation result or null
     * @throws IllegalStateException for InvocationTargetException (exception in
     *                               invoked method)
     */
    public static Object invokeNoException(Object target, String className, ClassLoader cl, String methodName,
                                           Class<?>[] parameterTypes, Object... args) {
        Class<?> clazz;
        try {
            clazz = cl.loadClass(className);
        } catch (ClassNotFoundException e) {
            return null;
        }

        try {
            return invoke(target, clazz, methodName, parameterTypes, args);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Convenience orm to reflection method invoke API. Invoke the method and
     * hide checked exceptions.
     *
     * @param target     object to invoke the method on (or null for static methods)
     * @param methodName method name
     * @return invocation result or null
     * @throws IllegalArgumentException if method not found
     * @throws IllegalStateException    for InvocationTargetException (exception in
     *                                  invoked method)
     */
    public static Object invoke(Object target, String methodName) {
        return invoke(target, target.getClass(), methodName, new Class[]{});
    }

    /**
     * Convenience orm to reflection field access API. Get field value and hide
     * checked exceptions. Field class is set by
     *
     * @param target    object to get field value (or null for static methods)
     * @param fieldName field name
     * @return field value
     * @throws IllegalArgumentException if field not found
     */
    public static Object get(Object target, String fieldName) {
        if (target == null)
            throw new NullPointerException("Target object cannot be null.");

        Class<?> clazz = target.getClass();

        while (clazz != null) {
            try {
                Field field = clazz.getDeclaredField(fieldName);
                if (!field.isAccessible()) {
                    field.setAccessible(true);
                }
                break;
            } catch (NoSuchFieldException e) {
                // ignore
            }
            clazz = clazz.getSuperclass();
        }

        if (clazz == null) {
            throw new IllegalArgumentException(String.format("No such field %s.%s on %s", target.getClass(), fieldName, target));
        }

        return get(target, clazz, fieldName);
    }

    /**
     * Convenience orm to reflection field access API. Get field value and hide
     * checked exceptions.
     *
     * @param target    object to get field value (or null for static methods)
     * @param clazz     class name
     * @param fieldName field name
     * @return field value
     * @throws IllegalArgumentException if field not found
     */
    public static Object get(Object target, Class<?> clazz, String fieldName) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            return field.get(target);
        } catch (NoSuchFieldException e) {
            throw new IllegalArgumentException(String.format("No such field %s.%s on %s", clazz.getName(), fieldName, target), e);
        } catch (IllegalAccessException e) {
            throw new IllegalArgumentException(String.format("Illegal access field %s.%s on %s", clazz.getName(), fieldName, target), e);
        }
    }

    /**
     * Convenience orm to reflection field access API. Get field value and
     * swallow exceptions. Use this method if you have multiple framework support
     * and the field may not exist in current version.
     *
     * @param target    object to get field value (or null for static methods)
     * @param clazz     class name
     * @param fieldName field name
     * @return field value or null if an exception
     */
    public static Object getNoException(Object target, Class<?> clazz, String fieldName) {
        try {
            return get(target, clazz, fieldName);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Convenience orm to reflection field access API. Set field value and hide
     * checked exceptions.
     *
     * @param target    object to get field value (or null for static methods)
     * @param clazz     class name
     * @param fieldName field name
     * @param value     field value
     * @throws IllegalArgumentException if field not found
     */
    public static void set(Object target, Class<?> clazz, String fieldName, Object value) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            field.set(target, value);
        } catch (NoSuchFieldException e) {
            throw new IllegalArgumentException(String.format("No such field %s.%s on %s", clazz.getName(), fieldName, target), e);
        } catch (IllegalAccessException e) {
            throw new IllegalArgumentException(String.format("Illegal access field %s.%s on %s", clazz.getName(), fieldName, target), e);
        }
    }
}
