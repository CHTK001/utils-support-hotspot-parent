# utils-support-hotspot-httpclient3x

Apache Commons HttpClient 3.x 热点监控模块

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>commons-httpclient</groupId>
    <artifactId>utils-support-hotspot-httpclient3x</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `HttpClient3xPlugin` | HttpClient 3.x 插件 支持 Apache Commons HttpClient 3.x 版本的请求拦截 @version 4.0.0.34 |
| `PluginRegistration` | HttpClient 3.x 插件注册类 负责注册 HttpClient 3.x 插件到 PluginRegistry |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-httpclient3x
├── utils-support-hotspot-core
```