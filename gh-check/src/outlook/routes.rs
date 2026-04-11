use axum::{
    extract::{Path, Query, State},
    response::{
        sse::{Event, Sse},
        IntoResponse, Json,
    },
};
use serde::Deserialize;
use std::{sync::Arc, time::Duration};
use tracing::{debug, error, info, warn};

use super::client::OutlookClient;
use super::models::OutlookAccountBrief;
use crate::cache;
use crate::config;
use crate::AppState;

#[derive(Deserialize)]
pub struct PageParams {
    #[serde(default)]
    pub page: usize,
    #[serde(default = "default_size")]
    pub size: usize,
}

fn default_size() -> usize {
    50
}

#[derive(Deserialize)]
pub struct InboxParams {
    #[serde(default)]
    pub page: usize,
    #[serde(default = "default_page_size")]
    pub page_size: usize,
    /// Cache-buster timestamp — if present, skip Redis cache
    #[serde(default)]
    pub _t: Option<u64>,
}

fn default_page_size() -> usize {
    25
}

/// GET /api/outlook/accounts
pub async fn list_accounts(
    State(state): State<Arc<AppState>>,
    Query(params): Query<PageParams>,
) -> Json<serde_json::Value> {
    // Short-lived cache (10s) to absorb burst requests
    let cache_key = format!("outlook:accounts:{}:{}", params.page, params.size);
    if let Some(cached) = cache::cget(&state.redis, &cache_key).await {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cached) {
            return Json(val);
        }
    }

    let accounts = state.load_outlook_accounts().await;
    let total = accounts.len();
    debug!("GET /api/outlook/accounts — total={} page={} size={}", total, params.page, params.size);
    let start = params.page * params.size;
    let page: Vec<OutlookAccountBrief> = accounts
        .iter()
        .skip(start)
        .take(params.size)
        .map(|a| {
            let display_name = {
                let clients = &state.outlook_clients;
                clients.get(&a.email).map(|c| {
                    c.try_lock().ok().map(|cl| cl.display_name.clone())
                }).flatten()
            };
            OutlookAccountBrief {
                email: a.email.clone(),
                display_name,
                connected: state.outlook_clients.contains_key(&a.email),
            }
        })
        .collect();

    let result = serde_json::json!({
        "accounts": page,
        "total": total,
        "page": params.page,
        "size": params.size,
    });
    let json_str = serde_json::to_string(&result).unwrap_or_default();
    cache::cset(&state.redis, &cache_key, &json_str, 10).await; // 10s TTL
    Json(result)
}

/// POST /api/outlook/connect/{email}
pub async fn connect(
    State(state): State<Arc<AppState>>,
    Path(email): Path<String>,
) -> Json<serde_json::Value> {
    info!("POST /api/outlook/connect/{}", email);

    // check profile cache — if already connected recently, skip re-auth
    let profile_key = format!("outlook:profile:{}", email);
    if let Some(cached) = cache::cget(&state.redis, &profile_key).await {
        if state.outlook_clients.contains_key(&email) {
            info!("connect: {} already connected (cached profile)", email);
            return Json(serde_json::json!({
                "ok": true,
                "display_name": cached,
                "cached": true,
            }));
        }
    }

    let accounts = state.load_outlook_accounts().await;
    let acc = match accounts.iter().find(|a| a.email == email) {
        Some(a) => a.clone(),
        None => {
            warn!("connect: account not found: {}", email);
            return Json(serde_json::json!({"error": "account not found"}));
        }
    };

    match OutlookClient::connect(&acc).await {
        Ok(client) => {
            let display_name = client.display_name.clone();
            info!("connect: {} OK — display_name=\"{}\"", email, display_name);
            let shared = Arc::new(tokio::sync::Mutex::new(client));
            state
                .outlook_clients
                .insert(email.clone(), shared.clone());

            // cache profile
            cache::cset(&state.redis, &profile_key, &display_name, config::TTL_PROFILE).await;
            // invalidate accounts list cache (connection status changed)
            cache::cdel(&state.redis, "outlook:accounts:*").await;

            // background prefetch
            let pool = state.redis.clone();
            let em = email.clone();
            tokio::spawn(async move {
                let mut cl = shared.lock().await;
                match cl.prefetch_bodies(&em, 50).await {
                    Ok(items) => {
                        let pairs: Vec<(&str, &str)> = items
                            .iter()
                            .map(|(k, v)| (k.as_str(), v.as_str()))
                            .collect();
                        cache::cpipe_set(&pool, &pairs, config::TTL_MESSAGE).await;
                        info!("prefetched {} bodies for {}", items.len(), em);
                    }
                    Err(e) => error!("prefetch error for {}: {}", em, e),
                }
            });

            Json(serde_json::json!({
                "ok": true,
                "display_name": display_name,
            }))
        }
        Err(e) => {
            error!("connect: {} FAILED — {}", email, e);
            Json(serde_json::json!({"error": e.to_string()}))
        }
    }
}

/// GET /api/outlook/messages/{email}
pub async fn messages(
    State(state): State<Arc<AppState>>,
    Path(email): Path<String>,
    Query(params): Query<InboxParams>,
) -> Json<serde_json::Value> {
    info!("GET /api/outlook/messages/{} page={} page_size={}", email, params.page, params.page_size);
    // try cache first (skip if _t cache-buster present)
    let cache_key = format!(
        "outlook:messages:{}:{}:{}",
        email, params.page, params.page_size
    );
    if params._t.is_none() {
        if let Some(cached) = cache::cget(&state.redis, &cache_key).await {
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cached) {
                debug!("messages: {} cache HIT", email);
                return Json(val);
            }
        }
    }

    let client_lock = match state.outlook_clients.get(&email) {
        Some(c) => c.clone(),
        None => {
            warn!("messages: {} not connected", email);
            return Json(serde_json::json!({"error": "not connected"}));
        }
    };

    debug!("messages: {} cache MISS, fetching from Graph API", email);
    let mut client = client_lock.lock().await;
    let skip = params.page * params.page_size;
    match client
        .list_messages("inbox", params.page_size, skip)
        .await
    {
        Ok((msgs, total)) => {
            info!("messages: {} returned {} msgs (total={})", email, msgs.len(), total);
            let result = serde_json::json!({
                "messages": msgs,
                "total": total,
                "page": params.page,
                "page_size": params.page_size,
            });
            let json_str = serde_json::to_string(&result).unwrap_or_default();
            cache::cset(&state.redis, &cache_key, &json_str, config::TTL_MESSAGES).await;
            Json(result)
        }
        Err(e) => {
            error!("messages: {} FAILED — {}", email, e);
            Json(serde_json::json!({"error": e.to_string()}))
        },
    }
}

/// GET /api/outlook/message/{email}/{msg_id}
pub async fn message(
    State(state): State<Arc<AppState>>,
    Path((email, msg_id)): Path<(String, String)>,
) -> Json<serde_json::Value> {
    info!("GET /api/outlook/message/{}/{}", email, &msg_id[..20.min(msg_id.len())]);
    // try cache
    let cache_key = format!("outlook:message:{}:{}", email, msg_id);
    if let Some(cached) = cache::cget(&state.redis, &cache_key).await {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cached) {
            debug!("message: {} cache HIT for {}", email, &msg_id[..20.min(msg_id.len())]);
            return Json(val);
        }
    }

    let client_lock = match state.outlook_clients.get(&email) {
        Some(c) => c.clone(),
        None => {
            warn!("message: {} not connected", email);
            return Json(serde_json::json!({"error": "not connected"}));
        }
    };

    debug!("message: {} cache MISS, fetching from Graph API", email);
    let mut client = client_lock.lock().await;
    match client.get_message(&msg_id).await {
        Ok(msg) => {
            info!("message: {} got \"{}\"", email, msg.subject);
            // drop lock before cache ops
            drop(client);
            // invalidate message list cache
            cache::cdel(&state.redis, &format!("outlook:messages:{}:*", email)).await;

            let result = serde_json::json!(msg);
            let json_str = serde_json::to_string(&result).unwrap_or_default();
            cache::cset(&state.redis, &cache_key, &json_str, config::TTL_MESSAGE).await;
            Json(result)
        }
        Err(e) => {
            error!("message: {} FAILED — {}", email, e);
            Json(serde_json::json!({"error": e.to_string()}))
        }
    }
}

/// DELETE /api/outlook/accounts/{email}
pub async fn delete_account(
    State(state): State<Arc<AppState>>,
    Path(email): Path<String>,
) -> Json<serde_json::Value> {
    info!("DELETE /api/outlook/accounts/{}", email);
    let path = crate::config::data_path(crate::config::OUTLOOK_FILE);

    let content = match std::fs::read_to_string(&path) {
        Ok(c) => c,
        Err(_) => return Json(serde_json::json!({"error": "outlook.txt not found"})),
    };

    let lines: Vec<&str> = content.lines().collect();
    let kept: Vec<&str> = lines.iter()
        .copied()
        .filter(|l| {
            let trimmed = l.trim();
            if trimmed.is_empty() { return false; }
            let first_field = trimmed.split('|').next().unwrap_or("");
            first_field != email
        })
        .collect();

    if kept.len() == lines.len() {
        return Json(serde_json::json!({"error": "account not found"}));
    }

    let new_content = if kept.is_empty() { String::new() } else { kept.join("\n") + "\n" };
    if let Err(e) = std::fs::write(&path, &new_content) {
        error!("delete_account: failed to write outlook.txt: {}", e);
        return Json(serde_json::json!({"error": "failed to write file"}));
    }

    // cleanup
    state.outlook_clients.remove(&email);
    cache::cdel(&state.redis, "outlook:accounts:*").await;
    cache::cdel(&state.redis, &format!("outlook:profile:{}", email)).await;
    cache::cdel(&state.redis, &format!("outlook:messages:{}:*", email)).await;

    info!("delete_account: {} removed", email);
    Json(serde_json::json!({"deleted": email}))
}

/// GET /api/outlook/accounts/stream — SSE that pushes account list when outlook.txt changes
pub async fn accounts_stream(
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    let stream = async_stream::stream! {
        let mut interval = tokio::time::interval(Duration::from_secs(3));
        let mut last_mtime = std::time::SystemTime::UNIX_EPOCH;
        let mut last_count = 0usize;

        loop {
            interval.tick().await;

            let resolved = crate::config::data_path(crate::config::OUTLOOK_FILE);
            let mtime = std::fs::metadata(&resolved)
                .and_then(|m| m.modified())
                .unwrap_or(std::time::SystemTime::UNIX_EPOCH);

            // Push on first tick or when file changed
            if mtime != last_mtime || last_count == 0 {
                last_mtime = mtime;
                let accounts = state.load_outlook_accounts().await;
                last_count = accounts.len();

                let page: Vec<super::models::OutlookAccountBrief> = accounts
                    .iter()
                    .take(50)
                    .map(|a| {
                        let display_name = state.outlook_clients.get(&a.email)
                            .and_then(|c| c.try_lock().ok().map(|cl| cl.display_name.clone()));
                        super::models::OutlookAccountBrief {
                            email: a.email.clone(),
                            display_name,
                            connected: state.outlook_clients.contains_key(&a.email),
                        }
                    })
                    .collect();

                let data = serde_json::json!({
                    "accounts": page,
                    "total": last_count,
                });
                yield Ok::<_, std::convert::Infallible>(Event::default().data(data.to_string()));
            }
        }
    };

    Sse::new(Box::pin(stream)).keep_alive(
        axum::response::sse::KeepAlive::new()
            .interval(Duration::from_secs(15))
            .text("keep-alive"),
    )
}

/// GET /api/outlook/stream/{email} — SSE
pub async fn stream(
    State(state): State<Arc<AppState>>,
    Path(email): Path<String>,
) -> impl IntoResponse {
    info!("GET /api/outlook/stream/{} — SSE started", email);
    let state2 = state.clone();
    let email2 = email.clone();

    let stream = async_stream::stream! {
        let mut interval = tokio::time::interval(Duration::from_secs(15));
        let mut poll_interval = tokio::time::interval(Duration::from_secs(30));
        let mut tick = 0u64;
        let mut last_total: Option<usize> = None;

        loop {
            tokio::select! {
                _ = interval.tick() => {
                    tick += 1;
                    yield Ok::<_, std::convert::Infallible>(Event::default().event("ping").data(tick.to_string()));
                }
                _ = poll_interval.tick() => {
                    if let Some(client_lock) = state2.outlook_clients.get(&email2) {
                        let mut client = client_lock.lock().await;
                        if let Ok((msgs, total)) = client.list_messages("inbox", 5, 0).await {
                            let mut new_count = 0usize;
                            // detect new mail → invalidate message list cache
                            if let Some(prev) = last_total {
                                if total > prev {
                                    new_count = total - prev;
                                    cache::cdel(&state2.redis, &format!("outlook:messages:{}:*", email2)).await;
                                }
                            }
                            last_total = Some(total);

                            let data = serde_json::json!({
                                "type": "new_mail",
                                "total": total,
                                "count": new_count,
                                "latest": msgs.first().map(|m| serde_json::json!({
                                    "subject": m.subject,
                                    "sender": m.sender_name,
                                    "date": m.date,
                                })),
                            });
                            yield Ok(Event::default().event("message").data(data.to_string()));
                        }
                    }
                }
            }
        }
    };

    Sse::new(Box::pin(stream)).keep_alive(
        axum::response::sse::KeepAlive::new()
            .interval(Duration::from_secs(20))
            .text("keep-alive"),
    )
}
