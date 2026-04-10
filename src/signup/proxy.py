"""Proxy IP rotation via ProxyNo1 API."""

import time
import requests

from .config import ROTATE_IP_API, ROTATE_WAIT


def rotate_ip():
    """Rotate proxy IP. Retries on rate-limit (status 5)."""
    print("  Rotating proxy IP...")
    try:
        resp = requests.get(ROTATE_IP_API, timeout=15)
        data = resp.json()
        if data.get("status") == 0:
            print(f"  IP rotated: {data.get('message', 'OK')}")
            print(f"  Waiting {ROTATE_WAIT}s...")
            time.sleep(ROTATE_WAIT)
            return True
        elif data.get("status") == 5:
            print("  Rate limited, retrying in 5s...")
            time.sleep(5)
            return rotate_ip()
        else:
            print(f"  Rotate failed: {data}")
            return False
    except Exception as e:
        print(f"  Rotate error: {e}")
        return False
