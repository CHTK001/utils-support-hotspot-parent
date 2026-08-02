# utils-support-hotspot-logger

Utils Support Hotspot Logger - 日志热点监控模块

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
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-logger</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `LogPlugin` | 日志插件 支持 Logback、Log4j、System.out/System.err 日志检测 @version 4.0.0.34 |
| `SystemOutPlugin` | System.out/System.err 日志插件（Spy 模式） 拦截方式：ByteBuddy Advice + Spy 桥接模式 拦截目标：java.io |
| `PluginRegistration` | Logger 插件注册 支持 Logback、Log4j、System.out/System.err 日志检测 @version 4.0.0.34 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-logger
├── utils-support-hotspot-core
```