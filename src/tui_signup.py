"""TUI Signup — Textual TUI for GitHub account registration."""

import sys
import multiprocessing
import logging
from pathlib import Path
from threading import Lock
import io

# Pre-init multiprocessing resource tracker before Textual takes over fds
multiprocessing.set_start_method("spawn", force=True)
_warmup_lock = multiprocessing.Lock()
del _warmup_lock

LOG_FILE = Path(__file__).parent.parent / "tui_signup.log"
logging.basicConfig(
    filename=str(LOG_FILE),
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    force=True,
)
logger = logging.getLogger("tui_signup")

from textual import work
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.widgets import Footer, RichLog, Static, Input

ACCOUNTS_FILE = Path(__file__).parent.parent / "cf-email-dashboard" / "data" / "accounts.txt"
THEME_FILE = Path(__file__).parent.parent / ".theme"

ALL_THEMES = [
    "dracula",
    "catppuccin-mocha",
    "catppuccin-macchiato",
    "catppuccin-frappe",
    "catppuccin-latte",
    "tokyo-night",
    "nord",
    "gruvbox",
    "monokai",
    "rose-pine",
    "rose-pine-moon",
    "rose-pine-dawn",
    "solarized-dark",
    "solarized-light",
    "atom-one-dark",
    "atom-one-light",
    "flexoki",
    "textual-dark",
    "textual-light",
    "textual-ansi",
]


class _LogWriter(io.TextIOBase):
    """Bridge print() to RichLog widget, thread-safe."""

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


class SignupApp(App):
    """GHReg Signup TUI."""

    TITLE = "GHReg Signup"
    SUB_TITLE = "GitHub Account Registration"

    CSS = """
    * {
        scrollbar-size-vertical: 1;
    }

    #banner {
        height: 3;
        content-align: center middle;
        background: $boost;
        color: $text;
        text-style: bold;
        padding: 1 0;
    }

    #main {
        height: 1fr;
    }

    #log-box {
        width: 2fr;
        border: round $primary 50%;
        border-title-color: $primary;
        border-title-style: bold;
        padding: 0 1;
    }

    #log-box:focus-within {
        border: round $primary;
    }

    #right-panel {
        width: 1fr;
        padding: 0 0 0 1;
    }

    #signup-log-box {
        height: 1fr;
        border: round $secondary 50%;
        border-title-color: $secondary;
        border-title-style: bold;
        padding: 0 1;
    }

    #signup-log-box:focus-within {
        border: round $secondary;
    }

    #accounts-box {
        height: auto;
        max-height: 10;
        border: round $success 50%;
        border-title-color: $success;
        border-title-style: bold;
        padding: 0 1;
        margin-top: 1;
    }

    #theme-bar {
        height: 1;
        color: $text-disabled;
        content-align: center middle;
        padding: 0 1;
    }

    #email-bar {
        dock: bottom;
        height: auto;
        padding: 0 0;
    }

    #email-field {
        border: round $primary 50%;
        padding: 0 1;
        margin: 0;
    }

    #email-field:focus {
        border: round $primary;
    }

    RichLog {
        height: 1fr;
    }
    """

    BINDINGS = [
        Binding("s", "focus_email", "Signup", show=True),
        Binding("d", "next_theme", "Theme+", show=True),
        Binding("shift+d", "prev_theme", "Theme-", show=False),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self):
        super().__init__()
        saved = THEME_FILE.read_text().strip() if THEME_FILE.exists() else ""
        if saved in ALL_THEMES:
            self._theme_idx = ALL_THEMES.index(saved)
        else:
            self._theme_idx = 0
        self.theme = ALL_THEMES[self._theme_idx]

    def compose(self) -> ComposeResult:
        yield Static("  GHReg Signup  ─  GitHub Account Registration", id="banner")
        with Horizontal(id="main"):
            with Vertical(id="log-box"):
                yield RichLog(id="log", highlight=True, markup=True)
            with Vertical(id="right-panel"):
                with Vertical(id="signup-log-box"):
                    yield RichLog(id="signup-log", highlight=True, markup=True)
                with Vertical(id="accounts-box"):
                    yield Static(id="accounts-panel")
                yield Static("", id="theme-bar")
        with Horizontal(id="email-bar"):
            yield Input(placeholder=" Enter email, press Enter to signup...", id="email-field")
        yield Footer()

    def on_mount(self) -> None:
        logger.info("on_mount called")
        self.query_one("#log-box").border_title = "Log"
        self.query_one("#signup-log-box").border_title = "Signup"
        self.query_one("#accounts-box").border_title = "Registered"

        self._render_accounts()
        self._render_theme_bar()

        log = self.query_one("#log", RichLog)
        log.write("[bold]  S[/] Signup   [bold]D[/] Theme   [bold]Q[/] Quit")
        log.write("")
        logger.info("focusing email field")
        self.query_one("#email-field", Input).focus()

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

    def _render_accounts(self) -> None:
        lines = []
        if ACCOUNTS_FILE.exists():
            text = ACCOUNTS_FILE.read_text().strip()
            if text:
                for line in text.splitlines():
                    parts = line.strip().split("|")
                    if len(parts) >= 4:
                        lines.append(f"[green]  ✓[/green] [bold]{parts[1]}[/bold] [dim]({parts[0]})[/dim]")
        if not lines:
            lines.append("[dim]  No accounts yet[/dim]")
        self.query_one("#accounts-panel", Static).update("\n".join(lines))

    def _log(self, text: str) -> None:
        self.query_one("#log", RichLog).write(text)

    def _signup_log(self, text: str) -> None:
        self.query_one("#signup-log", RichLog).write(text)

    def action_focus_email(self) -> None:
        self.query_one("#email-field", Input).focus()

    def on_input_submitted(self, event: Input.Submitted) -> None:
        logger.info(f"on_input_submitted: id={event.input.id} value='{event.value}' disabled={event.input.disabled}")
        if event.input.id == "email-field":
            email = event.value.strip()
            event.input.value = ""
            if not email or "@" not in email:
                return
            logger.info(f"calling _start_signup({email})")
            self._start_signup(email)

    def _start_signup(self, email: str) -> None:
        """Kick off signup from main thread."""
        logger.info(f"_start_signup: email={email}")
        # Disable input to prevent double submit
        self.query_one("#email-field", Input).disabled = True
        self.query_one("#signup-log", RichLog).clear()
        self._log(f"\n[bold]━━━ Signup: {email} ━━━[/]")
        self._do_signup(email)

    @work(thread=True, exclusive=True)
    def _do_signup(self, email: str) -> None:
        logger.info(f"_do_signup worker started for {email}")

        try:
            from .signup.flow import github_signup_headless
            logger.info("import github_signup_headless OK")
        except Exception as e:
            logger.error(f"import failed: {e}", exc_info=True)
            self.call_from_thread(self._log, f"[red]Import error: {e}[/red]")
            self.call_from_thread(self._enable_input)
            return

        writer = _LogWriter(self, "signup-log")
        old_stdout = sys.stdout

        try:
            sys.stdout = writer
            logger.info("calling github_signup_headless")
            github_signup_headless(email=email)
            sys.stdout = old_stdout
            writer.flush()
            logger.info("signup done OK")
            self.call_from_thread(self._log, f"[green]✓ Signup done: {email}[/green]")
        except Exception as e:
            sys.stdout = old_stdout
            writer.flush()
            logger.error(f"signup error: {e}", exc_info=True)
            import traceback
            tb = traceback.format_exc()
            self.call_from_thread(self._log, f"[red]✗ Error: {e}[/red]")
            self.call_from_thread(self._signup_log, tb)
        finally:
            sys.stdout = old_stdout
            logger.info("worker done, re-enabling input")
            self.call_from_thread(self._enable_input)
            self.call_from_thread(self._render_accounts)

    def _enable_input(self) -> None:
        field = self.query_one("#email-field", Input)
        field.disabled = False
        field.focus()


def main():
    app = SignupApp()
    app.run()


if __name__ == "__main__":
    main()
