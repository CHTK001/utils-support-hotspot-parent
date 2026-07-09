package com.chua.hotspot.test.boota;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SpringBoot 测试应用 A - 调用方
 * <p>
 * 端口: 18081
 * 功能: 接收请求后通过 HttpClient 调用服务 B (18082)
 * 测试: Agent 链路追踪 + IP 关系追踪
 * </p>
 *
 * 启动方式:
 * java -javaagent:output/java8/hotspot-agent.jar -jar target/utils-support-hotspot-test-springboot-a.jar
 */
@SpringBootApplication
public class ApplicationA {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationA.class, args);
    }
}