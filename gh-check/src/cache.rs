use deadpool_redis::{Config, Pool, Runtime, Connection};
use redis::AsyncCommands;
use anyhow::Result;

/// Create a Redis connection pool.
pub fn create_pool(url: &str, max_size: usize) -> Pool {
    let mut cfg = Config::from_url(url);
    cfg.pool = Some(deadpool_redis::PoolConfig {
        max_size,
        ..Default::default()
    });
    cfg.create_pool(Some(Runtime::Tokio1)).expect("redis pool")
}

async fn conn(pool: &Pool) -> Result<Connection> {
    Ok(pool.get().await?)
}

/// GET a cached value.
pub async fn cget(pool: &Pool, key: &str) -> Option<String> {
    let mut c = conn(pool).await.ok()?;
    c.get(key).await.ok()
}

/// SET a cached value with TTL.
pub async fn cset(pool: &Pool, key: &str, data: &str, ttl: u64) {
    if let Ok(mut c) = conn(pool).await {
        let _: Result<(), _> = c.set_ex(key, data, ttl).await;
    }
}

/// Pipeline SET with shared TTL.
pub async fn cpipe_set(pool: &Pool, items: &[(&str, &str)], ttl: u64) {
    if items.is_empty() {
        return;
    }
    if let Ok(mut c) = conn(pool).await {
        let mut pipe = redis::pipe();
        for (k, v) in items {
            pipe.cmd("SETEX").arg(*k).arg(ttl as i64).arg(*v);
        }
        let _: Result<(), _> = pipe.query_async(&mut *c).await;
    }
}

/// Delete keys matching a glob pattern via SCAN + UNLINK.
pub async fn cdel(pool: &Pool, pattern: &str) {
    if let Ok(mut c) = conn(pool).await {
        let mut cursor: u64 = 0;
        loop {
            let (next, keys): (u64, Vec<String>) =
                redis::cmd("SCAN")
                    .arg(cursor)
                    .arg("MATCH")
                    .arg(pattern)
                    .arg("COUNT")
                    .arg(200)
                    .query_async(&mut *c)
                    .await
                    .unwrap_or((0, vec![]));
            if !keys.is_empty() {
                let _: Result<(), _> = redis::cmd("UNLINK")
                    .arg(&keys)
                    .query_async(&mut *c)
                    .await;
            }
            if next == 0 {
                break;
            }
            cursor = next;
        }
    }
}

/// Redis DBSIZE.
pub async fn db_size(pool: &Pool) -> i64 {
    if let Ok(mut c) = conn(pool).await {
        redis::cmd("DBSIZE")
            .query_async(&mut *c)
            .await
            .unwrap_or(0)
    } else {
        0
    }
}

/// Redis INFO memory (used_memory_human).
pub async fn memory_info(pool: &Pool) -> String {
    if let Ok(mut c) = conn(pool).await {
        let info: String = redis::cmd("INFO")
            .arg("memory")
            .query_async(&mut *c)
            .await
            .unwrap_or_default();
        for line in info.lines() {
            if line.starts_with("used_memory_human:") {
                return line.split(':').nth(1).unwrap_or("?").trim().to_string();
            }
        }
    }
    "?".into()
}
