package com.chua.hotspot.mybatis.support.plugin;

import com.chua.hotspot.core.support.plugin.BytebuddyPlugin;
import com.chua.hotspot.core.support.server.api.SqlMonitorApi;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.*;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * MyBatis SQL 监控插件
 * <p>
 * 拦截 Executor 的 SQL 执行方法，捕获完整 SQL 语句
 * </p>
 * 
 * @author CH
 * @since 2024/12/14
 * @version 4.0.0.36
 */
public class MybatisSqlMonitorPlugin extends BytebuddyPlugin {
    
    @RuntimeType
    public static Object intercept(
            @This Object target,
            @Origin Method method,
            @AllArguments Object[] args,
            @Super Object delegate,
            @SuperCall Callable<?> callable) throws Exception {
        
        long startTime = System.currentTimeMillis();
        String sql = null;
        String error = null;
        
        try {
            // 提取 SQL 语句
            if (args != null && args.length > 0 && args[0] instanceof MappedStatement) {
                MappedStatement ms = (MappedStatement) args[0];
                Object parameter = args.length > 1 ? args[1] : null;
                
                try {
                    BoundSql boundSql = ms.getBoundSql(parameter);
                    sql = boundSql.getSql();
                    
                    // 清理 SQL 格式
                    if (sql != null) {
                        sql = sql.replaceAll("\\s+", " ").trim();
                    }
                } catch (Exception e) {
                    // 忽略 SQL 提取失败
                }
            }
            
            // 执行原始方法
            return callable.call();
            
        } catch (Exception e) {
            error = e.getMessage();
            throw e;
        } finally {
            // 记录 SQL
            if (sql != null) {
                long duration = System.currentTimeMillis() - startTime;
                SqlMonitorApi.addSqlRecord(sql, duration, error);
            }
        }
    }
    
    @Override
    public String name() {
        return "Mybatis-SQL-Monitor";
    }
    
    @Override
    public DynamicType.Builder.MethodDefinition.ReceiverTypeDefinition<?> transform(DynamicType.Builder<?> builder) {
        return builder.method(
                ElementMatchers.named("query")
                        .or(ElementMatchers.named("update"))
        ).intercept(MethodDelegation.to(MybatisSqlMonitorPlugin.class));
    }
    
    @Override
    public ElementMatcher<? super TypeDescription> type() {
        return ElementMatchers.named("org.apache.ibatis.executor.CachingExecutor")
                .or(ElementMatchers.named("org.apache.ibatis.executor.SimpleExecutor"))
                .or(ElementMatchers.named("org.apache.ibatis.executor.ReuseExecutor"))
                .or(ElementMatchers.named("org.apache.ibatis.executor.BatchExecutor"))
                .or(ElementMatchers.hasSuperType(ElementMatchers.named("org.apache.ibatis.executor.BaseExecutor")));
    }
}
