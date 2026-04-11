"""Token file storage."""

import json
from datetime import datetime, timezone


def save_token(token, token_name, output_file, username=None):
    """Save token to a JSON file (append to existing)."""
    entry = {
        "name": token_name,
        "token": token,
    }
    if username:
        entry["username"] = username
    entry["created_at"] = datetime.now(timezone.utc).isoformat()

    try:
        with open(output_file, "r") as f:
            data = json.load(f)
            if not isinstance(data, list):
                data = [data]
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    data.append(entry)

    with open(output_file, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
