"""python -m src.org — Interactive org manager."""
import sys
from pathlib import Path

from curl_cffi import requests as cffi_requests
from rich.console import Console
from rich.table import Table
from rich.prompt import Prompt

from ..login.session import github_login
from .manager import OrgManager

ACCOUNTS_FILE = Path(__file__).parent.parent.parent / "cf-email-dashboard" / "data" / "accounts.txt"

console = Console()


def _load_accounts():
    if not ACCOUNTS_FILE.exists():
        return []
    accounts = []
    for line in ACCOUNTS_FILE.read_text().strip().splitlines():
        parts = line.strip().split("|")
        if len(parts) >= 4:
            accounts.append({"email": parts[0], "username": parts[1],
                             "password": parts[2], "totp_secret": parts[3]})
    return accounts


def _pick_account(accounts):
    table = Table(header_style="bold magenta", border_style="bright_black", padding=(0, 1))
    table.add_column("#", style="bold cyan", width=4, justify="right")
    table.add_column("Username", style="bold white")
    table.add_column("Email", style="white")
    for i, a in enumerate(accounts, 1):
        table.add_row(str(i), a["username"], a["email"])
    console.print(table)
    choice = Prompt.ask(f"Chon account [cyan][1-{len(accounts)}][/]", default="1")
    idx = int(choice) - 1 if choice.isdigit() else 0
    return accounts[idx] if 0 <= idx < len(accounts) else None


def _pick_org(mgr: OrgManager):
    console.print("\n[cyan]Dang lay danh sach orgs...[/]")
    orgs = mgr.list_orgs()
    if not orgs:
        console.print("[red]Khong tim thay org nao![/]")
        return None

    if len(orgs) == 1:
        console.print(f"  Org: [bold]{orgs[0]}[/]")
        return orgs[0]

    for i, org in enumerate(orgs, 1):
        console.print(f"  [cyan]{i}[/]. {org}")
    choice = Prompt.ask(f"Chon org [cyan][1-{len(orgs)}][/]", default="1")
    idx = int(choice) - 1 if choice.isdigit() else 0
    return orgs[idx] if 0 <= idx < len(orgs) else orgs[0]


def main():
    console.print("\n[bold cyan]  ORG Manager  [/] — GitHub Organization Tools\n")

    accounts = _load_accounts()
    if not accounts:
        console.print("[red]No accounts in accounts.txt[/]")
        return

    acc = _pick_account(accounts)
    if not acc:
        return

    # Login
    session = cffi_requests.Session(impersonate="chrome")
    console.print(f"\n[cyan]Logging in {acc['username']}...[/]")
    ok = github_login(session, acc["email"], acc["password"], acc["totp_secret"])
    if not ok:
        console.print("[red]Login failed![/]")
        return
    console.print(f"[green]✓ Logged in: {acc['username']}[/]")

    mgr = OrgManager(session)

    # Pick org
    org = _pick_org(mgr)
    if not org:
        return

    # Menu loop
    while True:
        console.print(f"\n[bold]Org: [cyan]{org}[/][/]")
        console.print("  [cyan]1[/]. List members")
        console.print("  [cyan]2[/]. Invite user")
        console.print("  [cyan]3[/]. List pending invitations")
        console.print("  [cyan]4[/]. Search user")
        console.print("  [cyan]5[/]. Switch org")
        console.print("  [cyan]q[/]. Quit")

        choice = Prompt.ask("  >", default="1")

        if choice == "1":
            members = mgr.list_members(org)
            if members:
                t = Table(header_style="bold", border_style="bright_black")
                t.add_column("#", width=4)
                t.add_column("Username")
                t.add_column("ID", style="dim")
                for i, m in enumerate(members, 1):
                    t.add_row(str(i), m["username"], m["id"])
                console.print(t)
            else:
                console.print("  [dim]No members found[/]")

        elif choice == "2":
            usernames = Prompt.ask("  Username(s) to invite (comma-separated)")
            for uname in usernames.split(","):
                uname = uname.strip()
                if uname:
                    ok = mgr.invite_user(org, uname)
                    if ok:
                        console.print(f"  [green]✓ Invited {uname}[/]")
                    else:
                        console.print(f"  [red]✗ Failed to invite {uname}[/]")

        elif choice == "3":
            pending = mgr.list_pending(org)
            if pending:
                for p in pending:
                    console.print(f"  ⏳ {p}")
            else:
                console.print("  [dim]No pending invitations[/]")

        elif choice == "4":
            query = Prompt.ask("  Search")
            results = mgr.search_user(org, query)
            if results:
                for r in results:
                    console.print(f"  {r['username']} (id={r.get('user_id', '?')})")
            else:
                console.print("  [dim]No results[/]")

        elif choice == "5":
            org = _pick_org(mgr)
            if not org:
                break

        elif choice.lower() == "q":
            break

    console.print("[dim]Bye![/]")


if __name__ == "__main__":
    main()
