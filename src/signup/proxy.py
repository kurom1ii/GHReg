"""Proxy IP rotation via HomeProxy.vn API."""

import time
import requests

from .config import (
    ROTATE_IP_API, HOMEPROXY_TOKEN, HOMEPROXY_MERCHANT_ID,
    LIST_PROXY_API, CHANGE_INFO_API, PROXY_ID,
)

BEARER_HEADERS = {"Authorization": f"Bearer {HOMEPROXY_TOKEN}"}
FULL_HEADERS = {
    **BEARER_HEADERS,
    "x-merchant-id": HOMEPROXY_MERCHANT_ID,
    "Content-Type": "application/json",
}


def rotate_ip():
    """Rotate proxy IP. Waits and retries if cooldown active."""
    print("  Rotating proxy IP...")
    try:
        resp = requests.get(ROTATE_IP_API, headers=BEARER_HEADERS, timeout=15)
        data = resp.json()

        if data.get("status") == "success":
            remaining = data.get("timeRemaining", 0)
            if remaining and remaining > 0:
                print(f"  Cooldown: {remaining}s remaining, waiting...")
                time.sleep(remaining + 1)
                return rotate_ip()

            new_ip = data.get("ip", "?")
            proxy_str = data.get("proxy", "")
            print(f"  IP rotated: {new_ip}")
            if proxy_str:
                print(f"  Proxy: {proxy_str}")
            return True
        else:
            msg = data.get("message", str(data))
            remaining = data.get("timeRemaining", 0)
            if remaining and remaining > 0:
                print(f"  Cooldown: {remaining}s, waiting...")
                time.sleep(remaining + 1)
                return rotate_ip()
            print(f"  Rotate failed: {msg}")
            return False
    except Exception as e:
        print(f"  Rotate error: {e}")
        return False


def get_proxy_info():
    """Fetch current proxy info from HomeProxy purchased list."""
    try:
        resp = requests.get(
            LIST_PROXY_API,
            params={
                "sort": '[{"orderBy":"createdAt","order":"desc"}]',
                "filters": '{"proxy":{"ipaddress":{"categorytype":{"id":2}}}}',
            },
            headers=FULL_HEADERS,
            timeout=15,
        )
        data = resp.json()
        proxies = data.get("data", [])
        if not proxies:
            print("  No rotating proxy found")
            return None

        p = proxies[0]
        proxy = p["proxy"]
        ip = proxy["ipaddress"]["ip"]
        port = proxy["port"]
        user = proxy["username"]
        passwd = proxy["password"]
        interval = proxy.get("rotateInterval", 0)
        expired = p.get("expiredAt", 0)

        print(f"  Proxy: {ip}:{port} user={user} interval={interval}min")
        return {
            "id": p["id"],
            "ip": ip,
            "port": port,
            "username": user,
            "password": passwd,
            "rotateInterval": interval,
            "expiredAt": expired,
            "domain": proxy["ipaddress"].get("domain", ""),
        }
    except Exception as e:
        print(f"  Get proxy info error: {e}")
        return None


def change_proxy_config(password=None, rotate_interval=None):
    """Update proxy password and/or rotate interval."""
    body = {"userProxyIds": [int(PROXY_ID)]}
    if password is not None:
        body["password"] = password
    if rotate_interval is not None:
        body["rotateInterval"] = rotate_interval

    try:
        resp = requests.post(
            CHANGE_INFO_API,
            json=body,
            headers=FULL_HEADERS,
            timeout=15,
        )
        if resp.status_code in (200, 201):
            print(f"  Proxy config updated (interval={rotate_interval}min)")
            return True
        print(f"  Change config failed: {resp.status_code} {resp.text}")
        return False
    except Exception as e:
        print(f"  Change config error: {e}")
        return False
