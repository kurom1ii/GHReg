# CF Email Dashboard — API Documentation

Base URL: `http://localhost:3456`

---

## Email Routing (Cloudflare)

### GET /api/rules
Lấy tất cả email routing rules.

**Response:**
```json
{
  "rules": [
    {
      "id": "abc123",
      "name": "rule name",
      "enabled": true,
      "from": "user1@spxlua.com",
      "to": "dest@gmail.com"
    }
  ]
}
```

### POST /api/rules/create
Tạo batch email routing rules.

**Body:**
```json
{
  "prefix": "melody",
  "count": 5,
  "start": 1,
  "domain": "spxlua.com",
  "destination": "dest@gmail.com"
}
```
Tạo: melody1@spxlua.com, melody2@spxlua.com, ... melody5@spxlua.com

**Response:**
```json
{ "results": [{ "ok": true }, { "ok": true }] }
```

### POST /api/rules/delete
Xóa batch rules theo ID.

**Body:**
```json
{ "ids": ["rule-id-1", "rule-id-2"] }
```

### GET /api/destinations
Lấy danh sách destination addresses.

### POST /api/destinations/create
**Body:** `{ "email": "dest@gmail.com" }`

### POST /api/destinations/delete
**Body:** `{ "id": "dest-id" }`

---

## Outlook Email (Microsoft Graph API)

### GET /api/emails
Lấy danh sách email từ inbox.

**Query params:**
| Param | Default | Mô tả |
|-------|---------|-------|
| `top` | 30 | Số email trả về |
| `skip` | 0 | Offset phân trang |

**Response:**
```json
{
  "success": true,
  "account": "kuromi3814@gmail.com",
  "total": 2,
  "emails": [
    {
      "id": "AAMkAGI...",
      "subject": "Your GitHub launch code",
      "from": {
        "emailAddress": {
          "name": "GitHub",
          "address": "noreply@github.com"
        }
      },
      "receivedDateTime": "2026-04-09T16:38:02Z",
      "isRead": false,
      "bodyPreview": "Your verification code is...",
      "hasAttachments": false
    }
  ]
}
```

**Python example:**
```python
import requests

resp = requests.get("http://localhost:3456/api/emails", params={"top": 10})
data = resp.json()
for email in data["emails"]:
    print(f"{email['from']['emailAddress']['address']}: {email['subject']}")
```

### GET /api/emails/detail
Lấy nội dung đầy đủ 1 email (bao gồm HTML body).

**Query params:**
| Param | Mô tả |
|-------|-------|
| `id` | Email ID (bắt buộc) |

**Response:**
```json
{
  "success": true,
  "email": {
    "id": "AAMkAGI...",
    "subject": "Your GitHub launch code",
    "from": { "emailAddress": { "name": "GitHub", "address": "noreply@github.com" } },
    "receivedDateTime": "2026-04-09T16:38:02Z",
    "isRead": true,
    "bodyPreview": "...",
    "body": {
      "contentType": "html",
      "content": "<html>...</html>"
    },
    "hasAttachments": false
  }
}
```

**Python example:**
```python
import requests

# Lấy email mới nhất
emails = requests.get("http://localhost:3456/api/emails", params={"top": 1}).json()
email_id = emails["emails"][0]["id"]

# Đọc nội dung
detail = requests.get("http://localhost:3456/api/emails/detail", params={"id": email_id}).json()
html_body = detail["email"]["body"]["content"]
```

### GET /api/emails/search
Tìm kiếm email theo keyword.

**Query params:**
| Param | Default | Mô tả |
|-------|---------|-------|
| `q` | (bắt buộc) | Từ khóa tìm kiếm |
| `top` | 20 | Số kết quả tối đa |

**Response:**
```json
{
  "success": true,
  "emails": [...],
  "count": 1
}
```

**Python example:**
```python
# Tìm email GitHub verification
resp = requests.get("http://localhost:3456/api/emails/search", params={"q": "GitHub launch code"})
emails = resp.json()["emails"]
```

### GET /api/emails/folders
Lấy danh sách mail folders (Inbox, Sent, Drafts, ...).

**Response:**
```json
{
  "success": true,
  "folders": [
    {
      "id": "AAMkAGI...",
      "displayName": "Inbox",
      "totalItemCount": 2,
      "unreadItemCount": 2
    }
  ]
}
```

### POST /api/emails/mark-read
Đánh dấu email đã đọc.

**Body:**
```json
{ "id": "AAMkAGI..." }
```

**Response:**
```json
{ "success": true }
```

**Python example:**
```python
requests.post("http://localhost:3456/api/emails/mark-read", json={"id": email_id})
```

---

## Python Helper — Đọc email verification code

```python
import re
import requests

BASE = "http://localhost:3456"

def get_latest_github_code() -> str | None:
    """Tìm và trích xuất GitHub verification code từ email mới nhất."""
    resp = requests.get(f"{BASE}/api/emails/search", params={"q": "GitHub launch code", "top": 1})
    emails = resp.json().get("emails", [])
    if not emails:
        return None

    detail = requests.get(f"{BASE}/api/emails/detail", params={"id": emails[0]["id"]}).json()
    body = detail["email"]["body"]["content"]

    # Trích xuất code 6 chữ số từ HTML
    match = re.search(r'(\d{6})', body)
    return match.group(1) if match else None

def wait_for_email(sender: str, timeout: int = 120, interval: int = 5) -> dict | None:
    """Đợi email từ sender cụ thể, poll mỗi interval giây."""
    import time
    start = time.time()
    while time.time() - start < timeout:
        resp = requests.get(f"{BASE}/api/emails", params={"top": 5})
        for email in resp.json().get("emails", []):
            if sender.lower() in email["from"]["emailAddress"]["address"].lower():
                return email
        time.sleep(interval)
    return None
```

---

## Environment Variables

```env
# Cloudflare
CF_API_TOKEN=...
CF_ACCOUNT_ID=...
CF_ZONE_ID=...
CF_DOMAIN=spxlua.com
CF_DESTINATION_EMAIL=...
NEXT_PUBLIC_CF_DOMAIN=spxlua.com

# Microsoft Graph API
MS_EMAIL=kuromi3814@gmail.com
MS_REFRESH_TOKEN=M.C532_SN1...
MS_CLIENT_ID=9e5f94bc-e8a4-4e73-b8be-63364c29d753
```

Format credentials: `Email|Password|Refresh_Token|Client_Id|Recovery_Email`
