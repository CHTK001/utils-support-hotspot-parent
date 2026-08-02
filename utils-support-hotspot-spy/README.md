# utils-support-hotspot-spy

Spy bridge module for Bootstrap ClassLoader injection

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>utils-support-hotspot-spy</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `Spy` | Spy 桥接类 - 注入 Bootstrap ClassLoader 的最小桥接层 此类是整个 Spy 模式的核心，被注入到 Bootstrap ClassLo |
| `SpyHandler` | Spy 回调处理器接口 由 agent core 实现（SpyHandlerImpl），注册到 Spy.HANDLER。 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-spy
└── (无内部依赖)
```