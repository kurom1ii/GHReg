use axum::{
    extract::{Path, Query, State},
    response::{
        sse::{Event, Sse},
        IntoResponse, Json,
    },
};
use serde::Deserialize;
use std::{sync::Arc, time::Duration};
use totp_rs::{Algorithm, Secret, TOTP};
use tracing::{error, info, warn};

use super::{graphql, login, org, pat};
use super::models::{GithubAccountBrief, PatPreset};
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
fn default_size() -> usize { 50 }

#[derive(Deserialize)]
pub struct CheckAliveBody {
    pub usernames: Vec<String>,
    #[serde(default)]
    pub token: String,
}

#[derive(Deserialize)]
pub struct RateLimitParams {
    #[serde(default)]
    pub token: String,
}

#[derive(Deserialize)]
pub struct InviteBody {
    pub username: String,
    #[serde(default)]
    pub session_username: String,
}

#[derive(Deserialize)]
pub struct OrgQueryParams {
    #[serde(default)]
    pub fresh: bool,
}

/// GET /api/github/accounts
pub async fn list_accounts(
    State(state): State<Arc<AppState>>,
    Query(params): Query<PageParams>,
) -> Json<serde_json::Value> {
    // Short-lived cache (5s) — status changes on login invalidate it
    let cache_key = format!("github:accounts:{}:{}", params.page, params.size);
    if let Some(cached) = cache::cget(&state.redis, &cache_key).await {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cached) {
            return Json(val);
        }
    }

    let accounts = state.load_github_accounts().await;
    let total = accounts.len();
    let start = params.page * params.size;

    let page_accounts: Vec<_> = accounts.iter().skip(start).take(params.size).collect();
    let mut statuses = std::collections::HashMap::new();
    for a in &page_accounts {
        if state.github_sessions.contains_key(&a.username) {
            statuses.insert(a.username.clone(), "online".to_string());
        } else {
            let key = format!("github:status:{}", a.username);
            if let Some(s) = cache::cget(&state.redis, &key).await {
                statuses.insert(a.username.clone(), s);
            } else {
                statuses.insert(a.username.clone(), "offline".to_string());
            }
        }
    }

    let page: Vec<GithubAccountBrief> = page_accounts
        .iter()
        .map(|a| GithubAccountBrief {
            username: a.username.clone(),
            email: a.email.clone(),
            has_2fa: !a.totp_secret.is_empty(),
            status: statuses.get(&a.username).cloned().unwrap_or_else(|| "offline".to_string()),
        })
        .collect();

    let result = serde_json::json!({
        "accounts": page,
        "total": total,
        "page": params.page,
        "size": params.size,
    });
    let json_str = serde_json::to_string(&result).unwrap_or_default();
    cache::cset(&state.redis, &cache_key, &json_str, 5).await; // 5s TTL
    Json(result)
}

/// POST /api/github/login/{username}
pub async fn do_login(
    State(state): State<Arc<AppState>>,
    Path(username): Path<String>,
) -> Json<serde_json::Value> {
    info!("POST /api/github/login/{}", username);
    let accounts = state.load_github_accounts().await;
    let acc = match accounts.iter().find(|a| a.username == username) {
        Some(a) => a.clone(),
        None => {
            warn!("login: account not found: {}", username);
            return Json(serde_json::json!({"error": "account not found"}));
        }
    };

    info!("login: {} — creating client (Chrome136 TLS, has_2fa={})", username, !acc.totp_secret.is_empty());
    let client = match login::new_github_client() {
        Ok(c) => c,
        Err(e) => {
            error!("login: {} — client build FAILED: {}", username, e);
            return Json(serde_json::json!({"error": e.to_string()}));
        }
    };

    let status_key = format!("github:status:{}", username);
    match login::github_login(&client, &acc.username, &acc.password, &acc.totp_secret).await {
        Ok(true) => {
            info!("login: {} — SUCCESS, storing session", username);
            state.github_sessions.insert(username.clone(), client);
            cache::cset(&state.redis, &status_key, "online", config::TTL_GH_STATUS).await;
            cache::cdel(&state.redis, "github:accounts:*").await;
            Json(serde_json::json!({"ok": true, "status": "logged_in", "username": username}))
        }
        Ok(false) => {
            warn!("login: {} — FAILED (credentials invalid or blocked)", username);
            cache::cset(&state.redis, &status_key, "failed", config::TTL_GH_STATUS).await;
            Json(serde_json::json!({"error": "login failed"}))
        }
        Err(e) => {
            error!("login: {} — ERROR: {}", username, e);
            cache::cset(&state.redis, &status_key, &format!("error: {}", e), config::TTL_GH_STATUS).await;
            Json(serde_json::json!({"error": e.to_string()}))
        }
    }
}

/// POST /api/github/pat/{username}
pub async fn create_pat(
    State(state): State<Arc<AppState>>,
    Path(username): Path<String>,
) -> Json<serde_json::Value> {
    let client = match state.github_sessions.get(&username) {
        Some(c) => c.clone(),
        None => return Json(serde_json::json!({"error": "not logged in"})),
    };

    let accounts = state.load_github_accounts().await;
    let acc = match accounts.iter().find(|a| a.username == username) {
        Some(a) => a.clone(),
        None => return Json(serde_json::json!({"error": "account not found"})),
    };

    // sudo first
    if let Err(e) = pat::github_sudo(&client, &acc.password).await {
        error!("sudo failed for {}: {}", username, e);
    }

    let token_name = format!("auto-{}", chrono::Utc::now().format("%Y%m%d-%H%M%S"));
    match pat::create_pat(&client, &token_name, &acc.password, 30, PatPreset::Copilot).await {
        Ok(token) => {
            // save to file
            if let Err(e) = pat::save_token(
                &token,
                &token_name,
                Some(&username),
                config::TOKEN_FILE,
            ) {
                error!("save token error: {}", e);
            }
            info!("{}: PAT created: {}...", username, &token[..20.min(token.len())]);
            // update status in Redis
            let status_key = format!("github:status:{}", username);
            cache::cset(&state.redis, &status_key, "pat_created", config::TTL_GH_STATUS).await;
            let preview = format!("{}...{}", &token[..8.min(token.len())], &token[token.len().saturating_sub(4)..]);
            Json(serde_json::json!({"ok": true, "status": "pat_created", "token": token, "token_preview": preview}))
        }
        Err(e) => Json(serde_json::json!({"error": e.to_string()})),
    }
}

/// GET /api/github/orgs/{username}
pub async fn get_orgs(
    State(state): State<Arc<AppState>>,
    Path(username): Path<String>,
    Query(params): Query<OrgQueryParams>,
) -> Json<serde_json::Value> {
    let cache_key = format!("github:orgs:{}", username);

    // Skip cache when fresh=true (user explicitly clicked refresh)
    if !params.fresh {
        if let Some(cached) = cache::cget(&state.redis, &cache_key).await {
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cached) {
                info!("get_orgs: cache HIT for {}", username);
                return Json(val);
            }
        }
    } else {
        // Invalidate old cache
        cache::cdel(&state.redis, &format!("github:orgs:{}*", username)).await;
    }

    let client = match state.github_sessions.get(&username) {
        Some(c) => c.clone(),
        None => return Json(serde_json::json!({"error": "not logged in"})),
    };

    match org::list_orgs(&client).await {
        Ok(org_names) => {
            let mut org_infos = Vec::new();
            for name in &org_names {
                match org::get_org_info(&client, name).await {
                    Ok(info) => org_infos.push(serde_json::json!(info)),
                    Err(e) => {
                        error!("org info error for {}: {}", name, e);
                    }
                }
            }
            let result = serde_json::json!(org_infos);
            let json_str = serde_json::to_string(&result).unwrap_or_default();
            cache::cset(&state.redis, &cache_key, &json_str, config::TTL_ORGS).await;
            Json(result)
        }
        Err(e) => Json(serde_json::json!({"error": e.to_string()})),
    }
}

/// POST /api/github/invite/{org_name}
pub async fn invite(
    State(state): State<Arc<AppState>>,
    Path(org_name): Path<String>,
    Json(body): Json<InviteBody>,
) -> Json<serde_json::Value> {
    // Use specific session if provided, otherwise first available
    let client = if !body.session_username.is_empty() {
        match state.github_sessions.get(&body.session_username) {
            Some(entry) => entry.value().clone(),
            None => return Json(serde_json::json!({"error": "session not found"})),
        }
    } else {
        match state.github_sessions.iter().next() {
            Some(entry) => entry.value().clone(),
            None => return Json(serde_json::json!({"error": "no active session"})),
        }
    };

    match org::invite_user(&client, &org_name, &body.username, "direct_member").await {
        Ok(true) => {
            info!("invite: {} → {} OK, invalidating org cache", body.username, org_name);
            // invalidate org cache so next fetch shows the new member
            cache::cdel(&state.redis, "github:orgs:*").await;
            Json(serde_json::json!({"ok": true}))
        }
        Ok(false) => Json(serde_json::json!({"error": "invite failed"})),
        Err(e) => Json(serde_json::json!({"error": e.to_string()})),
    }
}

/// Helper: get a logged-in client from session param or first available.
fn get_session_client(state: &AppState, session: &str) -> Option<rquest::Client> {
    if !session.is_empty() {
        state.github_sessions.get(session).map(|e| e.value().clone())
    } else {
        state.github_sessions.iter().next().map(|e| e.value().clone())
    }
}

#[derive(Deserialize)]
pub struct SessionBody {
    #[serde(default)]
    pub session: String,
}

/// POST /api/github/orgs/{org_name}/remove/{username}
pub async fn remove_member_handler(
    State(state): State<Arc<AppState>>,
    Path((org_name, username)): Path<(String, String)>,
    Json(body): Json<SessionBody>,
) -> Json<serde_json::Value> {
    let client = match get_session_client(&state, &body.session) {
        Some(c) => c,
        None => return Json(serde_json::json!({"error": "no active session"})),
    };

    info!("remove: {} from {}", username, org_name);
    match org::remove_member(&client, &org_name, &username).await {
        Ok(true) => {
            cache::cdel(&state.redis, "github:orgs:*").await;
            Json(serde_json::json!({"ok": true}))
        }
        Ok(false) => Json(serde_json::json!({"error": "remove failed"})),
        Err(e) => Json(serde_json::json!({"error": e.to_string()})),
    }
}

/// POST /api/github/orgs/{org_name}/cancel/{invitee}
pub async fn cancel_pending_handler(
    State(state): State<Arc<AppState>>,
    Path((org_name, invitee)): Path<(String, String)>,
    Json(body): Json<SessionBody>,
) -> Json<serde_json::Value> {
    let client = match get_session_client(&state, &body.session) {
        Some(c) => c,
        None => return Json(serde_json::json!({"error": "no active session"})),
    };

    info!("cancel_pending: {} from {}", invitee, org_name);
    match org::cancel_pending(&client, &org_name, &invitee).await {
        Ok(true) => {
            cache::cdel(&state.redis, "github:orgs:*").await;
            Json(serde_json::json!({"ok": true}))
        }
        Ok(false) => Json(serde_json::json!({"error": "cancel failed"})),
        Err(e) => Json(serde_json::json!({"error": e.to_string()})),
    }
}

/// POST /api/github/check-alive
pub async fn check_alive(
    State(state): State<Arc<AppState>>,
    Json(body): Json<CheckAliveBody>,
) -> Json<serde_json::Value> {
    let token = if body.token.is_empty() {
        config::DEFAULT_PAT.to_string()
    } else {
        body.token
    };

    // cache key based on sorted usernames
    let mut sorted = body.usernames.clone();
    sorted.sort();
    let cache_key = format!("github:alive:{}", sorted.join(","));
    if let Some(cached) = cache::cget(&state.redis, &cache_key).await {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cached) {
            info!("check-alive: cache HIT ({} usernames)", sorted.len());
            return Json(val);
        }
    }

    match graphql::batch_check(&body.usernames, &token).await {
        Ok(results) => {
            let alive: Vec<&String> = results.iter().filter(|(_, &v)| v).map(|(k, _)| k).collect();
            let dead: Vec<&String> = results.iter().filter(|(_, &v)| !v).map(|(k, _)| k).collect();
            let result = serde_json::json!({
                "alive": alive.len(),
                "dead": dead.len(),
                "total": results.len(),
                "dead_accounts": dead,
                "results": results,
            });
            let json_str = serde_json::to_string(&result).unwrap_or_default();
            cache::cset(&state.redis, &cache_key, &json_str, config::TTL_ALIVE).await;
            Json(result)
        }
        Err(e) => Json(serde_json::json!({"error": e.to_string()})),
    }
}

/// POST /api/github/rate-limit
pub async fn rate_limit_handler(
    State(state): State<Arc<AppState>>,
    Query(params): Query<RateLimitParams>,
) -> Json<serde_json::Value> {
    let token = if params.token.is_empty() {
        config::DEFAULT_PAT
    } else {
        &params.token
    };

    // cache by token prefix
    let token_prefix = &token[..10.min(token.len())];
    let cache_key = format!("github:ratelimit:{}", token_prefix);
    if let Some(cached) = cache::cget(&state.redis, &cache_key).await {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cached) {
            return Json(val);
        }
    }

    match graphql::rate_limit(token).await {
        Ok(rl) => {
            let result = serde_json::json!({"rate_limit": rl});
            let json_str = serde_json::to_string(&result).unwrap_or_default();
            cache::cset(&state.redis, &cache_key, &json_str, config::TTL_RATE_LIMIT).await;
            Json(result)
        }
        Err(e) => Json(serde_json::json!({"error": e.to_string()})),
    }
}

/// GET /api/github/totp — generate current TOTP codes for all accounts
pub async fn totp_codes(
    State(state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    let accounts = state.load_github_accounts().await;
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let remaining = 30 - (now % 30);

    let mut codes = serde_json::Map::new();
    for a in &accounts {
        if a.totp_secret.is_empty() {
            continue;
        }
        match Secret::Encoded(a.totp_secret.clone()).to_bytes() {
            Ok(secret_bytes) => {
                let totp = TOTP::new_unchecked(Algorithm::SHA1, 6, 1, 30, secret_bytes);
                if let Ok(code) = totp.generate_current() {
                    codes.insert(a.username.clone(), serde_json::json!(code));
                }
            }
            Err(_) => {}
        }
    }

    Json(serde_json::json!({
        "codes": codes,
        "remaining": remaining,
    }))
}

/// GET /api/github/accounts/stream — SSE that pushes account list when accounts.txt changes
pub async fn accounts_stream(
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    let stream = async_stream::stream! {
        let mut interval = tokio::time::interval(Duration::from_secs(3));
        let mut last_mtime = std::time::SystemTime::UNIX_EPOCH;
        let mut last_count = 0usize;

        loop {
            interval.tick().await;

            let resolved = crate::config::data_path(crate::config::GITHUB_FILE);
            let mtime = std::fs::metadata(&resolved)
                .and_then(|m| m.modified())
                .unwrap_or(std::time::SystemTime::UNIX_EPOCH);

            if mtime != last_mtime || last_count == 0 {
                last_mtime = mtime;
                let accounts = state.load_github_accounts().await;
                last_count = accounts.len();

                let list: Vec<serde_json::Value> = accounts
                    .iter()
                    .map(|a| {
                        serde_json::json!({
                            "username": a.username,
                            "email": a.email,
                            "status": if state.github_sessions.contains_key(&a.username) { "online" } else { "offline" },
                        })
                    })
                    .collect();

                let data = serde_json::json!({
                    "accounts": list,
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

/// GET /api/github/stream — SSE for status updates
pub async fn stream(
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    let stream = async_stream::stream! {
        let mut interval = tokio::time::interval(Duration::from_secs(5));
        loop {
            interval.tick().await;
            let accounts = state.load_github_accounts().await;
            let total = accounts.len();
            let online = state.github_sessions.len();

            let statuses: Vec<serde_json::Value> = accounts
                .iter()
                .take(200)  // limit to prevent huge payloads
                .map(|a| {
                    serde_json::json!({
                        "username": a.username,
                        "status": if state.github_sessions.contains_key(&a.username) {
                            "online"
                        } else {
                            "offline"
                        },
                    })
                })
                .collect();

            let data = serde_json::json!({
                "type": "status_update",
                "total": total,
                "online": online,
                "accounts": statuses,
            });
            yield Ok::<_, std::convert::Infallible>(Event::default().event("status_update").data(data.to_string()));
        }
    };

    Sse::new(Box::pin(stream)).keep_alive(
        axum::response::sse::KeepAlive::new()
            .interval(Duration::from_secs(30))
            .text("keep-alive"),
    )
}
