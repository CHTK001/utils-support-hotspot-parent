# utils-support-hotspot-dragonfly

Dragonfly缓存操作热点监控模块，提供Redis兼容的高性能内存数据存储监控

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>utils-support-hotspot-dragonfly</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `DragonflyPlugin` | Dragonfly Socket 创建拦截插件 拦截 DefaultJedisSocketFactory.createSocket 方法 Dragonfly 完 |
| `PluginRegistration` | Dragonfly 插件注册 拦截 DefaultJedisSocketFactory.createSocket 由于 Dragonfly 兼容 Redis 协 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-dragonfly
├── utils-support-hotspot-core
```