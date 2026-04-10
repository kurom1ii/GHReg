"""python -m src.login <username> <password>"""
import sys
from .session import github_login_standalone

if len(sys.argv) != 3:
    print(f"Usage: python -m src.login <username/email> <password>")
    sys.exit(1)

github_login_standalone(sys.argv[1], sys.argv[2])
