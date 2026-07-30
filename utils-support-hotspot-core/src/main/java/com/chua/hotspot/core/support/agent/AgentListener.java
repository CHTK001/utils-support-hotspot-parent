package com.chua.hotspot.core.support.agent;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.monitor.AgentSelfMonitor;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.utility.JavaModule;

/**
 * Agent 构建监听器
 * 记录字节码增强事件并同步到 AgentSelfMonitor
 *
 * @author CH
 */
public class AgentListener implements AgentBuilder.Listener {
    final LogFactory logFactory = LogFactory.getInstance();

    @Override
    public void onDiscovery(String typeName, ClassLoader classLoader, JavaModule module, boolean loaded) {
    }

    @Override
    public void onTransformation(TypeDescription typeDescription, ClassLoader classLoader, JavaModule module, boolean loaded, DynamicType dynamicType) {
        AgentSelfMonitor.getInstance().recordTransform(
                typeDescription.getName(), 1, 0);
    }

    @Override
    public void onIgnored(TypeDescription typeDescription, ClassLoader classLoader, JavaModule module, boolean loaded) {
    }

    @Override
    public void onError(String typeName, ClassLoader classLoader, JavaModule module, boolean loaded, Throwable throwable) {
        if (typeName.startsWith("jdk.")) {
            return;
        }
        AgentSelfMonitor.getInstance().recordTransformFail(typeName);
        // 打印异常详情（受 --add-opens 限制时尤其重要）
        logFactory.warn("类增强失败: {} - {}", typeName, throwable.toString());
        Throwable cause = throwable.getCause();
        int depth = 0;
        while (cause != null && depth < 5) {
            logFactory.warn("  caused by: {} - {}", cause.getClass().getName(), cause.getMessage());
            cause = cause.getCause();
            depth++;
        }
    }

    @Override
    public void onComplete(String typeName, ClassLoader classLoader, JavaModule module, boolean loaded) {
    }
}