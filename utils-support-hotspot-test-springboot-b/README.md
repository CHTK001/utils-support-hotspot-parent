# utils-support-hotspot-test-springboot-b

SpringBoot 测试应用 B - 作为链路追踪的被调用方。
        启动后监听 18082 端口，接收服务 A 的 HTTP 调用，
        也可回调服务 A 形成双向链路，验证 Agent 的链路追踪和 IP 关系追踪功能。
        
        启动方式：
        java -javaagent:output/java8/hotspot-agent.jar -jar target/utils-support-hotspot-test-springboot-b.jar

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>utils-support-hotspot-test-springboot-b</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-test-springboot-b
└── (无内部依赖)
```