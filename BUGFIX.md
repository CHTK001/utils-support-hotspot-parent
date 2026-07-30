# Hotspot Agent Bugfix 报告

> 修复版本：`4.0.0.42`  
> 涉及模块：`utils-support-hotspot-core`、`utils-support-hotspot-httpclient4x`  
> 触发环境：Java 25 + Spring Boot 2.7.18 fat jar + HttpClient 4.5.14

---

## 0. ByteBuddy 升级（已合并）

| 项目 | 值 |
|---|---|
| 原版本 | 父 POM `1.15.7`、core `1.14.10`、profiler `1.14.10`（3 处不一致） |
| 新版本 | **1.17.8**（统一由 `<bytebuddy.version>` property 管理） |
| 启动参数 | 不再需要 `-Dnet.bytebuddy.experimental=true` |

变更文件：
- `pom.xml`：新增 `<bytebuddy.version>1.17.8</bytebuddy.version>`，3 个 byte-buddy 依赖全部用 `${bytebuddy.version}`
- `utils-support-hotspot-core/pom.xml`：移除 `1.14.10` 硬编码
- `utils-support-hotspot-profiler/pom.xml`：移除 `1.14.10` 硬编码

验证：tsa(18081)→tsb(18082) 5 次调用，SQLite `trace_records count=5`，tsa/tsb 拥有相同的 5 个 UUID linkId，`transformFailCount=0 / exceptionCount=0`。

---

## 1. 现象

`utils-support-hotspot-test-springboot-a (18081)` 与 `utils-support-hotspot-test-springboot-b (18082)` 启动后，调
用 `tsa → tsb` 链路：

- Spring Boot 业务调用正常（HTTP 200）
- Agent HTTP 服务启动正常（默认 `18954`，WebSocket `28954`）
- 5 个插件全部被发现并注册：`bytebuddy-filehandle / HttpClient3x / RSocket / Driver / HttpClient4x`
- `/agent/api/trace?action=history` 始终返回 `[]`
- SQLite `trace_records / log_records / exception_records / qps_statistics / http_performance / method_performance / component_statistics` **全部 0 条**

预期：跨服务 traceId 传递，trace 数据落库。

---

## 2. 根本原因（5 个）

### 2.1 [致命] ByteBuddy 1.14.10 不支持 Java 25

```
java.lang.IllegalArgumentException: Java 25 (69) is not supported by 
the current version of Byte Buddy which officially supports Java 22 (66) - 
update Byte Buddy or set net.bytebuddy.experimental as a VM property
```

**触发位置**：`ByteBuddy` 试图增强 `org.apache.http.impl.client.InternalHttpClient` 等类时抛错。

**修复**：启动参数加 `-Dnet.bytebuddy.experimental=true`。  
**根治**：升级 ByteBuddy 到 1.17+（未在本修复内）。

---

### 2.2 [致命] `SpyHandlerImpl.onBefore / onAfter / onError` 吞异常

**位置**：`utils-support-hotspot-core/src/main/java/com/chua/hotspot/core/support/spy/SpyHandlerImpl.java:100,113,127`

```java
} catch (Throwable e) {
    logFactory.debug("Spy onBefore 回调异常: ...", e.getMessage());
}
```

只 `debug()` 一行 message，**完全吞掉 stack trace**，导致肉眼无法定位根因。

**修复**：改成 `warn()` + 打印 `throwable.toString()` + 完整 stack trace。

---

### 2.3 [致命] `AgentListener.onError` 同样吞异常

**位置**：`utils-support-hotspot-core/src/main/java/com/chua/hotspot/core/support/agent/AgentListener.java:34-39`

```java
public void onError(String typeName, ..., Throwable throwable) {
    if (typeName.startsWith("jdk.")) return;
    AgentSelfMonitor.getInstance().recordTransformFail(typeName);
    // 缺：throwable 原因
}
```

`throwable` 被静默丢弃，"类增强失败" 原因不可见。

**修复**：打印 `throwable.toString()` + 5 层 cause 链。

---

### 2.4 [致命] `HttpClient4xPlugin.spyBefore/spyAfter` 在 HotspotPluginClassLoader 中触发 `NoClassDefFoundError`

**位置**：`utils-support-hotspot-httpclient4x/src/main/java/com/chua/hotspot/httpclient4x/support/plugin/HttpClient4xPlugin.java:83,147`

`HttpClient4xPlugin` 类被 `HotspotPluginClassLoader` 加载，该 CL 通过 `output/libs/` 初始化，**`httpclient-4.5.14.jar` 不在其中**。`HttpClient4xPlugin` 直接 `import org.apache.http.HttpRequest`：

```java
if (!(args[1] instanceof HttpRequest)) { ... }   // 触发 HttpRequest 类初始化 → NoClassDefFoundError
```

抛出 `NoClassDefFoundError: org/apache/http/HttpRequest`，整个 spyBefore 静默失败（被 2.2 修复前的 catch 吞掉）。

**修复**：

1. `output/libs/httpclient-4.5.14.jar`（+ `httpcore-4.4.16.jar`）需要被 `HotspotPluginClassLoader` 加载到 → 通过 `copy-libs` 阶段补齐
2. `HttpClient4xPlugin` 内部所有 `instanceof HttpRequest / HttpEntityEnclosingRequest`、`HttpRequest.getRequestLine()`、`addHeader` 等直接类型引用**全部改成反射**（`Class.forName(name, false, args[1].getClass().getClassLoader()).isInstance(args[1])`），
   避免类初始化时触发 NoClassDefFoundError

---

### 2.5 [致命] `NewTrackManager.createEntrySpan` 顺序错误导致 `linkId="nvl"`

**位置**：`utils-support-hotspot-core/src/main/java/com/chua/hotspot/core/support/span/NewTrackManager.java:157`

```java
public static Span createEntrySpan(Object[] args) {
    Span span = doCreateSpan();      // ← 先创建，doCreateSpan 默认 linkId = "nvl"
    if (currentSpan == null) {       // ← 再尝试设置 linkId，已经晚了一步
        String linkId = getRequestLinkId(args);
        ...
        TrackContext.setLinkId(linkId);
    }
    ...
}
```

`doCreateSpan()` 内部若 `TrackContext.getLinkId() == null` 写死 `linkId = "nvl"`（常量 `DEFAULT_LINK_ID`），然后才轮到 `createEntrySpan` 写入 UUID，导致 Span 对象始终持有 `"nvl"`。

**修复**：把 linkId 计算提到 `doCreateSpan()` **之前**，然后用 `span.setLinkId(resolvedLinkId)` 覆盖。

---

## 3. 顺带修复

### 3.1 `HttpClient4xPlugin.spyAfter` 没调用 `TraceHelper.afterRequest`

**位置**：`utils-support-hotspot-httpclient4x/src/main/java/com/chua/hotspot/httpclient4x/support/plugin/HttpClient4xPlugin.java:189`

只调 `NewTrackManager.costTime(span)`，没有调 `TraceHelper.afterRequest(span, args)`。`TraceHelper.afterRequest` 内部会调 `publishCompleteTrace()` → `DataRecorder.recordTraces(spans)` → 5 秒后 flush 到 SQLite。

不调这条链路，`trace_records` 永远 0 条。

**修复**：在 `spyAfter` 末尾、`super.spyAfter` 之前，加：

```java
TraceHelper.afterRequest(span, args);
```

### 3.2 `HttpClient4xPlugin.spyBefore` 改用 `TraceHelper.beforeRequest`

**位置**：`utils-support-hotspot-httpclient4x/src/main/java/.../HttpClient4xPlugin.java:74`

原来直接调 `NewTrackManager.createEntrySpan(args)`，没经过 `DistributedTraceContext` 的 `X-Trace-Id` 头继承。

**修复**：改用 `TraceHelper.beforeRequest(method, args, target, "HTTP", "Client")`，自动处理分布式追踪上下文。

---

## 4. 启动方式（验证通过，ByteBuddy 1.17.8）

```bat
java -javaagent:output\java8\utils-support-hotspot-agent-4.0.0.42-java8.jar ^
     -jar utils-support-hotspot-test-springboot-a\target\utils-support-hotspot-test-springboot-a-4.0.0.42.jar
```

**关键参数**（无 `-Dnet.bytebuddy.experimental=true`，由 ByteBuddy 1.17.8 原生支持 Java 25）：

- `-Dhotspot_application_name=...`：设置 `applicationName`（SQLite 数据库文件名）
- `-Dhotspot.lib.path`、`HOTSPOT_LIB_PATH` 可选覆盖 `output/libs/` 路径

---

## 5. 验证结果

启动 tsa:18081 + tsb:18082（端口避让到 18954/18955、28954/28955），5 次 `tsa/api/call-b → tsb/api/hello` 请求：

```
GET /agent/api/trace?action=history&limit=10

[
  { "linkId": "2c502326-f737-408b-99d5-301585b48a85", "spanCount": 1, ... },
  { "linkId": "e4775784-42ad-4e42-946c-b944f9baccac", "spanCount": 1, ... },
  { "linkId": "fa05c3fc-95ab-4526-8891-ae136912f1b8", "spanCount": 1, ... },
  { "linkId": "2e83c8cf-cb31-4f68-afac-5177912afe3b", "spanCount": 1, ... },
  { "linkId": "28545e5a-cf01-40d9-9dc4-c1bd4f922af0", "spanCount": 1, ... }
]
```

✅ 5 个独立 UUID linkId  
✅ **tsa 和 tsb 拥有相同的 5 个 linkId**（traceId 跨服务传递成功）  
✅ SQLite `trace_records` count=5（每个 tsa 调用 1 条）  
✅ `/agent/api/monitor` 显示 `transformFailCount=0 / exceptionCount=0 / reportDataCount=6`  
✅ `trace_records.trace_id` 列记录真实 UUID，与 `linkId` 一致

---

## 6. 后续建议（已合并 ✓）

1. ✅ ~~升级 ByteBuddy 到 1.17+~~（commit 2 完成）
2. ✅ ~~持久化 httpclient 依赖到 copy-libs~~（commit 3 完成）
3. **其他 plugin 模块**（mysql / pgsql / oracle / sqlserver、tomcat9x / 10x、undertow、jetty、netty 等）应同步检查：是否在 HotspotPluginClassLoader 中触发了相同 NoClassDefFoundError
4. **`AgentListener` / `SpyHandlerImpl`** 把 `debug()` 改 `warn()` 是有副作用的——目前每次类增强失败都打 WARN，会污染生产日志。后续应改成由 `data.recorder.log.level` 控制
5. **ByteBuddy 1.18.x 已发布**（2026-07-02 最新 1.18.11），如有需要可继续升级

---

## 7. 改动文件清单

| 文件 | 改动 |
|---|---|
| `utils-support-hotspot-core/src/main/java/com/chua/hotspot/core/support/agent/AgentListener.java` | +9：onError 打印 throwable + 5 层 cause |
| `utils-support-hotspot-core/src/main/java/com/chua/hotspot/core/support/spy/SpyHandlerImpl.java` | +9/-6：catch 块改 warn + stack |
| `utils-support-hotspot-core/src/main/java/com/chua/hotspot/core/support/span/NewTrackManager.java` | +13/-8：createEntrySpan 顺序修正 |
| `utils-support-hotspot-httpclient4x/src/main/java/com/chua/hotspot/httpclient4x/support/plugin/HttpClient4xPlugin.java` | +67/-29：instanceof 改反射 + TraceHelper.before/afterRequest 调用 |
| `pom.xml` | +2/-2：`<bytebuddy.version>1.17.8</bytebuddy.version>`，3 个 byte-buddy 依赖引用 property |
| `utils-support-hotspot-core/pom.xml` | byte-buddy 改用 `${bytebuddy.version}` + **新增 httpclient/httpcore/commons-codec provided 依赖 + copy-libs-provided execution 自动复制到 output/libs/** |
| `utils-support-hotspot-profiler/pom.xml` | +2/-2：byte-buddy 改用 `${bytebuddy.version}` |

构建产物：`output/libs/utils-support-hotspot-core-4.0.0.42.jar`、`output/libs/byte-buddy-1.17.8.jar`、`output/libs/byte-buddy-agent-1.17.8.jar`、`output/libs/httpclient-4.5.14.jar`、`output/libs/httpcore-4.4.16.jar`、`output/libs/commons-codec-1.16.0.jar`、`output/plugins/utils-support-hotspot-httpclient3x/4x-4.0.0.42.jar`