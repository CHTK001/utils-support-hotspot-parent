package com.chua.hotspot.core.support.constant;

import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 线程工厂
 *
 * @author CH
 * @since 2021-09-27
 */
public class NamedThreadFactory implements ThreadFactory {

    /** 线程池序号 */
    protected static final AtomicInteger POOL_SEQ = new AtomicInteger(1);

    /** 线程编号 */
    protected final AtomicInteger mThreadNum = new AtomicInteger(1);

    /** 线程名前缀 */
    protected final String mPrefix;

    /** 是否为守护线程 */
    protected final boolean mDaemon;

    /** 线程组 */
    protected final ThreadGroup mGroup;

    public NamedThreadFactory() {
        this("pool-" + POOL_SEQ.getAndIncrement(), false);
    }

    public NamedThreadFactory(String prefix) {
        this(prefix, false);
    }

    public NamedThreadFactory(String prefix, boolean daemon) {
        mPrefix = prefix + "-thread-";
        mDaemon = daemon;
        SecurityManager s = System.getSecurityManager();
        mGroup = (s == null) ? Thread.currentThread().getThreadGroup() : s.getThreadGroup();
    }

    @Override
    public Thread newThread(Runnable runnable) {
        String name = mPrefix + mThreadNum.getAndIncrement();
        Thread ret = new Thread(mGroup, runnable, name, 0);
        ret.setDaemon(mDaemon);
        return ret;
    }

    public ThreadGroup getThreadGroup() {
        return mGroup;
    }
}
