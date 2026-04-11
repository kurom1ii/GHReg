use anyhow::{Context, Result};
use rquest::Client;
use serde_json::json;
use std::collections::HashMap;
use tokio::sync::Semaphore;
use std::sync::Arc;
use crate::config;

/// Batch check GitHub usernames via GraphQL.
/// Returns map of username → alive (true) or dead (false).
pub async fn batch_check(
    usernames: &[String],
    token: &str,
) -> Result<HashMap<String, bool>> {
    let client = Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()?;

    let sem = Arc::new(Semaphore::new(config::GRAPHQL_WORKERS));
    let mut handles = Vec::new();
    let results: Arc<dashmap::DashMap<String, bool>> = Arc::new(dashmap::DashMap::new());

    for chunk in usernames.chunks(config::GRAPHQL_BATCH) {
        let sem = sem.clone();
        let client = client.clone();
        let token = token.to_string();
        let results = results.clone();
        let batch: Vec<String> = chunk.to_vec();

        handles.push(tokio::spawn(async move {
            let _permit = sem.acquire().await.unwrap();
            match check_batch(&client, &batch, &token).await {
                Ok(map) => {
                    for (k, v) in map {
                        results.insert(k, v);
                    }
                }
                Err(e) => {
                    tracing::error!("batch check error: {}", e);
                }
            }
        }));
    }

    for h in handles {
        let _ = h.await;
    }

    let mut out = HashMap::new();
    for entry in results.iter() {
        out.insert(entry.key().clone(), *entry.value());
    }
    Ok(out)
}

/// Check a single batch of usernames via one GraphQL query.
async fn check_batch(
    client: &Client,
    usernames: &[String],
    token: &str,
) -> Result<HashMap<String, bool>> {
    // Build aliased query: u0: user(login: "x") { __typename }
    let mut query_parts = Vec::with_capacity(usernames.len());
    for (i, name) in usernames.iter().enumerate() {
        let safe = name.replace('"', "\\\"");
        query_parts.push(format!("u{}: user(login: \"{}\") {{ __typename }}", i, safe));
    }
    let query = format!("{{ {} }}", query_parts.join(" "));

    let resp = client
        .post(config::GITHUB_GRAPHQL_URL)
        .bearer_auth(token)
        .header("user-agent", "gh-check/0.2")
        .json(&json!({"query": query}))
        .send()
        .await
        .context("graphql request")?;

    let body: serde_json::Value = resp.json().await?;
    let data = &body["data"];

    let mut results = HashMap::new();
    for (i, name) in usernames.iter().enumerate() {
        let key = format!("u{}", i);
        let alive = !data[&key].is_null();
        results.insert(name.clone(), alive);
    }
    Ok(results)
}

/// Query GraphQL rate limit.
pub async fn rate_limit(token: &str) -> Result<serde_json::Value> {
    let client = Client::new();
    let resp = client
        .post(config::GITHUB_GRAPHQL_URL)
        .bearer_auth(token)
        .header("user-agent", "gh-check/0.2")
        .json(&json!({"query": "{ rateLimit { limit remaining resetAt used } }"}))
        .send()
        .await?;
    let body: serde_json::Value = resp.json().await?;
    Ok(body["data"]["rateLimit"].clone())
}
