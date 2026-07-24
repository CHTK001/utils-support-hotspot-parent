# utils-support-hotspot-httpclient4x

Apache HttpClient 4.x 热点监控模块

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-httpclient4x</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `HttpClient4xPlugin` | HttpClient 4.x 插件 使用 Advice + Spy 模式替代 MethodDelegation 模式，解决 ClassLoader 可见性问题。 |
| `PluginRegistration` | HttpClient 4.x 插件注册类 负责注册 HttpClient 4.x 插件到 PluginRegistry |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-httpclient4x
├── utils-support-hotspot-httpclient3x
├── utils-support-hotspot-core
```