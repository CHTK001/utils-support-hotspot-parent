package com.chua.hotspot.spring.support.wrapper;

import com.chua.hotspot.core.support.environment.Project;
import com.chua.hotspot.core.support.report.ReportFactory;
import com.chua.hotspot.core.support.utils.DigestUtils;
import com.chua.hotspot.core.support.utils.NetUtils;
import com.chua.hotspot.core.support.utils.NumberUtils;
import com.chua.hotspot.core.support.utils.StringUtils;
import org.springframework.core.env.Environment;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.IntStream;

import static com.chua.hotspot.core.support.environment.Project.KEY;

/**
 * spring环境注册
 *
 * @author CH
 */
public class SpringEnvironmentWrapper implements EnvironmentWrapper {
    
    private static final String DEFAULT = "";
    @Override
    public void register(Object environment1) {
        if (!(environment1 instanceof Environment)) {
            return;
        }
        Environment environment = (Environment) environment1;
        String enable = environment.resolvePlaceholders("${plugin.report.client.enable:true}");
        String address = environment.resolvePlaceholders("${plugin.report.client.address:}");
//        MutablePropertySources propertySources = ((ConfigurableEnvironment) environment).getPropertySources();
//        for (PropertySource<?> propertySource : propertySources) {
//            if(propertySource instanceof ConfigurableEnvironment configurableEnvironment) {
//            }
//        }
        List<String> reportList = new LinkedList<>();
        IntStream.of(0, 20).forEach(it -> {
            String property = environment.getProperty("plugin.report.client.report[" + it + "]");
            if (StringUtils.isBlank(property)) {
                return;
            }
            reportList.add(property.toUpperCase());
        });
        if (!"true".equals(enable) && !StringUtils.isBlank(address)) {
            return;
        }
        Project project = Project.getInstance();
        project.setEnvironment(environment);
        project.setReportAddress(address);
        project.setReportType(reportList);
        project.setApplicationName(environment.getProperty("spring.application.name"));
        project.setApplicationPort(NumberUtils.toInt(environment.resolvePlaceholders("${server.port:8080}")));
        String localHost = NetUtils.getLocalHost();
        project.setApplicationHost(environment.resolvePlaceholders("${server.host:" + localHost + "}"));
        project.setApplicationActive(environment.getProperty("spring.profiles.active", DEFAULT));
        project.setApplicationActiveInclude(environment.getProperty("spring.profiles.include", ""));
        project.setContextPath(environment.resolvePlaceholders("${server.servlet.context-path:}"));
        project.setEndpointsUrl(environment.resolvePlaceholders("${management.endpoints.web.base-path:/actuator}"));
        project.setEndpoints(environment.resolvePlaceholders("${management.endpoints.web.exposure.include:*}"));
        //"spring.datasource"
        project.setDataSourceUrl(environment.resolvePlaceholders("${spring.datasource.url:}"));
        project.setDataSourceDriver(environment.resolvePlaceholders("${spring.datasource.driverClassName:}"));
        project.setDataSourceUsername(environment.resolvePlaceholders("${spring.datasource.username:}"));
        project.setDataSourcePassword(DigestUtils.aesEncrypt(environment.resolvePlaceholders("${spring.datasource.password:}"), KEY));
        project.setClientProtocolEndpointPort(StringUtils.defaultString(environment.resolvePlaceholders("${plugin.report.client.endpoint.port:}"), String.valueOf(NumberUtils.toInt(environment.resolvePlaceholders("${server.port:8080}")) + 10000)));
        project.setClientProtocolEndpointProtocol(environment.resolvePlaceholders("${plugin.report.client.endpoint.protocol:http}"));

        // 打印应用框架版本信息
        printFrameworkVersions();
        // 初始化数据上报（需要 Spring 配置）
        ReportFactory.getInstance().init();
    }
    
    /**
     * 打印应用框架版本信息
     */
    private void printFrameworkVersions() {
        System.out.println("========== 应用框架版本信息 ==========");
        
        // Spring 版本
        String springVersion = getSpringVersion();
        if (springVersion != null) {
            System.out.println("Spring: " + springVersion);
        }
        
        // Spring Boot 版本
        String springBootVersion = getSpringBootVersion();
        if (springBootVersion != null) {
            System.out.println("Spring Boot: " + springBootVersion);
        }
        
        // Tomcat 版本
        String tomcatVersion = getTomcatVersion();
        if (tomcatVersion != null) {
            System.out.println("Tomcat: " + tomcatVersion);
        }
        
        // Undertow 版本
        String undertowVersion = getUndertowVersion();
        if (undertowVersion != null) {
            System.out.println("Undertow: " + undertowVersion);
        }
        
        // Jetty 版本
        String jettyVersion = getJettyVersion();
        if (jettyVersion != null) {
            System.out.println("Jetty: " + jettyVersion);
        }
        
        // MyBatis 版本
        String mybatisVersion = getMybatisVersion();
        if (mybatisVersion != null) {
            System.out.println("MyBatis: " + mybatisVersion);
        }
        
        // Java 版本
        System.out.println("Java: " + System.getProperty("java.version"));
        System.out.println("JVM: " + System.getProperty("java.vm.name") + " " + System.getProperty("java.vm.version"));
        System.out.println("=======================================");
    }
    
    private String getSpringVersion() {
        try {
            Class<?> clazz = Class.forName("org.springframework.core.SpringVersion");
            return (String) clazz.getMethod("getVersion").invoke(null);
        } catch (Exception e) {
            return null;
        }
    }
    
    private String getSpringBootVersion() {
        try {
            Class<?> clazz = Class.forName("org.springframework.boot.SpringBootVersion");
            return (String) clazz.getMethod("getVersion").invoke(null);
        } catch (Exception e) {
            return null;
        }
    }
    
    private String getTomcatVersion() {
        try {
            Class<?> clazz = Class.forName("org.apache.catalina.util.ServerInfo");
            return (String) clazz.getMethod("getServerNumber").invoke(null);
        } catch (Exception e) {
            return null;
        }
    }
    
    private String getUndertowVersion() {
        try {
            Class<?> clazz = Class.forName("io.undertow.Version");
            return (String) clazz.getMethod("getVersionString").invoke(null);
        } catch (Exception e) {
            return null;
        }
    }
    
    private String getJettyVersion() {
        try {
            Class<?> clazz = Class.forName("org.eclipse.jetty.util.Jetty");
            return (String) clazz.getField("VERSION").get(null);
        } catch (Exception e) {
            return null;
        }
    }
    
    private String getMybatisVersion() {
        try {
            Class<?> clazz = Class.forName("org.apache.ibatis.session.Configuration");
            Package pkg = clazz.getPackage();
            return pkg != null ? pkg.getImplementationVersion() : null;
        } catch (Exception e) {
            return null;
        }
    }
}
