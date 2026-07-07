package com.chua.hotspot.dubbo3x.support.wrapper;

import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.NetAddress;
import org.apache.dubbo.rpc.RpcInvocation;
import org.apache.dubbo.common.URL;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

/**
 * @author CH
 * @since 2024/11/13
 */
public class ReflectionDubboRequestWrapper {

    /**
     * 发送到链路
     *
     * @param objects objects
     * @param obj     对象
     * @return
     */
    public static Span before(Object[] objects, Object obj) {
        Span entrySpan = NewTrackManager.createEntrySpan(objects);
        try {
            if (!(objects[1] instanceof RpcInvocation)) {
                return entrySpan;
            }
            
            RpcInvocation rpcInvocation = (RpcInvocation) objects[1];
            String className = rpcInvocation.getServiceName();
            String methodName = rpcInvocation.getMethodName();

            List<String> stackTraceElement = new LinkedList<>();
            stackTraceElement.add(className + "." + methodName);
            stackTraceElement.add("--------------参数-----------------");
            String[] parameterType = rpcInvocation.getCompatibleParamSignatures();
            Object[] values = rpcInvocation.getArguments();
            for (int i = 0, objectLength = parameterType.length; i < objectLength; i++) {
                Object o = values[i];
                stackTraceElement.add("(" + parameterType[i] + "): " + o);
            }

            StringBuffer center = new StringBuffer();
            stackTraceElement.add("--------------注册中心-----------------");
            stackTraceElement.addAll(createCenterMessage(obj, center));

            stackTraceElement.add("--------------信息-----------------");
            String current = createMessage(objects[0], stackTraceElement);

            entrySpan.setDescription("<span style='color: blue; font-size:1000;'><span class='badge badge-primary'>Dubbo(" + current + ")</span>" + className + "." + methodName + "</span>");
            entrySpan.setTips(stackTraceElement);
            entrySpan.setDatabase(current);
            entrySpan.setFrom(className + "." + methodName);
        } catch (Exception ignored) {
        }
        return entrySpan;
    }


    private static Collection<? extends String> createCenterMessage(Object obj, StringBuffer center) {
        List<String> rs = new LinkedList<>();
        try {
            // 尝试获取 URL 信息
            if (obj != null && obj.getClass().isArray()) {
                Object[] arr = (Object[]) obj;
                if (arr.length > 0 && arr[0] instanceof URL) {
                    URL url = (URL) arr[0];
                    NetAddress netAddress = NetAddress.of(url.toString());
                    rs.add("注册协议: " + netAddress.getProtocol());
                    rs.add("注册中心地址: " + netAddress.getAddress());
                    center.append(netAddress.getAddress());
                    
                    netAddress.parametric().forEach((k, v) -> {
                        rs.add(k + ": " + v);
                    });
                }
            }
        } catch (Throwable ignored) {
        }

        return rs;
    }

    private static String createMessage(Object object, List<String> stackTraceElement) {
        String current = null;
        try {
            // 尝试获取 URL 信息
            if (object != null && object.getClass().isArray()) {
                Object[] arr = (Object[]) object;
                if (arr.length > 0 && arr[0] != null) {
                    Object o1 = arr[0];
                    if (o1.getClass().isArray()) {
                        Object[] arr1 = (Object[]) o1;
                        if (arr1.length > 0 && arr1[0] instanceof URL) {
                            URL url = (URL) arr1[0];
                            String url1 = url.toString();
                            stackTraceElement.add(url1);
                            try {
                                current = url1.substring(url1.indexOf("->") + 2).trim();
                            } catch (Exception ignored) {
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return current;
    }
}
