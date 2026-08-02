# utils-support-hotspot-oracle

Utils Support Hotspot Oracle - Oracle热点监控模块

        该模块提供Oracle数据库的热点监控功能。

        主要特性：
        - 🔧 SQL执行监控：监控SQL语句执行
        - 🚀 性能分析：SQL执行时间和性能指标
        - 🛡️ 链路追踪：集成链路追踪支持
        - 📚 服务发现：自动发现Oracle服务实例

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-oracle</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `OraclePlugin` | Oracle 拦截插件 拦截 oracle.jdbc.driver.OraclePreparedStatement.executeInternal 方法 @ve |
| `PluginRegistration` | Oracle 插件注册 @version 4.0.0.33 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-oracle
├── utils-support-hotspot-core
```