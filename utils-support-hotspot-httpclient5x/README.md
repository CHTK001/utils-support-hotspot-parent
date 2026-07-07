# Utils Support Hotspot HttpClient 5.x

## 📋 模块简介

`utils-support-hotspot-httpclient5x` 是专为 Apache HttpClient 5.x 版本设计的性能监控模块，提供对 HTTP 客户端请求的全面监控和追踪能力。

## 🌟 主要特性

- **🔍 请求监控**: 实时监控 HTTP 请求的发送和响应
- **⚡ 性能分析**: 追踪请求耗时和性能瓶颈
- **📊 连接管理**: 监控连接池的使用情况
- **🔗 链路追踪**: 支持分布式链路追踪
- **📈 指标收集**: 收集请求成功率、延迟等指标

## 📦 支持的版本

- Apache HttpClient 5.0+
- Apache HttpClient 5.1+
- Apache HttpClient 5.2+

## 🚀 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.chua</groupId>
    <artifactId>utils-support-hotspot-httpclient5x</artifactId>
    <version>4.0.0.33</version>
</dependency>
```

### 2. 启动 Agent

```bash
java -javaagent:hotspot-agent.jar \
     -jar your-application.jar
```

### 3. 查看监控数据

访问 WebSocket 端口（默认 29000）查看实时监控数据。

## 📊 监控指标

### 请求指标

| 指标 | 说明 |
|------|------|
| 请求数 | HTTP 请求总数 |
| 成功率 | 成功请求占比 |
| 平均耗时 | 平均请求耗时 |
| 最大耗时 | 最大请求耗时 |
| 错误数 | 失败请求数 |

### 连接指标

| 指标 | 说明 |
|------|------|
| 活跃连接 | 当前活跃连接数 |
| 空闲连接 | 空闲连接数 |
| 总连接数 | 连接池总数 |
| 等待连接 | 等待获取连接的请求数 |

## 🔧 配置说明

### 基础配置

```yaml
hotspot:
  httpclient5x:
    enable: true
    capture-headers: true
    capture-body: false
    max-body-length: 1024
```

### 性能配置

```yaml
hotspot:
  httpclient5x:
    performance:
      slow-request-threshold: 1000  # 慢请求阈值（毫秒）
      max-concurrent-requests: 1000 # 最大并发请求数
```

## 📝 使用示例

### 监控 HTTP 请求

```java
// 使用 HttpClient 5.x 发送请求
try (ClassicHttpClient httpClient = HttpClients.createDefault()) {
    HttpGet httpGet = new HttpGet("http://example.com/api");
    
    try (ClassicHttpResponse response = httpClient.execute(httpGet)) {
        // 自动被监控和追踪
        System.out.println(response.getCode());
    }
}
```

## 🔍 故障排查

### 插件未加载

1. 检查 Agent JAR 是否正确启动
2. 查看启动日志中的插件加载信息
3. 确认 HttpClient 5.x JAR 在 classpath 中

### 监控数据不显示

1. 检查 WebSocket 连接是否正常
2. 验证网络连接和防火墙设置
3. 查看浏览器控制台的错误信息

## 📚 相关文档

- [HttpClient 4.x 监控](../utils-support-hotspot-httpclient/README.md)
- [HTTP 客户端监控](../doc/http客户端监控.md)
- [配置说明](../doc/配置说明.md)

## 📄 许可证

Apache License 2.0
