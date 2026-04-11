use anyhow::{bail, Context, Result};
use rquest::Client;
use rquest_util::Emulation;
use totp_rs::{Algorithm, Secret, TOTP};
use tracing::{debug, error, info, warn};

use crate::headers;
use crate::parsers;

/// Build an rquest Client with Chrome136 TLS fingerprint + cookie store.
pub fn new_github_client() -> Result<Client> {
    Ok(Client::builder()
        .emulation(Emulation::Chrome136)
        .cookie_store(true)
        .default_headers(headers::nav_headers())
        .redirect(rquest::redirect::Policy::none())
        .timeout(std::time::Duration::from_secs(30))
        .build()?)
}

/// Login to GitHub via web form scraping.
/// Returns true on success.
pub async fn github_login(
    client: &Client,
    username: &str,
    password: &str,
    totp_secret: &str,
) -> Result<bool> {
    // Step 1: GET /login — extract CSRF
    info!("{}: → GET https://github.com/login", username);
    let resp = client
        .get("https://github.com/login")
        .headers(headers::nav_headers())
        .send()
        .await
        .context("GET /login")?;
    let login_status = resp.status();
    info!("{}: ← {} (GET /login)", username, login_status);
    let login_html = resp.text().await?;

    let hidden = parsers::parse_form_hidden_fields(&login_html, "/session");
    let token = hidden
        .get("authenticity_token")
        .context("no authenticity_token on /login")?;
    debug!("{}: found authenticity_token={}...", username, &token[..20.min(token.len())]);

    // Step 2: POST /session
    info!("{}: → POST https://github.com/session (login={})", username, username);
    let ts = chrono::Utc::now().timestamp().to_string();
    let mut form = vec![
        ("authenticity_token", token.as_str()),
        ("login", username),
        ("password", password),
        ("webauthn-conditional", "undefined"),
        ("javascript-support", "true"),
        ("webauthn-support", "supported"),
        ("webauthn-iuvpaa-support", "unsupported"),
        ("return_to", "https://github.com/"),
        ("timestamp", ts.as_str()),
        ("timestamp_secret", ""),
    ];
    // honeypot required_field_* = ""
    for (k, _v) in &hidden {
        if k.starts_with("required_field") {
            form.push((k.as_str(), ""));
        }
    }

    let resp = client
        .post("https://github.com/session")
        .headers(headers::post_headers())
        .form(&form)
        .send()
        .await
        .context("POST /session")?;

    let status = resp.status();
    let location = resp
        .headers()
        .get("location")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_string();
    info!("{}: ← {} Location: \"{}\"", username, status, location);

    // Check cookies for logged_in=yes
    // If redirect to 2FA page, handle it
    if location.contains("/sessions/two-factor") {
        if totp_secret.is_empty() {
            error!("{}: 2FA required but no TOTP secret provided", username);
            bail!("2FA required but no TOTP secret provided");
        }
        info!("{}: 2FA required, submitting TOTP...", username);
        return submit_2fa(client, username, &location, totp_secret).await;
    }

    // Check if login succeeded
    if status.is_redirection() {
        info!("{}: → GET {} (following redirect)", username, location);
        // Follow the redirect manually to set cookies
        let redir_resp = client
            .get(&location)
            .headers(headers::nav_headers())
            .send()
            .await;
        if let Ok(r) = &redir_resp {
            debug!("{}: ← {} (redirect follow)", username, r.status());
        }
    }

    // Verify by checking if we can access the dashboard
    info!("{}: → GET https://github.com/ (verify login)", username);
    let check = client
        .get("https://github.com/")
        .headers(headers::nav_headers())
        .send()
        .await?;
    let check_status = check.status();
    let check_html = check.text().await?;
    let logged_in = check_html.contains("dashboard")
        || check_html.contains("octolytics-actor-login")
        || check_html.contains("user-profile-mini-avatar");

    if logged_in {
        info!("{}: ← {} — login VERIFIED OK", username, check_status);
    } else {
        let preview = &check_html[..500.min(check_html.len())];
        warn!("{}: ← {} — login FAILED (body preview: {})", username, check_status, preview);
    }
    Ok(logged_in)
}

/// Submit TOTP 2FA code.
async fn submit_2fa(client: &Client, username: &str, location: &str, totp_secret: &str) -> Result<bool> {
    let url = if location.starts_with("http") {
        location.to_string()
    } else {
        format!("https://github.com{}", location)
    };

    // GET the 2FA page
    info!("{}: → GET {} (2FA page)", username, url);
    let page_resp = client
        .get(&url)
        .headers(headers::nav_headers())
        .send()
        .await?;
    info!("{}: ← {} (2FA page)", username, page_resp.status());
    let page_html = page_resp.text().await?;

    let token = parsers::parse_auth_token(&page_html)
        .context("no authenticity_token on 2FA page")?;

    // Generate TOTP code
    let secret = Secret::Encoded(totp_secret.to_string())
        .to_bytes()
        .context("invalid TOTP secret")?;
    let totp = TOTP::new_unchecked(Algorithm::SHA1, 6, 1, 30, secret);
    let code = totp.generate_current()
        .map_err(|e| anyhow::anyhow!("TOTP generate: {}", e))?;

    // POST the 2FA code
    info!("{}: → POST https://github.com/sessions/two-factor (otp={})", username, code);
    let resp = client
        .post("https://github.com/sessions/two-factor")
        .headers(headers::post_headers())
        .form(&[
            ("authenticity_token", token.as_str()),
            ("app_otp", &code),
        ])
        .send()
        .await?;

    let resp_status = resp.status();
    let redir = resp
        .headers()
        .get("location")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_string();
    info!("{}: ← {} Location: \"{}\" (2FA submit)", username, resp_status, redir);

    // Follow redirect
    if !redir.is_empty() {
        let redir_url = if redir.starts_with("http") {
            redir
        } else {
            format!("https://github.com{}", redir)
        };
        info!("{}: → GET {} (post-2FA redirect)", username, redir_url);
        let r = client
            .get(&redir_url)
            .headers(headers::nav_headers())
            .send()
            .await;
        if let Ok(r) = &r {
            debug!("{}: ← {} (post-2FA redirect)", username, r.status());
        }
    }

    // Verify login
    info!("{}: → GET https://github.com/ (verify after 2FA)", username);
    let check = client
        .get("https://github.com/")
        .headers(headers::nav_headers())
        .send()
        .await?;
    let check_status = check.status();
    let html = check.text().await?;
    let logged_in = html.contains("dashboard")
        || html.contains("octolytics-actor-login")
        || html.contains("user-profile-mini-avatar");

    if logged_in {
        info!("{}: ← {} — 2FA login VERIFIED OK", username, check_status);
    } else {
        let preview = &html[..500.min(html.len())];
        warn!("{}: ← {} — 2FA login FAILED (body preview: {})", username, check_status, preview);
    }
    Ok(logged_in)
}
