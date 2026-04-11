mod cache;
mod config;
mod github;
mod headers;
mod outlook;
mod parsers;

use axum::{
    extract::State,
    response::{
        sse::{Event, Sse},
        IntoResponse, Json,
    },
    routing::{delete, get, post},
    Router,
};
use dashmap::DashMap;
use deadpool_redis::Pool;
use outlook::client::SharedOutlookClient;
use std::sync::Arc;
use std::time::SystemTime;
use tokio::sync::{broadcast, RwLock};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::info;

use github::models::GithubAccount;
use outlook::models::OutlookAccount;

/// Application shared state.
pub struct AppState {
    pub redis: Pool,
    pub outlook_clients: DashMap<String, SharedOutlookClient>,
    pub github_sessions: DashMap<String, rquest::Client>,
    pub log_tx: broadcast::Sender<String>,
    // file cache: (mtime, parsed data)
    outlook_file: RwLock<(SystemTime, Vec<OutlookAccount>)>,
    github_file: RwLock<(SystemTime, Vec<GithubAccount>)>,
}

impl AppState {
    fn new(redis: Pool, log_tx: broadcast::Sender<String>) -> Self {
        Self {
            redis,
            outlook_clients: DashMap::new(),
            github_sessions: DashMap::new(),
            log_tx,
            outlook_file: RwLock::new((SystemTime::UNIX_EPOCH, Vec::new())),
            github_file: RwLock::new((SystemTime::UNIX_EPOCH, Vec::new())),
        }
    }

    /// Load and cache Outlook accounts from data file.
    pub async fn load_outlook_accounts(&self) -> Vec<OutlookAccount> {
        self.load_file_cached(
            &self.outlook_file,
            config::OUTLOOK_FILE,
            OutlookAccount::from_line,
        )
        .await
    }

    /// Load and cache GitHub accounts from data file.
    pub async fn load_github_accounts(&self) -> Vec<GithubAccount> {
        self.load_file_cached(
            &self.github_file,
            config::GITHUB_FILE,
            GithubAccount::from_line,
        )
        .await
    }

    async fn load_file_cached<T: Clone>(
        &self,
        cache: &RwLock<(SystemTime, Vec<T>)>,
        path: &str,
        parser: fn(&str) -> Option<T>,
    ) -> Vec<T> {
        let resolved = config::data_path(path);
        let mtime = std::fs::metadata(&resolved)
            .and_then(|m| m.modified())
            .unwrap_or(SystemTime::UNIX_EPOCH);

        // Check if cache is fresh
        {
            let guard = cache.read().await;
            if guard.0 == mtime && !guard.1.is_empty() {
                return guard.1.clone();
            }
        }

        // Re-parse
        let data = match std::fs::read_to_string(&resolved) {
            Ok(d) => d,
            Err(e) => {
                tracing::error!("read {}: {}", path, e);
                return Vec::new();
            }
        };

        let items: Vec<T> = data
            .lines()
            .filter(|l| !l.trim().is_empty())
            .filter_map(parser)
            .collect();

        let mut guard = cache.write().await;
        *guard = (mtime, items.clone());
        items
    }
}

/// Cache management routes
async fn flush_cache(State(state): State<Arc<AppState>>) -> Json<serde_json::Value> {
    cache::cdel(&state.redis, "outlook:*").await;
    cache::cdel(&state.redis, "github:*").await;
    Json(serde_json::json!({"ok": true}))
}

async fn cache_stats(State(state): State<Arc<AppState>>) -> Json<serde_json::Value> {
    let db_size = cache::db_size(&state.redis).await;
    let memory = cache::memory_info(&state.redis).await;
    Json(serde_json::json!({
        "db_size": db_size,
        "memory": memory,
        "outlook_clients": state.outlook_clients.len(),
        "github_sessions": state.github_sessions.len(),
    }))
}

/// GET /api/logs/stream — SSE stream of backend logs
async fn log_stream(
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    let mut rx = state.log_tx.subscribe();
    let stream = async_stream::stream! {
        loop {
            match rx.recv().await {
                Ok(line) => {
                    yield Ok::<_, std::convert::Infallible>(
                        Event::default().data(line)
                    );
                }
                Err(broadcast::error::RecvError::Lagged(n)) => {
                    yield Ok(Event::default().data(format!("... skipped {} log lines", n)));
                }
                Err(_) => break,
            }
        }
    };
    Sse::new(Box::pin(stream)).keep_alive(
        axum::response::sse::KeepAlive::new()
            .interval(std::time::Duration::from_secs(30))
            .text("keep-alive"),
    )
}

fn build_router(state: Arc<AppState>) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Outlook routes
    let outlook_routes = Router::new()
        .route("/accounts", get(outlook::routes::list_accounts))
        .route("/accounts/{email}", delete(outlook::routes::delete_account))
        .route("/accounts/stream", get(outlook::routes::accounts_stream))
        .route("/connect/{email}", post(outlook::routes::connect))
        .route("/messages/{email}", get(outlook::routes::messages))
        .route("/message/{email}/{*msg_id}", get(outlook::routes::message))
        .route("/stream/{email}", get(outlook::routes::stream));

    // GitHub routes
    let github_routes = Router::new()
        .route("/accounts", get(github::routes::list_accounts))
        .route("/accounts/stream", get(github::routes::accounts_stream))
        .route("/login/{username}", post(github::routes::do_login))
        .route("/pat/{username}", post(github::routes::create_pat))
        .route("/orgs/{username}", get(github::routes::get_orgs))
        .route("/orgs/{org_name}/remove/{username}", post(github::routes::remove_member_handler))
        .route("/orgs/{org_name}/cancel/{invitee}", post(github::routes::cancel_pending_handler))
        .route("/invite/{org_name}", post(github::routes::invite))
        .route("/stream", get(github::routes::stream))
        .route("/totp", get(github::routes::totp_codes))
        .route("/check-alive", post(github::routes::check_alive))
        .route("/rate-limit", post(github::routes::rate_limit_handler));

    // Cache routes
    let cache_routes = Router::new()
        .route("/flush", post(flush_cache))
        .route("/stats", get(cache_stats));

    Router::new()
        .nest("/api/outlook", outlook_routes)
        .nest("/api/github", github_routes)
        .nest("/api/cache", cache_routes)
        .route("/api/logs/stream", get(log_stream))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}

#[tokio::main]
async fn main() {
    // Broadcast channel for streaming logs to frontend
    let (log_tx, _) = broadcast::channel::<String>(512);
    let log_tx2 = log_tx.clone();

    // Init logging — write to both stdout and broadcast channel
    use tracing_subscriber::layer::SubscriberExt;
    use tracing_subscriber::util::SubscriberInitExt;

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "gh_check=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .with(BroadcastLayer { tx: log_tx2 })
        .init();

    info!("gh-check v0.2 starting...");

    // Redis pool
    let redis = cache::create_pool(config::REDIS_URL, config::REDIS_POOL_SIZE);

    // Verify Redis connection
    match redis.get().await {
        Ok(_) => info!("Redis connected"),
        Err(e) => {
            tracing::error!("Redis connection failed: {}. Starting without cache.", e);
        }
    }

    let state = Arc::new(AppState::new(redis, log_tx));

    // Pre-warm account caches
    {
        let ol_count = state.load_outlook_accounts().await.len();
        let gh_count = state.load_github_accounts().await.len();
        info!("loaded {} outlook, {} github accounts", ol_count, gh_count);
    }

    let app = build_router(state);

    let listener = tokio::net::TcpListener::bind(config::BIND_ADDR)
        .await
        .expect("bind failed");
    info!("listening on {}", config::BIND_ADDR);
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("server error");
    info!("server stopped");
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("failed to listen for ctrl+c");
    tracing::info!("received Ctrl+C, shutting down...");
    // Force exit after 2s if graceful shutdown hangs (SSE streams)
    tokio::spawn(async {
        tokio::time::sleep(std::time::Duration::from_secs(2)).await;
        std::process::exit(0);
    });
}

/// Tracing layer that broadcasts log lines to SSE subscribers.
struct BroadcastLayer {
    tx: broadcast::Sender<String>,
}

impl<S: tracing::Subscriber> tracing_subscriber::Layer<S> for BroadcastLayer {
    fn on_event(
        &self,
        event: &tracing::Event<'_>,
        _ctx: tracing_subscriber::layer::Context<'_, S>,
    ) {
        let meta = event.metadata();
        let level = meta.level();
        let target = meta.target();

        // Skip noisy tower_http request/response logs for the log stream itself
        if target.contains("tower_http") && !target.contains("trace") {
            return;
        }

        let mut visitor = LogVisitor(String::new());
        event.record(&mut visitor);
        let msg = visitor.0;

        let line = format!(
            "{}|{}|{}|{}",
            chrono::Utc::now().format("%H:%M:%S"),
            level,
            target.rsplit("::").next().unwrap_or(target),
            msg,
        );
        let _ = self.tx.send(line);
    }
}

struct LogVisitor(String);

impl tracing::field::Visit for LogVisitor {
    fn record_debug(&mut self, field: &tracing::field::Field, value: &dyn std::fmt::Debug) {
        if field.name() == "message" {
            self.0 = format!("{:?}", value);
        } else if !self.0.is_empty() {
            self.0.push_str(&format!(" {}={:?}", field.name(), value));
        }
    }

    fn record_str(&mut self, field: &tracing::field::Field, value: &str) {
        if field.name() == "message" {
            self.0 = value.to_string();
        } else if !self.0.is_empty() {
            self.0.push_str(&format!(" {}={}", field.name(), value));
        }
    }
}
