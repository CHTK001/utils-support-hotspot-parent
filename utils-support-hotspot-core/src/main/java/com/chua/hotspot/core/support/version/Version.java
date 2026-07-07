package com.chua.hotspot.core.support.version;

import net.bytebuddy.agent.builder.AgentBuilder;

/**
 * @author CH
 */
public enum Version {
    /**
     * v10
     */
    V10,
    /**
     * v11
     */
    V11,
    /**
     * v12
     */
    V12,
    /**
     * v14
     */
    V14;

    public static Version getVersion() {
        String externalForm = AgentBuilder.class.getProtectionDomain().getCodeSource().getLocation().toExternalForm();
        if (externalForm.contains("10")) {
            return Version.V10;
        }

        if (externalForm.contains("12")) {
            return Version.V12;
        }

        return Version.V14;
    }
}
