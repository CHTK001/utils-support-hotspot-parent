package com.chua.hotspot.core.support.agent.transform;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import net.bytebuddy.dynamic.DynamicType;

/**
 * Transform
 *
 * @author CH
 */
public abstract class AbstractVersionTransform implements VersionTransform {

    protected BytebuddyPlugin plugin;

    public void setPlugin(BytebuddyPlugin bytebuddyPlugin) {
        this.plugin = bytebuddyPlugin;
    }

    public DynamicType.Builder<?> transformBuilder(DynamicType.Builder<?> builder) {
        return null == plugin ? null : plugin.transform(builder);
    }
}