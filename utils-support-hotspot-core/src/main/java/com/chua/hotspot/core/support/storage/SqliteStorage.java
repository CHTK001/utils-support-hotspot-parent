package com.chua.hotspot.core.support.storage;

import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.report.ReportFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * SQLite 存储管理类
 * 
 * 负责管理 SQLite 数据库连接、表创建和数据操作
 * 数据库文件按照 applicationName 命名
 * 
 * @author CH
 * @since 2024/12/13
 * @version 4.0.0.35
 */
public class SqliteStorage {
    
    /**
     * 日志对象
     */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 单例实例（延迟初始化）
     */
    private static SqliteStorage INSTANCE;

    /**
     * 默认应用名（未配置时使用）
     */
    private static final String DEFAULT_APP_NAME = "hotspot";

    /**
     * 数据库文件根目录
     */
    private static final String DB_BASE_DIR = "./agent/data/";

    /**
     * SQLite JDBC 驱动类名
     */
    private static final String SQLITE_JDBC_DRIVER = "org.sqlite.JDBC";

    /**
     * SQLite JDBC 连接 URL 前缀
     */
    private static final String SQLITE_JDBC_URL_PREFIX = "jdbc:sqlite:";

    /**
     * 数据库连接
     */
    private Connection connection;

    /**
     * 读写锁（写操作加写锁，读操作加读锁）
     */
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    /**
     * 数据库文件路径
     */
    private final String dbPath;

    /**
     * 私有构造函数
     */
    private SqliteStorage() {
        String appName = DEFAULT_APP_NAME;
        try {
            // 优先从 Project 单例获取 applicationName
            com.chua.hotspot.core.support.environment.Project project =
                    com.chua.hotspot.core.support.environment.Project.getInstance();
            if (project != null && project.getApplicationName() != null && !project.getApplicationName().isEmpty()) {
                appName = project.getApplicationName();
            }
        } catch (Exception ignored) {
        }

        // 数据库文件路径：./agent/data/{appName}.db
        this.dbPath = DB_BASE_DIR + appName + ".db";
        initialize();
    }
    
    /**
     * 获取单例实例
     */
    public static synchronized SqliteStorage getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new SqliteStorage();
        }
        return INSTANCE;
    }
    
    /**
     * 获取数据库连接
     */
    public Connection getConnection() {
        return connection;
    }
    
    /**
     * 初始化数据库
     */
    private void initialize() {
        try {
            // 确保目录存在
            java.io.File dbFile = new java.io.File(dbPath);
            if (!dbFile.getParentFile().exists()) {
                dbFile.getParentFile().mkdirs();
            }
            
            StorageConfig config = StorageConfig.getInstance();
            
            // 根据配置决定是否删除旧数据库
            if (config.isResetMode() && dbFile.exists()) {
                boolean deleted = dbFile.delete();
                if (deleted) {
                    LOGGER.info("RESET模式：已删除旧数据库文件: {}", dbPath);
                } else {
                    LOGGER.warn("无法删除旧数据库文件: {}", dbPath);
                }
            } else if (config.isPersistentMode() && dbFile.exists()) {
                LOGGER.info("PERSISTENT模式：保留历史数据，数据库文件: {}", dbPath);
            }
            
            // 加载 SQLite JDBC 驱动
            Class.forName("org.sqlite.JDBC");
            
            // 建立连接
            connection = DriverManager.getConnection("jdbc:sqlite:" + dbPath);
            
            // 创建表结构
            createTables();
            
            // 持久化模式下清理过期数据
            if (config.isPersistentMode()) {
                cleanupOldData();
            }
            
            LOGGER.info("SQLite 数据库初始化成功: {}", dbPath);
        } catch (Exception e) {
            LOGGER.error("SQLite 数据库初始化失败: {}", e.getMessage());
        }
    }
    
    /**
     * 创建数据库表
     */
    private void createTables() {
        lock.writeLock().lock();
        try (Statement stmt = connection.createStatement()) {
            
            // QPS 统计表
            stmt.execute("CREATE TABLE IF NOT EXISTS qps_statistics (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "container_type VARCHAR(50), " +
                    "timestamp BIGINT, " +
                    "qps INTEGER, " +
                    "total_requests BIGINT, " +
                    "active_connections INTEGER, " +
                    "create_time DATETIME DEFAULT CURRENT_TIMESTAMP" +
                    ")");
            
            // 创建索引
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_qps_timestamp ON qps_statistics(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_qps_container ON qps_statistics(container_type)");
            
            // 组件连接统计表
            stmt.execute("CREATE TABLE IF NOT EXISTS component_statistics (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "component_type VARCHAR(50), " +
                    "host VARCHAR(255), " +
                    "port INTEGER, " +
                    "connection_count INTEGER, " +
                    "timestamp BIGINT, " +
                    "create_time DATETIME DEFAULT CURRENT_TIMESTAMP" +
                    ")");
            
            // 创建索引
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_comp_timestamp ON component_statistics(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_comp_type ON component_statistics(component_type)");
            
            // 日志记录表
            stmt.execute("CREATE TABLE IF NOT EXISTS log_records (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "level VARCHAR(20), " +
                    "logger VARCHAR(255), " +
                    "message TEXT, " +
                    "thread VARCHAR(100), " +
                    "timestamp BIGINT, " +
                    "create_time DATETIME DEFAULT CURRENT_TIMESTAMP" +
                    ")");
            
            // 创建索引
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_log_timestamp ON log_records(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_log_level ON log_records(level)");
            
            // 链路追踪记录表
            stmt.execute("CREATE TABLE IF NOT EXISTS trace_records (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "trace_id VARCHAR(100), " +
                    "span_id VARCHAR(100), " +
                    "parent_id VARCHAR(100), " +
                    "link_id VARCHAR(100), " +
                    "span_data TEXT, " +  // JSON 存储完整 Span 数据
                    "timestamp BIGINT, " +
                    "create_time DATETIME DEFAULT CURRENT_TIMESTAMP" +
                    ")");
            
            // 创建索引
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_trace_timestamp ON trace_records(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_trace_link_id ON trace_records(link_id)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_trace_span_id ON trace_records(span_id)");
            
            // 异常记录表
            stmt.execute("CREATE TABLE IF NOT EXISTS exception_records (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "exception_type VARCHAR(255), " +
                    "message TEXT, " +
                    "stack_trace TEXT, " +
                    "thread VARCHAR(100), " +
                    "location VARCHAR(500), " +
                    "count INTEGER DEFAULT 1, " +
                    "first_occurrence BIGINT, " +
                    "last_occurrence BIGINT, " +
                    "timestamp BIGINT, " +
                    "create_time DATETIME DEFAULT CURRENT_TIMESTAMP" +
                    ")");
            
            // 创建索引
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_exception_timestamp ON exception_records(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_exception_type ON exception_records(exception_type)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_exception_thread ON exception_records(thread)");
            
            // HTTP 性能统计表
            stmt.execute("CREATE TABLE IF NOT EXISTS http_performance (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "endpoint VARCHAR(500), " +
                    "method VARCHAR(10), " +
                    "request_count BIGINT, " +
                    "total_time BIGINT, " +
                    "avg_time BIGINT, " +
                    "min_time BIGINT, " +
                    "max_time BIGINT, " +
                    "p50 BIGINT, " +
                    "p90 BIGINT, " +
                    "p95 BIGINT, " +
                    "p99 BIGINT, " +
                    "error_count INTEGER, " +
                    "timestamp BIGINT, " +
                    "create_time DATETIME DEFAULT CURRENT_TIMESTAMP" +
                    ")");
            
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_http_timestamp ON http_performance(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_http_endpoint ON http_performance(endpoint)");
            
            // 慢方法统计表
            stmt.execute("CREATE TABLE IF NOT EXISTS method_performance (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "method_signature VARCHAR(1000), " +
                    "call_count BIGINT, " +
                    "total_time BIGINT, " +
                    "avg_time BIGINT, " +
                    "min_time BIGINT, " +
                    "max_time BIGINT, " +
                    "timestamp BIGINT, " +
                    "create_time DATETIME DEFAULT CURRENT_TIMESTAMP" +
                    ")");
            
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_method_timestamp ON method_performance(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_method_signature ON method_performance(method_signature)");
            
            LOGGER.debug("SQLite 数据表创建完成");
        } catch (SQLException e) {
            LOGGER.error("创建数据表失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 清理过期数据
     */
    public void cleanupOldData() {
        StorageConfig config = StorageConfig.getInstance();
        long retentionTimestamp = config.getRetentionTimestamp();
        
        lock.writeLock().lock();
        try (Statement stmt = connection.createStatement()) {
            // 清理各表的过期数据
            int qpsDeleted = stmt.executeUpdate(
                "DELETE FROM qps_statistics WHERE timestamp < " + retentionTimestamp);
            
            int compDeleted = stmt.executeUpdate(
                "DELETE FROM component_statistics WHERE timestamp < " + retentionTimestamp);
            
            int traceDeleted = stmt.executeUpdate(
                "DELETE FROM trace_records WHERE timestamp < " + retentionTimestamp);
            
            int httpDeleted = stmt.executeUpdate(
                "DELETE FROM http_performance WHERE timestamp < " + retentionTimestamp);
            
            int methodDeleted = stmt.executeUpdate(
                "DELETE FROM method_performance WHERE timestamp < " + retentionTimestamp);
            
            LOGGER.info("清理过期数据完成: qps={}, component={}, trace={}, http={}, method={}",
                       qpsDeleted, compDeleted, traceDeleted, httpDeleted, methodDeleted);
            
            // 优化数据库（VACUUM）
            stmt.execute("VACUUM");
            
        } catch (SQLException e) {
            LOGGER.error("清理过期数据失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 插入 QPS 统计数据
     */
    public void insertQpsStatistics(String containerType, long timestamp, int qps, 
                                    long totalRequests, int activeConnections) {
        lock.writeLock().lock();
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO qps_statistics (container_type, timestamp, qps, total_requests, active_connections) " +
                "VALUES (?, ?, ?, ?, ?)")) {
            
            pstmt.setString(1, containerType);
            pstmt.setLong(2, timestamp);
            pstmt.setInt(3, qps);
            pstmt.setLong(4, totalRequests);
            pstmt.setInt(5, activeConnections);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            LOGGER.debug("插入 QPS 统计数据失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 批量插入 QPS 统计数据
     */
    public void batchInsertQpsStatistics(List<QpsStatistics> statisticsList) {
        if (statisticsList == null || statisticsList.isEmpty()) {
            return;
        }
        
        lock.writeLock().lock();
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO qps_statistics (container_type, timestamp, qps, total_requests, active_connections) " +
                "VALUES (?, ?, ?, ?, ?)")) {
            
            connection.setAutoCommit(false);
            
            for (QpsStatistics stats : statisticsList) {
                pstmt.setString(1, stats.containerType);
                pstmt.setLong(2, stats.timestamp);
                pstmt.setInt(3, stats.qps);
                pstmt.setLong(4, stats.totalRequests);
                pstmt.setInt(5, stats.activeConnections);
                pstmt.addBatch();
            }
            
            pstmt.executeBatch();
            connection.commit();
            connection.setAutoCommit(true);
            
        } catch (SQLException e) {
            LOGGER.debug("批量插入 QPS 统计数据失败: {}", e.getMessage());
            try {
                connection.rollback();
                connection.setAutoCommit(true);
            } catch (SQLException ex) {
                // ignore
            }
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 查询 QPS 历史数据
     */
    public List<Map<String, Object>> queryQpsHistory(String containerType, long startTime, long endTime) {
        List<Map<String, Object>> result = new ArrayList<>();
        lock.readLock().lock();
        
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT container_type, timestamp, qps, total_requests, active_connections " +
                "FROM qps_statistics " +
                "WHERE container_type = ? AND timestamp BETWEEN ? AND ? " +
                "ORDER BY timestamp ASC")) {
            
            pstmt.setString(1, containerType);
            pstmt.setLong(2, startTime);
            pstmt.setLong(3, endTime);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("containerType", rs.getString("container_type"));
                    row.put("timestamp", rs.getLong("timestamp"));
                    row.put("qps", rs.getInt("qps"));
                    row.put("totalRequests", rs.getLong("total_requests"));
                    row.put("activeConnections", rs.getInt("active_connections"));
                    result.add(row);
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("查询 QPS 历史数据失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return result;
    }
    
    /**
     * 插入组件统计数据
     */
    public void insertComponentStatistics(String componentType, String host, int port, 
                                         int connectionCount, long timestamp) {
        lock.writeLock().lock();
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO component_statistics (component_type, host, port, connection_count, timestamp) " +
                "VALUES (?, ?, ?, ?, ?)")) {
            
            pstmt.setString(1, componentType);
            pstmt.setString(2, host);
            pstmt.setInt(3, port);
            pstmt.setInt(4, connectionCount);
            pstmt.setLong(5, timestamp);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            LOGGER.debug("插入组件统计数据失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 批量插入组件统计数据
     */
    public void insertComponentStatistics(List<ComponentStatistics> statisticsList) {
        if (statisticsList == null || statisticsList.isEmpty()) {
            return;
        }
        
        lock.writeLock().lock();
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO component_statistics (component_type, host, port, connection_count, timestamp) " +
                "VALUES (?, ?, ?, ?, ?)")) {
            
            connection.setAutoCommit(false);
            
            for (ComponentStatistics stats : statisticsList) {
                pstmt.setString(1, stats.componentType);
                pstmt.setString(2, stats.host);
                pstmt.setInt(3, stats.port);
                pstmt.setInt(4, stats.connectionCount);
                pstmt.setLong(5, stats.timestamp);
                pstmt.addBatch();
            }
            
            pstmt.executeBatch();
            connection.commit();
            connection.setAutoCommit(true);
            
        } catch (SQLException e) {
            LOGGER.debug("批量插入组件统计数据失败: {}", e.getMessage());
            try {
                connection.rollback();
                connection.setAutoCommit(true);
            } catch (SQLException ex) {
                // ignore
            }
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 查询组件统计数据
     */
    public List<ComponentStatistics> queryComponentStatistics(String componentType, long startTime, long endTime) {
        List<ComponentStatistics> result = new ArrayList<>();
        lock.readLock().lock();
        
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT component_type, host, port, connection_count, timestamp " +
                "FROM component_statistics " +
                "WHERE component_type = ? AND timestamp BETWEEN ? AND ? " +
                "ORDER BY timestamp ASC")) {
            
            pstmt.setString(1, componentType);
            pstmt.setLong(2, startTime);
            pstmt.setLong(3, endTime);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    ComponentStatistics stats = new ComponentStatistics();
                    stats.componentType = rs.getString("component_type");
                    stats.host = rs.getString("host");
                    stats.port = rs.getInt("port");
                    stats.connectionCount = rs.getInt("connection_count");
                    stats.timestamp = rs.getLong("timestamp");
                    result.add(stats);
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("查询组件统计数据失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return result;
    }
    
    /**
     * 插入日志记录
     */
    public void insertLogRecord(String level, String loggerName, String message, String thread, long timestamp) {
        lock.writeLock().lock();
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO log_records (level, logger, message, thread, timestamp) " +
                "VALUES (?, ?, ?, ?, ?)")) {
            
            pstmt.setString(1, level);
            pstmt.setString(2, loggerName);
            pstmt.setString(3, message);
            pstmt.setString(4, thread);
            pstmt.setLong(5, timestamp);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            LOGGER.debug("插入日志记录失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 查询日志记录
     */
    public List<Map<String, Object>> queryLogRecords(String level, int limit, long startTime, long endTime) {
        List<Map<String, Object>> result = new ArrayList<>();
        lock.readLock().lock();
        
        try {
            StringBuilder sql = new StringBuilder(
                    "SELECT level, logger, message, thread, timestamp " +
                    "FROM log_records WHERE timestamp BETWEEN ? AND ?");
            
            if (level != null && !level.isEmpty()) {
                sql.append(" AND level = ?");
            }
            
            sql.append(" ORDER BY timestamp DESC LIMIT ?");
            
            try (PreparedStatement pstmt = connection.prepareStatement(sql.toString())) {
                int paramIndex = 1;
                pstmt.setLong(paramIndex++, startTime);
                pstmt.setLong(paramIndex++, endTime);
                
                if (level != null && !level.isEmpty()) {
                    pstmt.setString(paramIndex++, level);
                }
                
                pstmt.setInt(paramIndex, limit);
                
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> row = new HashMap<>();
                        row.put("level", rs.getString("level"));
                        row.put("logger", rs.getString("logger"));
                        row.put("message", rs.getString("message"));
                        row.put("thread", rs.getString("thread"));
                        row.put("timestamp", rs.getLong("timestamp"));
                        result.add(row);
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("查询日志记录失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return result;
    }
    
    /**
     * 插入链路追踪数据
     */
    public void insertTraceRecord(String traceId, String spanId, String parentId, 
                                  String linkId, String spanData, long timestamp) {
        lock.writeLock().lock();
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO trace_records (trace_id, span_id, parent_id, link_id, span_data, timestamp) " +
                "VALUES (?, ?, ?, ?, ?, ?)")) {
            
            pstmt.setString(1, traceId);
            pstmt.setString(2, spanId);
            pstmt.setString(3, parentId);
            pstmt.setString(4, linkId);
            pstmt.setString(5, spanData);
            pstmt.setLong(6, timestamp);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            LOGGER.debug("插入链路追踪数据失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 查询链路追踪数据（按时间范围）
     */
    public List<Map<String, Object>> queryTraceRecords(long startTime, long endTime, int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        lock.readLock().lock();
        
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT trace_id, span_id, parent_id, link_id, span_data, timestamp " +
                "FROM trace_records " +
                "WHERE timestamp BETWEEN ? AND ? " +
                "ORDER BY timestamp DESC LIMIT ?")) {
            
            pstmt.setLong(1, startTime);
            pstmt.setLong(2, endTime);
            pstmt.setInt(3, limit);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("traceId", rs.getString("trace_id"));
                    row.put("spanId", rs.getString("span_id"));
                    row.put("parentId", rs.getString("parent_id"));
                    row.put("linkId", rs.getString("link_id"));
                    row.put("spanData", rs.getString("span_data"));
                    row.put("timestamp", rs.getLong("timestamp"));
                    result.add(row);
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("查询链路追踪数据失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return result;
    }
    
    /**
     * 按 linkId 查询链路追踪数据
     */
    public List<Map<String, Object>> queryTraceByLinkId(String linkId) {
        List<Map<String, Object>> result = new ArrayList<>();
        lock.readLock().lock();
        
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT trace_id, span_id, parent_id, link_id, span_data, timestamp " +
                "FROM trace_records " +
                "WHERE link_id = ? " +
                "ORDER BY timestamp ASC")) {
            
            pstmt.setString(1, linkId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("traceId", rs.getString("trace_id"));
                    row.put("spanId", rs.getString("span_id"));
                    row.put("parentId", rs.getString("parent_id"));
                    row.put("linkId", rs.getString("link_id"));
                    row.put("spanData", rs.getString("span_data"));
                    row.put("timestamp", rs.getLong("timestamp"));
                    result.add(row);
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("按 linkId 查询链路追踪数据失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return result;
    }
    
    /**
     * 清理过期数据（保留最近 N 天）
     */
    public void cleanupOldData(int daysToKeep) {
        long cutoffTime = System.currentTimeMillis() - (daysToKeep * 24L * 60 * 60 * 1000);
        
        lock.writeLock().lock();
        try (Statement stmt = connection.createStatement()) {
            // 清理 QPS 统计数据
            stmt.execute("DELETE FROM qps_statistics WHERE timestamp < " + cutoffTime);
            
            // 清理组件统计数据
            stmt.execute("DELETE FROM component_statistics WHERE timestamp < " + cutoffTime);
            
            // 清理日志记录
            stmt.execute("DELETE FROM log_records WHERE timestamp < " + cutoffTime);
            
            // 清理链路追踪数据
            stmt.execute("DELETE FROM trace_records WHERE timestamp < " + cutoffTime);
            
            // 清理异常记录
            stmt.execute("DELETE FROM exception_records WHERE timestamp < " + cutoffTime);
            
            // 优化数据库
            stmt.execute("VACUUM");
            
            LOGGER.info("清理了 {} 天前的数据", daysToKeep);
        } catch (SQLException e) {
            LOGGER.error("清理过期数据失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 插入异常记录
     */
    public void insertExceptionRecord(String exceptionType, String message, String stackTrace, 
                                     String thread, String location, long timestamp) {
        lock.writeLock().lock();
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO exception_records (exception_type, message, stack_trace, thread, location, " +
                "first_occurrence, last_occurrence, timestamp) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)")) {
            
            pstmt.setString(1, exceptionType);
            pstmt.setString(2, message);
            pstmt.setString(3, stackTrace);
            pstmt.setString(4, thread);
            pstmt.setString(5, location);
            pstmt.setLong(6, timestamp);
            pstmt.setLong(7, timestamp);
            pstmt.setLong(8, timestamp);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            LOGGER.debug("插入异常记录失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * 查询异常记录（按时间范围）
     */
    public List<Map<String, Object>> queryExceptionRecords(long startTime, long endTime, int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        lock.readLock().lock();
        
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT id, exception_type, message, stack_trace, thread, location, count, " +
                "first_occurrence, last_occurrence, timestamp " +
                "FROM exception_records " +
                "WHERE timestamp BETWEEN ? AND ? " +
                "ORDER BY timestamp DESC LIMIT ?")) {
            
            pstmt.setLong(1, startTime);
            pstmt.setLong(2, endTime);
            pstmt.setInt(3, limit);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("id", rs.getLong("id"));
                    row.put("exceptionType", rs.getString("exception_type"));
                    row.put("message", rs.getString("message"));
                    row.put("stackTrace", rs.getString("stack_trace"));
                    row.put("thread", rs.getString("thread"));
                    row.put("location", rs.getString("location"));
                    row.put("count", rs.getInt("count"));
                    row.put("firstOccurrence", rs.getLong("first_occurrence"));
                    row.put("lastOccurrence", rs.getLong("last_occurrence"));
                    row.put("timestamp", rs.getLong("timestamp"));
                    result.add(row);
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("查询异常记录失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return result;
    }
    
    /**
     * 按异常类型统计
     */
    public List<Map<String, Object>> queryExceptionStatsByType(long startTime, long endTime) {
        List<Map<String, Object>> result = new ArrayList<>();
        lock.readLock().lock();
        
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT exception_type, COUNT(*) as total, SUM(count) as occurrences, " +
                "MIN(first_occurrence) as first_seen, MAX(last_occurrence) as last_seen " +
                "FROM exception_records " +
                "WHERE timestamp BETWEEN ? AND ? " +
                "GROUP BY exception_type " +
                "ORDER BY occurrences DESC")) {
            
            pstmt.setLong(1, startTime);
            pstmt.setLong(2, endTime);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("exceptionType", rs.getString("exception_type"));
                    row.put("total", rs.getInt("total"));
                    row.put("occurrences", rs.getInt("occurrences"));
                    row.put("firstSeen", rs.getLong("first_seen"));
                    row.put("lastSeen", rs.getLong("last_seen"));
                    result.add(row);
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("按异常类型统计失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return result;
    }
    
    /**
     * 查询异常详情
     */
    public Map<String, Object> queryExceptionDetail(long id) {
        lock.readLock().lock();
        
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT id, exception_type, message, stack_trace, thread, location, count, " +
                "first_occurrence, last_occurrence, timestamp " +
                "FROM exception_records " +
                "WHERE id = ?")) {
            
            pstmt.setLong(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("id", rs.getLong("id"));
                    row.put("exceptionType", rs.getString("exception_type"));
                    row.put("message", rs.getString("message"));
                    row.put("stackTrace", rs.getString("stack_trace"));
                    row.put("thread", rs.getString("thread"));
                    row.put("location", rs.getString("location"));
                    row.put("count", rs.getInt("count"));
                    row.put("firstOccurrence", rs.getLong("first_occurrence"));
                    row.put("lastOccurrence", rs.getLong("last_occurrence"));
                    row.put("timestamp", rs.getLong("timestamp"));
                    return row;
                }
            }
        } catch (SQLException e) {
            LOGGER.debug("查询异常详情失败: {}", e.getMessage());
        } finally {
            lock.readLock().unlock();
        }
        
        return null;
    }
    
    /**
     * 关闭数据库连接
     */
    public void close() {
        lock.writeLock().lock();
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                LOGGER.info("SQLite 数据库连接已关闭");
            }
        } catch (SQLException e) {
            LOGGER.error("关闭数据库连接失败: {}", e.getMessage());
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * QPS 统计数据实体
     */
    public static class QpsStatistics {
        public String containerType;
        public long timestamp;
        public int qps;
        public long totalRequests;
        public int activeConnections;
        
        public QpsStatistics(String containerType, long timestamp, int qps, 
                           long totalRequests, int activeConnections) {
            this.containerType = containerType;
            this.timestamp = timestamp;
            this.qps = qps;
            this.totalRequests = totalRequests;
            this.activeConnections = activeConnections;
        }
    }
    
    /**
     * 组件统计数据实体
     */
    public static class ComponentStatistics {
        public String componentType;
        public String host;
        public int port;
        public int connectionCount;
        public long timestamp;
        
        public ComponentStatistics() {
        }
    }
}
