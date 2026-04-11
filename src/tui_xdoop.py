"""xDoop Mail TUI — Manage temp emails via Textual interface."""

import io
import sys
from pathlib import Path
from threading import Lock

from textual import work
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.screen import ModalScreen
from textual.widgets import (
    Button, DataTable, Footer, Header, Input, Label, RichLog, Static,
)
from textual.worker import get_current_worker

from .xdoop import XDoopMail

THEME_FILE = Path(__file__).parent.parent / ".theme"

ALL_THEMES = [
    "dracula", "catppuccin-mocha", "catppuccin-macchiato", "catppuccin-frappe",
    "catppuccin-latte", "tokyo-night", "nord", "gruvbox", "monokai",
    "rose-pine", "rose-pine-moon", "rose-pine-dawn", "solarized-dark",
    "solarized-light", "atom-one-dark", "atom-one-light", "flexoki",
    "textual-dark", "textual-light", "textual-ansi",
]


# ── Log Writer ────────────────────────────────────────────────────


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


# ── Modal Screens ─────────────────────────────────────────────────


class CreateEmailScreen(ModalScreen[str | None]):
    """Single input modal for creating a custom email."""

    CSS = """
    CreateEmailScreen {
        align: center middle;
    }
    #dialog {
        width: 50;
        height: auto;
        border: round $accent;
        background: $surface;
        padding: 1 2;
    }
    #dialog Label {
        margin-bottom: 1;
    }
    #dialog Input {
        margin-bottom: 1;
    }
    #dialog-buttons {
        height: 3;
        align-horizontal: right;
    }
    #dialog-buttons Button {
        margin-left: 1;
    }
    """

    BINDINGS = [Binding("escape", "cancel", show=False)]

    def compose(self) -> ComposeResult:
        with Vertical(id="dialog"):
            yield Label("[bold]Create Custom Email[/]")
            yield Input(placeholder="username (e.g. mrskuromi)", id="input-username")
            with Horizontal(id="dialog-buttons"):
                yield Button("Cancel", id="btn-cancel", variant="default")
                yield Button("Create", id="btn-ok", variant="success")

    def on_mount(self) -> None:
        self.query_one("#input-username", Input).focus()

    def on_input_submitted(self, event: Input.Submitted) -> None:
        val = event.value.strip()
        if val:
            self.dismiss(val)

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "btn-ok":
            val = self.query_one("#input-username", Input).value.strip()
            if val:
                self.dismiss(val)
        else:
            self.dismiss(None)

    def action_cancel(self) -> None:
        self.dismiss(None)


class BatchEmailScreen(ModalScreen[tuple[str, int, int] | None]):
    """Modal for batch email creation."""

    CSS = """
    BatchEmailScreen {
        align: center middle;
    }
    #dialog {
        width: 55;
        height: auto;
        border: round $accent;
        background: $surface;
        padding: 1 2;
    }
    #dialog Label {
        margin-bottom: 1;
    }
    #dialog Input {
        margin-bottom: 1;
    }
    #dialog-buttons {
        height: 3;
        align-horizontal: right;
    }
    #dialog-buttons Button {
        margin-left: 1;
    }
    .field-row {
        height: auto;
        margin-bottom: 1;
    }
    .field-label {
        width: 10;
        height: 1;
        content-align: left middle;
    }
    .field-label Label {
        margin-bottom: 0;
    }
    """

    BINDINGS = [Binding("escape", "cancel", show=False)]

    def compose(self) -> ComposeResult:
        with Vertical(id="dialog"):
            yield Label("[bold]Create Batch Emails[/]")
            yield Label("[dim]prefix1, prefix2, ... prefixN[/]")
            with Horizontal(classes="field-row"):
                with Vertical(classes="field-label"):
                    yield Label("Prefix")
                yield Input(placeholder="mrskuromi", id="input-prefix", value="mrskuromi")
            with Horizontal(classes="field-row"):
                with Vertical(classes="field-label"):
                    yield Label("Start")
                yield Input(placeholder="1", id="input-start", value="1")
            with Horizontal(classes="field-row"):
                with Vertical(classes="field-label"):
                    yield Label("End")
                yield Input(placeholder="1000", id="input-end", value="1000")
            with Horizontal(id="dialog-buttons"):
                yield Button("Cancel", id="btn-cancel", variant="default")
                yield Button("Start Batch", id="btn-ok", variant="success")

    def on_mount(self) -> None:
        self.query_one("#input-prefix", Input).focus()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "btn-ok":
            self._submit()
        else:
            self.dismiss(None)

    def _submit(self) -> None:
        prefix = self.query_one("#input-prefix", Input).value.strip()
        try:
            start = int(self.query_one("#input-start", Input).value.strip())
            end = int(self.query_one("#input-end", Input).value.strip())
        except ValueError:
            return
        if prefix and start <= end:
            self.dismiss((prefix, start, end))

    def action_cancel(self) -> None:
        self.dismiss(None)


# ── Main App ──────────────────────────────────────────────────────


class XDoopApp(App):
    TITLE = "xDoop Mail"
    SUB_TITLE = "Temp Email Manager"
    ENABLE_COMMAND_PALETTE = False

    CSS = """
    * {
        scrollbar-color: $accent 10%;
        scrollbar-color-hover: $accent 70%;
        scrollbar-background: $surface-darken-1;
        scrollbar-size-vertical: 1;
    }

    Screen {
        layout: vertical;
    }

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

    /* ── Layout ───────────────────────────────────────── */

    #top-area {
        height: 1fr;
        min-height: 12;
    }

    #table-box {
        width: 1fr;
        padding: 0 1;
    }

    #sidebar {
        width: 28;
        padding: 1 1;
    }

    /* ── Buttons ──────────────────────────────────────── */

    #sidebar Button {
        width: 100%;
        height: 1;
        margin-bottom: 1;
        border: none;
        text-style: bold;
        padding: 0 1;
    }

    #btn-custom {
        background: $primary-muted;
        color: $text-primary;
    }
    #btn-custom:hover {
        background: $primary 30%;
    }

    #btn-batch {
        background: $warning-muted;
        color: $text-warning;
    }
    #btn-batch:hover {
        background: $warning 30%;
    }

    #btn-random {
        background: $success-muted;
        color: $text-success;
    }
    #btn-random:hover {
        background: $success 30%;
    }

    #btn-delete {
        background: $error-muted;
        color: $text-error;
    }
    #btn-delete:hover {
        background: $error 30%;
    }

    #btn-refresh {
        background: $accent-muted;
        color: $text;
    }
    #btn-refresh:hover {
        background: $accent 30%;
    }

    #btn-domain {
        background: $secondary-muted;
        color: $text;
    }
    #btn-domain:hover {
        background: $secondary 30%;
    }

    Button:disabled {
        opacity: 35%;
    }

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

    /* ── Log panel ────────────────────────────────────── */

    #log-box {
        height: 14;
        min-height: 8;
        padding: 0 1;
    }

    /* ── DataTable ────────────────────────────────────── */

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

    /* ── RichLog ──────────────────────────────────────── */

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
        Binding("c", "create_custom", "Custom", show=True, priority=True),
        Binding("b", "create_batch", "Batch", show=True, priority=True),
        Binding("r", "create_random", "Random", show=True, priority=True),
        Binding("delete", "delete_email", "Delete", show=True, priority=True),
        Binding("enter", "view_inbox", "Inbox", show=True, priority=True),
        Binding("f5", "refresh", "Refresh", show=True),
        Binding("tab", "toggle_domain", "Domain", show=True),
        Binding("d", "next_theme", "Theme+", show=False),
        Binding("shift+d", "prev_theme", "Theme-", show=False),
        Binding("x", "clear_log", "Clear", show=True),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self):
        super().__init__()
        saved = THEME_FILE.read_text().strip() if THEME_FILE.exists() else ""
        self._theme_idx = ALL_THEMES.index(saved) if saved in ALL_THEMES else 0
        self.theme = ALL_THEMES[self._theme_idx]
        self._mail: XDoopMail | None = None
        self._busy = False

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="top-area"):
            with Vertical(id="table-box", classes="section"):
                yield DataTable(id="emails-table", zebra_stripes=True, cursor_type="row")
            with Vertical(id="sidebar", classes="section"):
                yield Button("  Create Custom", id="btn-custom")
                yield Button("  Create Batch", id="btn-batch")
                yield Button("  Random", id="btn-random")
                yield Static("────────────────────────", classes="sidebar-sep")
                yield Button("  View Inbox", id="btn-inbox")
                yield Button("  Delete Email", id="btn-delete")
                yield Button("  Switch Domain", id="btn-domain")
                yield Button("  Refresh", id="btn-refresh")
                yield Static(id="info-panel")
                yield Static("", id="theme-bar")
        with Vertical(id="log-box", classes="section"):
            yield RichLog(id="log", highlight=True, markup=True)
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#table-box").border_title = "Emails"
        self.query_one("#sidebar").border_title = "Actions"
        self.query_one("#log-box").border_title = "Log"

        table = self.query_one("#emails-table", DataTable)
        table.add_columns("#", "Email", "Domain")
        table.focus()

        self._render_theme_bar()
        self._log("[bold]Connecting to xDoop...[/]")
        self._init_mail()

    # ── Session init ──────────────────────────────────────────

    @work(thread=True, exclusive=True, group="init")
    def _init_mail(self) -> None:
        try:
            self._mail = XDoopMail(domain="nidez.net", session_name="tui")
            self.call_from_thread(
                self._log,
                f"[green]Connected![/] Email: [bold]{self._mail.email}[/]"
            )
            self.call_from_thread(self._refresh_table)
            self.call_from_thread(self._render_info)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]Connection failed: {e}[/]")

    # ── Table ─────────────────────────────────────────────────

    def _refresh_table(self) -> None:
        if not self._mail:
            return
        table = self.query_one("#emails-table", DataTable)
        table.clear()
        for i, email in enumerate(self._mail.emails, 1):
            domain = email.split("@")[1] if "@" in email else "?"
            table.add_row(str(i), email, domain, key=email)
        # also add current email if not in list
        if self._mail.email and self._mail.email not in self._mail.emails:
            i = len(self._mail.emails) + 1
            domain = self._mail.email.split("@")[1] if "@" in self._mail.email else "?"
            table.add_row(str(i), self._mail.email, domain, key=self._mail.email)
        self._render_info()

    def _get_selected_email(self) -> str | None:
        table = self.query_one("#emails-table", DataTable)
        if table.row_count == 0:
            return None
        try:
            row_key, _ = table.coordinate_to_cell_key(table.cursor_coordinate)
            return str(row_key)
        except Exception:
            return None

    # ── Info panel ────────────────────────────────────────────

    def _render_info(self) -> None:
        if not self._mail:
            self.query_one("#info-panel", Static).update("[dim]Not connected[/]")
            return
        table = self.query_one("#emails-table", DataTable)
        lines = [
            f"[dim]Domain:[/] [bold]{self._mail.domain}[/]",
            f"[dim]Active:[/] [bold]{self._mail.email or '—'}[/]",
            f"[dim]Total:[/]  [bold]{table.row_count}[/] emails",
        ]
        self.query_one("#info-panel", Static).update("\n".join(lines))

    # ── Logging ───────────────────────────────────────────────

    def _log(self, text: str) -> None:
        self.query_one("#log", RichLog).write(text)

    def action_clear_log(self) -> None:
        self.query_one("#log", RichLog).clear()

    # ── Busy state ────────────────────────────────────────────

    def _set_busy(self, busy: bool) -> None:
        self._busy = busy
        for btn_id in ("btn-custom", "btn-batch", "btn-random", "btn-delete",
                       "btn-inbox", "btn-domain", "btn-refresh"):
            try:
                self.query_one(f"#{btn_id}", Button).disabled = busy
            except Exception:
                pass

    # ── Theme ─────────────────────────────────────────────────

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

    # ── Actions ───────────────────────────────────────────────

    def on_button_pressed(self, event: Button.Pressed) -> None:
        actions = {
            "btn-custom": self.action_create_custom,
            "btn-batch": self.action_create_batch,
            "btn-random": self.action_create_random,
            "btn-delete": self.action_delete_email,
            "btn-inbox": self.action_view_inbox,
            "btn-domain": self.action_toggle_domain,
            "btn-refresh": self.action_refresh,
        }
        action = actions.get(event.button.id)
        if action:
            action()

    # ── Create Custom ─────────────────────────────────────────

    def action_create_custom(self) -> None:
        if self._busy or not self._mail:
            return
        self.push_screen(CreateEmailScreen(), self._on_custom_result)

    def _on_custom_result(self, username: str | None) -> None:
        if username:
            self._do_create_custom(username)

    @work(thread=True, exclusive=True, group="action")
    def _do_create_custom(self, username: str) -> None:
        worker = get_current_worker()
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._log, f"Creating [bold]{username}@{self._mail.domain}[/]...")
        try:
            addr = self._mail.create_custom(username)
            if worker.is_cancelled:
                return
            self.call_from_thread(self._log, f"[green]✓[/] Created: [bold]{addr}[/]")
            self.call_from_thread(self._refresh_table)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]✗ Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)

    # ── Create Batch ──────────────────────────────────────────

    def action_create_batch(self) -> None:
        if self._busy or not self._mail:
            return
        self.push_screen(BatchEmailScreen(), self._on_batch_result)

    def _on_batch_result(self, result: tuple[str, int, int] | None) -> None:
        if result:
            prefix, start, end = result
            self._do_create_batch(prefix, start, end)

    @work(thread=True, exclusive=True, group="action")
    def _do_create_batch(self, prefix: str, start: int, end: int) -> None:
        worker = get_current_worker()
        self.call_from_thread(self._set_busy, True)
        total = end - start + 2  # +1 for range, +1 for base prefix
        self.call_from_thread(
            self._log,
            f"[bold]Batch creating {total} emails: {prefix}, {prefix}{start}..{prefix}{end}[/]"
        )

        created = 0
        errors = 0

        # create base prefix email
        try:
            addr = self._mail.create_custom(prefix)
            created += 1
            self.call_from_thread(self._log, f"  [green]✓[/] {addr}")
            self.call_from_thread(self._refresh_table)
        except Exception as e:
            errors += 1
            self.call_from_thread(self._log, f"  [red]✗[/] {prefix}: {e}")

        for i in range(start, end + 1):
            if worker.is_cancelled:
                self.call_from_thread(self._log, "[yellow]Batch cancelled[/]")
                break
            username = f"{prefix}{i}"
            try:
                addr = self._mail.create_custom(username)
                created += 1
                if i % 50 == 0 or i <= 5 or i == end:
                    self.call_from_thread(
                        self._log,
                        f"  [green]✓[/] [{created}/{total}] {addr}"
                    )
                    self.call_from_thread(self._refresh_table)
            except Exception as e:
                errors += 1
                self.call_from_thread(self._log, f"  [red]✗[/] {username}: {e}")
                import time
                time.sleep(1)

        self.call_from_thread(self._refresh_table)
        self.call_from_thread(
            self._log,
            f"[bold]Batch done:[/] [green]{created} created[/], [red]{errors} errors[/]"
        )
        self.call_from_thread(self._set_busy, False)

    # ── Create Random ─────────────────────────────────────────

    def action_create_random(self) -> None:
        if self._busy or not self._mail:
            return
        self._do_create_random()

    @work(thread=True, exclusive=True, group="action")
    def _do_create_random(self) -> None:
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._log, "Creating random email...")
        try:
            addr = self._mail.create_random()
            self.call_from_thread(self._log, f"[green]✓[/] Random: [bold]{addr}[/]")
            self.call_from_thread(self._refresh_table)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]✗ Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)

    # ── Delete Email ──────────────────────────────────────────

    def action_delete_email(self) -> None:
        if self._busy or not self._mail:
            return
        email = self._get_selected_email()
        if not email:
            self._log("[yellow]No email selected[/]")
            return
        self._do_delete_email(email)

    @work(thread=True, exclusive=True, group="action")
    def _do_delete_email(self, email: str) -> None:
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._log, f"Deleting [bold]{email}[/]...")
        try:
            self._mail.switch_email(email)
            self._mail.delete_email()
            self.call_from_thread(self._log, f"[green]✓[/] Deleted: {email}")
            self.call_from_thread(self._refresh_table)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]✗ Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)

    # ── View Inbox ────────────────────────────────────────────

    def action_view_inbox(self) -> None:
        if self._busy or not self._mail:
            return
        email = self._get_selected_email()
        if not email:
            self._log("[yellow]No email selected[/]")
            return
        self._do_view_inbox(email)

    @work(thread=True, exclusive=True, group="action")
    def _do_view_inbox(self, email: str) -> None:
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._log, f"\n[bold]━━━ Inbox: {email} ━━━[/]")
        try:
            self._mail.switch_email(email)
            msgs = self._mail.fetch_messages()
            if not msgs:
                self.call_from_thread(self._log, "  [dim]No messages[/]")
            else:
                self.call_from_thread(self._log, f"  [green]{len(msgs)} message(s)[/]")
                for msg in msgs:
                    self.call_from_thread(
                        self._log,
                        f"\n  [bold]{msg.subject}[/]"
                        f"\n  [dim]From:[/] {msg.sender}  [dim]Date:[/] {msg.date}"
                    )
                    if msg.body:
                        # show first 200 chars of body
                        body = msg.body[:200].replace("\n", " ")
                        self.call_from_thread(self._log, f"  {body}")
        except Exception as e:
            self.call_from_thread(self._log, f"[red]✗ Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)

    def on_data_table_row_selected(self, event: DataTable.RowSelected) -> None:
        """Double-click or Enter on table row → view inbox."""
        email = str(event.row_key.value)
        if not self._busy and self._mail:
            self._do_view_inbox(email)

    # ── Switch Domain ─────────────────────────────────────────

    def action_toggle_domain(self) -> None:
        if self._busy or not self._mail:
            return
        new_domain = "nidez.net" if self._mail.domain == "xdoop.com" else "xdoop.com"
        self._do_switch_domain(new_domain)

    @work(thread=True, exclusive=True, group="action")
    def _do_switch_domain(self, domain: str) -> None:
        self.call_from_thread(self._set_busy, True)
        try:
            self._mail.switch_domain(domain)
            self.call_from_thread(self._log, f"[green]✓[/] Domain → [bold]{domain}[/]")
            self.call_from_thread(self._render_info)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]✗ Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)

    # ── Refresh ───────────────────────────────────────────────

    def action_refresh(self) -> None:
        if self._busy or not self._mail:
            return
        self._do_refresh()

    @work(thread=True, exclusive=True, group="action")
    def _do_refresh(self) -> None:
        self.call_from_thread(self._set_busy, True)
        self.call_from_thread(self._log, "Refreshing...")
        try:
            # re-init to get fresh state
            self._mail = XDoopMail(domain="nidez.net", session_name="tui")
            self.call_from_thread(self._log, f"[green]✓[/] Refreshed — {len(self._mail.emails)} emails")
            self.call_from_thread(self._refresh_table)
        except Exception as e:
            self.call_from_thread(self._log, f"[red]✗ Error: {e}[/]")
        finally:
            self.call_from_thread(self._set_busy, False)


# ── Entry point ───────────────────────────────────────────────────


def main():
    app = XDoopApp()
    app.run()


if __name__ == "__main__":
    main()
