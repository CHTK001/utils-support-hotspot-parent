# Utils Support Hotspot Parent

## 📋 项目简介

`utils-support-hotspot-parent` 是一个专注于应用性能监控和热点分析的父级模块，提供了对 JVM、框架、中间件、Web 容器等各个层面的全方位监控支持。该模块通过字节码增强、AOP 切面、指标收集等技术，为开发者提供了完整的应用性能观测和分析能力。

## 🌟 主要特性

- **🔥 热点分析**: 实时监控应用热点和性能瓶颈
- **📊 全链路监控**: 从 JVM 到应用层的完整监控链路
- **⚡ 零侵入**: 基于字节码增强的无侵入监控
- **🎯 精准定位**: 精确定位性能问题和资源消耗
- **📈 实时指标**: 实时收集和展示性能指标
- **🔧 可扩展**: 支持自定义监控指标和告警规则

## 📦 模块结构

### 🏗️ 核心监控模块

- **utils-support-hotspot-core**: 热点监控核心引擎
- **utils-support-hotspot-agent**: Java Agent 字节码增强

### ☕ JVM 监控模块

- **utils-support-hotspot-jvm**: JVM 内存、GC、线程监控

### 🌐 框架监控模块

- **utils-support-hotspot-spring**: Spring 框架性能监控
- **utils-support-hotspot-mybatis**: MyBatis ORM 性能监控
- **utils-support-hotspot-netty**: Netty 网络框架监控
- **utils-support-hotspot-jakarta**: Jakarta EE 监控支持
- **utils-support-hotspot-javax**: Java EE 监控支持

### 🗄️ 中间件监控模块

- **utils-support-hotspot-redis**: Redis 缓存性能监控
- **utils-support-hotspot-mysql**: MySQL 数据库性能监控
- **utils-support-hotspot-kafka**: Kafka 消息队列监控
- **utils-support-hotspot-rabbit**: RabbitMQ 消息队列监控
- **utils-support-hotspot-zookeeper**: Zookeeper 协调服务监控
- **utils-support-hotspot-p6spy**: P6Spy SQL 监控集成

### 🌐 Web 容器监控模块

- **utils-support-hotspot-tomcat**: Tomcat 容器性能监控
- **utils-support-hotspot-undertow**: Undertow 容器监控
- **utils-support-hotspot-jetty**: Jetty 容器监控

### 📡 HTTP 客户端监控模块

- **utils-support-hotspot-httpclient**: HTTP 客户端性能监控
- **utils-support-hotspot-okhttp**: OkHttp 客户端监控

### 📊 序列化监控模块

- **utils-support-hotspot-jackson**: Jackson 序列化性能监控
- **utils-support-hotspot-fastjson**: FastJSON 序列化监控

### 🔧 工具和扩展模块

- **utils-support-hotspot-logger**: 日志性能监控
- **utils-support-hotspot-ui**: 监控数据可视化界面
- **utils-support-hotspot-hotswap**: 热部署监控支持
- **utils-support-hotspot-dubbo3x**: Dubbo 3.x RPC 监控

## 📡 API 接口

### 链路追踪 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/agent/trace?action=latest` | GET | 获取最新一条链路追踪数据 |
| `/agent/trace?action=list&limit=20` | GET | 获取最新 N 条链路列表 |
| `/agent/trace?action=detail&traceId=xxx` | GET | 根据 traceId 获取链路详情 |

**示例响应**：
```json
{
  "code": 200,
  "data": {
    "name": "/api/user/list",
    "data": "{\"traceId\":\"abc123\",\"duration\":125}",
    "timestamp": 1702310400000
  }
}
```

### 日志查询 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/agent/log?action=tail&limit=100` | GET | 获取最新 N 条日志 |
| `/agent/log?action=search&keyword=error&limit=50` | GET | 搜索包含关键词的日志 |
| `/agent/log?action=level&level=ERROR&limit=100` | GET | 按日志级别查询 |
| `/agent/log?action=clear` | POST | 清空日志缓存 |

**示例响应**：
```json
{
  "code": 200,
  "data": [
    {
      "timestamp": 1702310400000,
      "level": "INFO",
      "logger": "com.example.UserService",
      "message": "用户登录成功",
      "thread": "http-nio-8080-exec-1"
    }
  ]
}
```

### 热重载 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/agent/hotswap?action=status` | GET | 获取热重载状态 |
| `/agent/hotswap?action=reload&className=com.example.MyClass` | POST | 手动触发类重载 |
| `/agent/hotswap?action=reloadFile&filePath=/path/to/MyClass.class&className=com.example.MyClass` | POST | 从文件重载类 |
| `/agent/hotswap?action=list&pattern=com.example&limit=100` | GET | 列出已加载的类 |

**示例响应**：
```json
{
  "code": 200,
  "data": {
    "enabled": true,
    "instrumentation": true,
    "loadedClassCount": 12580,
    "timestamp": 1702310400000
  }
}
```

### SQL 监控 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/agent/table_info?date=2024-12-11` | GET | 获取指定日期的 SQL 统计 |

### 线程监控 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/agent/thread` | GET | 获取线程信息 |

---

## 🔍 功能详解

### 链路追踪

链路追踪功能可以帮助你追踪请求在分布式系统中的完整调用链路：

- **自动采集**：自动采集 HTTP 请求、数据库查询、缓存操作等
- **链路关联**：通过 traceId 关联同一请求的所有操作
- **性能分析**：记录每个操作的耗时，定位性能瓶颈
- **错误追踪**：记录异常信息，快速定位问题

### 日志监控

实时收集和查询应用日志：

- **实时收集**：自动收集应用运行时日志
- **关键词搜索**：支持按关键词搜索日志
- **级别过滤**：支持按日志级别（DEBUG/INFO/WARN/ERROR）过滤
- **Tail 模式**：类似 `tail -f` 实时获取最新日志

### 热重载

支持在不重启应用的情况下更新代码：

- **手动触发**：通过 API 手动触发类重载
- **文件监听**：自动监听 class 文件变更
- **HotswapAgent 集成**：集成 HotswapAgent 实现完整热重载
- **Spring Bean 重载**：支持 Spring Bean 的热重载

**启用 HotswapAgent**：

```bash
# Java 17/21 (JetBrains Runtime)
java -XX:+AllowEnhancedClassRedefinition -XX:HotswapAgent=fatjar \
     -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -jar your-application.jar

# Java 11 (DCEVM)
java -XX:HotswapAgent=fatjar \
     -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -jar your-application.jar

# Java 8 (DCEVM)
java -XXaltjvm=dcevm \
     -javaagent:hotswap-agent.jar \
     -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -jar your-application.jar
```

---

## 🚀 快速开始

### 第一步：下载 Agent JAR

从 [Releases](https://github.com/chua-utils/utils-support-parent-starter/releases) 页面下载最新版本的 `utils-support-hotspot-agent-4.0.0.33.jar`

或者通过 Maven 构建：

```bash
cd utils-support-hotspot-parent/utils-support-hotspot-agent
mvn clean package
# 生成的 JAR 在 target 目录下
```

### 第二步：启动应用

#### 基本启动（默认配置）

```bash
java -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -jar your-application.jar
```

#### 自定义端口启动

```bash
java -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -Dprotocol.http.port=19000 \
     -Dprotocol.websocket.port=29000 \
     -jar your-application.jar
```

#### 禁用特定插件

```bash
java -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -DdenyPlugin=redis,mysql \
     -jar your-application.jar
```

### 第三步：访问监控界面

启动后，访问以下地址：

- **HTTP API**: `http://localhost:18954/agent`
- **WebSocket**: `ws://localhost:28954`
- **监控 UI**: `http://localhost:18954/ui` (如果启用了 UI 模块)

### Maven 依赖（可选）

如果需要在项目中集成监控功能：

```xml
<!-- 核心监控 -->
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-core</artifactId>
    <version>4.0.0.33</version>
</dependency>

<!-- Spring监控 -->
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-spring</artifactId>
    <version>4.0.0.33</version>
</dependency>

<!-- MySQL监控 -->
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-mysql</artifactId>
    <version>4.0.0.33</version>
</dependency>
```

### 基本使用示例

````java
// 自定义监控指标
@Component
public class CustomMetrics {

    @HotspotMonitor(name = "business.operation", description = "业务操作监控")
    public void businessOperation() {
        // 业务逻辑
        processBusinessLogic();
    }

    @HotspotTimer(name = "database.query", threshold = 1000)
    public List<User> queryUsers(String condition) {
        // 数据库查询
        return userRepository.findByCondition(condition);
    }

    @HotspotCounter(name = "api.calls")
    public ResponseEntity<String> apiEndpoint() {
        // API处理逻辑
        return ResponseEntity.ok("success");
    }
}

// 监控数据收集
@Service
public class MonitoringService {

    @Autowired
    private HotspotMetricsCollector metricsCollector;

    public HotspotReport generateReport() {
        return HotspotReport.builder()
            .jvmMetrics(metricsCollector.getJvmMetrics())
            .applicationMetrics(metricsCollector.getApplicationMetrics())
            .middlewareMetrics(metricsCollector.getMiddlewareMetrics())
            .build();
    }

    public List<HotspotAlert> checkAlerts() {
        return metricsCollector.getActiveAlerts();
    }
}

// 性能分析
@Service
public class PerformanceAnalyzer {

    @Autowired
    private HotspotAnalyzer analyzer;

    public PerformanceReport analyzePerformance(Duration timeRange) {
        return analyzer.analyze(timeRange);
    }

    public List<Hotspot> findHotspots(HotspotCriteria criteria) {
        return analyzer.findHotspots(criteria);
    }

    public OptimizationSuggestion getSuggestions() {
        return analyzer.generateOptimizationSuggestions();
    }
}

## ⚙️ 配置说明

### 配置方式

Hotspot 支持三种配置方式（优先级从高到低）：

1. **启动参数** - 通过 `-D` 参数传递
2. **环境变量** - 通过系统环境变量
3. **配置文件** - 通过 `hotspot.yml` 文件

### 核心配置项

| 配置项 | 默认值 | 说明 |
|---------|---------|------|
| `protocol.http.port` | `18954` | HTTP 服务端口 |
| `protocol.http.host` | `0.0.0.0` | HTTP 服务地址 |
| `protocol.websocket.port` | `28954` | WebSocket 端口（HTTP端口+10000） |
| `denyPlugin` | 空 | 禁用的插件列表，逗号分隔 |

### 启动参数配置示例

```bash
# 基本配置
java -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -Dprotocol.http.port=19000 \
     -Dprotocol.http.host=127.0.0.1 \
     -Dprotocol.websocket.port=29000 \
     -jar your-application.jar

# 禁用特定插件
java -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -DdenyPlugin=redis,mysql,kafka \
     -jar your-application.jar
````

### 配置文件示例

```yaml
# hotspot.yml
hotspot:
  # 核心配置
  core:
    enabled: true
    sampling-rate: 0.1 # 采样率（0.1 = 10%）
    buffer-size: 10000 # 缓冲区大小
    flush-interval: 5s # 刷新间隔

  # JVM监控
  jvm:
    enabled: true
    gc-monitoring: true
    memory-monitoring: true
    thread-monitoring: true

  # 框架监控
  frameworks:
    spring:
      enabled: true
      monitor-controllers: true
      monitor-services: true
      monitor-repositories: true
    mybatis:
      enabled: true
      monitor-sql: true
      slow-query-threshold: 1000ms

  # 中间件监控
  middleware:
    redis:
      enabled: true
      monitor-commands: true
      slow-command-threshold: 100ms
    mysql:
      enabled: true
      monitor-connections: true
      monitor-queries: true
      slow-query-threshold: 1000ms
    kafka:
      enabled: true
      monitor-producers: true
      monitor-consumers: true

  # Web容器监控
  containers:
    tomcat:
      enabled: true
      monitor-requests: true
      monitor-sessions: true
      monitor-threads: true

  # 告警配置
  alerts:
    enabled: true
    rules:
      - name: "高CPU使用率"
        condition: "jvm.cpu.usage > 0.8"
        duration: 30s
        severity: WARNING
      - name: "内存使用率过高"
        condition: "jvm.memory.usage > 0.9"
        duration: 60s
        severity: CRITICAL

  # 输出配置
  output:
    console:
      enabled: true
      format: JSON
    file:
      enabled: true
      path: /logs/hotspot/
      rotation: daily
    metrics:
      enabled: true
      endpoint: /actuator/hotspot
```

### 应用配置

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: hotspot,metrics,health
  endpoint:
    hotspot:
      enabled: true

hotspot:
  ui:
    enabled: true
    path: /hotspot-ui
    username: admin
    password: ${HOTSPOT_UI_PASSWORD:admin}
```

## 🔧 高级功能

### 自定义监控指标

```java
@Configuration
public class CustomMonitoringConfig {

    @Bean
    public CustomMetricsCollector customMetricsCollector() {
        return CustomMetricsCollector.builder()
            .addMetric("business.orders.count", this::getOrderCount)
            .addMetric("business.revenue.total", this::getTotalRevenue)
            .addMetric("cache.hit.ratio", this::getCacheHitRatio)
            .build();
    }

    @Bean
    public HotspotInterceptor businessInterceptor() {
        return HotspotInterceptor.builder()
            .pattern("com.example.service.*")
            .enableTiming(true)
            .enableCounting(true)
            .enableErrorTracking(true)
            .build();
    }
}
```

### 性能分析和优化建议

```java
@Service
public class PerformanceOptimizer {

    @Autowired
    private HotspotAnalyzer analyzer;

    public OptimizationPlan createOptimizationPlan() {
        PerformanceReport report = analyzer.analyze(Duration.ofHours(1));

        OptimizationPlan plan = new OptimizationPlan();

        // 分析CPU热点
        List<Hotspot> cpuHotspots = report.getCpuHotspots();
        for (Hotspot hotspot : cpuHotspots) {
            if (hotspot.getCpuUsage() > 0.8) {
                plan.addSuggestion(OptimizationSuggestion.builder()
                    .type(OptimizationType.CPU_OPTIMIZATION)
                    .description("优化高CPU使用率方法: " + hotspot.getMethodName())
                    .priority(Priority.HIGH)
                    .build());
            }
        }

        // 分析内存热点
        List<Hotspot> memoryHotspots = report.getMemoryHotspots();
        for (Hotspot hotspot : memoryHotspots) {
            if (hotspot.getMemoryUsage() > 100 * 1024 * 1024) { // 100MB
                plan.addSuggestion(OptimizationSuggestion.builder()
                    .type(OptimizationType.MEMORY_OPTIMIZATION)
                    .description("优化高内存使用方法: " + hotspot.getMethodName())
                    .priority(Priority.MEDIUM)
                    .build());
            }
        }

        return plan;
    }
}
```

### 实时监控和告警

```java
@Component
public class RealTimeMonitor {

    @Autowired
    private HotspotMetricsCollector collector;

    @Autowired
    private AlertManager alertManager;

    @Scheduled(fixedRate = 5000) // 每5秒检查一次
    public void checkPerformanceMetrics() {
        HotspotMetrics metrics = collector.getCurrentMetrics();

        // 检查CPU使用率
        if (metrics.getCpuUsage() > 0.8) {
            alertManager.sendAlert(Alert.builder()
                .type(AlertType.HIGH_CPU_USAGE)
                .severity(Severity.WARNING)
                .message("CPU使用率过高: " + metrics.getCpuUsage())
                .timestamp(Instant.now())
                .build());
        }

        // 检查内存使用率
        if (metrics.getMemoryUsage() > 0.9) {
            alertManager.sendAlert(Alert.builder()
                .type(AlertType.HIGH_MEMORY_USAGE)
                .severity(Severity.CRITICAL)
                .message("内存使用率过高: " + metrics.getMemoryUsage())
                .timestamp(Instant.now())
                .build());
        }

        // 检查慢查询
        List<SlowQuery> slowQueries = metrics.getSlowQueries();
        for (SlowQuery query : slowQueries) {
            if (query.getDuration().toMillis() > 2000) {
                alertManager.sendAlert(Alert.builder()
                    .type(AlertType.SLOW_QUERY)
                    .severity(Severity.WARNING)
                    .message("发现慢查询: " + query.getSql())
                    .timestamp(Instant.now())
                    .build());
            }
        }
    }
}
```

## ❓ 常见问题

### 1. Agent 启动失败

**问题**：启动应用时报错 "Error opening zip file or JAR manifest missing"

**解决方案**：

- 检查 Agent JAR 文件是否存在且完整
- 确保使用的是 `utils-support-hotspot-agent-4.0.0.33.jar`，而不是其他模块的 JAR
- 重新构建 Agent JAR：`mvn clean package`

### 2. 端口被占用

**问题**：启动时报错 "Address already in use"

**解决方案**：

```bash
# 修改默认端口
java -javaagent:utils-support-hotspot-agent-4.0.0.33.jar \
     -Dprotocol.http.port=19000 \
     -Dprotocol.websocket.port=29000 \
     -jar your-application.jar
```

### 3. 监控数据不准确

**问题**：监控数据显示不准确或缺失

**解决方案**：

- 检查相关插件是否被禁用（`denyPlugin` 配置）
- 查看日志确认插件是否成功加载
- 确保应用使用的是支持的框架版本

### 4. 内存占用过高

**问题**：Agent 导致应用内存占用增加

**解决方案**：

- 调整采样率：`-Dsampling.rate=0.01`（降低到 1%）
- 减小缓冲区大小：`-Dbuffer.size=5000`
- 禁用不需要的插件

### 5. 性能影响

**问题**：Agent 导致应用性能下降

**解决方案**：

- 使用更低的采样率
- 只启用必要的监控插件
- 在非生产环境使用全量监控，生产环境使用采样监控

### 6. 与其他 Agent 冲突

**问题**：与 Arthas、SkyWalking 等其他 Agent 冲突

**解决方案**：

- 确保 Agent 的加载顺序正确
- 避免多个 Agent 同时监控相同的类
- 使用 `denyPlugin` 禁用冲突的插件

### 7. 日志输出过多

**问题**：Agent 输出大量日志

**解决方案**：

- 调整日志级别：`-Dlog.level=WARN`
- 禁用控制台输出：`-Dlog.console=false`
- 配置日志文件输出

### 8. 如何卸载 Agent

**问题**：需要在运行时禁用监控

**解决方案**：

- Agent 一旦加载无法卸载，需要重启应用
- 可以通过 API 禁用特定插件：`POST /agent/plugin/disable?name=redis`
- 下次启动时不添加 `-javaagent` 参数

## 📚 文档链接

- [核心监控文档](utils-support-hotspot-core/README.md)
- [Spring 监控文档](utils-support-hotspot-spring/README.md)
- [MySQL 监控文档](utils-support-hotspot-mysql/README.md)
- [Redis 监控文档](utils-support-hotspot-redis/README.md)
- [监控 UI 文档](utils-support-hotspot-ui/README.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 [Apache 2.0](../LICENSE) 许可证。

## 🔗 相关链接

- [项目主页](https://github.com/chua-utils/utils-support-parent-starter)
- [问题反馈](https://github.com/chua-utils/utils-support-parent-starter/issues)
- [更新日志](CHANGELOG.md)
