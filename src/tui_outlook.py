"""Outlook Mail TUI — Read inbox via Microsoft Graph API."""

import io
import re
from pathlib import Path
from threading import Lock

from textual import work
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.screen import ModalScreen
from textual.widgets import (
    Button, DataTable, Footer, Header, RichLog, Static,
)
from textual.worker import get_current_worker

from .outlook import OutlookClient, html_to_text

THEME_FILE = Path(__file__).parent.parent / ".theme"
ACCOUNTS_FILE = Path(__file__).parent.parent / "data" / "outlook.txt"

ALL_THEMES = [
    "dracula", "catppuccin-mocha", "catppuccin-macchiato", "catppuccin-frappe",
    "catppuccin-latte", "tokyo-night", "nord", "gruvbox", "monokai",
    "rose-pine", "rose-pine-moon", "rose-pine-dawn", "solarized-dark",
    "solarized-light", "atom-one-dark", "atom-one-light", "flexoki",
    "textual-dark", "textual-light", "textual-ansi",
]


def _load_accounts() -> list[str]:
    """Load account lines from outlook.txt. Each line: email|pass|refresh|client_id"""
    if not ACCOUNTS_FILE.exists():
        return []
    return [l.strip() for l in ACCOUNTS_FILE.read_text().strip().splitlines() if "|" in l]


# ── Account picker screen ─────────────────────────────────────


class AccountPickerScreen(ModalScreen[str | None]):
    """Pick an Outlook account from the list."""

    CSS = """
    AccountPickerScreen {
        align: center middle;
    }
    #picker {
        width: 70;
        height: auto;
        max-height: 20;
        border: round $accent;
        background: $surface;
        padding: 1 2;
    }
    #picker DataTable {
        height: auto;
        max-height: 14;
    }
    #picker Static {
        margin-bottom: 1;
    }
    """

    BINDINGS = [Binding("escape", "cancel", show=False)]

    def __init__(self, accounts: list[str]) -> None:
        super().__init__()
        self._accounts = accounts

    def compose(self) -> ComposeResult:
        with Vertical(id="picker"):
            yield Static("[bold]Select Outlook Account[/]")
            yield DataTable(id="acct-table", zebra_stripes=True, cursor_type="row")

    def on_mount(self) -> None:
        table = self.query_one("#acct-table", DataTable)
        table.add_columns("#", "Email")
        for i, line in enumerate(self._accounts, 1):
            email = line.split("|")[0]
            table.add_row(str(i), email, key=str(i - 1))
        table.focus()

    def on_data_table_row_selected(self, event: DataTable.RowSelected) -> None:
        idx = int(event.row_key.value)
        self.dismiss(self._accounts[idx])

    def action_cancel(self) -> None:
        self.dismiss(None)


# ── App ───────────────────────────────────────────────────────


class OutlookApp(App):
    TITLE = "Outlook Mail"
    SUB_TITLE = "Microsoft Graph API"
    ENABLE_COMMAND_PALETTE = False

    CSS = """
    * {
        scrollbar-color: $accent 10%;
        scrollbar-color-hover: $accent 70%;
        scrollbar-background: $surface-darken-1;
        scrollbar-size-vertical: 1;
    }

    Screen { layout: vertical; }

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

    /* ── Layout ──────────────────────────────── */

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

    /* ── Buttons ─────────────────────────────── */

    #sidebar Button {
        width: 100%;
        height: 1;
        margin-bottom: 1;
        border: none;
        text-style: bold;
        padding: 0 1;
    }

    #btn-read {
        background: $primary-muted;
        color: $text-primary;
    }
    #btn-read:hover { background: $primary 30%; }

    #btn-refresh {
        background: $success-muted;
        color: $text-success;
    }
    #btn-refresh:hover { background: $success 30%; }

    #btn-switch {
        background: $secondary-muted;
        color: $text;
    }
    #btn-switch:hover { background: $secondary 30%; }

    #btn-next {
        background: $warning-muted;
        color: $text-warning;
    }
    #btn-next:hover { background: $warning 30%; }

    #btn-prev {
        background: $accent-muted;
        color: $text;
    }
    #btn-prev:hover { background: $accent 30%; }

    Button:disabled { opacity: 35%; }

    .sidebar-sep {
        color: $text-muted;
        margin-top: 1;
        margin-bottom: 1;
        text-style: dim;
        content-align: center middle;
        width: 100%;
    }

    #info-panel {
        margin-top: 1;
        padding: 0;
        height: auto;
    }

    #theme-bar {
        height: 1;
        color: $text-disabled;
        content-align: center middle;
        padding: 0 1;
    }

    /* ── Mail viewer ─────────────────────────── */

    #mail-box {
        height: 16;
        min-height: 8;
        padding: 0 1;
    }

    /* ── DataTable ────────────────────────────── */

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

    /* ── RichLog ──────────────────────────────── */

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
        Binding("r", "refresh", "Refresh", show=True, priority=True),
        Binding("s", "switch_account", "Switch", show=True, priority=True),
        Binding("n", "next_page", "Next", show=True, priority=True),
        Binding("p", "prev_page", "Prev", show=True, priority=True),
        Binding("d", "next_theme", "Theme+", show=False),
        Binding("shift+d", "prev_theme", "Theme-", show=False),
        Binding("x", "clear_log", "Clear", show=True),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self, account: str | None = None):
        super().__init__()
        saved = THEME_FILE.read_text().strip() if THEME_FILE.exists() else ""
        self._theme_idx = ALL_THEMES.index(saved) if saved in ALL_THEMES else 0
        self.theme = ALL_THEMES[self._theme_idx]
        self._account: str | None = account
        self._accounts = _load_accounts()
        self._client: OutlookClient | None = None
        self._busy = False
        self._page = 0
        self._page_size = 25
        self._total = 0

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="top-area"):
            with Vertical(id="table-box", classes="section"):
                yield DataTable(id="inbox-table", zebra_stripes=True, cursor_type="row")
            with Vertical(id="sidebar", classes="section"):
                yield Button("  Read Email", id="btn-read")
                yield Button("  Refresh", id="btn-refresh")
                yield Button("  Switch Account", id="btn-switch")
                yield Static("────────────────────", classes="sidebar-sep")
                yield Button("  Next Page", id="btn-next")
                yield Button("  Prev Page", id="btn-prev")
                yield Static(id="info-panel")
                yield Static("", id="theme-bar")
        with Vertical(id="mail-box", classes="section"):
            yield RichLog(id="log", highlight=True, markup=True)
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#table-box").border_title = "Inbox"
        self.query_one("#sidebar").border_title = "Actions"
        self.query_one("#mail-box").border_title = "Mail"

        table = self.query_one("#inbox-table", DataTable)
        table.add_columns(" ", "From", "Subject", "Date")
        table.focus()

        self._render_theme_bar()

        if self._account:
            self._log("[bold]Connecting to Outlook...[/]")
            self._init_client()
        elif self._accounts:
            self._show_picker()
        else:
            self._log(f"[red]No accounts found in {ACCOUNTS_FILE}[/]")

    def _show_picker(self) -> None:
        self.push_screen(AccountPickerScreen(self._accounts), self._on_account_picked)

    def _on_account_picked(self, account: str | None) -> None:
        if not account:
            if not self._client:
                self._log("[yellow]No account selected[/]")
            return
        self._account = account
        email = account.split("|")[0]
        self._page = 0
        self._total = 0
        self._client = None
        table = self.query_one("#inbox-table", DataTable)
        table.clear()
        self.query_one("#log", RichLog).clear()
        self._log(f"[bold]Connecting to {email}...[/]")
        self._init_client()

    # ── Switch account ──────────────────────────────────

    def action_switch_account(self) -> None:
        if self._busy:
            return
        if not self._accounts:
            self._log(f"[red]No accounts in {ACCOUNTS_FILE}[/]")
            return
        self._show_picker()

    # ── Button handler ────────────────────────────────────

    def on_button_pressed(self, event: Button.Pressed) -> None:
        actions = {
            "btn-read": self.action_read_mail,
            "btn-refresh": self.action_refresh,
            "btn-switch": self.action_switch_account,
            "btn-next": self.action_next_page,
            "btn-prev": self.action_prev_page,
        }
        action = actions.get(event.button.id)
        if action:
            action()

    # ── Client init ──────────────────────────────────────

    @work(thread=True, exclusive=True, group="init")
    def _init_client(self) -> None:
        try:
            parts = self._account.split("|")
            self._client = OutlookClient(parts[0], parts[1], parts[2], parts[3])
            self.call_from_thread(
                self._log,
                f"[green]Connected![/] {self._client.display_name} [dim]<{self._client.email}>[/]"
            )
            self.call_from_thread(self._load_inbox)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]Connection failed: {e}[/]")

    # ── Inbox ────────────────────────────────────────────

    def _load_inbox(self) -> None:
        if not self._client:
            return
        self._do_load_inbox()

    @work(thread=True, exclusive=True, group="action")
    def _do_load_inbox(self) -> None:
        self.call_from_thread(self._set_busy, True)
        try:
            skip = self._page * self._page_size
            msgs, total = self._client.list_messages(top=self._page_size, skip=skip)
            self._total = total
            self.call_from_thread(self._fill_table, msgs)
            self.call_from_thread(self._render_info)
            page_num = self._page + 1
            total_pages = max(1, (total + self._page_size - 1) // self._page_size)
            self.call_from_thread(
                self._log,
                f"[green]Loaded[/] page {page_num}/{total_pages} — {total} total messages"
            )
        except Exception as e:
            self.call_from_thread(self._log, f"[red]Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)

    def _fill_table(self, msgs) -> None:
        table = self.query_one("#inbox-table", DataTable)
        table.clear()
        for m in msgs:
            read_mark = "[dim]+[/]" if m.is_read else "[bold]*[/]"
            sender = m.sender_name or m.sender_email
            if len(sender) > 24:
                sender = sender[:22] + ".."
            subj = m.subject
            if len(subj) > 50:
                subj = subj[:48] + ".."
            # format date
            date = m.date
            if "T" in date:
                date = date.split("T")[0] + " " + date.split("T")[1][:5]
            table.add_row(read_mark, sender, subj, date, key=m.id)

    def _get_selected_id(self) -> str | None:
        table = self.query_one("#inbox-table", DataTable)
        if table.row_count == 0:
            return None
        try:
            row_key, _ = table.coordinate_to_cell_key(table.cursor_coordinate)
            return str(row_key)
        except Exception:
            return None

    # ── Read mail ────────────────────────────────────────

    def action_read_mail(self) -> None:
        if self._busy or not self._client:
            return
        msg_id = self._get_selected_id()
        if not msg_id:
            self._log("[yellow]No message selected[/]")
            return
        self._do_read_mail(msg_id)

    def on_data_table_row_selected(self, event: DataTable.RowSelected) -> None:
        msg_id = str(event.row_key.value)
        if not self._busy and self._client:
            self._do_read_mail(msg_id)

    @work(thread=True, exclusive=True, group="action")
    def _do_read_mail(self, msg_id: str) -> None:
        self.call_from_thread(self._set_busy, True)
        try:
            msg = self._client.get_message(msg_id)
            self._client.mark_read(msg_id)

            self.call_from_thread(self._show_message, msg)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)

    def _show_message(self, msg) -> None:
        log = self.query_one("#log", RichLog)
        log.clear()
        log.write(f"[bold]{msg.subject}[/]")
        log.write(f"[dim]From:[/]  {msg.sender_name} [dim]<{msg.sender_email}>[/]")
        log.write(f"[dim]Date:[/]  {msg.date}")
        log.write("─" * 60)
        # show plain text body, split into lines
        body = msg.body_text or msg.preview
        for line in body.splitlines():
            log.write(line)

    # ── Pagination ───────────────────────────────────────

    def action_next_page(self) -> None:
        if self._busy or not self._client:
            return
        max_page = max(0, (self._total - 1) // self._page_size)
        if self._page < max_page:
            self._page += 1
            self._load_inbox()

    def action_prev_page(self) -> None:
        if self._busy or not self._client:
            return
        if self._page > 0:
            self._page -= 1
            self._load_inbox()

    # ── Refresh ──────────────────────────────────────────

    def action_refresh(self) -> None:
        if self._busy or not self._client:
            return
        self._page = 0
        self._load_inbox()

    # ── Info panel ───────────────────────────────────────

    def _render_info(self) -> None:
        if not self._client:
            self.query_one("#info-panel", Static).update("[dim]Not connected[/]")
            return
        page_num = self._page + 1
        total_pages = max(1, (self._total + self._page_size - 1) // self._page_size)
        lines = [
            f"[dim]User:[/]  [bold]{self._client.display_name}[/]",
            f"[dim]Email:[/] [bold]{self._client.email}[/]",
            f"[dim]Total:[/] [bold]{self._total}[/] messages",
            f"[dim]Page:[/]  [bold]{page_num}/{total_pages}[/]",
        ]
        self.query_one("#info-panel", Static).update("\n".join(lines))

    # ── Logging ──────────────────────────────────────────

    def _log(self, text: str) -> None:
        self.query_one("#log", RichLog).write(text)

    def action_clear_log(self) -> None:
        self.query_one("#log", RichLog).clear()

    # ── Busy state ───────────────────────────────────────

    def _set_busy(self, busy: bool) -> None:
        self._busy = busy
        for btn_id in ("btn-read", "btn-refresh", "btn-switch", "btn-next", "btn-prev"):
            try:
                self.query_one(f"#{btn_id}", Button).disabled = busy
            except Exception:
                pass

    # ── Theme ────────────────────────────────────────────

    def _apply_theme(self) -> None:
        self.theme = ALL_THEMES[self._theme_idx]
        THEME_FILE.write_text(self.theme)
        self._render_theme_bar()

    def action_next_theme(self) -> None:
        self._theme_idx = (self._theme_idx + 1) % len(ALL_THEMES)
        self._apply_theme()

    def action_prev_theme(self) -> None:
        self._theme_idx = (self._theme_idx - 1) % len(ALL_THEMES)
        self._apply_theme()

    def _render_theme_bar(self) -> None:
        self.query_one("#theme-bar", Static).update(
            f"[dim]◀ {self.theme} ({self._theme_idx + 1}/{len(ALL_THEMES)}) ▶[/dim]"
        )


# ── Entry point ───────────────────────────────────────────────


def main():
    import sys
    account = sys.argv[1] if len(sys.argv) > 1 else None

    if "--serve" in sys.argv or "--web" in sys.argv:
        import webbrowser
        from textual_serve.server import Server

        # command must NOT include --serve to avoid recursion
        cmd = [sys.executable, "-m", "src.tui_outlook"]
        if account:
            cmd.append(account)
        port = 8000
        for arg in sys.argv:
            if arg.startswith("--port="):
                port = int(arg.split("=", 1)[1])
        import socket
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            while s.connect_ex(("127.0.0.1", port)) == 0:
                port += 1
        url = f"http://localhost:{port}"
        print(f"Serving on {url}")
        webbrowser.open(url)
        server = Server(command=" ".join(cmd), host="localhost", port=port)
        server.serve()
    else:
        app = OutlookApp(account)
        app.run()


if __name__ == "__main__":
    main()
