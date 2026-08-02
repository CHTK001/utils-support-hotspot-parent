# utils-support-hotspot-agent

Utils Support Hotspot Agent - 热点监控代理模块

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
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>utils-support-hotspot-agent</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `Agent` | Agent 薄壳入口 - 只做3件事 1. 注入 spy.jar 到 Bootstrap ClassLoader 2. 创建 HotspotClassLoade |
| `HotspotClassLoader` | Agent 专用的类加载器 - 加载 core.jar + libs/ + plugins/ agent 薄壳通过此类加载器加载 core 和所有依赖，实现 a |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-agent
└── (无内部依赖)
```