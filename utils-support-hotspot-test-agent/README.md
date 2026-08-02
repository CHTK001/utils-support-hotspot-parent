# utils-support-hotspot-test-agent

可独立运行的Java Agent测试程序，用于验证FastMethodHelper双引擎和AgentSelfMonitor监控功能。
        使用方式：java -javaagent:utils-support-hotspot-test-agent.jar -jar your-app.jar

---

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-test-agent</artifactId>
    <version>${project.version}</version>
</dependency>
```

---

## 功能概览

| 类/接口 | 说明 |
|---------|------|
| `AgentSelfMonitorTestAgent` | AgentSelfMonitor 监控功能验证 Agent 使用方式： # 方式1：启动时加载 java -javaagent:utils-support-ho |
| `FastMethodHelperTestAgent` | FastMethodHelper 双引擎验证 Agent 使用方式： # 方式1：启动时加载 java -javaagent:utils-support-hot |

---

## 配置说明

本模块为零配置模块，引入依赖后即可使用。

---

## 依赖关系

```
utils-support-hotspot-test-agent
├── utils-support-hotspot-core
```