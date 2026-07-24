# utils-support-hotspot-tomcat9x

Utils Support Hotspot Tomcat9x - Tomcat 9.x热点监控模块

        该模块提供专业的功能支持和工具集成。

        主要特性：
        - 🔧 功能完整：提供完整的功能实现
        - 🚀 性能优化：高性能的实现方案
        - 🛡️ 稳定可靠：经过充分测试和验证
        - 📚 文档完善：详细的使用文档和示例
        - 🔄 易于集成：简单的 API 和配置方式

        适用场景：
        - 企业级应用开发
        - 系统集成项目
        - 工具链构建
        - 第三方服务集成

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>utils-support-hotspot-tomcat9x</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `TomcatLinkResolver` | Tomcat 9.x 链路解析器 通过反射支持 Tomcat 内部类和标准 Servlet API @version 4.0.0.38 |
| `TomcatPlugin` | Tomcat 9.x HTTP 请求拦截插件 拦截 StandardHostValve.invoke 方法，实现 HTTP 请求的链路追踪和性能监控。 |
| `TomcatTransfer` | Tomcat 数据传输器 负责将 Tomcat 请求/响应数据转换为 Span 对象 @version 4.0.0.34 |
| `PluginRegistration` | Tomcat 9x 插件注册入口 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-tomcat9x
├── utils-support-hotspot-core
```