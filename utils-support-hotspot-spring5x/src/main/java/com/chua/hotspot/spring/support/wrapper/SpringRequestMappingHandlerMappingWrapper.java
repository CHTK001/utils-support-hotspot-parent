package com.chua.hotspot.spring.support.wrapper;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.qps.UrlQps;
import com.chua.hotspot.spring.support.factory.SpringFactory;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.condition.MediaTypeExpression;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 请求映射
 *
 * @author CH
 */
public class SpringRequestMappingHandlerMappingWrapper implements RequestMappingHandlerMappingWrapper {
    static final SpringRequestMappingHandlerMappingWrapper INSTANCE = new SpringRequestMappingHandlerMappingWrapper();

    public static byte[] getStaticMapping() {
        return INSTANCE.getMapping();
    }

    public static int statistics(String directPath, String[] statistics) {
        for (String statistic : statistics) {
            if (statistic.endsWith(directPath)) {
                return UrlQps.getInstance().count(statistic);
            }
        }

        return 0;
    }

    @Override
    public byte[] getMapping() {
        RequestMappingHandlerMapping requestMappingHandlerMapping = (RequestMappingHandlerMapping) SpringFactory.getInstance().requestMappingHandlerMapping;
        if (null == requestMappingHandlerMapping) {
            return new byte[0];
        }
        String[] statistics = UrlQps.getInstance().statistics();
        List<JSONObject> rs = new LinkedList<>();
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping.getHandlerMethods();
        handlerMethods.forEach((k, v) -> {
            JSONObject jsonObject = new JSONObject();
            Set<String> directPaths = k.getDirectPaths();
            if (directPaths.isEmpty()) {
                directPaths = k.getPatternValues();
            }
            jsonObject.put("url", directPaths);
            jsonObject.put("produces", k.getProducesCondition().getExpressions().stream().map(MediaTypeExpression::getMediaType)
                    .map(Object::toString)
                    .collect(Collectors.joining(",")));
            jsonObject.put("consumes", k.getConsumesCondition().getExpressions().stream().map(MediaTypeExpression::getMediaType).map(Object::toString)
                    .collect(Collectors.joining(",")));
            jsonObject.put("methods", k.getMethodsCondition().getMethods().stream().map(RequestMethod::name).collect(Collectors.toList()));
            jsonObject.put("bean", v.getBean());
//            jsonObject.put("shouldValidateArguments", v.shouldValidateArguments());
//            jsonObject.put("shouldValidateReturnValue", v.shouldValidateReturnValue());
            jsonObject.put("beanType", v.getBeanType().getTypeName());
            jsonObject.put("methodName", v.getMethod().getName());
            jsonObject.put("parameterNumber", v.getMethodParameters().length);
            int sum = 0;
            for (String directPath : directPaths) {
                sum += statistics(directPath.replace("/", "_"), statistics);
            }

            jsonObject.put("qps", sum / 86400f);
            jsonObject.put("visited", sum);

            rs.add(jsonObject);
        });
        rs.sort((o1, o2) -> o2.getFloat("qps").compareTo(o1.getFloat("qps")));
        return JSON.toJSONBytes(rs);
    }
}
