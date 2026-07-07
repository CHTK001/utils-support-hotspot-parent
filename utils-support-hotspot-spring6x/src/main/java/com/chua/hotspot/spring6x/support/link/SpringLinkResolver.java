package com.chua.hotspot.spring6x.support.link;

import com.chua.hotspot.core.support.link.LinkResolver;
import com.chua.hotspot.core.support.span.Span;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.context.request.ServletWebRequest;

import java.util.List;

import static com.chua.hotspot.core.support.constant.Constant.LINK_ID;

/**
 * Spring 6.x 链路解析器（jakarta.servlet）
 * 用于解析 Spring 6.x 环境下的链路 ID
 *
 * @author CH
 * @since 2024/12/11
 * @version 4.0.0.34
 */
public class SpringLinkResolver implements LinkResolver {

    /**
     * 从参数中获取 HttpServletResponse
     *
     * @param objects 参数数组
     * @return HttpServletResponse 对象
     */
    public static HttpServletResponse getResponse(Object[] objects) {
        if (objects == null || objects.length == 0) {
            return null;
        }

        for (Object object : objects) {
            if (object instanceof HttpServletResponse) {
                return (HttpServletResponse) object;
            }
            if (object instanceof ServletWebRequest) {
                return ((ServletWebRequest) object).getResponse();
            }
        }
        return null;
    }

    @Override
    public String name() {
        return "org.springframework.web.context.request.ServletWebRequest";
    }

    @Override
    public String getLinkId(Object[] args) {
        if (args == null || args.length == 0) {
            return null;
        }

        Object object = args[0];
        if (object instanceof ServletWebRequest) {
            return ((ServletWebRequest) object).getHeader(LINK_ID);
        }
        return null;
    }

    @Override
    public String getLinkParentId(Object[] args) {
        return getLinkId(args);
    }

    @Override
    public void sendResponse(List<Span> spans, Object response) {
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
