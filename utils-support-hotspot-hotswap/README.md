# utils-support-hotspot-hotswap

Utils Support Hotspot HotSwap - 热替换监控模块

        该模块提供 Java 应用的热重载功能，集成 HotswapAgent 实现：
        - 类文件热替换（无需重启应用）
        - Spring Bean 热重载
        - 配置文件监听和重载

        主要特性：
        - 🔧 无缝热替换：支持方法体、字段、注解等修改的热替换
        - 🚀 Spring 集成：自动处理 Spring Bean 的重新注册
        - 🛡️ 稳定可靠：基于成熟的 HotswapAgent 框架
        - 📚 文件监听：支持 class、jar、xml 等文件变更监听
        - 🔄 易于集成：简单配置即可启用

        适用场景：
        - 开发环境热部署
        - 微服务快速迭代
        - Spring Boot 应用调试

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.hotswapagent</groupId>
    <artifactId>utils-support-hotspot-hotswap</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `HotswapAgentPlugin` | HotswapAgent 热重载插件 这是一个简单的 HotswapAgent 插件，用于记录类热重载事件。 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-hotswap
├── utils-support-hotspot-core
```