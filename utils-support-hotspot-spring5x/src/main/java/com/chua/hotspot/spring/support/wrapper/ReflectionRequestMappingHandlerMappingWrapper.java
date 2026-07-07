package com.chua.hotspot.spring.support.wrapper;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.chua.hotspot.core.support.qps.UrlQps;
import com.chua.hotspot.core.support.utils.ClassUtils;
import com.chua.hotspot.spring.support.factory.SpringFactory;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.chua.hotspot.spring.support.wrapper.SpringRequestMappingHandlerMappingWrapper.statistics;

public class ReflectionRequestMappingHandlerMappingWrapper implements RequestMappingHandlerMappingWrapper {

    static final ReflectionRequestMappingHandlerMappingWrapper INSTANCE = new ReflectionRequestMappingHandlerMappingWrapper();

    public static byte[] getStaticMapping() {
        return INSTANCE.getMapping();
    }

    @Override
    public byte[] getMapping() {
        Object requestMappingHandlerMapping = SpringFactory.getInstance().requestMappingHandlerMapping;
        if (null == requestMappingHandlerMapping) {
            return new byte[0];
        }
        String[] statistics = UrlQps.getInstance().statistics();
        List<JSONObject> rs = new LinkedList<>();
        Map handlerMethods = (Map) ClassUtils.invoke("getHandlerMethods", requestMappingHandlerMapping);
        handlerMethods.forEach((k, v) -> {
            JSONObject jsonObject = new JSONObject();
            Set<String> directPaths = (Set<String>) ClassUtils.invoke("getDirectPaths", k);
            if (directPaths.isEmpty()) {
                directPaths = (Set<String>) ClassUtils.invoke("getPatternValues", k);
            }
            jsonObject.put("url", directPaths);
            jsonObject.put("produces",
                    ((Set) ClassUtils.invoke("getExpressions", ClassUtils.invoke("getProducesCondition", k)))
                            .stream()
                            .map(it -> ClassUtils.invoke("getMediaType", it))
                            .map(Object::toString)
                            .collect(Collectors.joining(",")));
            jsonObject.put("consumes",
                    ((Set) ClassUtils.invoke("getExpressions", ClassUtils.invoke("getConsumesCondition", k)))
                            .stream()
                            .map(it -> ClassUtils.invoke("getMediaType", it))
                            .map(Object::toString)
                            .collect(Collectors.joining(",")));

            jsonObject.put("methods",
                    ((Set) ClassUtils.invoke("getMethods", ClassUtils.invoke("getMethodsCondition", k)))
                            .stream()
                            .map(it -> ClassUtils.invoke("name", it))
                            .collect(Collectors.toList()));
            jsonObject.put("bean", ClassUtils.invoke("getBean", v));
//            jsonObject.put("shouldValidateArguments", v.shouldValidateArguments());
//            jsonObject.put("shouldValidateReturnValue", v.shouldValidateReturnValue());
            jsonObject.put("beanType", ClassUtils.invoke("getBeanType", ClassUtils.invoke("getBeanType", v)));
            jsonObject.put("methodName",
                    ClassUtils.invoke("getName", ClassUtils.invoke("getMethod", v)));
            jsonObject.put("parameterNumber",
                    ((Object[]) ClassUtils.invoke("getMethodParameters", v)).length);
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
