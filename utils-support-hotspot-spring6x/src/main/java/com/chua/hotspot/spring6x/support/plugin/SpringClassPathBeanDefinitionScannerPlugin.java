package com.chua.hotspot.spring6x.support.plugin;

import com.chua.hotspot.core.support.entity.ClassSource;
import com.chua.hotspot.core.support.hotswap.Hotswap;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.span.NewTrackManager;
import com.chua.hotspot.spring6x.support.factory.SpringFactory;
import com.chua.hotspot.spring6x.support.handler.SpringStaticHandler;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * 班路径bean释义扫描仪插件
 *
 * @author CH
 */
public class SpringClassPathBeanDefinitionScannerPlugin extends BytebuddyPlugin implements Hotswap<ClassSource> {

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
            @SuperCall(nullIfImpossible = true) Callable<?> callable) throws Exception {
        // 热重载功能交给 HotswapAgent，直接调用原方法
        return NewTrackManager.invoke(callable);
    }

    @Override
    public String name() {
        return "Spring-ClassPathBeanDefinitionScannerPlugin";
    }

    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(ElementMatchers.named("doScan")).intercept(MethodDelegation.to(SpringClassPathBeanDefinitionScannerPlugin.class));
    }

    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.springframework.context.annotation.ClassPathBeanDefinitionScanner");
    }

    @Override
    public void reload(ClassSource classSource) {
        if (null == SpringFactory.getInstance().applicationContext) {
            return;
        }

        if (classSource.startsWith("com.chua.common")) {
            return;
        }

        String[] beanNamesForType = new String[0];
        try {
            beanNamesForType = SpringFactory.getInstance().getBeanNamesForType(classSource.getType());
        } catch (Exception e) {
            return;
        }
        if (beanNamesForType.length == 0) {
            return;
        }

        SpringStaticHandler.reset();
        SpringFactory.getInstance().reset(classSource);
    }
}
