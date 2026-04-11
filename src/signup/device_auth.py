"""GitHub device code OAuth flow (same as copilot-api)."""

import time
import requests

GITHUB_CLIENT_ID = "Iv1.b507a08c87ecfe98"
GITHUB_SCOPE = "read:user"

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}


def request_device_code():
    """POST to GitHub to get device_code + user_code.
    Returns dict with device_code, user_code, interval, or None."""
    print("  [Auth] Requesting device code...")
    try:
        resp = requests.post(
            "https://github.com/login/device/code",
            json={"client_id": GITHUB_CLIENT_ID, "scope": GITHUB_SCOPE},
            headers=HEADERS,
            timeout=15,
        )
        if resp.status_code != 200:
            print(f"  [Auth] Failed: {resp.status_code} {resp.text[:200]}")
            return None
        data = resp.json()
        print(f"  [Auth] User code: {data.get('user_code')}")
        return data
    except Exception as e:
        print(f"  [Auth] Request error: {e}")
        return None


def enter_device_code(page, user_code):
    """Navigate browser to github.com/login/device and enter user_code."""
    print(f"  [Auth] Navigating to device login...")
    page.goto("https://github.com/login/device", wait_until="domcontentloaded", timeout=15000)
    page.wait_for_timeout(2000)

    # Type user_code into the input field
    for sel in [
        'input[name="user-code"]',
        'input[id="user-code"]',
        'input[aria-label*="code" i]',
        'input[type="text"]',
    ]:
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click()
                page.keyboard.type(user_code, delay=0)
                print(f"  [Auth] Entered user code: {user_code}")
                break
        except:
            pass

    page.wait_for_timeout(500)

    # Click Continue
    for sel in [
        'button:has-text("Continue")',
        'button[type="submit"]',
    ]:
        try:
            btn = page.query_selector(sel)
            if btn and btn.is_visible():
                btn.click()
                print(f"  [Auth] Clicked Continue")
                break
        except:
            pass

    page.wait_for_timeout(3000)

    # Click Authorize
    for sel in [
        'button:has-text("Authorize")',
        'button[name="authorize"]',
        'button.js-oauth-authorize-btn',
        'button[type="submit"]',
    ]:
        try:
            btn = page.query_selector(sel)
            if btn and btn.is_visible():
                btn.click()
                print(f"  [Auth] Clicked Authorize")
                break
        except:
            pass

    page.wait_for_timeout(2000)


def poll_access_token(device_code, interval=5, timeout=120):
    """Poll GitHub for access token. Returns token string or None."""
    print(f"  [Auth] Polling for access token...")
    poll_interval = interval + 1
    start = time.time()

    while time.time() - start < timeout:
        try:
            resp = requests.post(
                "https://github.com/login/oauth/access_token",
                json={
                    "client_id": GITHUB_CLIENT_ID,
                    "device_code": device_code,
                    "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
                },
                headers=HEADERS,
                timeout=15,
            )
            if resp.status_code == 200:
                data = resp.json()
                token = data.get("access_token")
                if token:
                    print(f"  [Auth] Got token: {token[:12]}...")
                    return token
                error = data.get("error", "")
                if error == "authorization_pending":
                    pass
                elif error == "slow_down":
                    poll_interval += 5
                elif error in ("expired_token", "access_denied"):
                    print(f"  [Auth] Failed: {error}")
                    return None
        except Exception as e:
            print(f"  [Auth] Poll error: {e}")

        elapsed = int(time.time() - start)
        print(f"  [Auth] Waiting... ({elapsed}s/{timeout}s)")
        time.sleep(poll_interval)

    print(f"  [Auth] Timeout after {timeout}s")
    return None


def device_auth_flow(page):
    """Full device code auth flow. Returns access_token or None."""
    print("\n[Device Auth] Starting GitHub OAuth device flow...")

    data = request_device_code()
    if not data:
        return None

    device_code = data["device_code"]
    user_code = data["user_code"]
    interval = data.get("interval", 5)

    enter_device_code(page, user_code)
    token = poll_access_token(device_code, interval=interval)

    if token:
        print(f"  [Auth] Device auth complete!")
    else:
        print(f"  [Auth] Device auth failed.")

    return token
