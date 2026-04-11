use anyhow::{Context, Result};
use rquest::Client;
use regex::Regex;
use scraper::{Html, Selector};
use tracing::{debug, info, warn};

use super::models::{OrgInfo, OrgMember};
use crate::headers;
use crate::parsers;

/// Same-origin nav headers for GitHub internal navigation.
fn same_origin_nav() -> rquest::header::HeaderMap {
    let mut h = headers::nav_headers();
    h.insert("sec-fetch-site", rquest::header::HeaderValue::from_static("same-origin"));
    h
}

/// GET with manual redirect following (client uses Policy::none for login flow).
async fn get_follow(client: &Client, url: &str) -> Result<rquest::Response> {
    let mut current_url = url.to_string();
    for _ in 0..5 {
        let resp = client
            .get(&current_url)
            .headers(same_origin_nav())
            .send()
            .await?;
        if resp.status().is_redirection() {
            if let Some(loc) = resp.headers().get("location").and_then(|v| v.to_str().ok()) {
                current_url = if loc.starts_with("http") {
                    loc.to_string()
                } else {
                    format!("https://github.com{}", loc)
                };
                debug!("org: following redirect → {}", current_url);
                continue;
            }
        }
        return Ok(resp);
    }
    anyhow::bail!("too many redirects for {}", url)
}

/// List organizations the logged-in user belongs to.
pub async fn list_orgs(client: &Client) -> Result<Vec<String>> {
    info!("org: → GET https://github.com/settings/organizations");
    let resp = get_follow(client, "https://github.com/settings/organizations").await?;
    let status = resp.status();
    if !status.is_success() {
        warn!("org: list_orgs failed: {}", status);
        return Ok(vec![]);
    }
    let html = resp.text().await?;
    debug!("org: got settings/organizations page ({}B)", html.len());

    // Primary: avatar alt + link pattern (matches Python's pattern)
    // NOTE: Rust regex crate does NOT support backreferences (\1).
    // Use two capture groups and compare programmatically.
    let re = Regex::new(
        r#"<img[^>]*alt="([\w-]+)"[^>]*class="[^"]*avatar[^"]*"[^>]*/>\s*(?:<[^>]*>)*\s*<a\s+href="/([\w-]+)">([\w-]+)</a>"#
    )?;
    let mut orgs: Vec<String> = re
        .captures_iter(&html)
        .filter_map(|c| {
            let alt = &c[1];
            let href = &c[2];
            let text = &c[3];
            if alt == href && href == text {
                Some(alt.to_string())
            } else {
                None
            }
        })
        .collect();

    // Fallback: self-referencing links (href name == inner text)
    if orgs.is_empty() {
        let re2 = Regex::new(r#"<a[^>]*href="/([\w][\w-]*)"[^>]*>\s*([\w][\w-]*)\s*</a>"#)?;
        orgs = re2
            .captures_iter(&html)
            .filter_map(|c| {
                if &c[1] == &c[2] {
                    Some(c[1].to_string())
                } else {
                    None
                }
            })
            .collect();
    }

    // Deduplicate, preserve order
    let mut seen = std::collections::HashSet::new();
    orgs.retain(|o| seen.insert(o.clone()));

    info!("org: found {} orgs: {:?}", orgs.len(), orgs);
    Ok(orgs)
}

/// List members of an organization (returns usernames + display names).
pub async fn list_members(client: &Client, org: &str) -> Result<Vec<OrgMember>> {
    let url = format!("https://github.com/orgs/{}/people", org);
    info!("org: → GET {}", url);
    let resp = get_follow(client, &url).await?;
    let status = resp.status();
    if !status.is_success() {
        warn!("org: list_members for {} failed: {}", org, status);
        return Ok(vec![]);
    }
    let html = resp.text().await?;
    let doc = Html::parse_document(&html);

    let li_sel = Selector::parse("li[data-bulk-actions-id]").unwrap();
    let input_sel = Selector::parse(r#"input[name="members[]"]"#).unwrap();
    let link_sel = Selector::parse("a[href]").unwrap();

    let mut members: Vec<OrgMember> = Vec::new();
    let mut seen = std::collections::HashSet::new();

    for li in doc.select(&li_sel) {
        // Get username from hidden input
        let username = match li.select(&input_sel).next() {
            Some(input) => match input.value().attr("value") {
                Some(v) => v.to_string(),
                None => continue,
            },
            None => continue,
        };

        if !seen.insert(username.clone()) {
            continue;
        }

        // Try to find display name from a link to /{username}
        let expected_href = format!("/{}", username);
        let mut display_name = username.clone();

        for link in li.select(&link_sel) {
            if let Some(href) = link.value().attr("href") {
                if href == expected_href {
                    let text: String = link.text().collect::<String>().trim().to_string();
                    if !text.is_empty() && text != username {
                        display_name = text;
                        break;
                    }
                }
            }
        }

        members.push(OrgMember { username, display_name });
    }

    // Fallback: if scraper found nothing, try regex (page structure may differ)
    if members.is_empty() {
        let re = Regex::new(
            r#"(?s)data-bulk-actions-id="\d+"[\s\S]*?name="members\[\]"\s+value="([\w-]+)""#
        )?;
        for cap in re.captures_iter(&html) {
            let username = cap[1].to_string();
            if seen.insert(username.clone()) {
                members.push(OrgMember {
                    display_name: username.clone(),
                    username,
                });
            }
        }
    }

    info!("org: {} has {} members", org, members.len());
    Ok(members)
}

/// List pending invitations for an organization.
pub async fn list_pending(client: &Client, org: &str) -> Result<Vec<String>> {
    let url = format!("https://github.com/orgs/{}/people/pending_invitations", org);
    let resp = get_follow(client, &url).await?;
    if !resp.status().is_success() {
        return Ok(vec![]);
    }
    let html = resp.text().await?;

    // Self-referencing link pattern — two capture groups, compare programmatically
    // (Rust regex crate does NOT support backreferences)
    let re = Regex::new(r#"<a[^>]*href="/([\w-]+)"[^>]*>\s*([\w-]+)\s*</a>"#)?;
    let mut pending: Vec<String> = re
        .captures_iter(&html)
        .filter_map(|c| {
            if &c[1] == &c[2] {
                Some(c[1].to_string())
            } else {
                None
            }
        })
        .collect();

    // Deduplicate
    let mut seen = std::collections::HashSet::new();
    pending.retain(|p| seen.insert(p.clone()));

    if !pending.is_empty() {
        info!("org: {} has {} pending invitations", org, pending.len());
    }
    Ok(pending)
}

/// Invite a user to an organization (scraping flow matching Python).
pub async fn invite_user(
    client: &Client,
    org: &str,
    username: &str,
    role: &str,
) -> Result<bool> {
    // Step 1: GET /orgs/{org}/people → extract CSRF from member_adder_add form
    let people_url = format!("https://github.com/orgs/{}/people", org);
    info!("invite: [1/3] GET {}", people_url);
    let people_html = get_follow(client, &people_url).await?.text().await?;

    let fields = parsers::parse_form_hidden_fields(&people_html, "member_adder_add");
    let token = fields
        .get("authenticity_token")
        .context("no CSRF for member_adder_add")?;

    // Step 2: POST member_adder_add
    info!("invite: [2/3] POST member_adder_add ({})", username);
    let resp = client
        .post(&format!(
            "https://github.com/orgs/{}/invitations/member_adder_add",
            org
        ))
        .headers(headers::post_headers())
        .header("referer", format!("https://github.com/orgs/{}/people", org))
        .form(&[
            ("authenticity_token", token.as_str()),
            ("enable_tip", ""),
            ("identifier", username),
        ])
        .send()
        .await?;

    let location = resp
        .headers()
        .get("location")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_string();

    if resp.status().as_u16() != 302 || location.is_empty() {
        warn!("invite: step 2 failed: {}", resp.status());
        return Ok(false);
    }

    // Step 3: GET the edit URL
    let edit_url = if location.starts_with("http") {
        location.clone()
    } else {
        format!("https://github.com{}", location)
    };

    info!("invite: [3/3] GET {}", edit_url);
    let edit_html = get_follow(client, &edit_url).await?.text().await?;

    // Parse confirm form
    let forms = parsers::parse_all_forms(&edit_html);
    // Debug: log all forms on the edit page
    for f in &forms {
        if !f.action.is_empty() {
            info!("invite: edit page form: action={} fields={:?}", f.action, f.fields.keys().collect::<Vec<_>>());
        }
    }
    let confirm_form = forms
        .iter()
        .find(|f| {
            f.action.contains("invitation")
                && f.fields.contains_key("invitee_id")
        })
        .or_else(|| {
            // Fallback: any form with invitation in action + authenticity_token
            forms.iter().find(|f| {
                f.action.contains("invitation")
                    && f.fields.contains_key("authenticity_token")
            })
        })
        .context("confirm form not found")?;

    let _confirm_token = confirm_form
        .fields
        .get("authenticity_token")
        .context("no CSRF in confirm form")?
        .clone();

    // Step 4: POST confirm — send ALL form fields
    let confirm_url = if confirm_form.action.starts_with("/") {
        format!("https://github.com{}", confirm_form.action)
    } else {
        confirm_form.action.clone()
    };

    // Build form data from all fields, override role
    let mut form_fields = confirm_form.fields.clone();
    form_fields.insert("role".to_string(), role.to_string());

    let form_data: Vec<(&str, &str)> = form_fields.iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    info!("invite: POST {} (role={}, fields={:?})", confirm_url, role, form_fields.keys().collect::<Vec<_>>());

    let resp4 = client
        .post(&confirm_url)
        .headers(headers::post_headers())
        .header("referer", &edit_url)
        .form(&form_data)
        .send()
        .await?;

    let final_loc = resp4
        .headers()
        .get("location")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let ok = resp4.status().as_u16() == 302
        && (final_loc.contains("pending") || final_loc.contains("people"));
    if ok {
        info!("invite: ✓ invited {} to {} as {}", username, org, role);
    } else {
        warn!("invite: failed for {} (status={}, loc={})", username, resp4.status(), final_loc);
    }
    Ok(ok)
}

/// Remove a member from an organization.
/// Flow: find numeric user ID from people page → GET destroy_members_dialog → POST destroy_members.
pub async fn remove_member(client: &Client, org: &str, username: &str) -> Result<bool> {
    let people_url = format!("https://github.com/orgs/{}/people", org);

    // Step 1: GET the people page to find the numeric user ID
    info!("org: remove {} — [1/3] GET {} (find user ID)", username, people_url);
    let resp = get_follow(client, &people_url).await?;
    if !resp.status().is_success() {
        warn!("org: remove_member — people page failed: {}", resp.status());
        return Ok(false);
    }
    let html = resp.text().await?;

    // Use scraper to find the correct user ID within the same <li> element
    let user_id = {
        let doc = Html::parse_document(&html);
        let li_sel = Selector::parse("li[data-bulk-actions-id]").unwrap();
        let input_sel = Selector::parse(r#"input[name="members[]"]"#).unwrap();

        let mut found_id: Option<String> = None;
        for li in doc.select(&li_sel) {
            // Check if this <li> contains the target username
            if let Some(input) = li.select(&input_sel).next() {
                if input.value().attr("value") == Some(username) {
                    // Found it — get the data-bulk-actions-id from this same <li>
                    if let Some(id) = li.value().attr("data-bulk-actions-id") {
                        found_id = Some(id.to_string());
                        break;
                    }
                }
            }
        }
        found_id
    }; // doc dropped here

    let user_id = match user_id {
        Some(id) => id,
        None => {
            warn!("org: remove_member — user ID not found for {}", username);
            return Ok(false);
        }
    };
    info!("org: remove {} — user_id={}", username, user_id);

    // Step 2: GET destroy_members_dialog to get the CSRF form
    let dialog_url = format!(
        "https://github.com/orgs/{}/people/destroy_members_dialog?member_ids%5B%5D={}&redirect_to_path=%2Forgs%2F{}%2Fpeople",
        org, user_id, org
    );
    info!("org: remove {} — [2/3] GET destroy_members_dialog", username);
    let dialog_resp = client
        .get(&dialog_url)
        .headers(headers::xhr_headers())
        .header("referer", &people_url)
        .send()
        .await?;
    if !dialog_resp.status().is_success() {
        warn!("org: remove_member — dialog failed: {}", dialog_resp.status());
        return Ok(false);
    }
    let dialog_html = dialog_resp.text().await?;

    // Step 3: Parse the form and POST destroy_members
    let forms = parsers::parse_all_forms(&dialog_html);
    let destroy_form = forms.iter().find(|f| f.action.contains("destroy_members"));

    let form = match destroy_form {
        Some(f) => f,
        None => {
            warn!("org: remove_member — destroy_members form not found in dialog");
            return Ok(false);
        }
    };

    let action_url = if form.action.starts_with("/") {
        format!("https://github.com{}", form.action)
    } else {
        form.action.clone()
    };

    // Build form data — ensure member_ids has the correct value
    let token = form.fields.get("authenticity_token")
        .context("no CSRF in destroy form")?;

    info!("org: remove {} — [3/3] POST {}", username, action_url);
    let resp = client
        .post(&action_url)
        .headers(headers::post_headers())
        .header("referer", &people_url)
        .form(&[
            ("authenticity_token", token.as_str()),
            ("_method", "delete"),
            ("member_ids", user_id.as_str()),
            ("redirect_to_path", &format!("/orgs/{}/people", org)),
        ])
        .send()
        .await?;

    let status = resp.status();
    let loc = resp.headers().get("location")
        .and_then(|v| v.to_str().ok()).unwrap_or("").to_string();
    let ok = status.as_u16() == 302 || status.is_success();
    if ok {
        info!("org: ✓ removed {} (id={}) from {} (status={}, loc={})", username, user_id, org, status, loc);
    } else {
        warn!("org: ✗ remove {} from {} failed (status={}, loc={})", username, org, status, loc);
    }
    Ok(ok)
}

/// Cancel a pending invitation for a user.
pub async fn cancel_pending(client: &Client, org: &str, invitee: &str) -> Result<bool> {
    let pending_url = format!("https://github.com/orgs/{}/people/pending_invitations", org);
    info!("org: cancel invite for {} in {} — GET pending page", invitee, org);
    let resp = get_follow(client, &pending_url).await?;
    if !resp.status().is_success() {
        warn!("org: cancel_pending — failed to load pending page: {}", resp.status());
        return Ok(false);
    }
    let html = resp.text().await?;

    // Extract invitation ID and CSRF token synchronously (scraper::Html is !Send)
    let (invitation_id, token) = {
        let inv_re = Regex::new(&format!(
            r#"/orgs/{}/invitations/(\d+)"#,
            regex::escape(org)
        ))?;

        let doc = Html::parse_document(&html);
        let li_sel = Selector::parse("li").unwrap();
        let link_sel = Selector::parse("a[href]").unwrap();

        let mut inv_id: Option<String> = None;
        let invitee_href = format!("/{}", invitee);

        for li in doc.select(&li_sel) {
            let has_invitee = li.select(&link_sel).any(|a| {
                a.value().attr("href").map_or(false, |h| h == invitee_href)
            });
            if has_invitee {
                let row_html = li.html();
                if let Some(cap) = inv_re.captures(&row_html) {
                    inv_id = Some(cap[1].to_string());
                    break;
                }
            }
        }

        // Fallback: regex on full HTML
        if inv_id.is_none() {
            let invitee_pattern = Regex::new(&format!(
                r#"href="/{}"[\s\S]{{0,500}}/orgs/{}/invitations/(\d+)"#,
                regex::escape(invitee), regex::escape(org)
            ))?;
            if let Some(cap) = invitee_pattern.captures(&html) {
                inv_id = Some(cap[1].to_string());
            }
        }

        let csrf = parsers::parse_auth_token(&html);
        (inv_id, csrf)
    }; // doc is dropped here before any .await

    let inv_id = match invitation_id {
        Some(id) => id,
        None => {
            warn!("org: cancel_pending — could not find invitation ID for {}", invitee);
            return Ok(false);
        }
    };

    let token = match token {
        Some(t) => t,
        None => {
            warn!("org: cancel_pending — no CSRF token found");
            return Ok(false);
        }
    };

    let cancel_url = format!("https://github.com/orgs/{}/invitations/{}", org, inv_id);
    info!("org: → POST {} (_method=delete)", cancel_url);
    let resp = client
        .post(&cancel_url)
        .headers(headers::post_headers())
        .header("referer", &pending_url)
        .form(&[
            ("authenticity_token", token.as_str()),
            ("_method", "delete"),
        ])
        .send()
        .await?;

    let status = resp.status();
    let ok = status.as_u16() == 302 || status.is_success();
    if ok {
        info!("org: ✓ cancelled invite for {} in {} (inv_id={})", invitee, org, inv_id);
    } else {
        warn!("org: ✗ cancel invite for {} failed (status={})", invitee, status);
    }
    Ok(ok)
}

/// Get full org info: name, members, pending invitations.
pub async fn get_org_info(client: &Client, org: &str) -> Result<OrgInfo> {
    let (members, pending) =
        tokio::try_join!(list_members(client, org), list_pending(client, org))?;
    Ok(OrgInfo {
        name: org.to_string(),
        members,
        pending,
    })
}
