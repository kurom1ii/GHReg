"""Outlook Mail client via Microsoft Graph API with OAuth refresh token."""

from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass, field
from html.parser import HTMLParser
from curl_cffi import requests as cffi_requests


TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
GRAPH = "https://graph.microsoft.com/v1.0"
SCOPES = "https://graph.microsoft.com/.default offline_access"


class _HTMLToText(HTMLParser):
    """Minimal HTML to plain text converter."""

    def __init__(self):
        super().__init__()
        self._parts: list[str] = []
        self._skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ("style", "script", "head"):
            self._skip = True
        elif tag == "br":
            self._parts.append("\n")
        elif tag in ("p", "div", "tr", "li", "h1", "h2", "h3", "h4"):
            self._parts.append("\n")

    def handle_endtag(self, tag):
        if tag in ("style", "script", "head"):
            self._skip = False

    def handle_data(self, data):
        if not self._skip:
            self._parts.append(data)

    def get_text(self) -> str:
        text = "".join(self._parts)
        # collapse blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


def html_to_text(html: str) -> str:
    parser = _HTMLToText()
    parser.feed(html)
    return parser.get_text()


@dataclass
class MailMessage:
    id: str
    subject: str
    sender_name: str
    sender_email: str
    date: str
    preview: str
    is_read: bool
    body_html: str = ""
    body_text: str = ""


class OutlookClient:
    """Microsoft Graph API client for Outlook mail."""

    def __init__(self, email: str, password: str, refresh_token: str, client_id: str):
        self.email = email
        self.password = password
        self.client_id = client_id
        self.refresh_token = refresh_token
        self.access_token: str | None = None
        self._token_expires: float = 0
        self.display_name: str = email
        self.session = cffi_requests.Session(impersonate="chrome136")

        self._refresh_access_token()
        self._load_profile()

    def _refresh_access_token(self):
        """Get a new access token using the refresh token."""
        r = self.session.post(TOKEN_URL, data={
            "client_id": self.client_id,
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token,
            "scope": SCOPES,
        }, timeout=15)
        r.raise_for_status()
        data = r.json()
        if "error" in data:
            raise RuntimeError(f"Token error: {data['error_description']}")
        self.access_token = data["access_token"]
        self._token_expires = time.time() + data.get("expires_in", 3600) - 60
        if data.get("refresh_token"):
            self.refresh_token = data["refresh_token"]

    def _ensure_token(self):
        if time.time() >= self._token_expires:
            self._refresh_access_token()

    def _headers(self) -> dict:
        self._ensure_token()
        return {"Authorization": f"Bearer {self.access_token}"}

    def _load_profile(self):
        r = self.session.get(f"{GRAPH}/me", headers=self._headers(), timeout=10)
        if r.ok:
            me = r.json()
            self.display_name = me.get("displayName", self.email)

    # ── Mail operations ──────────────────────────────────────

    def list_messages(self, folder: str = "inbox", top: int = 25, skip: int = 0) -> tuple[list[MailMessage], int]:
        """List messages in a folder. Returns (messages, total_count)."""
        params = {
            "$top": str(top),
            "$skip": str(skip),
            "$select": "id,subject,from,receivedDateTime,isRead,bodyPreview",
            "$orderby": "receivedDateTime desc",
            "$count": "true",
        }
        r = self.session.get(
            f"{GRAPH}/me/mailFolders/{folder}/messages",
            params=params,
            headers={**self._headers(), "ConsistencyLevel": "eventual"},
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        total = data.get("@odata.count", 0)
        msgs = []
        for m in data.get("value", []):
            fr = m.get("from", {}).get("emailAddress", {})
            msgs.append(MailMessage(
                id=m["id"],
                subject=m.get("subject", "(no subject)"),
                sender_name=fr.get("name", ""),
                sender_email=fr.get("address", ""),
                date=m.get("receivedDateTime", ""),
                preview=m.get("bodyPreview", ""),
                is_read=m.get("isRead", False),
            ))
        return msgs, total

    def get_message(self, msg_id: str) -> MailMessage:
        """Get full message with body."""
        r = self.session.get(
            f"{GRAPH}/me/messages/{msg_id}",
            params={"$select": "id,subject,from,receivedDateTime,isRead,body,bodyPreview"},
            headers=self._headers(),
            timeout=15,
        )
        r.raise_for_status()
        m = r.json()
        fr = m.get("from", {}).get("emailAddress", {})
        body = m.get("body", {})
        body_html = body.get("content", "")
        body_text = html_to_text(body_html) if body.get("contentType") == "html" else body_html
        return MailMessage(
            id=m["id"],
            subject=m.get("subject", "(no subject)"),
            sender_name=fr.get("name", ""),
            sender_email=fr.get("address", ""),
            date=m.get("receivedDateTime", ""),
            preview=m.get("bodyPreview", ""),
            is_read=m.get("isRead", False),
            body_html=body_html,
            body_text=body_text,
        )

    def mark_read(self, msg_id: str):
        """Mark a message as read."""
        self.session.patch(
            f"{GRAPH}/me/messages/{msg_id}",
            json={"isRead": True},
            headers={**self._headers(), "Content-Type": "application/json"},
            timeout=10,
        )

    def get_folders(self) -> list[dict]:
        """List mail folders."""
        r = self.session.get(
            f"{GRAPH}/me/mailFolders",
            params={"$select": "id,displayName,totalItemCount,unreadItemCount"},
            headers=self._headers(),
            timeout=10,
        )
        r.raise_for_status()
        return r.json().get("value", [])

    def __repr__(self):
        return f"OutlookClient({self.display_name} <{self.email}>)"


# ── CLI test ──────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    # email|password|refresh_token|client_id
    if len(sys.argv) > 1:
        parts = sys.argv[1].split("|")
    else:
        parts = input("account (email|pass|refresh|client_id): ").strip().split("|")

    client = OutlookClient(parts[0], parts[1], parts[2], parts[3])
    print(f"Logged in: {client}")

    msgs, total = client.list_messages()
    print(f"\nInbox: {len(msgs)}/{total} messages")
    for m in msgs:
        mark = "+" if m.is_read else " "
        print(f"  [{mark}] {m.sender_name or m.sender_email}: {m.subject}")
        print(f"       {m.date}")
