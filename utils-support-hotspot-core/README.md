# utils-support-hotspot-core

Utils Support Hotspot Core - 热点监控核心模块

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
    <artifactId>utils-support-hotspot-core</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `AgentBootstrap` | Agent 核心启动入口 由 agent 薄壳通过反射调用，在 HotspotPluginClassLoader 中执行所有核心初始化逻辑。 |
| `AgentFactory` | Agent 工厂 - 构建和安装 ByteBuddy AgentBuilder 支持 Advice + Spy 模式和旧版 MethodDelegation 模 |
| `AgentListener` | Agent 构建监听器 记录字节码增强事件并同步到 AgentSelfMonitor |
| `SpyAdvice` | Spy Advice 内联通知类 由 ByteBuddy Advice 内联到目标方法中，调用 Spy 桥接类的静态方法。 |
| `AbstractVersionTransform` | Transform |
| `TransformFactory` | TransformFactory |
| `VersionTransform` | Transform |
| `AlertLevel` | 告警级别枚举 定义告警的严重程度，从低到高分为 INFO、WARN、ERROR、CRITICAL @version 4.0.0.34 |
| `AlertManager` | 告警管理器 核心职责： 管理告警规则的注册、更新、删除 接收指标数据并评估是否触发告警 记录告警历史并去重（同一规则告警间隔控制） 通过 ReportFacto |
| `AlertRecord` | 告警记录 记录一次告警的完整信息，包括触发规则、指标值、告警时间等。 @version 4.0.0.34 |
| ... | 共 170 个类 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-core
├── utils-support-hotspot-spy
```