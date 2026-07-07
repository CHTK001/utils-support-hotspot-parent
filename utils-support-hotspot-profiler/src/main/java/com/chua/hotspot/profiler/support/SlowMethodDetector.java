package com.chua.hotspot.profiler.support;

import com.chua.hotspot.core.support.log.LogFactory;
import net.bytebuddy.ByteBuddy;
// import net.bytebuddy.agent.ByteBuddyAgent;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.loading.ClassReloadingStrategy;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.instrument.Instrumentation;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 慢方法检测器
 * 使用ByteBuddy自动注入方法执行时间统计代码
 *
 * @author CH
 */
public class SlowMethodDetector {

    private static final LogFactory logger = LogFactory.getInstance();
    
    private static final SlowMethodDetector INSTANCE = new SlowMethodDetector();
    
    private Instrumentation instrumentation;
    
    // 已instrumented的类
    private final Set<String> instrumentedClasses = ConcurrentHashMap.newKeySet();
    
    // 需要排除的包前缀
    private final Set<String> excludedPackages = new HashSet<>();
    
    private volatile boolean initialized = false;

    private SlowMethodDetector() {
        // 默认排除的包
        excludedPackages.add("java.");
        excludedPackages.add("javax.");
        excludedPackages.add("sun.");
        excludedPackages.add("com.sun.");
        excludedPackages.add("jdk.");
        excludedPackages.add("org.springframework.");
        excludedPackages.add("net.bytebuddy.");
        excludedPackages.add("com.chua.hotspot.");
    }

    public static SlowMethodDetector getInstance() {
        return INSTANCE;
    }

    /**
     * 初始化慢方法检测器
     * 
     * @param inst Instrumentation实例
     */
    public void initialize(Instrumentation inst) {
        if (initialized) {
            logger.warn("SlowMethodDetector already initialized");
            return;
        }
        
        this.instrumentation = inst;
        this.initialized = true;
        logger.info("SlowMethodDetector initialized successfully");
    }

    /**
     * 为指定类启用方法profiling
     * 
     * @param className 类名（可以使用通配符，如com.example.*）
     */
    public void enableProfilingForClass(String className) {
        if (!initialized) {
            logger.warn("SlowMethodDetector not initialized, call initialize() first");
            return;
        }

        if (isExcluded(className)) {
            logger.warn("Class {} is in excluded packages", className);
            return;
        }

        try {
            // 使用ByteBuddy重新定义类
            Class<?> target = Class.forName(className);
            new ByteBuddy()
                .redefine(target)
                .visit(Advice.to(MethodTimingAdvice.class).on(ElementMatchers.any()))
                .make()
                .load(target.getClassLoader(), ClassReloadingStrategy.of(instrumentation));
            
            instrumentedClasses.add(className);
            logger.info("Enabled profiling for class: {}", className);
        } catch (Exception e) {
            logger.error("Failed to enable profiling for class: " + className, e);
        }
    }

    /**
     * 为指定包启用方法profiling
     * 
     * @param packageName 包名
     */
    public void enableProfilingForPackage(String packageName) {
        if (!initialized) {
            logger.warn("SlowMethodDetector not initialized");
            return;
        }

        if (isExcluded(packageName)) {
            logger.warn("Package {} is in excluded packages", packageName);
            return;
        }

        try {
            // 获取所有已加载的类
            Class<?>[] loadedClasses = instrumentation.getAllLoadedClasses();
            int count = 0;
            
            for (Class<?> clazz : loadedClasses) {
                if (clazz.getName().startsWith(packageName) && !isExcluded(clazz.getName())) {
                    try {
                        enableProfilingForClass(clazz.getName());
                        count++;
                    } catch (Exception e) {
                        logger.debug("Failed to instrument class: {}", clazz.getName());
                    }
                }
            }
            
            logger.info("Enabled profiling for package: {}, instrumented {} classes", packageName, count);
        } catch (Exception e) {
            logger.error("Failed to enable profiling for package: " + packageName, e);
        }
    }

    /**
     * 添加排除的包前缀
     * 
     * @param packagePrefix 包前缀
     */
    public void addExcludedPackage(String packagePrefix) {
        excludedPackages.add(packagePrefix);
        logger.info("Added excluded package: {}", packagePrefix);
    }

    /**
     * 移除排除的包前缀
     * 
     * @param packagePrefix 包前缀
     */
    public void removeExcludedPackage(String packagePrefix) {
        excludedPackages.remove(packagePrefix);
        logger.info("Removed excluded package: {}", packagePrefix);
    }

    /**
     * 获取所有排除的包前缀
     * 
     * @return 排除的包前缀集合
     */
    public Set<String> getExcludedPackages() {
        return new HashSet<>(excludedPackages);
    }

    /**
     * 检查类或包是否被排除
     * 
     * @param name 类名或包名
     * @return 是否被排除
     */
    private boolean isExcluded(String name) {
        for (String prefix : excludedPackages) {
            if (name.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取已instrumented的类列表
     * 
     * @return 类名集合
     */
    public Set<String> getInstrumentedClasses() {
        return new HashSet<>(instrumentedClasses);
    }

    /**
     * 检查是否已初始化
     * 
     * @return 是否已初始化
     */
    public boolean isInitialized() {
        return initialized;
    }

    /**
     * ByteBuddy Advice类，用于注入方法执行时间统计代码
     */
    public static class MethodTimingAdvice {

        /**
         * 方法执行前
         * 
         * @return 开始时间戳
         */
        @Advice.OnMethodEnter
        public static long enter() {
            return System.currentTimeMillis();
        }

        /**
         * 方法执行后
         * 
         * @param startTime 开始时间戳
         * @param origin 方法签名
         */
        @Advice.OnMethodExit
        public static void exit(@Advice.Enter long startTime, 
                              @Advice.Origin String origin) {
            try {
                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;
                
                // 记录到MethodProfiler
                MethodProfiler.getInstance().recordMethodExecution(origin, executionTime);
            } catch (Exception e) {
                // 忽略错误，避免影响业务代码
            }
        }
    }
}
