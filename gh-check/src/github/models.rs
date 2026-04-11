use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GithubAccount {
    pub email: String,
    pub username: String,
    pub password: String,
    pub totp_secret: String,
}

impl GithubAccount {
    /// Parse a pipe-delimited line: email|username|password|totp_secret
    pub fn from_line(line: &str) -> Option<Self> {
        let parts: Vec<&str> = line.split('|').collect();
        if parts.len() >= 4 {
            Some(Self {
                email: parts[0].trim().to_string(),
                username: parts[1].trim().to_string(),
                password: parts[2].trim().to_string(),
                totp_secret: parts[3].trim().to_string(),
            })
        } else {
            None
        }
    }
}

#[derive(Debug, Serialize)]
pub struct GithubAccountBrief {
    pub username: String,
    pub email: String,
    pub has_2fa: bool,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenEntry {
    pub name: String,
    pub token: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrgMember {
    pub username: String,
    pub display_name: String,
}

#[derive(Debug, Serialize)]
pub struct OrgInfo {
    pub name: String,
    pub members: Vec<OrgMember>,
    pub pending: Vec<String>,
}

/// PAT permission presets.
#[derive(Debug, Clone, Copy)]
#[allow(dead_code)]
pub enum PatPreset {
    Minimal,
    Readonly,
    Copilot,
    FullRepo,
}

#[allow(dead_code)]
impl PatPreset {
    pub fn parse(s: &str) -> Self {
        match s {
            "readonly" => Self::Readonly,
            "copilot" => Self::Copilot,
            "full_repo" => Self::FullRepo,
            _ => Self::Minimal,
        }
    }
}

