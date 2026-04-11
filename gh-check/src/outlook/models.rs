use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MailMessage {
    pub id: String,
    pub subject: String,
    pub sender_name: String,
    pub sender_email: String,
    pub date: String,
    pub preview: String,
    pub is_read: bool,
    #[serde(default)]
    pub body_html: String,
    #[serde(default)]
    pub body_text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutlookAccount {
    pub email: String,
    pub password: String,
    pub refresh_token: String,
    pub client_id: String,
}

impl OutlookAccount {
    /// Parse a pipe-delimited line: email|password|refresh_token|client_id
    pub fn from_line(line: &str) -> Option<Self> {
        let parts: Vec<&str> = line.split('|').collect();
        if parts.len() >= 4 {
            Some(Self {
                email: parts[0].trim().to_string(),
                password: parts[1].trim().to_string(),
                refresh_token: parts[2].trim().to_string(),
                client_id: parts[3].trim().to_string(),
            })
        } else {
            None
        }
    }
}

#[derive(Debug, Serialize)]
pub struct OutlookAccountBrief {
    pub email: String,
    pub display_name: Option<String>,
    pub connected: bool,
}
