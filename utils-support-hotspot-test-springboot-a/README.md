# utils-support-hotspot-test-springboot-a

SpringBoot 测试应用 A - 作为链路追踪的调用方。
        启动后监听 18081 端口，内部通过 HttpClient 调用服务 B (18082)，
        用于验证 Agent 的链路追踪和 IP 关系追踪功能。
        
        启动方式：
        java -javaagent:output/java8/hotspot-agent.jar -jar target/utils-support-hotspot-test-springboot-a.jar

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>utils-support-hotspot-test-springboot-a</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-test-springboot-a
└── (无内部依赖)
```