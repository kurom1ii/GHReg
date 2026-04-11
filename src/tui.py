"""TUITUI — Interactive GitHub Account Manager (Textual TUI)."""

import io
import json
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import redirect_stdout
from pathlib import Path
from threading import Lock

from curl_cffi import requests as cffi_requests
from rich.text import Text

from textual import work
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical, VerticalScroll
from textual.widgets import (
    Button, DataTable, Footer, Header, Input, RichLog, Static, TextArea,
)
from textual.worker import get_current_worker

from .login.session import github_login
from .pat.sudo import github_sudo
from .pat.creator import create_pat
from .pat.storage import save_token
from .pat.permissions import PERMISSION_PRESETS
from .org.manager import OrgManager

ACCOUNTS_FILE = Path(__file__).parent.parent / "cf-email-dashboard" / "data" / "accounts.txt"
TOKENS_FILE = "github_tokens.json"


# ── Log Writer ───────────────────────────────────────────────────────


class _LogWriter(io.TextIOBase):
    """Bridge print() → RichLog widget, thread-safe."""

    def __init__(self, app: App, log_id: str = "log"):
        self._app = app
        self._log_id = log_id
        self._lock = Lock()
        self._buf = ""

    def write(self, text: str) -> int:
        with self._lock:
            self._buf += text
            while "\n" in self._buf:
                line, self._buf = self._buf.split("\n", 1)
                if line.strip():
                    self._app.call_from_thread(self._emit, line.rstrip())
        return len(text)

    def flush(self):
        with self._lock:
            if self._buf.strip():
                self._app.call_from_thread(self._emit, self._buf.rstrip())
                self._buf = ""

    def _emit(self, text: str):
        try:
            self._app.query_one(f"#{self._log_id}", RichLog).write(text)
        except Exception:
            pass


# ── Helpers ──────────────────────────────────────────────────────────


def _load_accounts() -> list[dict]:
    if not ACCOUNTS_FILE.exists():
        return []
    accounts = []
    for line in ACCOUNTS_FILE.read_text().strip().splitlines():
        parts = line.strip().split("|")
        if len(parts) >= 4:
            accounts.append({
                "email": parts[0],
                "username": parts[1],
                "password": parts[2],
                "totp_secret": parts[3],
            })
    return accounts


# ── App ──────────────────────────────────────────────────────────────


class TuiTuiApp(App):
    TITLE = "TUITUI"
    SUB_TITLE = "GHReg — GitHub Account Manager"
    ENABLE_COMMAND_PALETTE = False

    CSS = """
    /* ── Global ─────────────────────────────────────────── */

    * {
        scrollbar-color: $accent 10%;
        scrollbar-color-hover: $accent 70%;
        scrollbar-background: $surface-darken-1;
        scrollbar-size-vertical: 1;
    }

    Screen {
        layout: vertical;
    }

    /* ── Section pattern (Posting-inspired) ──────────────── */

    .section {
        border: round $accent 30%;
        border-title-color: $text-muted;
        border-title-style: bold;
        border-title-align: left;
        background: $surface;
    }

    .section:focus-within {
        border: round $accent 90%;
        border-title-color: $text;
    }

    /* ── Layout ──────────────────────────────────────────── */

    #top-area {
        height: 1fr;
        min-height: 10;
    }

    #table-box {
        width: 1fr;
        padding: 0 1;
    }

    #sidebar {
        width: 26;
        padding: 1 1;
    }

    /* ── Buttons (compact, Posting-style) ─────────────── */

    #sidebar Button {
        width: 100%;
        height: 1;
        margin-bottom: 1;
        border: none;
        text-style: bold;
        padding: 0 1;
    }

    #sidebar #btn-login {
        background: $primary-muted;
        color: $text-primary;
    }
    #sidebar #btn-login:hover {
        background: $primary 30%;
    }

    #sidebar #btn-pat {
        background: $success-muted;
        color: $text-success;
    }
    #sidebar #btn-pat:hover {
        background: $success 30%;
    }

    #sidebar #btn-all {
        background: $warning-muted;
        color: $text-warning;
    }
    #sidebar #btn-all:hover {
        background: $warning 30%;
    }

    #sidebar #btn-quit {
        background: $error-muted;
        color: $text-error;
    }
    #sidebar #btn-quit:hover {
        background: $error 30%;
    }

    #sidebar #btn-check {
        background: $primary-muted;
        color: $text-primary;
    }
    #sidebar #btn-check:hover {
        background: $primary 30%;
    }

    #pat-input {
        height: 1;
        border: none;
        padding: 0;
        margin-bottom: 1;
    }
    #pat-input:focus {
        border-left: outer $accent;
    }

    Button:disabled {
        opacity: 35%;
    }

    /* ── Sidebar separator & input ───────────────────────── */

    .sidebar-sep {
        color: $text-muted;
        margin-top: 1;
        margin-bottom: 1;
        text-style: dim;
        content-align: center middle;
        width: 100%;
    }

    #invite-input {
        height: 3;
        max-height: 4;
        border: none;
        padding: 0;
        margin-bottom: 0;
    }

    #invite-input:focus {
        border-left: outer $accent;
    }

    /* ── Steps panel ─────────────────────────────────────── */

    #steps-panel {
        margin-top: 1;
        padding: 0;
        height: auto;
    }

    #status-bar {
        color: $text-muted;
        text-style: italic;
        width: 100%;
        content-align: center middle;
        margin-top: 1;
    }

    /* ── Log panel ───────────────────────────────────────── */

    #log-box {
        height: 14;
        min-height: 8;
        padding: 0 1;
    }

    /* ── DataTable (Posting-style) ────────────────────── */

    DataTable {
        height: 1fr;
        padding: 0 1;
    }

    DataTable:focus {
        padding: 0 1 0 0;
        border-left: inner $accent;
    }

    DataTable > .datatable--header {
        background: $surface;
        color: $text-success;
        text-style: bold;
    }

    DataTable > .datatable--cursor {
        background: $accent 15%;
        color: $text;
        text-style: bold;
    }

    DataTable:blur > .datatable--cursor {
        background: transparent;
    }

    DataTable > .datatable--even-row {
        background: $surface;
    }

    DataTable > .datatable--odd-row {
        background: $surface-darken-1;
    }

    /* ── RichLog ─────────────────────────────────────────── */

    RichLog {
        height: 1fr;
        padding: 0 1;
    }

    RichLog:focus {
        padding: 0 1 0 0;
        border-left: inner $accent;
    }
    """

    BINDINGS = [
        Binding("l", "login", "Login", show=True, priority=True),
        Binding("p", "pat", "PAT", show=True, priority=True),
        Binding("a", "login_all", "All", show=True, priority=True),
        Binding("o", "org_list", "Org", show=True, priority=True),
        Binding("i", "org_invite", "Invite", show=True, priority=True),
        Binding("k", "check_alive", "Check", show=True, priority=True),
        Binding("r", "reload", "Reload", show=True),
        Binding("c", "clear_log", "Clear", show=True),
        Binding("d", "toggle_dark", "Theme"),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self):
        super().__init__()
        self.theme = "monokai"
        self._accounts: list[dict] = []
        self._sessions: dict[str, cffi_requests.Session] = {}
        self._org_mgrs: dict[str, OrgManager] = {}
        self._busy = False
        self._steps: list[str] = []
        self._step_states: dict[int, str] = {}

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="top-area"):
            with Vertical(id="table-box", classes="section"):
                yield DataTable(id="accounts")
            with Vertical(id="sidebar", classes="section"):
                yield Button("  Login", id="btn-login", variant="primary")
                yield Button("  Create PAT", id="btn-pat", variant="success")
                yield Button("  Login All", id="btn-all", variant="warning")
                yield Static("── Org ──", classes="sidebar-sep")
                yield Button("  Org Info", id="btn-org", variant="primary")
                yield TextArea("", id="invite-input", language=None)
                yield Button("  Invite", id="btn-invite", variant="success")
                yield Static("── API ──", classes="sidebar-sep")
                yield Input("", placeholder="ghp_...", id="pat-input", password=True)
                yield Button("  Check Alive", id="btn-check", variant="primary")
                yield Static("─────────", classes="sidebar-sep")
                yield Button("  Quit", id="btn-quit", variant="error")
                yield Static(id="steps-panel")
                yield Static("Ready", id="status-bar")
        with Vertical(id="log-box", classes="section"):
            yield RichLog(id="log", highlight=True, markup=True)
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#table-box").border_title = "Accounts"
        self.query_one("#sidebar").border_title = "Actions"
        self.query_one("#log-box").border_title = "Log"

        self._reload_table()
        self.set_interval(5, self._reload_table)

        log = self.query_one("#log", RichLog)
        log.write(Text.assemble(
            ("  TUITUI  ", "bold reverse cyan"),
            ("  GitHub Account Manager  ", "dim italic"),
        ))
        log.write("")
        log.write("[dim]  L=Login  P=PAT  A=Login All  R=Reload  C=Clear  Q=Quit[/]")
        log.write("")

    # ── Table ────────────────────────────────────────────────────

    def _reload_table(self):
        self._accounts = _load_accounts()
        table = self.query_one("#accounts", DataTable)
        table.clear(columns=True)
        table.cursor_type = "row"
        table.zebra_stripes = True

        table.add_column("#", width=4, key="num")
        table.add_column("Username", width=14, key="user")
        table.add_column("Email", width=30, key="email")
        table.add_column("2FA", width=5, key="tfa")
        table.add_column("Status", width=14, key="status")

        for i, acc in enumerate(self._accounts, 1):
            tfa = "✓" if acc["totp_secret"] else "✗"
            table.add_row(
                str(i), acc["username"], acc["email"], tfa, "—",
                key=str(i),
            )

        self.query_one("#table-box").border_title = f"Accounts ({len(self._accounts)})"

    def _selected(self) -> dict | None:
        table = self.query_one("#accounts", DataTable)
        row = table.cursor_row
        if 0 <= row < len(self._accounts):
            return self._accounts[row]
        return None

    # ── Steps panel ──────────────────────────────────────────────

    def _set_steps(self, steps: list[str]):
        self._steps = steps
        self._step_states = {i: "pending" for i in range(len(steps))}
        self._render_steps()

    def _step(self, idx: int, state: str):
        self._step_states[idx] = state
        try:
            self.call_from_thread(self._render_steps)
        except Exception:
            self._render_steps()

    def _render_steps(self):
        lines = []
        for i, name in enumerate(self._steps):
            s = self._step_states.get(i, "pending")
            if s == "done":
                lines.append(f"[green] ✓ {name}[/]")
            elif s == "active":
                lines.append(f"[yellow] ▸ {name}[/]")
            elif s == "fail":
                lines.append(f"[red] ✗ {name}[/]")
            else:
                lines.append(f"[dim] ○ {name}[/]")
        self.query_one("#steps-panel", Static).update("\n".join(lines))

    # ── UI helpers ───────────────────────────────────────────────

    def _status(self, text: str):
        self.query_one("#status-bar", Static).update(text)

    def _log(self, text: str):
        self.query_one("#log", RichLog).write(text)

    def _row_status(self, username: str, status: str):
        table = self.query_one("#accounts", DataTable)
        for i, acc in enumerate(self._accounts):
            if acc["username"] == username:
                table.update_cell(str(i + 1), "status", status)
                break

    def _set_busy(self, busy: bool):
        self._busy = busy
        for btn_id in ("btn-login", "btn-pat", "btn-all", "btn-org", "btn-invite", "btn-check"):
            self.query_one(f"#{btn_id}", Button).disabled = busy

    # ── Actions ──────────────────────────────────────────────────

    def action_login(self) -> None:
        acc = self._selected()
        if acc and not self._busy:
            self._run_login(acc)

    def action_pat(self) -> None:
        acc = self._selected()
        if not acc or self._busy:
            return
        if acc["username"] not in self._sessions:
            self._log(f"[yellow]⚠ Login {acc['username']} first![/]")
            return
        self._run_pat(acc)

    def action_login_all(self) -> None:
        if not self._busy:
            self._run_login_all()

    def action_org_list(self) -> None:
        acc = self._selected()
        if acc and not self._busy:
            if acc["username"] not in self._sessions:
                self._log(f"[yellow]⚠ Login {acc['username']} first![/]")
                return
            self._run_org_info(acc)

    def action_org_invite(self) -> None:
        acc = self._selected()
        if not acc or self._busy:
            return
        if acc["username"] not in self._sessions:
            self._log(f"[yellow]⚠ Login {acc['username']} first![/]")
            return
        usernames = self.query_one("#invite-input", TextArea).text.strip()
        if not usernames:
            self._log("[yellow]⚠ Enter username(s) in the text area! (one per line, or comma/space separated)[/]")
            self.query_one("#invite-input", TextArea).focus()
            return
        self._run_org_invite(acc, usernames)

    def action_reload(self) -> None:
        self._reload_table()
        self._log("[cyan]↻ Accounts reloaded[/]")

    def action_check_alive(self) -> None:
        if not self._busy:
            pat = self.query_one("#pat-input", Input).value.strip()
            if not pat:
                self._log("[yellow]⚠ Enter PAT token first![/]")
                self.query_one("#pat-input", Input).focus()
                return
            self._run_check_alive(pat)

    def action_clear_log(self) -> None:
        self.query_one("#log", RichLog).clear()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        match event.button.id:
            case "btn-login": self.action_login()
            case "btn-pat": self.action_pat()
            case "btn-all": self.action_login_all()
            case "btn-org": self.action_org_list()
            case "btn-invite": self.action_org_invite()
            case "btn-check": self.action_check_alive()
            case "btn-quit": self.action_quit()

    def on_data_table_row_selected(self, event: DataTable.RowSelected) -> None:
        acc = self._selected()
        if acc and not self._busy:
            self._run_login(acc)

    # ── Workers ──────────────────────────────────────────────────

    @work(thread=True, exclusive=True, group="action")
    def _run_login(self, acc: dict) -> None:
        worker = get_current_worker()
        username = acc["username"]
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._set_steps, ["Login", "2FA"])
        self.call_from_thread(self._status, f"⏳ {username}...")
        self.call_from_thread(self._row_status, username, "⏳ ...")
        self.call_from_thread(self._log, f"\n[bold cyan]━━━ Login: {username} ━━━[/]")

        self._step(0, "active")
        session = cffi_requests.Session(impersonate="chrome")
        writer = _LogWriter(self, "log")

        with redirect_stdout(writer):
            ok = github_login(session, acc["email"], acc["password"], acc["totp_secret"])
        writer.flush()

        if worker.is_cancelled:
            return

        if ok:
            self._sessions[username] = session
            self._step(0, "done")
            self._step(1, "done")
            self.call_from_thread(self._log, f"[bold green]✓ Logged in: {username}[/]")
            self.call_from_thread(self._row_status, username, "✓ Logged in")
            self.call_from_thread(self._status, f"✓ {username}")
        else:
            self._step(0, "fail")
            self.call_from_thread(self._log, f"[bold red]✗ Failed: {username}[/]")
            self.call_from_thread(self._row_status, username, "✗ Failed")
            self.call_from_thread(self._status, f"✗ {username}")

        self.call_from_thread(self._set_busy, False)

    @work(thread=True, exclusive=True, group="action")
    def _run_pat(self, acc: dict) -> None:
        worker = get_current_worker()
        username = acc["username"]
        session = self._sessions.get(username)
        if not session:
            return

        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._set_steps, ["Sudo", "Create PAT", "Save"])
        self.call_from_thread(self._status, f"⏳ PAT {username}...")
        self.call_from_thread(self._log, f"\n[bold yellow]━━━ PAT: {username} ━━━[/]")

        writer = _LogWriter(self, "log")

        # Sudo
        self._step(0, "active")
        with redirect_stdout(writer):
            sudo_ok = github_sudo(session, acc["password"])
        writer.flush()

        if worker.is_cancelled:
            return

        self._step(0, "done" if sudo_ok else "fail")
        if sudo_ok:
            self.call_from_thread(self._log, "[green]✓ Sudo[/]")
        else:
            self.call_from_thread(self._log, "[yellow]! Sudo failed, trying...[/]")

        # Create PAT
        self._step(1, "active")
        token_name = f"{username}-pat"
        preset = "copilot"

        with redirect_stdout(writer):
            token = create_pat(
                session,
                token_name=token_name,
                password=acc["password"],
                expires_days=30,
                preset=preset,
            )
        writer.flush()

        if worker.is_cancelled:
            return

        if token:
            self._step(1, "done")
            short = f"{token[:20]}...{token[-6:]}"
            self.call_from_thread(self._log, f"[bold green]✓ PAT: {short}[/]")

            # Save
            self._step(2, "active")
            save_token(token, token_name, TOKENS_FILE, username=username)
            self._step(2, "done")
            self.call_from_thread(self._log, f"[green]✓ Saved → {TOKENS_FILE}[/]")
            self.call_from_thread(self._row_status, username, "✓ PAT done")
            self.call_from_thread(self._status, f"✓ {username} PAT")
        else:
            self._step(1, "fail")
            self.call_from_thread(self._log, "[bold red]✗ PAT failed[/]")
            self.call_from_thread(self._row_status, username, "✗ PAT fail")
            self.call_from_thread(self._status, f"✗ {username}")

        self.call_from_thread(self._set_busy, False)

    @work(thread=True, exclusive=True, group="action")
    def _run_login_all(self) -> None:
        worker = get_current_worker()
        total = len(self._accounts)
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._log, f"\n[bold cyan]━━━ Login All ({total}) ━━━[/]")

        steps = [acc["username"] for acc in self._accounts]
        self.call_from_thread(self._set_steps, steps)

        writer = _LogWriter(self, "log")
        ok_count = 0

        for i, acc in enumerate(self._accounts):
            if worker.is_cancelled:
                break

            username = acc["username"]
            self.call_from_thread(self._status, f"[{i+1}/{total}] {username}...")
            self.call_from_thread(self._row_status, username, "⏳ ...")
            self._step(i, "active")

            session = cffi_requests.Session(impersonate="chrome")
            with redirect_stdout(writer):
                ok = github_login(session, acc["email"], acc["password"], acc["totp_secret"])
            writer.flush()

            if ok:
                self._sessions[username] = session
                self._step(i, "done")
                self.call_from_thread(self._row_status, username, "✓ Logged in")
                ok_count += 1
            else:
                self._step(i, "fail")
                self.call_from_thread(self._row_status, username, "✗ Failed")

        self.call_from_thread(self._log, f"\n[bold]Done: {ok_count}/{total}[/]")
        self.call_from_thread(self._status, f"✓ {ok_count}/{total}")
        self.call_from_thread(self._set_busy, False)

    # ── API Workers ──────────────────────────────────────────────

    GRAPHQL_BATCH = 50   # users per GraphQL query
    GRAPHQL_WORKERS = 30  # max concurrent threads

    @staticmethod
    def _graphql_request(pat: str, query: str) -> dict:
        """Thread-safe HTTP via urllib (releases GIL during I/O)."""
        req = urllib.request.Request(
            "https://api.github.com/graphql",
            data=json.dumps({"query": query}).encode(),
            headers={
                "Authorization": f"bearer {pat}",
                "Content-Type": "application/json",
                "User-Agent": "GHReg/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read())
        except Exception as exc:
            return {"error": str(exc)}

    @work(thread=True, exclusive=True, group="action")
    def _run_check_alive(self, pat: str) -> None:
        worker = get_current_worker()
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._log, "\n[bold cyan]━━━ Check Alive ━━━[/]")

        usernames = [acc["username"] for acc in self._accounts]
        total = len(usernames)
        self.call_from_thread(self._set_steps, usernames)
        self.call_from_thread(self._status, f"⏳ Checking {total} accounts...")

        for i in range(total):
            self._step(i, "active")

        # Split into batches
        batches: list[tuple[int, list[tuple[int, str]]]] = []
        indexed = list(enumerate(usernames))
        for b, start in enumerate(range(0, total, self.GRAPHQL_BATCH)):
            batches.append((b + 1, indexed[start : start + self.GRAPHQL_BATCH]))

        n_batches = len(batches)
        self.call_from_thread(
            self._log,
            f"[dim]{total} users → {n_batches} batch(es) × {self.GRAPHQL_BATCH}, {self.GRAPHQL_WORKERS} threads[/]",
        )

        alive = 0
        dead = 0
        batch_done = 0
        results_lock = Lock()
        t_start = time.monotonic()

        def _check_batch(batch_id: int, batch: list[tuple[int, str]]) -> tuple[int, dict, float]:
            aliases = [
                f'u{idx}: user(login: "{u}") {{ __typename }}'
                for idx, u in batch
            ]
            query = "query { " + " ".join(aliases) + " rateLimit { remaining } }"
            t0 = time.monotonic()
            data = TuiTuiApp._graphql_request(pat, query)
            elapsed = time.monotonic() - t0
            return batch_id, data, elapsed

        max_workers = min(n_batches, self.GRAPHQL_WORKERS)
        with ThreadPoolExecutor(max_workers=max_workers) as pool:
            future_to_batch = {
                pool.submit(_check_batch, bid, batch): batch
                for bid, batch in batches
            }

            for future in as_completed(future_to_batch):
                if worker.is_cancelled:
                    return

                batch = future_to_batch[future]
                try:
                    batch_id, data, elapsed = future.result()
                except Exception as exc:
                    for idx, u in batch:
                        self._step(idx, "fail")
                        self.call_from_thread(self._row_status, u, "✗ Error")
                    with results_lock:
                        dead += len(batch)
                        batch_done += 1
                    self.call_from_thread(self._log, f"[red]✗ Batch #{batch_id} error: {exc}[/]")
                    continue

                if "data" not in data:
                    err = data.get("message", data.get("error", "Unknown"))
                    for idx, u in batch:
                        self._step(idx, "fail")
                        self.call_from_thread(self._row_status, u, "✗ Error")
                    with results_lock:
                        dead += len(batch)
                        batch_done += 1
                    self.call_from_thread(self._log, f"[red]✗ Batch #{batch_id} API error: {err}[/]")
                    continue

                result = data["data"]
                remaining = result.get("rateLimit", {}).get("remaining", "?")
                b_dead = 0

                for idx, u in batch:
                    if result.get(f"u{idx}"):
                        self._step(idx, "done")
                        self.call_from_thread(self._row_status, u, "✓ Alive")
                        with results_lock:
                            alive += 1
                    else:
                        self._step(idx, "fail")
                        self.call_from_thread(self._row_status, u, "✗ Dead")
                        self.call_from_thread(self._log, f"[red]  ✗ {u} — dead/suspended[/]")
                        with results_lock:
                            dead += 1
                        b_dead += 1

                with results_lock:
                    batch_done += 1
                dead_info = f" ({b_dead} dead)" if b_dead else ""
                self.call_from_thread(
                    self._log,
                    f"[dim]  batch #{batch_id} done — {elapsed:.1f}s — remaining: {remaining}{dead_info}[/]",
                )

        t_total = time.monotonic() - t_start
        self.call_from_thread(self._log, f"\n[bold]Result: {alive} alive, {dead} dead / {total} total ({t_total:.1f}s)[/]")
        self.call_from_thread(self._status, f"✓ {alive} alive / {dead} dead")
        self.call_from_thread(self._set_busy, False)

    # ── Org Workers ─────────────────────────────────────────────

    def _get_org_mgr(self, username: str) -> OrgManager | None:
        session = self._sessions.get(username)
        if not session:
            return None
        if username not in self._org_mgrs:
            self._org_mgrs[username] = OrgManager(session)
        return self._org_mgrs[username]

    @work(thread=True, exclusive=True, group="action")
    def _run_org_info(self, acc: dict) -> None:
        worker = get_current_worker()
        username = acc["username"]
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._set_steps, ["List orgs", "Members", "Pending"])
        self.call_from_thread(self._status, f"⏳ Org {username}...")
        self.call_from_thread(self._log, f"\n[bold magenta]━━━ Org: {username} ━━━[/]")

        mgr = self._get_org_mgr(username)
        if not mgr:
            self.call_from_thread(self._set_busy, False)
            return

        writer = _LogWriter(self, "log")

        # List orgs
        self._step(0, "active")
        with redirect_stdout(writer):
            orgs = mgr.list_orgs()
        writer.flush()

        if worker.is_cancelled:
            return

        self._step(0, "done")
        if orgs:
            self.call_from_thread(self._log, f"[green]Orgs: {', '.join(orgs)}[/]")
        else:
            self.call_from_thread(self._log, "[dim]No orgs found[/]")
            self.call_from_thread(self._set_busy, False)
            return

        org = orgs[0]

        # List members
        self._step(1, "active")
        with redirect_stdout(writer):
            members = mgr.list_members(org)
        writer.flush()

        if worker.is_cancelled:
            return

        self._step(1, "done")
        member_names = [m["username"] for m in members]
        self.call_from_thread(self._log, f"[cyan]Members ({len(members)}): {', '.join(member_names)}[/]")

        # List pending
        self._step(2, "active")
        with redirect_stdout(writer):
            pending = mgr.list_pending(org)
        writer.flush()

        self._step(2, "done")
        if pending:
            self.call_from_thread(self._log, f"[yellow]Pending ({len(pending)}): {', '.join(pending)}[/]")
        else:
            self.call_from_thread(self._log, "[dim]No pending invitations[/]")

        self.call_from_thread(self._status, f"✓ {org}: {len(members)} members")
        self.call_from_thread(self._set_busy, False)

    @work(thread=True, exclusive=True, group="action")
    def _run_org_invite(self, acc: dict, usernames_str: str) -> None:
        worker = get_current_worker()
        username = acc["username"]
        self.call_from_thread(self._set_busy, True)

        mgr = self._get_org_mgr(username)
        if not mgr:
            self.call_from_thread(self._set_busy, False)
            return

        # Get first org
        orgs = mgr.list_orgs()
        if not orgs:
            self.call_from_thread(self._log, "[red]No orgs found![/]")
            self.call_from_thread(self._set_busy, False)
            return

        org = orgs[0]
        raw = [u.strip() for u in usernames_str.replace(",", " ").replace("\n", " ").split() if u.strip()]
        targets = [u.split("@")[0] if "@" in u else u for u in raw]
        self.call_from_thread(self._set_steps, targets)
        self.call_from_thread(self._log, f"\n[bold magenta]━━━ Invite to {org} ━━━[/]")

        writer = _LogWriter(self, "log")
        ok_count = 0

        for i, target in enumerate(targets):
            if worker.is_cancelled:
                break

            self.call_from_thread(self._status, f"Inviting {target}...")
            self._step(i, "active")

            with redirect_stdout(writer):
                ok = mgr.invite_user(org, target)
            writer.flush()

            if ok:
                self._step(i, "done")
                self.call_from_thread(self._log, f"[green]✓ Invited {target}[/]")
                ok_count += 1
            else:
                self._step(i, "fail")
                self.call_from_thread(self._log, f"[red]✗ Failed {target}[/]")

        self.call_from_thread(self._log, f"\n[bold]Invited: {ok_count}/{len(targets)}[/]")
        self.call_from_thread(self._status, f"✓ {ok_count}/{len(targets)} invited")
        self.call_from_thread(self._set_busy, False)
        self.call_from_thread(self._clear_invite_input)

    def _clear_invite_input(self):
        self.query_one("#invite-input", TextArea).clear()


# ── Entry ────────────────────────────────────────────────────────────


def main():
    app = TuiTuiApp()
    app.run()


if __name__ == "__main__":
    main()
