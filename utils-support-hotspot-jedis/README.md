# utils-support-hotspot-jedis

Jedis缓存操作热点监控模块

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>utils-support-hotspot-jedis</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `JedisPlugin` | Jedis Socket 创建拦截插件 拦截 DefaultJedisSocketFactory.createSocket 方法 @version 4.0.0. |
| `PluginRegistration` | Jedis 插件注册 只保留底层拦截（DefaultJedisSocketFactory.createSocket） 可以同时捕获原生 Jedis 和 Spri |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-jedis
├── utils-support-hotspot-core
```