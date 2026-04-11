use anyhow::{bail, Context, Result};
use rquest::Client;
use std::collections::HashMap;
use tracing::info;

use super::models::{PatPreset, TokenEntry};
use crate::headers;
use crate::parsers;

/// All fine-grained PAT permission keys.
const ALL_PERMISSIONS: &[&str] = &[
    "actions", "actions_variables", "administration", "blocking",
    "checks", "codespaces", "codespaces_lifecycle_admin",
    "codespaces_metadata", "codespaces_secrets", "contents",
    "custom_properties", "dependabot_secrets", "deployments",
    "email_addresses", "environments", "followers", "git_signing_ssh_public_keys",
    "gpg_keys", "interaction_limits", "issues", "merge_queues",
    "metadata", "members", "organization_actions_variables",
    "organization_administration", "organization_announcement_banners",
    "organization_codespaces", "organization_codespaces_secrets",
    "organization_codespaces_settings", "organization_copilot_seat_management",
    "organization_custom_org_roles", "organization_custom_properties",
    "organization_custom_roles", "organization_dependabot_secrets",
    "organization_events", "organization_hooks",
    "organization_personal_access_token_requests",
    "organization_personal_access_tokens", "organization_plan",
    "organization_projects", "organization_secrets",
    "organization_self_hosted_runners", "organization_user_blocking",
    "packages", "pages", "profile", "pull_requests", "repo_security",
    "repository_hooks", "repository_projects",
    "secret_scanning_alerts", "secrets", "security_events",
    "single_file_paths", "ssh_signing_keys", "starring",
    "status", "team_discussions", "vulnerability_alerts",
    "watching", "workflows",
    // copilot-specific
    "copilot_messages", "copilot_editor_context", "user_copilot_requests",
];

fn preset_permissions(preset: PatPreset) -> HashMap<&'static str, &'static str> {
    match preset {
        PatPreset::Minimal => HashMap::new(),
        PatPreset::Readonly => {
            let mut m = HashMap::new();
            m.insert("contents", "read");
            m.insert("metadata", "read");
            m
        }
        PatPreset::Copilot => {
            let mut m = HashMap::new();
            m.insert("copilot_messages", "read");
            m.insert("copilot_editor_context", "read");
            m.insert("user_copilot_requests", "read");
            m
        }
        PatPreset::FullRepo => {
            let mut m = HashMap::new();
            for &k in &[
                "actions",
                "administration",
                "contents",
                "issues",
                "metadata",
                "pull_requests",
                "workflows",
                "secrets",
                "actions_variables",
            ] {
                m.insert(k, "write");
            }
            m
        }
    }
}

fn build_pat_form(preset: PatPreset) -> Vec<(String, String)> {
    let active = preset_permissions(preset);
    let mut fields = Vec::new();
    for &perm in ALL_PERMISSIONS {
        let val = active.get(perm).copied().unwrap_or("none");
        fields.push((
            format!("integration[default_permissions][{}]", perm),
            val.to_string(),
        ));
    }
    fields
}

/// Confirm sudo mode by submitting password.
pub async fn github_sudo(client: &Client, password: &str) -> Result<bool> {
    // Try the modal endpoint first
    let html = client
        .get("https://github.com/sessions/sudo_modal")
        .headers(headers::xhr_headers())
        .send()
        .await?
        .text()
        .await?;

    let token = match parsers::parse_auth_token(&html) {
        Some(t) => t,
        None => {
            // fallback to /settings/sudo
            let html2 = client
                .get("https://github.com/settings/sudo")
                .headers(headers::nav_headers())
                .send()
                .await?
                .text()
                .await?;
            parsers::parse_auth_token(&html2)
                .context("no auth token on sudo page")?
        }
    };

    let resp = client
        .post("https://github.com/settings/sudo")
        .headers(headers::post_headers())
        .form(&[
            ("authenticity_token", token.as_str()),
            ("sudo_password", password),
        ])
        .send()
        .await?;

    let status = resp.status();
    Ok(status.is_success() || status.is_redirection())
}

/// Create a fine-grained PAT via form scraping.
/// Returns the token string on success.
pub async fn create_pat(
    client: &Client,
    token_name: &str,
    password: &str,
    expires_days: u32,
    preset: PatPreset,
) -> Result<String> {
    // Step 1: GET the new PAT form
    let html = client
        .get("https://github.com/settings/personal-access-tokens/new")
        .headers(headers::nav_headers())
        .send()
        .await?
        .text()
        .await?;

    // Find the PAT creation form
    let forms = parsers::parse_all_forms(&html);
    let pat_form = forms
        .iter()
        .find(|f| f.action.contains("personal-access-tokens"))
        .context("PAT form not found")?;

    let auth_token = pat_form
        .fields
        .get("authenticity_token")
        .context("no authenticity_token in PAT form")?
        .clone();

    // Build form data
    let expire_date = (chrono::Utc::now()
        + chrono::Duration::days(expires_days as i64))
    .format("%Y-%m-%d")
    .to_string();

    let mut form_data: Vec<(String, String)> = vec![
        ("authenticity_token".into(), auth_token),
        (
            "user_programmatic_access[name]".into(),
            token_name.to_string(),
        ),
        (
            "user_programmatic_access[description]".into(),
            "Auto-created".to_string(),
        ),
        (
            "user_programmatic_access[default_expires_at]".into(),
            expire_date,
        ),
        ("install_target".into(), "all".to_string()),
    ];

    // Add permission fields
    form_data.extend(build_pat_form(preset));

    // Step 2: POST
    let resp = client
        .post(&format!(
            "https://github.com{}",
            pat_form.action
        ))
        .headers(headers::post_headers())
        .form(&form_data)
        .send()
        .await?;

    let resp_html = resp.text().await?;

    // Check if confirm step needed
    if resp_html.contains("confirm=1") || resp_html.contains("Confirm creation") {
        // Re-submit with confirm
        let confirm_token = parsers::parse_auth_token(&resp_html)
            .unwrap_or_default();
        form_data.retain(|&(ref k, _)| k != "authenticity_token");
        form_data.push(("authenticity_token".into(), confirm_token));
        form_data.push(("confirm".into(), "1".into()));

        let resp2 = client
            .post(&format!(
                "https://github.com{}",
                pat_form.action
            ))
            .headers(headers::post_headers())
            .form(&form_data)
            .send()
            .await?;
        let html2 = resp2.text().await?;
        return extract_token(&html2);
    }

    // Check if sudo needed
    if resp_html.contains("sudo_password") || resp_html.contains("Confirm access") {
        info!("PAT creation requires sudo, confirming...");
        github_sudo(client, password).await?;
        // Retry PAT creation
        let resp3 = client
            .post(&format!(
                "https://github.com{}",
                pat_form.action
            ))
            .headers(headers::post_headers())
            .form(&form_data)
            .send()
            .await?;
        let html3 = resp3.text().await?;
        return extract_token(&html3);
    }

    extract_token(&resp_html)
}

fn extract_token(html: &str) -> Result<String> {
    // Pattern 1: id="new-access-token" value="github_pat_..."
    let re1 = regex::Regex::new(r#"id="new-access-token"[^>]*value="(github_pat_[A-Za-z0-9_]+)""#)?;
    if let Some(cap) = re1.captures(html) {
        return Ok(cap[1].to_string());
    }

    // Pattern 2: value="github_pat_..."
    let re2 = regex::Regex::new(r#"value="(github_pat_[A-Za-z0-9_]{20,})""#)?;
    if let Some(cap) = re2.captures(html) {
        return Ok(cap[1].to_string());
    }

    // Pattern 3: bare token in text
    let re3 = regex::Regex::new(r"(github_pat_[A-Za-z0-9_]{20,})")?;
    if let Some(cap) = re3.captures(html) {
        return Ok(cap[1].to_string());
    }

    bail!("could not extract PAT from response")
}

/// Save a token entry to the JSON token file.
pub fn save_token(
    token: &str,
    name: &str,
    username: Option<&str>,
    output_file: &str,
) -> Result<()> {
    let entry = TokenEntry {
        name: name.to_string(),
        token: token.to_string(),
        username: username.map(|s| s.to_string()),
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    let mut entries: Vec<TokenEntry> = if std::path::Path::new(output_file).exists() {
        let data = std::fs::read_to_string(output_file)?;
        serde_json::from_str(&data).unwrap_or_default()
    } else {
        Vec::new()
    };

    entries.push(entry);
    std::fs::write(output_file, serde_json::to_string_pretty(&entries)?)?;
    Ok(())
}
