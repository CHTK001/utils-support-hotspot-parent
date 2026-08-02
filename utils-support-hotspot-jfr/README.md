# utils-support-hotspot-jfr

JDK Flight Recorder 集成模块

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>utils-support-hotspot-jfr</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `JfrApi` | JFR API 提供 JDK Flight Recorder 控制接口 @version 4.0.0.36 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-jfr
├── utils-support-hotspot-core
```