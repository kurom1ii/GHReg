use std::path::Path;

// ── Redis TTLs (seconds) ──
pub const TTL_MESSAGES: u64 = 600;
pub const TTL_MESSAGE: u64 = 3600;
pub const TTL_GH_STATUS: u64 = 300;
pub const TTL_ORGS: u64 = 600;
pub const TTL_RATE_LIMIT: u64 = 30;
pub const TTL_ALIVE: u64 = 600;
pub const TTL_PROFILE: u64 = 3600;

// ── Data files ──
pub const OUTLOOK_FILE: &str = "data/outlook.txt";
pub const GITHUB_FILE: &str = "data/accounts.txt";
pub const TOKEN_FILE: &str = "data/github_tokens.json";

// ── GraphQL ──
pub const GRAPHQL_BATCH: usize = 100;
pub const GRAPHQL_WORKERS: usize = 200;
pub const GITHUB_GRAPHQL_URL: &str = "https://api.github.com/graphql";
pub const DEFAULT_PAT: &str = "";

// ── Server ──
pub const BIND_ADDR: &str = "127.0.0.1:8000";
pub const REDIS_URL: &str = "redis://127.0.0.1:6379";
pub const REDIS_POOL_SIZE: usize = 20;

// ── Microsoft OAuth2 ──
pub const MS_TOKEN_URL: &str =
    "https://login.microsoftonline.com/common/oauth2/v2.0/token";
pub const MS_GRAPH: &str = "https://graph.microsoft.com/v1.0";
pub const MS_SCOPES: &str =
    "https://graph.microsoft.com/.default offline_access";

// ── GitHub URLs ──

/// Resolve a relative data file path against the binary's working dir.
pub fn data_path(rel: &str) -> std::path::PathBuf {
    Path::new(rel).to_path_buf()
}
