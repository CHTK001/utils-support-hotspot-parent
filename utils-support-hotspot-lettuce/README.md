# utils-support-hotspot-lettuce

Lettuce缓存操作热点监控模块

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>io.lettuce</groupId>
    <artifactId>utils-support-hotspot-lettuce</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `PluginRegistration` | Lettuce 插件注册 注意：Lettuce 与 Spring Data Redis 的集成插件已移至 spring5x 和 spring6x 模块 本模块仅 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-lettuce
├── utils-support-hotspot-core
```