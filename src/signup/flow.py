"""GitHub signup orchestration with Camoufox stealth browser."""

import shutil
from datetime import datetime
from camoufox.sync_api import Camoufox

from .config import PROXY, PROFILE_DIR, FUNCAPTCHA_BASE_DIR
from .proxy import rotate_ip
from .interceptor import setup_captcha_interceptor
from .game_frame import auto_click_verify
from .form_filler import fill_signup_form
from .email_verifier import get_verification_code, fill_verification_code


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

        # ĐẶC BIỆT: Override Page Visibility API — có thể ảnh hưởng tới cách captcha phát hiện, BETA-TESTING
        page.add_init_script("""
            Object.defineProperty(document, 'hidden', { get: () => false });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
            document.addEventListener('visibilitychange', e => { e.stopImmediatePropagation(); }, true);
        """)

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

        counter, solving = setup_captcha_interceptor(page, captcha_dir)

        print(f"\n[3/4] Waiting for captcha. Auto-solve active.")
        print(f"  Press Ctrl+C to stop.\n")

        try:
            while True:
                page.wait_for_timeout(1000)

                # Check if we passed captcha and reached email confirm page
                if _detect_email_confirm_page(page):
                    print("\n[4/4] Email confirmation detected!")
                    code = get_verification_code(timeout=120, interval=5)
                    if code:
                        fill_verification_code(page, code)
                        page.wait_for_timeout(3000)
                        print(f"\n  Signup complete! Check browser.")
                    else:
                        print(f"  Could not get verification code. Enter manually.")
                    # Keep browser open for manual intervention
                    input("  Press Enter to close browser...")
                    break

                if not solving[0]:
                    auto_click_verify(page)
        except KeyboardInterrupt:
            print("\n\n  Stopping...")

        captured = list(captcha_dir.glob("*.*"))
        print(f"  Total captcha images captured: {len(captured)}")
        if captured:
            print(f"  Saved in: {captcha_dir}")


if __name__ == "__main__":
    github_signup()
