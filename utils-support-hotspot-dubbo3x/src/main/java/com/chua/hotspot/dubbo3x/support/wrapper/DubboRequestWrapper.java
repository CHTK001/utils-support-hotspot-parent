package com.chua.hotspot.dubbo3x.support.wrapper;

import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.core.support.utils.NetAddress;
import org.apache.dubbo.rpc.RpcInvocation;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

/**
 * @author CH
 * @since 2024/11/13
 */
public class DubboRequestWrapper {

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
            RpcInvocation rpcInvocation = (RpcInvocation) objects[1];
            String className = String.valueOf(rpcInvocation.getServiceName());
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
            Object o1 = ClassUtils.getObject(0, obj);
            Object url = ClassUtils.getObject("url", o1);
            NetAddress netAddress = NetAddress.of(url.toString());
            rs.add("注册协议: " + netAddress.getProtocol());
            rs.add("注册中心地址: " + netAddress.getAddress());
            center.append(netAddress.getAddress());
//            try {
//                ServiceAgentPlugin.registerAddress(netAddress.getAddress(), "image", "resources/images/"+ netAddress.getProtocol() + ".png");
//            } catch (Exception ignored) {
//            }
//
//            try {
//                ServiceAgentPlugin.registerAddress(netAddress.getAddress(), "image", "resources/images/"+ netAddress.getProtocol() + ".png");
//            } catch (Exception ignored) {
//            }

            netAddress.parametric().forEach((k, v) -> {
                rs.add(k + ": " + v);
            });
        } catch (Throwable ignored) {
        }

        return rs;
    }

    private static String createMessage(Object object, List<String> stackTraceElement) {
        String current = null;
        try {
            Object o1 = ClassUtils.getObject(0, object);
            Object o11 = ClassUtils.getObject(0, o1);
            Object url = ClassUtils.getObject(0, o11);
            String url1 = url.toString();
            stackTraceElement.add(url1);
            try {
                current = url1.substring(url1.indexOf("->") + 2).trim();
            } catch (Exception ignored) {
            }

        } catch (Exception ignored) {
        }
        return current;
    }
}
