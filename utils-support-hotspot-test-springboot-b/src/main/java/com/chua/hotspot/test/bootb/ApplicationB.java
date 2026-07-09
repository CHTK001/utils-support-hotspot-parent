package com.chua.hotspot.test.bootb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SpringBoot 测试应用 B - 被调用方
 * <p>
 * 端口: 18082
 * 功能: 接收服务 A 的 HTTP 调用，可回调服务 A 形成双向链路
 * 测试: Agent 链路追踪 + IP 关系追踪
 * </p>
 *
 * 启动方式:
 * java -javaagent:output/java8/hotspot-agent.jar -jar target/utils-support-hotspot-test-springboot-b.jar
 */
@SpringBootApplication
public class ApplicationB {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationB.class, args);
    }
}