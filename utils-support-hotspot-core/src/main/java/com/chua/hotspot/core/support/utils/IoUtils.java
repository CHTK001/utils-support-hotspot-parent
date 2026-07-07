package com.chua.hotspot.core.support.utils;

import java.io.*;
import java.nio.charset.StandardCharsets;

/**
 * @author CH
 */
public class IoUtils {


    /**
     * 字符串
     *
     * @param resourceAsStream 资源作为流
     * @return {@link String}
     */
    public static String toString(InputStream resourceAsStream) {
        char[] chars = new char[4096];
        int read = 0;
        try (
                StringWriter stringWriter = new StringWriter();
                InputStreamReader reader = new InputStreamReader(resourceAsStream, StandardCharsets.UTF_8)
        ) {
            while ((read = reader.read(chars)) != -1) {
                stringWriter.write(chars, 0, read);
            }

            stringWriter.flush();
            return stringWriter.toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * byte
     *
     * @param resourceAsStream 资源作为流
     * @return {@link byte[]}
     */
    public static byte[] toByteArray(InputStream resourceAsStream) {
        byte[] chars = new byte[4096];
        int read = 0;
        try (
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                InputStream inputStream = resourceAsStream
        ) {
            while ((read = inputStream.read(chars)) != -1) {
                byteArrayOutputStream.write(chars, 0, read);
            }

            byteArrayOutputStream.flush();
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
