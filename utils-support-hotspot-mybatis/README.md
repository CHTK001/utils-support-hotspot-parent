# utils-support-hotspot-mybatis

Utils Support Hotspot MyBatis - MyBatis热点监控模块

        该模块提供专业的功能支持和工具集成。

        主要特性：
        - 🔧 功能完整：提供完整的功能实现
        - 🚀 性能优化：高性能的实现方案
        - 🛡️ 稳定可靠：经过充分测试和验证
        - 📚 文档完善：详细的使用文档和示例
        - 🔄 易于集成：简单的 API 和配置方式

        适用场景：
        - 企业级应用开发
        - 系统集成项目
        - 工具链构建
        - 第三方服务集成

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>utils-support-hotspot-mybatis</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `MybatisConfigurationPlugin` | MybatisConfigurationPlugin |
| `MybatisFactory` | MybatisFactory |
| `MybatisPluginConfigurationPlugin` | MybatisPluginConfigurationPlugin |
| `MybatisSimpleExecutorPlugin` | MyBatis SQL 执行器拦截插件 拦截 SimpleExecutor/BatchExecutor 的 query/update/queryCursor 方 |
| `MybatisSqlMonitorPlugin` | MyBatis SQL 监控插件 拦截 Executor 的 SQL 执行方法，捕获完整 SQL 语句 @version 4.0.0.36 |
| `MybatisSqlSessionTemplatePlugin` | MybatisSqlSessionTemplatePlugin |
| `PluginRegistration` | MyBatis 插件注册 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-mybatis
├── utils-support-hotspot-core
```