package com.chua.hotspot.core.support.server.api;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.server.http.HttpRequest;
import com.chua.hotspot.core.support.utils.StringUtils;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * 类反编译 API
 * <p>
 * 提供类结构信息查询（简化版反编译）
 * </p>
 *
 * @author CH
 * @version 4.0.0.34
 * @since 2024/12/12
 */
public class CfrApi implements ApiEndpoint {

    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    @Override
    public String name() {
        return "cfr";
    }

    @Override
    public String description() {
        return "获取类结构信息";
    }

    @Override
    public Object handle(HttpRequest request) {
        String className = request.getParam("name");
        
        if (StringUtils.isEmpty(className)) {
            return "// 请提供类名参数 name";
        }
        
        LOGGER.debug("获取类结构: {}", className);
        
        try {
            Class<?> clazz = Class.forName(className);
            return generateClassStructure(clazz);
        } catch (ClassNotFoundException e) {
            LOGGER.error("类不存在: {}", className);
            return "// 类不存在: " + className;
        } catch (Exception e) {
            LOGGER.error("获取类结构失败: {}", e.getMessage());
            return "// 获取类结构失败: " + e.getMessage();
        }
    }

    /**
     * 生成类结构信息
     *
     * @param clazz 类
     * @return 类结构字符串
     */
    private String generateClassStructure(Class<?> clazz) {
        StringBuilder sb = new StringBuilder();
        
        // 包名
        if (clazz.getPackage() != null) {
            sb.append("package ").append(clazz.getPackage().getName()).append(";\n\n");
        }
        
        // 类声明
        sb.append(getModifiers(clazz.getModifiers()));
        
        if (clazz.isInterface()) {
            sb.append("interface ");
        } else if (clazz.isEnum()) {
            sb.append("enum ");
        } else {
            sb.append("class ");
        }
        
        sb.append(clazz.getSimpleName());
        
        // 父类
        if (clazz.getSuperclass() != null && clazz.getSuperclass() != Object.class) {
            sb.append(" extends ").append(clazz.getSuperclass().getSimpleName());
        }
        
        // 接口
        Class<?>[] interfaces = clazz.getInterfaces();
        if (interfaces.length > 0) {
            sb.append(clazz.isInterface() ? " extends " : " implements ");
            sb.append(Arrays.stream(interfaces)
                    .map(Class::getSimpleName)
                    .collect(Collectors.joining(", ")));
        }
        
        sb.append(" {\n\n");
        
        // 字段
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            sb.append("    ")
                    .append(getModifiers(field.getModifiers()))
                    .append(field.getType().getSimpleName())
                    .append(" ")
                    .append(field.getName())
                    .append(";\n");
        }
        
        if (fields.length > 0) {
            sb.append("\n");
        }
        
        // 构造方法
        for (java.lang.reflect.Constructor<?> constructor : clazz.getDeclaredConstructors()) {
            sb.append("    ")
                    .append(getModifiers(constructor.getModifiers()))
                    .append(clazz.getSimpleName())
                    .append("(")
                    .append(Arrays.stream(constructor.getParameterTypes())
                            .map(Class::getSimpleName)
                            .collect(Collectors.joining(", ")))
                    .append(") { }\n");
        }
        
        sb.append("\n");
        
        // 方法
        Method[] methods = clazz.getDeclaredMethods();
        for (Method method : methods) {
            sb.append("    ")
                    .append(getModifiers(method.getModifiers()))
                    .append(method.getReturnType().getSimpleName())
                    .append(" ")
                    .append(method.getName())
                    .append("(")
                    .append(Arrays.stream(method.getParameterTypes())
                            .map(Class::getSimpleName)
                            .collect(Collectors.joining(", ")))
                    .append(")");
            
            // 异常
            Class<?>[] exceptions = method.getExceptionTypes();
            if (exceptions.length > 0) {
                sb.append(" throws ")
                        .append(Arrays.stream(exceptions)
                                .map(Class::getSimpleName)
                                .collect(Collectors.joining(", ")));
            }
            
            sb.append(" { }\n");
        }
        
        sb.append("}\n");
        
        return sb.toString();
    }

    /**
     * 获取修饰符字符串
     *
     * @param modifiers 修饰符
     * @return 修饰符字符串
     */
    private String getModifiers(int modifiers) {
        StringBuilder sb = new StringBuilder();
        
        if (Modifier.isPublic(modifiers)) {
            sb.append("public ");
        }
        if (Modifier.isProtected(modifiers)) {
            sb.append("protected ");
        }
        if (Modifier.isPrivate(modifiers)) {
            sb.append("private ");
        }
        if (Modifier.isStatic(modifiers)) {
            sb.append("static ");
        }
        if (Modifier.isFinal(modifiers)) {
            sb.append("final ");
        }
        if (Modifier.isAbstract(modifiers)) {
            sb.append("abstract ");
        }
        if (Modifier.isSynchronized(modifiers)) {
            sb.append("synchronized ");
        }
        if (Modifier.isNative(modifiers)) {
            sb.append("native ");
        }
        
        return sb.toString();
    }
}
