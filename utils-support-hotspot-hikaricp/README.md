# utils-support-hotspot-hikaricp

HikariCP连接池热点监控模块 - 拦截连接获取/归还，监控连接池性能指标

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>utils-support-hotspot-hikaricp</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `HikariCPPlugin` | HikariCP 连接池拦截插件 拦截 HikariPool.getConnection 和 HikariPool.evictConnection， 监控连接获 |
| `PluginRegistration` | HikariCP 插件注册 @version 4.0.0.40 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-hikaricp
├── utils-support-hotspot-core
```