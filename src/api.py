"""GHReg API — FastAPI backend with Redis caching, prefetch, GraphQL batching."""

import asyncio
import orjson
import sys
import threading
import os
from pathlib import Path
from contextlib import contextmanager

import redis
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from src.outlook import OutlookClient

app = FastAPI(title="GHReg API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── Redis (connection pool) ───────────────────────────────────

_pool = redis.ConnectionPool(
    host="localhost", port=6379, db=0,
    decode_responses=True,
    max_connections=20,
    socket_connect_timeout=2,
    socket_timeout=2,
    retry_on_timeout=True,
)
R = redis.Redis(connection_pool=_pool)

# orjson: ~3-5x faster than stdlib json, returns bytes (decode_responses=True handles decode)
_dumps = orjson.dumps
_loads = orjson.loads

# TTLs
TTL_ACCOUNTS = 600      # 10 min
TTL_MESSAGES = 30       # 30s — short for freshness
TTL_MESSAGE = 300       # 5 min — bodies cache
TTL_PROFILE = 3600      # 1 hour
TTL_GH_STATUS = 300     # 5 min
TTL_ORGS = 600          # 10 min

# ── Cache helpers (pipeline-optimized) ────────────────────────

def _cget(key: str):
    raw = R.get(key)
    return _loads(raw) if raw else None


def _cset(key: str, data, ttl: int = 60):
    R.setex(key, ttl, _dumps(data))


def _cmget(*keys: str) -> list:
    """Batch get multiple keys at once."""
    if not keys:
        return []
    vals = R.mget(keys)
    return [_loads(v) if v else None for v in vals]


def _cpipe_set(items: dict[str, tuple], ttl: int = 60):
    """Batch set via pipeline. items = {key: data}"""
    if not items:
        return
    pipe = R.pipeline(transaction=False)
    for key, data in items.items():
        pipe.setex(key, ttl, _dumps(data))
    pipe.execute()


def _cdel(pattern: str):
    """Delete by pattern using SCAN + UNLINK (async delete)."""
    cursor = 0
    while True:
        cursor, keys = R.scan(cursor=cursor, match=pattern, count=200)
        if keys:
            R.unlink(*keys)
        if cursor == 0:
            break


# ── File loading with mtime cache ────────────────────────────

OUTLOOK_FILE = _root / "data" / "outlook.txt"
GITHUB_FILE = _root / "cf-email-dashboard" / "data" / "accounts.txt"

_file_cache: dict[str, tuple[float, list]] = {}  # path -> (mtime, data)

_outlook_clients: dict[str, OutlookClient] = {}
_github_sessions: dict[str, object] = {}


def _load_file_cached(path: Path, parser) -> list:
    """Load file with mtime check — only re-read if file changed."""
    key = str(path)
    try:
        mtime = path.stat().st_mtime
    except FileNotFoundError:
        return []
    cached = _file_cache.get(key)
    if cached and cached[0] == mtime:
        return cached[1]
    data = parser(path)
    _file_cache[key] = (mtime, data)
    return data


def _parse_outlook(path: Path) -> list:
    out = []
    for line in path.read_text().strip().splitlines():
        p = line.strip().split("|")
        if len(p) >= 4:
            out.append({"email": p[0], "password": p[1], "refresh_token": p[2], "client_id": p[3]})
    return out


def _parse_github(path: Path) -> list:
    out = []
    for line in path.read_text().strip().splitlines():
        p = line.strip().split("|")
        if len(p) >= 4:
            out.append({"email": p[0], "username": p[1], "password": p[2], "totp": p[3]})
    return out


def _load_outlook():
    return _load_file_cached(OUTLOOK_FILE, _parse_outlook)


def _load_github():
    return _load_file_cached(GITHUB_FILE, _parse_github)


# ── Prefetch: background thread fetches all mail bodies ───────

_prefetch_locks: dict[str, threading.Lock] = {}


def _prefetch_all_bodies(email: str):
    """Background: fetch all message bodies and cache them."""
    lock = _prefetch_locks.setdefault(email, threading.Lock())
    if not lock.acquire(blocking=False):
        return  # already prefetching
    try:
        c = _outlook_clients.get(email)
        if not c:
            return
        # fetch first page of messages
        msgs, total = c.list_messages(top=50, skip=0)
        pipe_data = {}
        for m in msgs:
            cache_key = f"outlook:msg:{email}:{m.id[:40]}"
            # skip if already cached
            if R.exists(cache_key):
                continue
            try:
                full = c.get_message(m.id)
                pipe_data[cache_key] = {
                    "subject": full.subject, "sender": full.sender_name,
                    "sender_email": full.sender_email, "date": full.date,
                    "body_html": full.body_html,
                    "body_text": full.body_text or full.preview,
                }
            except Exception:
                continue
        # batch write all at once
        if pipe_data:
            _cpipe_set(pipe_data, TTL_MESSAGE)
    finally:
        lock.release()


# ── GraphQL batch for GitHub account verification ─────────────

GITHUB_GRAPHQL = "https://api.github.com/graphql"


def _graphql_batch_check(usernames: list[str], token: str) -> dict[str, bool]:
    """Check multiple GitHub users exist in one GraphQL request."""
    if not usernames:
        return {}
    # build batched query
    parts = []
    for i, u in enumerate(usernames):
        parts.append(f'u{i}: user(login: "{u}") {{ login }}')
    query = "query { " + " ".join(parts) + " }"

    from curl_cffi import requests as cffi_requests
    s = cffi_requests.Session(impersonate="chrome136")
    try:
        r = s.post(GITHUB_GRAPHQL, json={"query": query},
                   headers={"Authorization": f"Bearer {token}"}, timeout=10)
        if r.status_code != 200:
            return {}
        data = r.json().get("data", {})
        result = {}
        for i, u in enumerate(usernames):
            result[u] = data.get(f"u{i}") is not None
        return result
    except Exception:
        return {}


def _graphql_rate_limit(token: str) -> dict | None:
    """Check rate limit via GraphQL."""
    query = "query { rateLimit { limit remaining resetAt } }"
    from curl_cffi import requests as cffi_requests
    s = cffi_requests.Session(impersonate="chrome136")
    try:
        r = s.post(GITHUB_GRAPHQL, json={"query": query},
                   headers={"Authorization": f"Bearer {token}"}, timeout=5)
        if r.status_code == 200:
            return r.json().get("data", {}).get("rateLimit")
    except Exception:
        pass
    return None


# ── Outlook endpoints ─────────────────────────────────────────

@app.get("/api/outlook/accounts")
def outlook_accounts(page: int = 0, size: int = 50):
    full_key = "outlook:accounts:list"
    cached = _cget(full_key)
    if not cached:
        cached = [{"email": a["email"]} for a in _load_outlook()]
        _cset(full_key, cached, TTL_ACCOUNTS)
    total = len(cached)
    start = page * size
    return {"accounts": cached[start:start + size], "total": total, "page": page}


@app.post("/api/outlook/connect/{email}")
def outlook_connect(email: str, bg: BackgroundTasks):
    # fast path: already connected + cached
    cached = _cget(f"outlook:profile:{email}")
    if cached and email in _outlook_clients:
        return cached

    if email in _outlook_clients:
        c = _outlook_clients[email]
        result = {"display_name": c.display_name, "email": c.email}
        _cset(f"outlook:profile:{email}", result, TTL_PROFILE)
        # prefetch bodies in background
        bg.add_task(_prefetch_all_bodies, email)
        return result

    acct = next((a for a in _load_outlook() if a["email"] == email), None)
    if not acct:
        raise HTTPException(404, "Account not found")
    try:
        c = OutlookClient(acct["email"], acct["password"], acct["refresh_token"], acct["client_id"])
        _outlook_clients[email] = c
        result = {"display_name": c.display_name, "email": c.email}
        _cset(f"outlook:profile:{email}", result, TTL_PROFILE)
        # prefetch all message bodies in background
        bg.add_task(_prefetch_all_bodies, email)
        return result
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/outlook/messages/{email}")
def outlook_messages(email: str, page: int = 0, page_size: int = 25):
    c = _outlook_clients.get(email)
    if not c:
        raise HTTPException(400, "Not connected")

    cache_key = f"outlook:messages:{email}:p{page}:s{page_size}"
    cached = _cget(cache_key)
    if cached:
        return cached

    msgs, total = c.list_messages(top=page_size, skip=page * page_size)
    result = {
        "total": total,
        "page": page,
        "messages": [
            {
                "id": m.id, "subject": m.subject,
                "sender": m.sender_name or m.sender_email,
                "sender_email": m.sender_email,
                "date": m.date[:16].replace("T", " ") if "T" in m.date else m.date,
                "preview": m.preview, "is_read": m.is_read,
            }
            for m in msgs
        ],
    }
    _cset(cache_key, result, TTL_MESSAGES)
    return result


@app.get("/api/outlook/message/{email}/{msg_id:path}")
def outlook_message(email: str, msg_id: str):
    c = _outlook_clients.get(email)
    if not c:
        raise HTTPException(400, "Not connected")

    cache_key = f"outlook:msg:{email}:{msg_id[:40]}"
    cached = _cget(cache_key)
    if cached:
        return cached

    msg = c.get_message(msg_id)
    c.mark_read(msg_id)
    result = {
        "subject": msg.subject, "sender": msg.sender_name,
        "sender_email": msg.sender_email, "date": msg.date,
        "body_html": msg.body_html, "body_text": msg.body_text or msg.preview,
    }
    _cset(cache_key, result, TTL_MESSAGE)
    # invalidate message list (read status changed)
    _cdel(f"outlook:messages:{email}:*")
    return result


@app.get("/api/outlook/stream/{email}")
async def outlook_stream(email: str):
    """SSE endpoint — push new-mail events every 30s, ping every 15s."""
    async def _gen():
        last_ids: set = set()
        counter = 0
        while True:
            await asyncio.sleep(15)
            counter += 1
            if counter % 2 == 0:  # every 30s
                c = _outlook_clients.get(email)
                if c:
                    try:
                        msgs, _ = await asyncio.to_thread(
                            lambda: c.list_messages(top=5, skip=0)
                        )
                        current_ids = {m.id for m in msgs}
                        if last_ids:
                            new_ids = current_ids - last_ids
                            if new_ids:
                                new_msgs = [m for m in msgs if m.id in new_ids]
                                payload = _dumps({
                                    "type": "new_mail",
                                    "count": len(new_ids),
                                    "messages": [
                                        {
                                            "id": m.id,
                                            "subject": m.subject,
                                            "sender": m.sender_name or m.sender_email,
                                            "date": m.date,
                                        }
                                        for m in new_msgs
                                    ],
                                }).decode()
                                _cdel(f"outlook:messages:{email}:*")
                                yield f"data: {payload}\n\n"
                        last_ids = current_ids
                    except Exception:
                        pass
            yield 'data: {"type":"ping"}\n\n'

    return StreamingResponse(
        _gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── GitHub endpoints ──────────────────────────────────────────

@app.get("/api/github/accounts")
def github_accounts(page: int = 0, size: int = 50):
    all_accts = _load_github()
    total = len(all_accts)
    start = page * size
    slice_ = all_accts[start:start + size]
    result = [
        {"email": a["email"], "username": a["username"],
         "status": "logged_in" if a["username"] in _github_sessions else "offline"}
        for a in slice_
    ]
    return {"accounts": result, "total": total, "page": page}


@app.post("/api/github/login/{username}")
def github_login_endpoint(username: str):
    acct = next((a for a in _load_github() if a["username"] == username), None)
    if not acct:
        raise HTTPException(404, "Account not found")
    try:
        from curl_cffi import requests as cffi_requests
        from src.login.session import github_login
        session = cffi_requests.Session(impersonate="chrome136")
        ok = github_login(session, acct["email"], acct["password"], acct["totp"])
        if ok:
            _github_sessions[username] = session
            _cset(f"github:status:{username}", "logged_in", TTL_GH_STATUS)
            return {"status": "logged_in", "username": username}
        _cset(f"github:status:{username}", "failed", TTL_GH_STATUS)
        return {"status": "failed", "username": username}
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/github/pat/{username}")
def github_pat_endpoint(username: str):
    session = _github_sessions.get(username)
    if not session:
        raise HTTPException(400, "Not logged in")
    acct = next((a for a in _load_github() if a["username"] == username), None)
    try:
        from src.pat.sudo import github_sudo
        from src.pat.creator import create_pat
        from src.pat.storage import save_token
        github_sudo(session, acct["password"])
        token = create_pat(session, token_name="web-pat", expires_days=30, preset="copilot")
        if token:
            save_token(token, "web-pat", str(_root / "github_tokens.json"), username)
            _cset(f"github:status:{username}", "pat_created", TTL_GH_STATUS)
            return {"status": "pat_created", "token_preview": token[:20] + "..."}
        raise HTTPException(500, "PAT creation failed")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/github/orgs/{username}")
def github_orgs(username: str):
    session = _github_sessions.get(username)
    if not session:
        raise HTTPException(400, "Not logged in")

    cached = _cget(f"github:orgs:{username}")
    if cached:
        return cached

    try:
        from src.org.manager import OrgManager
        mgr = OrgManager(session)
        orgs = mgr.list_orgs()
        result = []
        for org in orgs:
            members = mgr.list_members(org)
            pending = mgr.list_pending(org)
            result.append({
                "name": org,
                "members": [m.get("username", "") for m in members],
                "pending": pending,
            })
        _cset(f"github:orgs:{username}", result, TTL_ORGS)
        return result
    except Exception as e:
        raise HTTPException(500, str(e))


class InviteRequest(BaseModel):
    username: str


@app.post("/api/github/invite/{org_name}")
def github_invite(org_name: str, req: InviteRequest):
    session = next(iter(_github_sessions.values()), None)
    if not session:
        raise HTTPException(400, "No logged in sessions")
    try:
        from src.org.manager import OrgManager
        ok = OrgManager(session).invite_user(org_name, req.username)
        _cdel("github:orgs:*")
        return {"ok": ok, "username": req.username, "org": org_name}
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/github/stream")
async def github_stream():
    """SSE endpoint — push status_update events every 20s."""
    async def _gen():
        last_statuses: dict[str, str] = {}
        while True:
            await asyncio.sleep(20)
            accts = _load_github()
            # Build a compact username->status map (efficient for large lists)
            current_map = {
                a["username"]: ("logged_in" if a["username"] in _github_sessions else "offline")
                for a in accts
            }
            if current_map != last_statuses:
                last_statuses = current_map
                payload = _dumps({"type": "status_update", "statuses": current_map}).decode()
                yield f"data: {payload}\n\n"
            else:
                yield 'data: {"type":"ping"}\n\n'

    return StreamingResponse(
        _gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── GraphQL endpoints ─────────────────────────────────────────

class CheckAliveRequest(BaseModel):
    usernames: list[str]
    token: str


@app.post("/api/github/check-alive")
def github_check_alive(req: CheckAliveRequest):
    """Batch check if GitHub users exist via single GraphQL query."""
    cache_key = "github:alive:" + ",".join(sorted(req.usernames))
    cached = _cget(cache_key)
    if cached:
        return cached
    result = _graphql_batch_check(req.usernames, req.token)
    if result:
        _cset(cache_key, result, TTL_ORGS)
    return result


@app.post("/api/github/rate-limit")
def github_rate_limit(token: str):
    """Check PAT rate limit via GraphQL."""
    cached = _cget(f"github:ratelimit:{token[:10]}")
    if cached:
        return cached
    result = _graphql_rate_limit(token)
    if result:
        _cset(f"github:ratelimit:{token[:10]}", result, 30)
    return result or {"error": "Could not fetch rate limit"}


# ── Cache management ──────────────────────────────────────────

@app.post("/api/cache/flush")
def cache_flush():
    _cdel("outlook:*")
    _cdel("github:*")
    return {"flushed": True}


@app.get("/api/cache/stats")
def cache_stats():
    pipe = R.pipeline(transaction=False)
    pipe.dbsize()
    pipe.info("memory")
    pipe.info("clients")
    dbsize, mem_info, cli_info = pipe.execute()
    return {
        "total_keys": dbsize,
        "used_memory": mem_info.get("used_memory_human"),
        "connected_clients": cli_info.get("connected_clients"),
        "prefetch_active": {e: not _prefetch_locks.get(e, threading.Lock()).locked()
                           for e in _outlook_clients},
    }


# ── Startup: pre-warm ────────────────────────────────────────

@app.on_event("startup")
def startup_warmup():
    """Pre-warm account lists into Redis on startup."""
    try:
        ol = _load_outlook()
        _cset("outlook:accounts:list", [{"email": a["email"]} for a in ol], TTL_ACCOUNTS)
        _load_github()
    except Exception:
        pass
