# utils-support-hotspot-dubbo2x

Utils Support Hotspot Dubbo2x - Dubbo2.x热点监控模块

        该模块提供 Dubbo 2.x 版本的监控支持。

        主要特性：
        - 🔧 支持 Dubbo 2.x（com.alibaba.dubbo）
        - 🚀 RPC 调用监控
        - 🛡️ 服务实例追踪
        - 📚 分布式链路追踪
        - 🔄 无侵入式监控

        适用场景：
        - Dubbo 2.x 应用监控
        - 微服务性能分析
        - 分布式链路追踪

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-dubbo2x</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `Dubbo2xLinkResolver` | Dubbo 2.x 链路解析器 |
| `Dubbo2xContextPlugin` | Dubbo 2.x 上下文插件 |
| `Dubbo2xPlugin` | Dubbo 2.x 监控插件 支持 com.alibaba.dubbo 包名的 Dubbo 2.x 版本 @version 4.0.0.33 |
| `Dubbo2xResponsePlugin` | Dubbo 2.x 响应插件 |
| `PluginRegistration` | Dubbo2x 插件注册 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-dubbo2x
├── utils-support-hotspot-core
```