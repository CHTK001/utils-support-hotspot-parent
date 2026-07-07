package com.chua.hotspot.core.support.transform;

import com.chua.hotspot.core.support.plugin.BasePlugin;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.Map;

/**
 * @author CH
 */
public class TransformerBaseImpl implements ClassFileTransformer {
    private final Map<String, BasePlugin.MethodWrapper> classMap;

    public TransformerBaseImpl(Map<String, BasePlugin.MethodWrapper> classMap) {
        this.classMap = classMap;
    }

    @Override
    public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined, ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
        if (classMap.containsKey(className)) {
            return classMap.get(className).invoke(className);
        }
        return classfileBuffer;
    }
}
