package com.chua.hotspot.core.support.transfor;

import com.chua.hotspot.core.support.utils.ClassUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author CH
 */
public class TransferFactory {

    static final TransferFactory INSTANCE = new TransferFactory();
    private final Map<String, List<Transfer>> transferMap = new HashMap<>();
    private final Map<String, String> nameToTransfer = new HashMap<>();
    private final Map<String, Transfer> supportedTransports = new HashMap<>();

    TransferFactory() {
        List<Class<?>> classes = ClassUtils.getClasses("com.chua.hotspot");
        for (Class<?> aClass : classes) {
            if (Transfer.class.isAssignableFrom(aClass) && !aClass.isInterface()) {
                Transfer instance = null;
                try {
                    instance = (Transfer) aClass.newInstance();
                } catch (Exception ignored) {
                }
                if (null == instance) {
                    continue;
                }
                transferMap.computeIfAbsent(instance.type(), it -> new ArrayList<>()).add(instance);
                nameToTransfer.put(instance.type(), instance.name());
            }
        }
    }

    public static TransferFactory getInstance() {
        return INSTANCE;
    }

    public Transfer get(String type) {
        if (supportedTransports.isEmpty()) {
            initialize();
        }
        return supportedTransports.get(type);
    }

    private void initialize() {
        for (Map.Entry<String, List<Transfer>> entry : transferMap.entrySet()) {
            for (Transfer transfer : entry.getValue()) {
                if (isSupport(transfer)) {
                    supportedTransports.put(nameToTransfer.get(entry.getKey()), transfer);
                }
            }
        }
    }

    /**
     * 判断给定的Transfer对象是否被支持
     * 通过检查Transfer对象的名称对应的类是否存在来确定是否支持该Transfer对象
     *
     * @param transfer 要检查的Transfer对象
     * @return 如果支持则返回true，否则返回false
     */
    private boolean isSupport(Transfer transfer) {
        if (null == transfer.type()) {
            return true;
        }
        // 检查Transfer对象的名称对应的类是否存在
        // 如果类存在，则认为该Transfer对象被支持
        return ClassUtils.isPresent(transfer.type());
    }
}
