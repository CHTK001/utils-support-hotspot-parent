package com.chua.hotspot.tomcat.support.link;

import com.chua.hotspot.core.support.link.LinkResolver;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;

import java.util.List;

import static com.chua.hotspot.core.support.constant.Constant.LINK_ID;

/**
 * Tomcat 9.x 链路解析器
 * <p>
 * 通过反射支持 Tomcat 内部类和标准 Servlet API
 * </p>
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.38
 */
public class TomcatLinkResolver implements LinkResolver {
    
    @Override
    public String name() {
        return "org.apache.catalina.core.StandardHostValve";
    }

    @Override
    public String getLinkId(Object[] args) {
        if (args == null || args.length == 0) {
            return null;
        }

        Object object = args[0];
        if (object == null) {
            return null;
        }

        // 通过反射调用 getHeader 方法
        try {
            return (String) ClassUtils.invoke("getHeader", object, LINK_ID);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public String getLinkParentId(Object[] args) {
        return getLinkId(args);
    }

    @Override
    public void sendResponse(List<Span> spans, Object response) {
    }

    /**
     * 从参数中获取 Response 对象
     *
     * @param objects 参数数组
     * @return Response 对象
     */
    public static Object getResponse(Object[] objects) {
        if (objects == null || objects.length == 0) {
            return null;
        }
        for (Object object : objects) {
            if (object != null) {
                String className = object.getClass().getName();
                // 检查是否是 Response 类型
                if (className.contains("Response") || className.contains("response")) {
                    return object;
                }
            }
        }
        return null;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
