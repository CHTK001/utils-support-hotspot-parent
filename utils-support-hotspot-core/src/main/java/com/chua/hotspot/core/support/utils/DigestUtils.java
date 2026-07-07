package com.chua.hotspot.core.support.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * @author CH
 * @since 2024/9/20
 */
public class DigestUtils {
    /**
     * AES加密
     *
     * @param content    内容
     * @param encryptKey 密钥
     * @return 加密后的内容
     */
    public static String aesEncrypt(String content, String encryptKey) {
        if (!StringUtils.isEmpty(content) && !StringUtils.isEmpty(encryptKey)) {
            byte[] encryptStr;
            try {
                Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
                cipher.init(1, new SecretKeySpec(encryptKey.getBytes(), "AES"));
                encryptStr = cipher.doFinal(content.getBytes(StandardCharsets.UTF_8));
            } catch (Exception var4) {
                Exception e = var4;
                throw new RuntimeException(e);
            }

            return Base64.getEncoder().encodeToString(encryptStr);
        } else {
            return null;
        }
    }
}
