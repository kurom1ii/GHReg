#!/usr/bin/env python3
"""
Create email routing rules on Cloudflare for spxlua.com
Routes kuromi2011@spxlua.com -> kuromi2021@spxlua.com to a destination email.
"""

import requests
import sys
import time

# ====== Configuration ======
CF_API_TOKEN = "cfat_JgXGbVuALh9HM3fmTOShHyG2XzdgcgLswLy6V1tMd2d471c6"
ACCOUNT_ID = "a2085d6ac11ba567f87a99b8529e1d23"
ZONE_ID = "6fd76a2fd4699f5adb6d7fcffe4c2619"
DOMAIN = "spxlua.com"
DESTINATION_EMAIL = "kuromi3814@gmail.com"

HEADERS = {
    "Authorization": f"Bearer {CF_API_TOKEN}",
    "Content-Type": "application/json",
}

BASE_URL = f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/email/routing/rules"


def verify_token():
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/tokens/verify"
    resp = requests.get(url, headers=HEADERS, timeout=10)
    data = resp.json()
    if data.get("success"):
        print(f"  ✅ Token active: {data['result']['status']}")
        return True
    else:
        print(f"  ❌ Token invalid: {data.get('errors')}")
        return False


def list_existing_rules():
    resp = requests.get(BASE_URL, headers=HEADERS, timeout=10)
    data = resp.json()
    if not data.get("success"):
        print(f"  ⚠️ Cannot list rules: {data.get('errors')}")
        return []
    return data.get("result", [])


def create_email_rule(local_part):
    """Create a routing rule: local_part@spxlua.com -> DESTINATION_EMAIL"""
    email = f"{local_part}@{DOMAIN}"
    payload = {
        "name": f"Route {email}",
        "enabled": True,
        "matchers": [
            {"type": "literal", "field": "to", "value": email}
        ],
        "actions": [
            {"type": "forward", "value": [DESTINATION_EMAIL]}
        ],
    }

    resp = requests.post(BASE_URL, headers=HEADERS, json=payload, timeout=10)
    data = resp.json()

    if data.get("success"):
        print(f"  ✅ {email} -> {DESTINATION_EMAIL}")
        return True
    else:
        errors = data.get("errors", [])
        # Already exists?
        if any("already exists" in str(e).lower() for e in errors):
            print(f"  ⏭️  {email} already exists, skipping")
            return True
        print(f"  ❌ {email} failed: {errors}")
        return False


def main():
    print("=" * 60)
    print(f"Cloudflare Email Routing — {DOMAIN}")
    print(f"Destination: {DESTINATION_EMAIL}")
    print("=" * 60)

    if not verify_token():
        sys.exit(1)

    # Create kuromi2011 -> kuromi2021
    emails = [f"melody{i}" for i in range(1, 5)]

    print(f"\nCreating {len(emails)} email routes...\n")

    success = 0
    for local in emails:
        if create_email_rule(local):
            success += 1
        time.sleep(0.3)  # Rate limit friendly

    print(f"\n{'='*60}")
    print(f"Done: {success}/{len(emails)} routes created")
    print(f"Emails: kuromi2011@{DOMAIN} -> kuromi2021@{DOMAIN}")
    print(f"All forward to: {DESTINATION_EMAIL}")


if __name__ == "__main__":
    main()
