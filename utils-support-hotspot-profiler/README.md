# utils-support-hotspot-profiler

Utils Support Hotspot Profiler - 慢方法性能分析模块

        该模块提供方法级性能监控和慢方法检测功能。

        主要特性：
        - 🔍 自动识别执行时间超过阈值的方法
        - 📊 方法调用耗时排行榜
        - 🔗 方法调用链耗时分析
        - ⚙️ 支持动态调整阈值
        - 📈 实时性能统计和趋势分析

        适用场景：
        - 应用性能调优
        - 慢方法定位和分析
        - 方法级性能监控
        - 性能瓶颈识别

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-profiler</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `MethodProfiler` | 方法性能分析器 负责记录和统计方法执行时间 |
| `SlowMethodApi` | 慢方法分析API 提供方法性能统计和慢方法查询接口 |
| `SlowMethodDetector` | 慢方法检测器 使用ByteBuddy自动注入方法执行时间统计代码 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-profiler
├── utils-support-hotspot-core
```