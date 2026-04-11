"""GitHub signup orchestration with Camoufox stealth browser."""

import re
import shutil
from datetime import datetime, timezone
from camoufox.sync_api import Camoufox
import time
import requests
from .config import PROXY, PROFILE_DIR, FUNCAPTCHA_BASE_DIR
from .proxy import rotate_ip
from .interceptor import setup_captcha_interceptor
from .game_frame import auto_click_verify
from .form_filler import fill_signup_form, _human_type,fast_human_type
from .email_verifier import get_verification_code, fill_verification_code
from .post_signup import auto_login, setup_2fa, save_account
from .device_auth import device_auth_flow

API_BASE = "http://127.0.0.1:8000"


def _poll_launch_code(email, timeout=120, interval=5, exclude_codes=None):
    """Poll gh-check backend API for GitHub launch code email.
    Returns 8-digit code string or None."""
    print(f"  [API] Polling for GitHub launch code to {email}...")
    exclude = exclude_codes or set()
    start = time.time()
    seen_ids = set()

    while time.time() - start < timeout:
        try:
            resp = requests.get(
                f"{API_BASE}/api/outlook/messages/{email}",
                params={"page": 0, "page_size": 10, "_t": int(time.time())},
                timeout=10,
            )
            if resp.status_code != 200:
                print(f"  [API] List messages failed: {resp.status_code}")
                time.sleep(interval)
                continue

            messages = resp.json().get("messages", [])
            for msg in messages:
                msg_id = msg.get("id", "")
                if msg_id in seen_ids:
                    continue

                sender = (msg.get("sender_email") or "").lower()
                subject = (msg.get("subject") or "").lower()

                if "noreply@github.com" not in sender:
                    seen_ids.add(msg_id)
                    continue
                if "launch code" not in subject:
                    seen_ids.add(msg_id)
                    continue

                # Check freshness
                date_str = msg.get("date", "")
                if date_str:
                    try:
                        received = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                        age = (datetime.now(timezone.utc) - received).total_seconds()
                        if age > 300:
                            seen_ids.add(msg_id)
                            continue
                    except:
                        pass

                # Try preview first for quick code extraction
                preview = msg.get("preview") or ""
                match = re.search(r'(\d{8})', preview)
                if match:
                    code = match.group(1)
                    if code not in exclude:
                        print(f"  [API] Found code: {code} (from preview)")
                        return code

                # Fetch full body
                body_resp = requests.get(
                    f"{API_BASE}/api/outlook/message/{email}/{msg_id}",
                    timeout=10,
                )
                if body_resp.status_code == 200:
                    body_data = body_resp.json()
                    body_text = body_data.get("body_text") or body_data.get("preview") or ""
                    match = re.search(r'(\d{8})', body_text)
                    if match:
                        code = match.group(1)
                        if code not in exclude:
                            print(f"  [API] Found code: {code}")
                            return code

                seen_ids.add(msg_id)

        except Exception as e:
            print(f"  [API] Poll error: {e}")

        elapsed = int(time.time() - start)
        print(f"  [API] No code yet... ({elapsed}s/{timeout}s)")
        time.sleep(interval)

    print(f"  [API] Timeout after {timeout}s")
    return None


def clean_profile():
    """Delete and recreate browser profile directory."""
    if PROFILE_DIR.exists():
        shutil.rmtree(PROFILE_DIR, ignore_errors=True)
        print("  Old profile deleted")
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)


def _detect_email_confirm_page(page):
    """Check if page is showing the email verification code input."""
    try:
        # Check for "Confirm your email" or digit inputs
        for sel in [
            'text="Confirm your email"',
            'text="Enter code"',
            'input[aria-label*="Digit 1" i]',
            'input[aria-label*="launch code" i]',
        ]:
            el = page.query_selector(sel)
            if el:
                return True
    except:
        pass
    return False


def github_signup():
    clean_profile()
    rotate_ip()

    email = input("  Email: ").strip()
    if not email:
        print("  Email is required")
        return

    username = email.split("@")[0]
    password = email

    launch_kwargs = dict(
        headless=False,
        geoip=True,
        proxy=PROXY,
        humanize=True,
    )

    print(f"{'='*60}")
    print(f"  Email:    {email}")
    print(f"  Username: {username}")
    print(f"{'='*60}")

    with Camoufox(**launch_kwargs) as browser:
        page = browser.new_page()
        print("\ngithub_signup()")
        # Verify proxy IP
        print("\n  Verifying proxy IP...")
        page.goto("https://httpbin.org/ip", timeout=10000)
        ip_text = page.text_content("pre") or page.text_content("body")
        print(f"  IP: {ip_text.strip()}")
        # Navigate to GitHub signup
        print("\n[1/4] Opening GitHub signup...")
        page.goto("https://github.com/signup", wait_until="domcontentloaded", timeout=30000)
        print(f"  URL: {page.url}")
        # Auto-fill form
        print("\n[2/4] Auto-filling form...")
        fill_signup_form(page, email, password)

        # Setup captcha interceptor
        captcha_dir = FUNCAPTCHA_BASE_DIR / username
        captcha_dir.mkdir(parents=True, exist_ok=True)
        print(f"  Captcha images: {captcha_dir}")

        counter, solving, captcha_ready, try_solve = setup_captcha_interceptor(page, captcha_dir)

        print(f"\n[3/4] Waiting for captcha. Auto-solve active.")
        print(f"  Press Ctrl+C to stop.\n")

        try:
            while True:
                page.wait_for_timeout(2000)

                # Detect signup blocked
                try:
                    blocked = page.query_selector("text=\"We couldn't create your account\"")
                    if blocked:
                        print("\n  Signup blocked: unusual activity detected. Closing.")
                        return
                except:
                    pass

                # Check if we passed captcha and reached email confirm page
                if _detect_email_confirm_page(page):
                    print("\n[4/4] Email confirmation detected!")

                    max_attempts = 3
                    used_codes = set()
                    for attempt in range(1, max_attempts + 1):
                        print(f"\n  --- Attempt {attempt}/{max_attempts} ---")
                        code = _poll_launch_code(
                            email, timeout=90, interval=5,
                            exclude_codes=used_codes,
                        )
                        if not code:
                            print("  Could not get verification code.")
                            break
                        used_codes.add(code)

                        # Clear existing digits only on retry
                        if attempt > 1:
                            for i in range(8):
                                el = page.query_selector(f'#launch-code-{i}')
                                if el:
                                    try:
                                        el.click()
                                        el.fill("")
                                    except:
                                        pass

                        # Human-type each digit into its own input
                        for i, digit in enumerate(code):
                            fast_human_type(page, f'#launch-code-{i}', digit)
                        page.wait_for_timeout(1000)

                        # Click continue/verify button
                        for sel in [
                            'button:has-text("Continue")',
                            'button:has-text("Verify")',
                            'button[type="submit"]',
                        ]:
                            try:
                                btn = page.query_selector(sel)
                                if btn and btn.is_visible():
                                    btn.click()
                                    break
                            except:
                                pass

                        page.wait_for_timeout(5000)
                        if _detect_email_confirm_page(page):
                            print(f"  Code {code} rejected, waiting for new email...")
                            page.wait_for_timeout(3000)
                            continue

                        print("  Email verified!")
                        token = device_auth_flow(page)
                        if auto_login(page, email, password):
                            secret = setup_2fa(page)
                            if secret:
                                save_account(email, username, password, secret, token=token)
                            else:
                                print("  2FA setup failed. Check browser.")
                        else:
                            print("  Login failed. Check browser.")
                        break
                    else:
                        print(f"  Failed after {max_attempts} attempts.")

                    input("  Press Enter to close browser...")
                    break

                if not solving[0]:
                    if captcha_ready[0]:
                        try_solve()
                    else:
                        auto_click_verify(page)
        except KeyboardInterrupt:
            print("\n\n  Stopping...")

        captured = list(captcha_dir.glob("*.*"))
        print(f"  Total captcha images captured: {len(captured)}")
        if captured:
            print(f"  Saved in: {captcha_dir}")


if __name__ == "__main__":
    github_signup()


def github_signup_headless(email, step_callback=None):
    """Signup flow callable from TUI. step_callback(idx, state) updates UI steps.
    Steps: 0=Rotate IP, 1=Fill form, 2=Solve captcha, 3=Email verify, 4=Login, 5=Setup 2FA, 6=Save account
    """
    def _step(idx, state):
        if step_callback:
            step_callback(idx, state)

    clean_profile()

    _step(0, "active")
    rotate_ip()
    _step(0, "done")

    username = email.split("@")[0]
    password = email

    launch_kwargs = dict(
        headless=False,
        geoip=True,
        proxy=PROXY,
        humanize=True,
    )

    print(f"{'='*60}")
    print(f"  Email:    {email}")
    print(f"  Username: {username}")
    print(f"{'='*60}")

    with Camoufox(**launch_kwargs) as browser:
        page = browser.new_page()
        print("\ngithub_signup_headless()")
        print("\n  Verifying proxy IP...")
        page.goto("https://httpbin.org/ip", timeout=10000)
        ip_text = page.text_content("pre") or page.text_content("body")
        print(f"  IP: {ip_text.strip()}")

        print("\n[1/7] Opening GitHub signup...")
        page.goto("https://github.com/signup", wait_until="domcontentloaded", timeout=30000)
        
        _step(1, "active")
        #time.sleep(1000000)
        print("[2/7] Auto-filling form...")
        fill_signup_form(page, email, password)
        _step(1, "done")

        captcha_dir = FUNCAPTCHA_BASE_DIR / username
        captcha_dir.mkdir(parents=True, exist_ok=True)

        counter, solving, captcha_ready, try_solve = setup_captcha_interceptor(page, captcha_dir)

        _step(2, "active")
        print("[3/7] Waiting for captcha...")

        while True:
            page.wait_for_timeout(1000)

            if _detect_email_confirm_page(page):
                _step(2, "done")
                _step(3, "active")
                print("[4/7] Email confirmation detected!")

                max_attempts = 3
                used_codes = set()
                verified = False
                for attempt in range(1, max_attempts + 1):
                    print(f"\n  --- Attempt {attempt}/{max_attempts} ---")
                    code = _poll_launch_code(
                        email, timeout=120, interval=5,
                        exclude_codes=used_codes,
                    )
                    if not code:
                        break
                    used_codes.add(code)

                    # Clear existing digits only on retry
                    if attempt > 1:
                        for i in range(8):
                            el = page.query_selector(f'#launch-code-{i}')
                            if el:
                                try:
                                    el.click()
                                    el.fill("")
                                except:
                                    pass

                    # Human-type each digit into its own input
                    for i, digit in enumerate(code):
                        _human_type(page, f'#launch-code-{i}', digit)
                    page.wait_for_timeout(1000)

                    # Click continue/verify button
                    for sel in [
                        'button:has-text("Continue")',
                        'button:has-text("Verify")',
                        'button[type="submit"]',
                    ]:
                        try:
                            btn = page.query_selector(sel)
                            if btn and btn.is_visible():
                                btn.click()
                                break
                        except:
                            pass

                    page.wait_for_timeout(5000)
                    if _detect_email_confirm_page(page):
                        print(f"  Code {code} rejected...")
                        page.wait_for_timeout(3000)
                        continue
                    else:
                        verified = True
                        break
                _step(3, "done")
                if not verified:
                    print("  Email verification failed.")
                    return

                print("  Email verified!")

                # Device auth
                token = device_auth_flow(page)

                # Login
                _step(4, "active")
                if not auto_login(page, email, password):
                    print("  Login failed.")
                    _step(4, "done")
                    return
                _step(4, "done")

                # 2FA
                _step(5, "active")
                secret = setup_2fa(page)
                _step(5, "done")

                if secret:
                    _step(6, "active")
                    save_account(email, username, password, secret, token=token)
                    _step(6, "done")
                    print("\n  Signup complete!")
                else:
                    print("  2FA setup failed.")
                return

            if not solving[0]:
                if captcha_ready[0]:
                    try_solve()
                else:
                    auto_click_verify(page)
