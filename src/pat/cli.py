"""CLI entry point for PAT creation."""

import sys
import argparse

from curl_cffi import requests as cffi_requests

from ..login.session import github_login
from .sudo import github_sudo
from .creator import create_pat
from .storage import save_token
from .permissions import PERMISSION_PRESETS


def main():
    parser = argparse.ArgumentParser(
        description="GitHub Login + Create Fine-grained PAT",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Permission presets (--preset):
  minimal   - no permissions (default)
  readonly  - contents:read + metadata:read
  copilot   - copilot read permissions
  full_repo - full repo read/write

Custom permissions (--perm):
  --perm contents=write --perm issues=read

Examples:
  %(prog)s -u user@mail.com -p password -n "my-token"
  %(prog)s -u user@mail.com -p password -n "ci-token" --preset full_repo
  %(prog)s -u user@mail.com -p password -n "api-token" --perm contents=write --perm issues=read
  %(prog)s -u user@mail.com -p password -n "token1" -o tokens.json
""",
    )
    parser.add_argument("-u", "--username", required=True)
    parser.add_argument("-p", "--password", required=True)
    parser.add_argument("-n", "--name", required=True, help="Token name")
    parser.add_argument("-e", "--expires", type=int, default=30,
                        help="Expiration in days (default 30)")
    parser.add_argument("--preset", default="minimal",
                        choices=list(PERMISSION_PRESETS.keys()),
                        help="Permission preset")
    parser.add_argument("--perm", action="append", default=[],
                        help="Custom permission key=value, can specify multiple")
    parser.add_argument("-o", "--output", default="github_tokens.json",
                        help="Token output file (default github_tokens.json)")

    args = parser.parse_args()

    custom_perms = {}
    for p in args.perm:
        if "=" in p:
            k, v = p.split("=", 1)
            custom_perms[k] = v

    session = cffi_requests.Session(impersonate="chrome")

    if not github_login(session, args.username, args.password):
        sys.exit(1)

    if not github_sudo(session, args.password):
        print("sudo mode activation failed, trying to continue...")

    token = create_pat(
        session,
        token_name=args.name,
        password=args.password,
        expires_days=args.expires,
        preset=args.preset,
        custom_perms=custom_perms if custom_perms else None,
    )

    if token:
        save_token(token, args.name, args.output)
        print(f"\n===== Done =====")
        print(f"  Token: {token}")
        print(f"  Saved to: {args.output}")
    else:
        print("\nToken creation failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
