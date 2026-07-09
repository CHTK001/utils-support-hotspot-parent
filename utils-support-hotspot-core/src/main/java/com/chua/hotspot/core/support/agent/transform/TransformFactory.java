package com.chua.hotspot.core.support.agent.transform;

import com.chua.hotspot.core.support.compiler.Compiler;
import com.chua.hotspot.core.support.compiler.JdkCompiler;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.version.Version;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.NotFoundException;
import javassist.util.proxy.MethodFilter;
import javassist.util.proxy.MethodHandler;
import javassist.util.proxy.ProxyObject;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;
import net.bytebuddy.utility.JavaModule;

import java.lang.reflect.Method;
import java.security.ProtectionDomain;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author CH
 */
@SuppressWarnings("ALL")
public class TransformFactory {

    static final TransformFactory INSTANCE = new TransformFactory();
    final LogFactory logFactory = LogFactory.getInstance();
    final Compiler compiler = new JdkCompiler();
    private final Class<?> versionTransformType;
    Map<Version, Class<? extends VersionTransform>> transformList = new ConcurrentHashMap<>();

    public TransformFactory() {
        try {
            javassist.util.proxy.ProxyFactory proxyFactory = new javassist.util.proxy.ProxyFactory();
            proxyFactory.setSuperclass(AbstractVersionTransform.class);
            versionTransformType = proxyFactory.createClass(new MethodFilter() {
                @Override
                public boolean isHandled(Method m) {
                    return "transform".equals(m.getName());
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static TransformFactory getInstance() {
        return INSTANCE;
    }

    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] objects,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        return null;
    }

    public VersionTransform init(BytebuddyPlugin plugin) {
        AbstractVersionTransform newInstance = null;
        try {
            newInstance = (AbstractVersionTransform) versionTransformType.newInstance();
        } catch (Exception e) {
            return null;
        }
        if (plugin instanceof BytebuddyPlugin) {
            newInstance.setPlugin(plugin);
        }
        ProxyObject proxyObject = (ProxyObject) newInstance;
        proxyObject.setHandler(new MethodHandler() {
            @Override
            public Object invoke(Object self, Method thisMethod, Method proceed, Object[] args) throws Throwable {
                return plugin.transform((DynamicType.Builder<?>) args[0]);
            }
        });
        return newInstance;
    }

    private ElementMatcher<? super MethodDescription> createMethod(Version version) {
        if (version.ordinal() > Version.V11.ordinal()) {
            return ElementMatchers.named("transform")
                    .and(ElementMatchers.takesArgument(0, DynamicType.Builder.class))
                    .and(ElementMatchers.takesArgument(1, TypeDescription.class))
                    .and(ElementMatchers.takesArgument(2, ClassLoader.class))
                    .and(ElementMatchers.takesArgument(3, JavaModule.class))
                    .and(ElementMatchers.takesArgument(4, ProtectionDomain.class));
        }
        return ElementMatchers.named("transform")
                .and(ElementMatchers.takesArgument(0, DynamicType.Builder.class))
                .and(ElementMatchers.takesArgument(1, TypeDescription.class))
                .and(ElementMatchers.takesArgument(2, ClassLoader.class))
                .and(ElementMatchers.takesArgument(3, JavaModule.class));
    }

    private CtClass[] createParam(Version version, ClassPool classPool) throws NotFoundException {
        if (version.ordinal() > Version.V11.ordinal()) {
            return new CtClass[]{
                    classPool.get(DynamicType.Builder.class.getTypeName()),
                    classPool.get(TypeDescription.class.getTypeName()),
                    classPool.get(ClassLoader.class.getTypeName()),
                    classPool.get(JavaModule.class.getTypeName()),
                    classPool.get(ProtectionDomain.class.getTypeName()),
            };
        }
        return new CtClass[]{
                classPool.get(DynamicType.Builder.class.getTypeName()),
                classPool.get(TypeDescription.class.getTypeName()),
                classPool.get(ClassLoader.class.getTypeName()),
                classPool.get(JavaModule.class.getTypeName()),
        };
    }
}