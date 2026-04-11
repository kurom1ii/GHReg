use anyhow::{bail, Context, Result};
use rquest::Client;
use std::sync::Arc;
use tokio::sync::Mutex;
use tracing::{debug, error, info, warn};

use super::models::{MailMessage, OutlookAccount};
use crate::config;
use crate::parsers::html_to_text;

pub struct OutlookClient {
    pub email: String,
    pub display_name: String,
    client: Client,
    access_token: String,
    refresh_token: String,
    client_id: String,
    token_expires: std::time::Instant,
}

impl OutlookClient {
    /// Build and authenticate a new OutlookClient.
    pub async fn connect(acc: &OutlookAccount) -> Result<Self> {
        info!("{}: connecting (client_id={}...)", acc.email, &acc.client_id[..8.min(acc.client_id.len())]);
        let client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()?;
        let mut oc = Self {
            email: acc.email.clone(),
            display_name: String::new(),
            client,
            access_token: String::new(),
            refresh_token: acc.refresh_token.clone(),
            client_id: acc.client_id.clone(),
            token_expires: std::time::Instant::now(),
        };
        oc.refresh_access_token().await.context("initial token refresh")?;
        info!("{}: token acquired, loading profile...", acc.email);
        oc.load_profile().await.context("load profile")?;
        info!("{}: connected as \"{}\"", oc.email, oc.display_name);
        Ok(oc)
    }

    async fn refresh_access_token(&mut self) -> Result<()> {
        info!("{}: → POST {} (grant_type=refresh_token, scope={})", self.email, config::MS_TOKEN_URL, config::MS_SCOPES);
        let params = [
            ("client_id", self.client_id.as_str()),
            ("scope", config::MS_SCOPES),
            ("refresh_token", self.refresh_token.as_str()),
            ("grant_type", "refresh_token"),
        ];
        let resp = self
            .client
            .post(config::MS_TOKEN_URL)
            .form(&params)
            .send()
            .await
            .context("token refresh request")?;
        let status = resp.status();
        let headers = format!("{:?}", resp.headers());
        debug!("{}: ← {} headers={}", self.email, status, headers);
        let body: serde_json::Value = resp.json().await?;
        if !status.is_success() {
            let err_code = body["error"].as_str().unwrap_or("unknown");
            let err_desc = body["error_description"].as_str().unwrap_or("no description");
            error!("{}: ← token refresh FAILED ({}): {} — {}", self.email, status, err_code, err_desc);
            bail!("token refresh failed ({}): {} — {}", status, err_code, err_desc);
        }
        self.access_token = body["access_token"]
            .as_str()
            .context("no access_token in response")?
            .to_string();
        let expires_in = body["expires_in"].as_u64().unwrap_or(3600);
        self.token_expires =
            std::time::Instant::now() + std::time::Duration::from_secs(expires_in);
        if let Some(rt) = body["refresh_token"].as_str() {
            self.refresh_token = rt.to_string();
            debug!("{}: refresh_token rotated", self.email);
        }
        info!("{}: ← token OK (expires_in={}s, token={}...)", self.email, expires_in, &self.access_token[..12.min(self.access_token.len())]);
        Ok(())
    }

    async fn ensure_token(&mut self) -> Result<()> {
        if std::time::Instant::now()
            + std::time::Duration::from_secs(60)
            >= self.token_expires
        {
            info!("{}: token expiring soon, refreshing...", self.email);
            self.refresh_access_token().await?;
        }
        Ok(())
    }

    async fn load_profile(&mut self) -> Result<()> {
        let url = format!("{}/me", config::MS_GRAPH);
        info!("{}: → GET {} (Bearer {}...)", self.email, url, &self.access_token[..12.min(self.access_token.len())]);
        let resp = self
            .client
            .get(&url)
            .bearer_auth(&self.access_token)
            .send()
            .await?;
        let status = resp.status();
        let body: serde_json::Value = resp.json().await?;
        if !status.is_success() {
            let err = body["error"]["message"].as_str().unwrap_or("unknown error");
            error!("{}: ← load_profile FAILED ({}): {}", self.email, status, err);
            bail!("load_profile failed ({}): {}", status, err);
        }
        self.display_name = body["displayName"]
            .as_str()
            .unwrap_or(&self.email)
            .to_string();
        info!("{}: ← profile OK displayName=\"{}\"", self.email, self.display_name);
        Ok(())
    }

    fn auth_get(&self, url: &str) -> rquest::RequestBuilder {
        self.client.get(url).bearer_auth(&self.access_token)
    }

    fn auth_patch(&self, url: &str) -> rquest::RequestBuilder {
        self.client.patch(url).bearer_auth(&self.access_token)
    }

    /// List messages in a folder. Returns (messages, total_count).
    pub async fn list_messages(
        &mut self,
        folder: &str,
        top: usize,
        skip: usize,
    ) -> Result<(Vec<MailMessage>, usize)> {
        self.ensure_token().await?;
        let url = format!(
            "{}/me/mailFolders/{}/messages?\
             $count=true&\
             $orderby=receivedDateTime desc&\
             $select=id,subject,from,receivedDateTime,bodyPreview,isRead&\
             $top={}&$skip={}",
            config::MS_GRAPH,
            folder,
            top,
            skip
        );
        debug!("{}: → GET {} (ConsistencyLevel: eventual)", self.email, url);
        let resp = self
            .auth_get(&url)
            .header("ConsistencyLevel", "eventual")
            .send()
            .await?;
        let status = resp.status();
        let body: serde_json::Value = resp.json().await?;
        if !status.is_success() {
            let err = body["error"]["message"].as_str().unwrap_or("unknown error");
            error!("{}: ← list_messages FAILED ({}): {}", self.email, status, err);
            bail!("list_messages failed ({}): {}", status, err);
        }
        let total = body["@odata.count"].as_u64().unwrap_or(0) as usize;
        let msgs: Vec<MailMessage> = body["value"]
            .as_array()
            .map(|arr| {
                arr.iter()
                    .map(|m| MailMessage {
                        id: m["id"].as_str().unwrap_or("").to_string(),
                        subject: m["subject"].as_str().unwrap_or("(no subject)").to_string(),
                        sender_name: m["from"]["emailAddress"]["name"]
                            .as_str()
                            .unwrap_or("")
                            .to_string(),
                        sender_email: m["from"]["emailAddress"]["address"]
                            .as_str()
                            .unwrap_or("")
                            .to_string(),
                        date: m["receivedDateTime"]
                            .as_str()
                            .unwrap_or("")
                            .to_string(),
                        preview: m["bodyPreview"].as_str().unwrap_or("").to_string(),
                        is_read: m["isRead"].as_bool().unwrap_or(false),
                        body_html: String::new(),
                        body_text: String::new(),
                    })
                    .collect()
            })
            .unwrap_or_default();
        info!("{}: listed {} messages (total={})", self.email, msgs.len(), total);
        Ok((msgs, total))
    }

    /// Get full message body.
    pub async fn get_message(&mut self, msg_id: &str) -> Result<MailMessage> {
        self.ensure_token().await?;
        let url = format!(
            "{}/me/messages/{}?\
             $select=id,subject,from,receivedDateTime,bodyPreview,isRead,body",
            config::MS_GRAPH,
            msg_id
        );
        debug!("{}: get_message {}", self.email, msg_id);
        let resp = self.auth_get(&url).send().await?;
        if !resp.status().is_success() {
            let status = resp.status();
            let err_body = resp.text().await.unwrap_or_default();
            error!("{}: get_message failed ({}): {}", self.email, status, err_body);
            bail!("get_message failed ({}): {}", status, err_body);
        }
        let m: serde_json::Value = resp.json().await?;
        let body_html = m["body"]["content"].as_str().unwrap_or("").to_string();
        let body_text = html_to_text(&body_html);
        let subject = m["subject"].as_str().unwrap_or("").to_string();
        debug!("{}: got message \"{}\"", self.email, subject);
        Ok(MailMessage {
            id: m["id"].as_str().unwrap_or("").to_string(),
            subject,
            sender_name: m["from"]["emailAddress"]["name"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            sender_email: m["from"]["emailAddress"]["address"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            date: m["receivedDateTime"].as_str().unwrap_or("").to_string(),
            preview: m["bodyPreview"].as_str().unwrap_or("").to_string(),
            is_read: m["isRead"].as_bool().unwrap_or(false),
            body_html,
            body_text,
        })
    }

    /// Mark a message as read.
    pub async fn mark_read(&mut self, msg_id: &str) -> Result<()> {
        self.ensure_token().await?;
        let url = format!("{}/me/messages/{}", config::MS_GRAPH, msg_id);
        let resp = self.auth_patch(&url)
            .json(&serde_json::json!({"isRead": true}))
            .send()
            .await?;
        if !resp.status().is_success() {
            warn!("{}: mark_read failed ({})", self.email, resp.status());
        } else {
            debug!("{}: marked read {}", self.email, msg_id);
        }
        Ok(())
    }

    /// Prefetch top N message bodies. Returns vec of (cache_key, json_body).
    pub async fn prefetch_bodies(
        &mut self,
        email: &str,
        count: usize,
    ) -> Result<Vec<(String, String)>> {
        let (msgs, _) = self.list_messages("inbox", count, 0).await?;
        info!("{}: prefetching bodies for {} messages", email, msgs.len());
        let mut results = Vec::with_capacity(msgs.len());
        let mut errors = 0u32;
        for msg in &msgs {
            match self.get_message(&msg.id).await {
                Ok(full) => {
                    let key = format!("outlook:message:{}:{}", email, msg.id);
                    let json = serde_json::to_string(&full)?;
                    results.push((key, json));
                }
                Err(e) => {
                    errors += 1;
                    warn!("{}: prefetch body failed for msg {}: {}", email, msg.id, e);
                    continue;
                }
            }
        }
        if errors > 0 {
            warn!("{}: prefetch completed with {} errors", email, errors);
        }
        Ok(results)
    }
}

/// Thread-safe wrapper.
pub type SharedOutlookClient = Arc<Mutex<OutlookClient>>;
