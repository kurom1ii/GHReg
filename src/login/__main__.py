"""python -m src.login [account_number]"""
import sys
from pathlib import Path

from rich.console import Console
from rich.table import Table
from rich.prompt import Prompt

from .session import github_login_standalone

ACCOUNTS_FILE = Path(__file__).parent.parent.parent / "cf-email-dashboard" / "data" / "accounts.txt"

console = Console()


def _load_accounts():
    if not ACCOUNTS_FILE.exists():
        console.print(f"[red]File not found:[/] {ACCOUNTS_FILE}")
        return []
    accounts = []
    for line in ACCOUNTS_FILE.read_text().strip().splitlines():
        parts = line.strip().split("|")
        if len(parts) >= 4:
            accounts.append({"email": parts[0], "username": parts[1], "password": parts[2], "totp_secret": parts[3]})
    return accounts


accounts = _load_accounts()
if not accounts:
    sys.exit(1)

# Auto-select if arg provided, otherwise prompt
if len(sys.argv) > 1 and sys.argv[1].isdigit():
    idx = int(sys.argv[1]) - 1
else:
    table = Table(header_style="bold magenta", border_style="bright_black", padding=(0, 1))
    table.add_column("#", style="bold cyan", width=4, justify="right")
    table.add_column("Username", style="bold white")
    table.add_column("Email", style="white")
    for i, a in enumerate(accounts, 1):
        table.add_row(str(i), a["username"], a["email"])
    console.print(table)

    choice = Prompt.ask(f"Chon account [cyan][1-{len(accounts)}][/]", default="1")
    idx = int(choice) - 1 if choice.isdigit() else 0

if 0 <= idx < len(accounts):
    acc = accounts[idx]
    github_login_standalone(acc["email"], acc["password"], acc["totp_secret"])
else:
    console.print("[red]Invalid selection[/]")
