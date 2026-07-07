package com.chua.hotspot.mybatis.support.plugin;

import com.chua.hotspot.core.support.hotswap.Hotswap;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;
import org.apache.ibatis.session.Configuration;

import java.io.File;
import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * @author CH
 */
public class MybatisConfigurationPlugin extends BytebuddyPlugin implements Hotswap<File> {
    @RuntimeType
    public static Object intercept(
            // 被拦截的目标对象 （动态生成的目标对象）
            @This Object target,
            // 正在执行的方法Method 对象（目标对象父类的Method）
            @Origin Method method,
            // 正在执行的方法的全部参数
            @AllArguments Object[] objects,
            // 目标对象的一个代理
            @Super Object delegate,
            // 方法的调用者对象 对原始方法的调用依靠它
            @SuperCall Callable<?> callable) throws Exception {
        MybatisFactory.getInstance().register((Configuration) target);
        MybatisFactory.getInstance().register(objects[0].toString());
        return callable.call();
    }

    @Override
    public String name() {
        return "Mybatis-Configuration";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("addLoadedResource")).intercept(MethodDelegation.to(MybatisConfigurationPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.ibatis.session.Configuration")
                .or(ElementMatchers.hasSuperType(ElementMatchers.named("org.apache.ibatis.session.Configuration")));
//        return ElementMatchers.named("org.apache.ibatis.builder.xml.XMLConfigBuilder")
//                .or(ElementMatchers.hasSuperType(ElementMatchers.named("org.apache.ibatis.builder.xml.XMLConfigBuilder")));
    }

    @Override
    public void reload(File file) {
        if (!file.exists()) {
            logFactory.info("{} not found", file.getAbsolutePath());
            return;
        }
        MybatisFactory.getInstance().rebaseXml(file);
    }
}
