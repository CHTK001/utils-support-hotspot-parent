# utils-support-hotspot-jetty

Utils Support Hotspot Jetty - Jetty热点监控模块

        该模块提供 Jetty 服务器的热点监控功能。

        主要特性：
        - 🔧 功能完整：提供完整的 Jetty HTTP 请求监控
        - 🚀 性能优化：高性能的实现方案
        - 🛡️ 稳定可靠：经过充分测试和验证
        - 📚 文档完善：详细的使用文档和示例
        - 🔄 易于集成：简单的 API 和配置方式

        适用场景：
        - 使用 Jetty 作为 Web 服务器的应用
        - Spring Boot + Jetty 的应用
        - 嵌入式 Jetty 应用

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.eclipse.jetty</groupId>
    <artifactId>utils-support-hotspot-jetty</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `JettyPlugin` | Jetty HTTP 请求拦截插件 拦截 Jetty 的 HttpChannel.handle() 方法，实现 HTTP 请求的链路追踪和性能监控。 |
| `PluginRegistration` | Jetty 插件注册 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-jetty
├── utils-support-hotspot-core
```