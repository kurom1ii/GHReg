"""
xDoop TMail API client using curl_cffi to bypass TLS fingerprinting.

Usage:
    from src.xdoop import XDoopMail

    mail = XDoopMail()
    print(mail.email)                # auto-generated email
    mail.fetch_messages()            # check inbox
    mail.create_random()             # new random email
    mail.create_custom("myname")     # custom email
    mail.switch_domain("nidez.net")  # change domain
"""

from __future__ import annotations

import json
import pickle
import re
import time
import html as html_lib
from dataclasses import dataclass, field
from pathlib import Path
from curl_cffi import requests as cffi_requests


@dataclass
class Message:
    id: str
    sender: str
    subject: str
    date: str
    body: str = ""
    attachments: list[str] = field(default_factory=list)


class XDoopMail:
    BASE = "https://xdoop.com"
    LIVEWIRE = f"{BASE}/livewire/update"
    IMPERSONATE = "chrome136"
    SESSION_DIR = Path(__file__).resolve().parent.parent / ".sessions"

    def __init__(self, domain: str = "nidez.net", session_name: str = "default"):
        self.session = cffi_requests.Session(impersonate=self.IMPERSONATE)
        self._desired_domain = domain
        self.domain = domain
        self.email: str | None = None
        self.emails: list[str] = []
        self.csrf: str | None = None
        self._snapshots: dict[str, dict] = {}
        self._messages: list[Message] = []
        self._session_name = session_name
        self._session_file = self.SESSION_DIR / f"{session_name}.pkl"

        if not self._load_session():
            self._init_session()
            # enforce desired domain if server assigned a different one
            if self.domain != self._desired_domain:
                self.switch_domain(self._desired_domain)
            self._save_session()

    # ── bootstrap ──────────────────────────────────────────────

    def _save_session(self):
        """Persist session state to disk."""
        self.SESSION_DIR.mkdir(parents=True, exist_ok=True)
        state = {
            "cookies": self.session.cookies.jar._cookies,
            "csrf": self.csrf,
            "email": self.email,
            "emails": self.emails,
            "domain": self.domain,
            "desired_domain": self._desired_domain,
            "snapshots": self._snapshots,
        }
        with open(self._session_file, "wb") as f:
            pickle.dump(state, f)

    def _load_session(self) -> bool:
        """Restore session from disk. Returns True if successful."""
        if not self._session_file.exists():
            return False
        try:
            with open(self._session_file, "rb") as f:
                state = pickle.load(f)
            self.session.cookies.jar._cookies = state["cookies"]
            self.csrf = state["csrf"]
            self.email = state["email"]
            self.emails = state["emails"]
            self.domain = state["domain"]
            self._desired_domain = state.get("desired_domain", self.domain)
            self._snapshots = state["snapshots"]
            # validate session is still alive
            self._livewire_call([
                self._make_component("frontend.actions", calls=[
                    self._dispatch("syncEmail", {"email": self.email}),
                ]),
            ])
            return True
        except Exception:
            self._session_file.unlink(missing_ok=True)
            return False

    def _init_session(self):
        """GET /mailbox → extract CSRF, cookies, snapshots, email."""
        r = self.session.get(f"{self.BASE}/mailbox", timeout=15)
        r.raise_for_status()

        # CSRF token
        m = re.search(r'csrf-token.*?content="([^"]+)"', r.text)
        if not m:
            raise RuntimeError("Cannot extract CSRF token")
        self.csrf = m.group(1)

        # initial email
        m = re.search(r"const email = '([^']+)'", r.text)
        if m:
            self.email = m.group(1)
            self.emails = [self.email]

        # Livewire snapshots
        for raw in re.findall(r'wire:snapshot="([^"]+)"', r.text):
            snap = json.loads(html_lib.unescape(raw))
            name = snap["memo"]["name"]
            self._snapshots[name] = snap

        # sync + fetch
        self._livewire_call(
            [
                self._make_component("frontend.actions", calls=[
                    self._dispatch("syncEmail", {"email": self.email}),
                ]),
                self._make_component("frontend.app", calls=[
                    self._dispatch("syncEmail", {"email": self.email}),
                    self._dispatch("fetchMessages", {}),
                ]),
            ]
        )

    # ── public API ─────────────────────────────────────────────

    def create_random(self) -> str:
        """Create a new random email. Returns the new address."""
        self._livewire_call([
            self._make_component("frontend.actions", calls=[
                {"path": "", "method": "random", "params": []},
            ]),
        ])
        if self.email and self.email not in self.emails:
            self.emails.append(self.email)
        self._save_session()
        return self.email

    def create_custom(self, username: str, domain: str | None = None) -> str:
        """Create email with custom username. Returns new address."""
        if domain:
            self.switch_domain(domain)
        self._livewire_call([
            self._make_component("frontend.actions",
                updates={"user": username},
                calls=[{"path": "", "method": "create", "params": []}],
            ),
        ])
        # server doesn't always update emails list, track manually
        if self.email and self.email not in self.emails:
            self.emails.append(self.email)
        self._save_session()
        return self.email

    def create_batch(
        self,
        prefix: str,
        start: int = 1,
        end: int = 1000,
        domain: str | None = None,
        delay: float = 0.5,
    ) -> list[str]:
        """Create emails: {prefix}{start}..{prefix}{end}. Returns list of created addresses."""
        if domain:
            self.switch_domain(domain)

        created: list[str] = []
        # first create the base prefix email (no number)
        try:
            addr = self.create_custom(prefix, domain)
            created.append(addr)
            print(f"  [0] {addr}")
        except Exception as e:
            print(f"  [0] SKIP {prefix}: {e}")

        for i in range(start, end + 1):
            username = f"{prefix}{i}"
            try:
                addr = self.create_custom(username)
                created.append(addr)
                if i % 50 == 0 or i <= 5:
                    print(f"  [{i}] {addr}  (total: {len(created)})")
            except Exception as e:
                print(f"  [{i}] ERROR {username}: {e}")
                # save progress on error
                self._save_session()
                time.sleep(2)
                continue
            time.sleep(delay)
        self._save_session()
        return created

    def delete_email(self):
        """Delete the current email."""
        self._livewire_call([
            self._make_component("frontend.actions", calls=[
                {"path": "", "method": "deleteEmail", "params": []},
            ]),
        ])
        self._save_session()

    def switch_domain(self, domain: str):
        """Switch domain (xdoop.com or nidez.net)."""
        self.domain = domain
        self._livewire_call([
            self._make_component("frontend.actions", calls=[
                {"path": "", "method": "setDomain", "params": [domain]},
            ]),
        ])
        self._save_session()

    def switch_email(self, email: str):
        """Switch to another email in the session."""
        r = self.session.get(f"{self.BASE}/switch/{email}", timeout=15)
        r.raise_for_status()
        self.email = email
        # re-parse snapshots from redirected page
        for raw in re.findall(r'wire:snapshot="([^"]+)"', r.text):
            snap = json.loads(html_lib.unescape(raw))
            self._snapshots[snap["memo"]["name"]] = snap
        self._save_session()

    def fetch_messages(self) -> list[Message]:
        """Fetch inbox messages. Returns list of Message."""
        resp = self._livewire_call([
            self._make_component("frontend.app", calls=[
                self._dispatch("fetchMessages", {}),
            ]),
        ])
        self._parse_messages(resp)
        return self._messages

    @property
    def messages(self) -> list[Message]:
        return self._messages

    # ── Livewire protocol ──────────────────────────────────────

    @staticmethod
    def _dispatch(event: str, params: dict) -> dict:
        return {"path": "", "method": "__dispatch", "params": [event, params]}

    def _make_component(
        self,
        name: str,
        updates: dict | None = None,
        calls: list[dict] | None = None,
    ) -> dict:
        snap = self._snapshots.get(name)
        if not snap:
            raise RuntimeError(f"No snapshot for component '{name}'")
        return {
            "snapshot": json.dumps(snap),
            "updates": updates or {},
            "calls": calls or [],
        }

    def _livewire_call(self, components: list[dict]) -> dict:
        """POST to /livewire/update and process response."""
        payload = {
            "_token": self.csrf,
            "components": components,
        }
        r = self.session.post(
            self.LIVEWIRE,
            json=payload,
            headers={
                "X-Livewire": "",
                "Content-Type": "application/json",
                "Referer": f"{self.BASE}/mailbox",
            },
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()

        # update snapshots from response
        for comp in data.get("components", []):
            snap_str = comp.get("snapshot", "")
            if snap_str:
                snap = json.loads(snap_str) if isinstance(snap_str, str) else snap_str
                name = snap["memo"]["name"]
                self._snapshots[name] = snap

                # track email state
                if name == "frontend.actions":
                    if snap["data"].get("email"):
                        self.email = snap["data"]["email"]
                    emails_raw = snap["data"].get("emails", [[]])
                    if isinstance(emails_raw, list) and emails_raw:
                        self.emails = emails_raw[0] if isinstance(emails_raw[0], list) else []
                    if snap["data"].get("domain"):
                        self.domain = snap["data"]["domain"]

        return data

    def _parse_messages(self, data: dict):
        """Extract messages from Livewire response."""
        self._messages = []
        for comp in data.get("components", []):
            snap_str = comp.get("snapshot", "")
            snap = json.loads(snap_str) if isinstance(snap_str, str) else snap_str
            if snap["memo"]["name"] != "frontend.app":
                continue
            msgs_raw = snap["data"].get("messages", [[], {"s": "arr"}])
            # msgs_raw = [[msg1, msg2, ...], {"s": "arr"}]
            if not isinstance(msgs_raw, list) or not msgs_raw:
                continue
            msg_list = msgs_raw[0]
            if not isinstance(msg_list, list):
                continue
            for item in msg_list:
                # each item is [msg_dict, {"s": "arr"}] or plain dict
                msg = item
                if isinstance(item, list) and item:
                    msg = item[0]
                if not isinstance(msg, dict) or "s" in msg:
                    continue
                self._messages.append(Message(
                    id=str(msg.get("id", "")),
                    sender=msg.get("sender_name", msg.get("sender", "")),
                    subject=msg.get("subject", ""),
                    date=msg.get("datediff", msg.get("date", "")),
                    body=msg.get("content", msg.get("body", "")),
                ))

    # ── repr ───────────────────────────────────────────────────

    def __repr__(self):
        return f"XDoopMail(email={self.email!r}, domain={self.domain!r}, emails={self.emails})"


# ── CLI ───────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="xDoop TMail client")
    parser.add_argument("--session", default="default", help="Session name for persistence")
    sub = parser.add_subparsers(dest="cmd")

    # batch sub-command
    bp = sub.add_parser("batch", help="Create batch emails")
    bp.add_argument("prefix", help="Email prefix (e.g. mrskuromi)")
    bp.add_argument("--start", type=int, default=1)
    bp.add_argument("--end", type=int, default=1000)
    bp.add_argument("--domain", default="nidez.net")
    bp.add_argument("--delay", type=float, default=0.5)

    # info sub-command
    sub.add_parser("info", help="Show session info")

    args = parser.parse_args()

    if args.cmd == "batch":
        print(f"=== Batch create: {args.prefix}1..{args.prefix}{args.end} ===\n")
        mail = XDoopMail(domain=args.domain, session_name=args.session)
        print(f"Session: {args.session} | Email: {mail.email}")
        print(f"Existing emails: {len(mail.emails)}\n")
        created = mail.create_batch(args.prefix, args.start, args.end, args.domain, args.delay)
        print(f"\nDone! Created {len(created)} emails.")
        print(f"Session saved to: {mail._session_file}")

    elif args.cmd == "info":
        mail = XDoopMail(session_name=args.session)
        print(f"Session:  {args.session}")
        print(f"Email:    {mail.email}")
        print(f"Emails:   {mail.emails}")
        print(f"Domain:   {mail.domain}")
        print(f"File:     {mail._session_file}")

    else:
        print("=== xDoop TMail curl_cffi client ===\n")
        mail = XDoopMail(session_name=args.session)
        print(f"[1] Auto email:  {mail.email}")
        print(f"    All emails:  {mail.emails}")
        print(f"    Domain:      {mail.domain}")

        msgs = mail.fetch_messages()
        print(f"    Messages:    {len(msgs)}")

        print(f"\n[2] Creating random email...")
        new_email = mail.create_random()
        print(f"    New email:   {new_email}")
        print(f"    All emails:  {mail.emails}")

        print(f"\n[3] Fetching messages for {mail.email}...")
        msgs = mail.fetch_messages()
        print(f"    Messages:    {len(msgs)}")
        for m in msgs:
            print(f"      - {m.sender}: {m.subject} ({m.date})")

        print(f"\n[4] Creating custom email...")
        custom = mail.create_custom("testxdoop123")
        print(f"    Custom:      {custom}")
        print(f"    All emails:  {mail.emails}")

        print(f"\nDone! {mail}")
        print(f"Session saved: {mail._session_file}")
