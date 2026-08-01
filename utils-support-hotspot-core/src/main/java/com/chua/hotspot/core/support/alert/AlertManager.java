package com.chua.hotspot.core.support.alert;

import com.chua.hotspot.core.support.enums.ModuleType;
import com.chua.hotspot.core.support.environment.Project;
import com.chua.hotspot.core.support.log.LogFactory;
import com.chua.hotspot.core.support.report.ReportFactory;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 告警管理器
 * <p>
 * 核心职责：
 * <ul>
 *   <li>管理告警规则的注册、更新、删除</li>
 *   <li>接收指标数据并评估是否触发告警</li>
 *   <li>记录告警历史并去重（同一规则告警间隔控制）</li>
 *   <li>通过 ReportFactory 上报告警事件</li>
 * </ul>
 * </p>
 * <p>
 * 使用方式：
 * <pre>
 *   // 注册规则
 *   AlertManager.getInstance().addRule(rule);
 *
 *   // 上报指标
 *   AlertManager.getInstance().submitMetric("sql.slowQuery", 5000);
 *
 *   // 查询告警
 *   List<AlertRecord> alerts = AlertManager.getInstance().getRecentAlerts();
 * </pre>
 * </p>
 *
 * @author CH
 * @since 2024/12/15
 * @version 4.0.0.34
 */
public class AlertManager {

/**
 * 日志对象
 */
    private static final LogFactory LOGGER = LogFactory.getInstance();

    /**
     * 单例实例
     */
    private static final AlertManager INSTANCE = new AlertManager();

    /**
     * 最近告警记录（限制 500 条）
     */
    private final ConcurrentLinkedQueue<AlertRecord> recentAlerts = new ConcurrentLinkedQueue<>();

    /**
     * 最近告警记录最大数量
     */
    private static final int MAX_RECENT_ALERTS = 500;

    /**
     * 告警规则注册表（按规则 ID 索引）
     */
    private final Map<String, AlertRule> rules = new ConcurrentHashMap<>();

    /**
     * 指标名称 → 规则列表索引（加速规则匹配）
     */
    private final Map<String, List<AlertRule>> metricRuleIndex = new ConcurrentHashMap<>();

    /**
     * 规则 ID → 上次告警时间（毫秒），用于告警间隔控制
     */
    private final Map<String, Long> lastAlertTime = new ConcurrentHashMap<>();

    /**
     * 规则 ID → 连续触发计数，用于 consecutiveCount 判断
     */
    private final Map<String, AtomicLong> consecutiveHits = new ConcurrentHashMap<>();

    /**
     * 指标滑动窗口数据（指标名称 → 时间序列值）
     */
    private final Map<String, MetricWindow> metricWindows = new ConcurrentHashMap<>();

    /**
     * 告警 ID 序列
     */
    private final AtomicLong alertIdSeq = new AtomicLong(0);

    private AlertManager() {
        registerDefaultRules();
    }

    public static AlertManager getInstance() {
        return INSTANCE;
    }

    // ==================== 规则管理 ====================

    /**
     * 添加告警规则
     *
     * @param rule 告警规则
     */
    public void addRule(AlertRule rule) {
        if (rule == null || rule.getId() == null || rule.getId().isEmpty()) {
            LOGGER.warn("告警规则 ID 不能为空");
            return;
        }
        rules.put(rule.getId(), rule);
        // 更新指标索引
        metricRuleIndex.computeIfAbsent(rule.getMetric(), k -> new ArrayList<>()).add(rule);
        LOGGER.info("注册告警规则: {} [metric={}, threshold={}, level={}]",
                rule.getName(), rule.getMetric(), rule.getThreshold(), rule.getLevel());
    }

    /**
     * 移除告警规则
     *
     * @param ruleId 规则 ID
     */
    public void removeRule(String ruleId) {
        AlertRule removed = rules.remove(ruleId);
        if (removed != null) {
            List<AlertRule> ruleList = metricRuleIndex.get(removed.getMetric());
            if (ruleList != null) {
                ruleList.removeIf(r -> r.getId().equals(ruleId));
            }
            consecutiveHits.remove(ruleId);
            lastAlertTime.remove(ruleId);
            LOGGER.info("移除告警规则: {}", removed.getName());
        }
    }

    /**
     * 获取所有告警规则
     *
     * @return 不可修改的规则列表
     */
    public List<AlertRule> getRules() {
        return Collections.unmodifiableList(new ArrayList<>(rules.values()));
    }

    /**
     * 获取指定指标的告警规则
     *
     * @param metric 指标名称
     * @return 规则列表
     */
    public List<AlertRule> getRulesByMetric(String metric) {
        List<AlertRule> ruleList = metricRuleIndex.get(metric);
        return ruleList != null ? Collections.unmodifiableList(ruleList) : Collections.emptyList();
    }

    // ==================== 指标提交与评估 ====================

    /**
     * 提交指标值并评估告警规则
     *
     * @param metric 指标名称
     * @param value  指标值
     */
    public void submitMetric(String metric, double value) {
        // 记录指标到滑动窗口
        MetricWindow window = metricWindows.computeIfAbsent(metric, k -> new MetricWindow());
        window.add(value);

        // 查找匹配的规则
        List<AlertRule> matchedRules = metricRuleIndex.get(metric);
        if (matchedRules == null || matchedRules.isEmpty()) {
            return;
        }

        // 逐条评估
        for (AlertRule rule : matchedRules) {
            if (!rule.isEnabled()) {
                continue;
            }
            evaluateRule(rule, value);
        }
    }

    /**
     * 评估单条告警规则
     */
    private void evaluateRule(AlertRule rule, double currentValue) {
        boolean triggered = false;

        switch (rule.getConditionType()) {
            case THRESHOLD:
                triggered = currentValue > rule.getThreshold();
                break;
            case COUNT:
                MetricWindow window = metricWindows.get(rule.getMetric());
                if (window != null) {
                    triggered = window.count(rule.getWindowSeconds()) > (long) rule.getThreshold();
                }
                break;
            case RATE:
                MetricWindow rateWindow = metricWindows.get(rule.getMetric());
                if (rateWindow != null) {
                    double rate = rateWindow.rate(rule.getWindowSeconds());
                    triggered = rate > rule.getThreshold();
                }
                break;
            case ABSENCE:
                MetricWindow absWindow = metricWindows.get(rule.getMetric());
                if (absWindow != null) {
                    long elapsed = (System.currentTimeMillis() - absWindow.lastTime()) / 1000;
                    triggered = elapsed > (long) rule.getThreshold();
                }
                break;
        }

        if (!triggered) {
            // 未触发，重置连续计数
            consecutiveHits.remove(rule.getId());
            return;
        }

        // 检查连续触发次数
        long hits = consecutiveHits.computeIfAbsent(rule.getId(), k -> new AtomicLong(0)).incrementAndGet();
        if (hits < rule.getConsecutiveCount()) {
            return;
        }

        // 检查告警间隔
        Long lastTime = lastAlertTime.get(rule.getId());
        if (lastTime != null) {
            long elapsed = (System.currentTimeMillis() - lastTime) / 1000;
            if (elapsed < rule.getAlertIntervalSeconds()) {
                return;
            }
        }

        // 触发告警
        fireAlert(rule, currentValue);
    }

    /**
     * 触发告警
     */
    private void fireAlert(AlertRule rule, double currentValue) {
        AlertRecord record = new AlertRecord();
        record.setId(String.valueOf(alertIdSeq.incrementAndGet()));
        record.setRuleId(rule.getId());
        record.setRuleName(rule.getName());
        record.setLevel(rule.getLevel());
        record.setModuleType(rule.getModuleType());
        record.setMetric(rule.getMetric());
        record.setCurrentValue(currentValue);
        record.setThreshold(rule.getThreshold());
        record.setMessage(String.format("[%s] %s 当前值 %.2f 超过阈值 %.2f",
                rule.getLevel().getDescription(), rule.getName(), currentValue, rule.getThreshold()));

        // 填充应用信息
        try {
            Project project = Project.getInstance();
            record.setApplicationName(project.getApplicationName());
        } catch (Exception e) {
            record.setApplicationName("unknown");
        }
        record.setHost(ReportFactory.LOCAL_HOST);

        // 记录告警
        recentAlerts.add(record);
        while (recentAlerts.size() > MAX_RECENT_ALERTS) {
            recentAlerts.poll();
        }

        // 更新告警时间
        lastAlertTime.put(rule.getId(), System.currentTimeMillis());

        // 重置连续计数
        consecutiveHits.remove(rule.getId());

        // 通过 ReportFactory 上报告警事件
        ReportFactory.report(ModuleType.EXCEPTION, "ALERT", record);

        LOGGER.warn("告警触发: {}", record.getMessage());
    }

    // ==================== 告警查询 ====================

    /**
     * 获取最近的告警记录
     *
     * @return 告警记录列表
     */
    public List<AlertRecord> getRecentAlerts() {
        return new ArrayList<>(recentAlerts);
    }

    /**
     * 获取指定级别的告警记录
     *
     * @param level 告警级别
     * @return 告警记录列表
     */
    public List<AlertRecord> getAlertsByLevel(AlertLevel level) {
        List<AlertRecord> result = new ArrayList<>();
        for (AlertRecord record : recentAlerts) {
            if (record.getLevel() == level) {
                result.add(record);
            }
        }
        return result;
    }

    /**
     * 获取指定模块的告警记录
     *
     * @param moduleType 模块类型
     * @return 告警记录列表
     */
    public List<AlertRecord> getAlertsByModule(ModuleType moduleType) {
        List<AlertRecord> result = new ArrayList<>();
        for (AlertRecord record : recentAlerts) {
            if (record.getModuleType() == moduleType) {
                result.add(record);
            }
        }
        return result;
    }

    /**
     * 获取告警统计信息
     *
     * @return 按级别分组的告警计数
     */
    public Map<AlertLevel, Integer> getAlertStats() {
        Map<AlertLevel, Integer> stats = new EnumMap<>(AlertLevel.class);
        for (AlertLevel level : AlertLevel.values()) {
            stats.put(level, 0);
        }
        for (AlertRecord record : recentAlerts) {
            stats.merge(record.getLevel(), 1, Integer::sum);
        }
        return stats;
    }

    /**
     * 清除所有告警记录
     */
    public void clearAlerts() {
        recentAlerts.clear();
        lastAlertTime.clear();
        consecutiveHits.clear();
    }

    // ==================== 默认规则 ====================

    /**
     * 注册默认告警规则
     */
    private void registerDefaultRules() {
        // 慢 SQL 告警（超过 3 秒）
        addRule(createRule("default-slow-sql", "慢SQL告警", ModuleType.SQL,
                "sql.slowQuery", AlertRule.ConditionType.THRESHOLD, 3000, AlertLevel.WARN));

        // 异常频率告警（1 分钟内超过 50 次）
        addRule(createRule("default-exception-rate", "异常频率告警", ModuleType.EXCEPTION,
                "exception.count", AlertRule.ConditionType.COUNT, 50, AlertLevel.ERROR));

        // JVM 内存告警（超过 85%）
        addRule(createRule("default-jvm-memory", "JVM内存告警", ModuleType.JVM,
                "jvm.memory.usedPercent", AlertRule.ConditionType.THRESHOLD, 85, AlertLevel.WARN));
    }

    private AlertRule createRule(String id, String name, ModuleType moduleType,
                                  String metric, AlertRule.ConditionType conditionType,
                                  double threshold, AlertLevel level) {
        AlertRule rule = new AlertRule();
        rule.setId(id);
        rule.setName(name);
        rule.setModuleType(moduleType);
        rule.setMetric(metric);
        rule.setConditionType(conditionType);
        rule.setThreshold(threshold);
        rule.setLevel(level);
        return rule;
    }

    // ==================== 指标滑动窗口 ====================

    /**
     * 指标滑动窗口
     * <p>
     * 用于记录指标在时间窗口内的值序列，支持计数、速率等聚合计算。
     * </p>
     */
    static class MetricWindow {
        /** 时间戳-值对（按时间排序） */
        private final ConcurrentLinkedQueue<TimeValue> values = new ConcurrentLinkedQueue<>();
        private static final int MAX_WINDOW_SIZE = 600;

        void add(double value) {
            values.add(new TimeValue(System.currentTimeMillis(), value));
            // 超过窗口大小时移除最旧的
            while (values.size() > MAX_WINDOW_SIZE) {
                values.poll();
            }
        }

        /**
         * 统计时间窗口内的数据点数量
         *
         * @param windowSeconds 窗口大小（秒）
         * @return 窗口内的数据点数量
         */
        long count(int windowSeconds) {
            long cutoff = System.currentTimeMillis() - windowSeconds * 1000L;
            return values.stream().filter(tv -> tv.timestamp >= cutoff).count();
        }

        /**
         * 计算时间窗口内的变化速率（值/秒）
         *
         * @param windowSeconds 窗口大小（秒）
         * @return 速率值
         */
        double rate(int windowSeconds) {
            long cutoff = System.currentTimeMillis() - windowSeconds * 1000L;
            List<TimeValue> inWindow = new ArrayList<>();
            for (TimeValue tv : values) {
                if (tv.timestamp >= cutoff) {
                    inWindow.add(tv);
                }
            }
            if (inWindow.size() < 2) {
                return 0.0;
            }
            double first = inWindow.get(0).value;
            double last = inWindow.get(inWindow.size() - 1).value;
            long durationMs = inWindow.get(inWindow.size() - 1).timestamp - inWindow.get(0).timestamp;
            if (durationMs <= 0) {
                return 0.0;
            }
            return (last - first) / (durationMs / 1000.0);
        }

        /**
         * 获取最后一次数据的时间戳
         */
        long lastTime() {
            TimeValue last = null;
            for (TimeValue tv : values) {
                last = tv;
            }
            return last != null ? last.timestamp : 0;
        }
    }

    /**
     * 时间戳-值对
     */
    static class TimeValue {
        final long timestamp;
        final double value;

        TimeValue(long timestamp, double value) {
            this.timestamp = timestamp;
            this.value = value;
        }
    }
}