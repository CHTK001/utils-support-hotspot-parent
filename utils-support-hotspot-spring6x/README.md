# utils-support-hotspot-spring6x

Utils Support Hotspot Spring6x - Spring 6.x热点监控模块

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
    <groupId>org.hotswapagent</groupId>
    <artifactId>utils-support-hotspot-spring6x</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `SpringFactory` | SpringFactory |
| `BeanDefinitionHandler` | BeanDefinitionHandler |
| `SpringStaticHandler` | SpringStaticHandler |
| `SpringLinkResolver` | Spring 6.x 链路解析器（jakarta.servlet） 用于解析 Spring 6.x 环境下的链路 ID @version 4.0.0.34 |
| `RedisTemplatePlugin` | Spring 6.x Redis Template 插件 继承 Spring 5.x 的实现，无需额外修改 @version 4.0.0.34 |
| `SpringApplicationPlugin` | spring 上下文 |
| `SpringClassPathBeanDefinitionScannerPlugin` | 班路径bean释义扫描仪插件 |
| `SpringEnvironmentPlugin` | spring配置 |
| `SpringRequestMappingHandlerMappingPlugin` | SpringRequestMappingHandlerMappingPlugin |
| `PluginRegistration` | Spring 插件注册 @version 4.0.0.34 |
| ... | 共 12 个类 |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-spring6x
├── utils-support-hotspot-spring5x
├── utils-support-hotspot-core
```