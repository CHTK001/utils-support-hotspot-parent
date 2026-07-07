package com.chua.hotspot.dubbo3x.support.link;

import com.chua.hotspot.core.support.report.ReportFactory;
import com.alibaba.fastjson.JSON;
import com.chua.hotspot.core.support.link.LinkResolver;
import com.chua.hotspot.core.support.server.ServiceInstance;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.core.support.span.Span;
import com.chua.hotspot.core.support.utils.NetAddress;
import com.chua.hotspot.core.support.utils.StringUtils;
import org.apache.dubbo.rpc.RpcContext;
import org.apache.dubbo.rpc.AsyncRpcResult;

import java.util.Collections;
import java.util.List;
import java.util.Stack;

import static com.chua.hotspot.core.support.constant.Constant.*;
import static com.alibaba.fastjson.serializer.SerializerFeature.PrettyFormat;

/**
 * @author CH
 */
public class DubboxxLinkResolver implements LinkResolver {

    /**
     * 切入点
     *
     * @param span    切入点
     * @param objects
     */
    public static void insertPoint(Span span, Object[] objects) {
        if (null == span || StringUtils.isBlank(span.getLinkId())) {
            return;
        }

        try {
            RpcContext context = RpcContext.getContext();
            context.setAttachment(LINK_ID, span.getLinkId());
            context.setAttachment(LINK_PID, span.getPid());
        } catch (Exception ignored) {
        }
    }

    public static void insertResponsePoint(Object call) {
        if (null == call || !(call instanceof AsyncRpcResult)) {
            return;
        }
        
        java.util.List<Span> spans = NewTrackManager.currentSpans();
        if (spans == null || spans.isEmpty()) {
            return;
        }

        AsyncRpcResult result = (AsyncRpcResult) call;
        java.util.List<Span> spanList = new java.util.ArrayList<>(spans);
        for (Span span : spanList) {
            span.setStackTrace(Collections.emptyList());
        }
        result.setAttachment(LINK_RES_SPAN, StringUtils.gzip(JSON.toJSONBytes(spanList)));
    }

    public static void receivePoint(Object invoke) {
        if (!(invoke instanceof AsyncRpcResult)) {
            return;
        }
        
        AsyncRpcResult result = (AsyncRpcResult) invoke;
        String attachment = result.getAttachment(LINK_RES_SPAN);
        if (null == attachment) {
            return;
        }
        
        Span lastSpan = NewTrackManager.getLastSpan();
        if (null == lastSpan) {
            return;
        }

        ServiceInstance dubboServiceInstance = null;
        try {
            dubboServiceInstance = new ServiceInstance();
            NetAddress netAddress = NetAddress.of(lastSpan.getDatabase());
            dubboServiceInstance.setName("DUBBO");
            dubboServiceInstance.setSourceHost(ReportFactory.APP_HOST);
            dubboServiceInstance.setSourcePort(Integer.parseInt(ReportFactory.APP_PORT));
            dubboServiceInstance.setTargetPort(netAddress.getPort());
            dubboServiceInstance.setTargetHost(netAddress.getHost());
            ReportFactory.sendServiceInstance(dubboServiceInstance);
        } catch (Exception ignored) {
        }
        
        Object getValue = result.getValue();
        registerSpan(getValue, attachment, lastSpan, dubboServiceInstance);
    }

    private static void registerSpan(Object value, String trim, Span lastSpan, ServiceInstance serviceInstance) {
        String pid = lastSpan.getId();
        List<Span> spans = StringUtils.unGzip(trim);
        for (int i = 0, spansSize = spans.size(); i < spansSize; i++) {
            Span span = spans.get(i);
            if (i == 0) {
                span.setPid(pid);
            }

            if (i == spansSize - 1) {
                span.setTips(Collections.singletonList(JSON.toJSONString(value, PrettyFormat)));
            }

            NewTrackManager.registerSpan(span);
            if (null == serviceInstance) {
                return;
            }

            List<ServiceInstance> instances = span.getInstances();
            for (ServiceInstance instance : instances) {
                if ("HOST".equals(instance.getSourceName())) {
                    instance.setSourceHost(serviceInstance.getTargetHost());
                    instance.setSourcePort(serviceInstance.getTargetPort());
                }
                if ("HOST".equals(instance.getName())) {
                    instance.setTargetHost(serviceInstance.getTargetHost());
                    instance.setTargetPort(serviceInstance.getTargetPort());
                }
            }
            for (ServiceInstance instance : instances) {
                ReportFactory.sendServiceInstance(instance);
            }
        }
    }

    @Override
    public String name() {
        return "";
    }

    @Override
    public String getLinkId(Object[] args) {
        try {
            RpcContext context = RpcContext.getContext();
            return context.getAttachment(LINK_ID);
        } catch (Exception ignored) {
        }
        return null;
    }

    @Override
    public String getLinkParentId(Object[] args) {
        try {
            RpcContext context = RpcContext.getContext();
            return context.getAttachment(LINK_PID);
        } catch (Exception ignored) {
        }
        return null;
    }

    @Override
    public void sendResponse(List<Span> spans, Object response) {

    }

    @Override
    public int getOrder() {
        return 0;
    }
}
