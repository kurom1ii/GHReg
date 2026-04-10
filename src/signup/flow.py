"""GitHub signup orchestration with Camoufox stealth browser."""

import shutil
from datetime import datetime
from camoufox.sync_api import Camoufox

from .config import PROXY, PROFILE_DIR, FUNCAPTCHA_BASE_DIR
from .proxy import rotate_ip
from .interceptor import setup_captcha_interceptor
from .game_frame import auto_click_verify


def clean_profile():
    """Delete and recreate browser profile directory."""
    if PROFILE_DIR.exists():
        shutil.rmtree(PROFILE_DIR, ignore_errors=True)
        print("  Old profile deleted")
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)


def github_signup():
    clean_profile()
    rotate_ip()

    launch_kwargs = dict(
        headless=False,
        geoip=True,
        proxy=PROXY,
        humanize=True,
    )

    print(f"{'='*60}")

    with Camoufox(**launch_kwargs) as browser:
        page = browser.new_page()

        # Verify proxy IP
        print("\n  Verifying proxy IP...")
        page.goto("https://httpbin.org/ip", timeout=1000)
        ip_text = page.text_content("pre") or page.text_content("body")
        print(f"  IP: {ip_text.strip()}")

        # Navigate to GitHub signup
        print("\n[1/2] Opening GitHub signup...")
        page.goto("https://github.com/signup", wait_until="domcontentloaded", timeout=30000)
        print(f"  URL: {page.url}")

        username = input("  Enter username (for captcha folder name): ").strip()
        if not username:
            username = f"unknown_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        captcha_dir = FUNCAPTCHA_BASE_DIR / username
        captcha_dir.mkdir(parents=True, exist_ok=True)
        print(f"  Captcha images: {captcha_dir}")

        counter, solving = setup_captcha_interceptor(page, captcha_dir)

        print(f"\n[2/2] Fill form in browser. Captcha auto-started + auto-solved.")
        print(f"  Press Ctrl+C to stop.\n")

        try:
            while True:
                page.wait_for_timeout(1000)
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
