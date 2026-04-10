#!/usr/bin/env python3
"""
GitHub signup with Camoufox (stealth Firefox).
Manual mode: you fill form yourself.
Auto-solves FunCaptcha via YesCaptcha API (6-grid + rotation + multi-round).
"""

import os
import sys
import re
import shutil
import json
import time
import base64
import requests
from pathlib import Path
from datetime import datetime
from camoufox.sync_api import Camoufox

# ====== Configuration ======
PROXY_HOST = "ybdc1.proxyno1.com"
PROXY_PORT = 47244
PROXY_KEY = "XjZcNObANHVu9Ij2aIr59C1775727581"
ROTATE_IP_API = f"https://app.proxyno1.com/api/change-key-ip/{PROXY_KEY}"
ROTATE_WAIT = 10

PROXY = {"server": f"http://{PROXY_HOST}:{PROXY_PORT}"}

YESCAPTCHA_KEY = "d732aa8b947a7c4c590fefcb82490e75ddf1072081378"
YESCAPTCHA_BASE = "https://api.yescaptcha.com"
YESCAPTCHA_SOFT_ID = 75315

PROJECT_DIR = Path(__file__).resolve().parent.parent
EXTENSIONS_DIR = PROJECT_DIR / "extensions"
PROFILE_DIR = PROJECT_DIR / ".chrome_profile"
FUNCAPTCHA_BASE_DIR = PROJECT_DIR / "data" / "funcaptcha"

MAX_ROUNDS = 15


# ====== Helpers ======

def clean_profile():
    if PROFILE_DIR.exists():
        shutil.rmtree(PROFILE_DIR, ignore_errors=True)
        print("  🗑️ Old profile deleted")
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)


def rotate_ip():
    print("🔄 Rotating proxy IP...")
    try:
        resp = requests.get(ROTATE_IP_API, timeout=15)
        data = resp.json()
        if data.get("status") == 0:
            print(f"  ✅ IP rotated: {data.get('message', 'OK')}")
            print(f"  ⏳ Waiting {ROTATE_WAIT}s...")
            time.sleep(ROTATE_WAIT)
            return True
        elif data.get("status") == 5:
            print("  ⏳ Rate limited, retrying in 5s...")
            time.sleep(5)
            return rotate_ip()
        else:
            print(f"  ⚠️ Rotate failed: {data}")
            return False
    except Exception as e:
        print(f"  ⚠️ Rotate error: {e}")
        return False


# ====== YesCaptcha API ======

def solve_with_yescaptcha(image_b64_raw, question):
    """Call YesCaptcha FunCaptchaClassification API.
    image_b64_raw: raw base64 string WITHOUT data:image prefix."""
    payload = {
        "clientKey": YESCAPTCHA_KEY,
        "task": {
            "type": "FunCaptchaClassification",
            "image": image_b64_raw,
            "question": question,
        },
        "softID": YESCAPTCHA_SOFT_ID,
    }
    try:
        resp = requests.post(f"{YESCAPTCHA_BASE}/createTask", json=payload, timeout=30)
        data = resp.json()

        # Immediate result
        if data.get("errorId") == 0 and data.get("status") == "ready" and data.get("solution"):
            return _parse_solution(data["solution"])

        # Need polling
        task_id = data.get("taskId")
        if data.get("errorId") == 0 and task_id:
            return _poll_task_result(task_id)

        print(f"    ⚠️ YesCaptcha error: {data.get('errorCode', '')} {data.get('errorDescription', '')}")
        return None
    except Exception as e:
        print(f"    ⚠️ YesCaptcha request failed: {e}")
        return None


def _poll_task_result(task_id, max_polls=20, interval=3):
    """Poll getTaskResult until ready."""
    for i in range(max_polls):
        time.sleep(interval)
        try:
            resp = requests.post(f"{YESCAPTCHA_BASE}/getTaskResult", json={
                "clientKey": YESCAPTCHA_KEY,
                "taskId": task_id,
            }, timeout=15)
            data = resp.json()
            if data.get("status") == "ready" and data.get("solution"):
                return _parse_solution(data["solution"])
            if data.get("errorId") != 0:
                print(f"    ⚠️ Poll error: {data.get('errorCode')}")
                return None
        except:
            pass
    print(f"    ⚠️ Polling timeout after {max_polls * interval}s")
    return None


def _parse_solution(solution):
    """Parse YesCaptcha solution into standardized result."""
    objects = solution.get("objects", [])
    labels = solution.get("labels", [])
    confidences = solution.get("confidences", [])
    label = solution.get("label", "")
    return {
        "objects": objects,
        "labels": labels,
        "confidences": confidences,
        "label": label,
    }


# ====== Captcha Frame Helpers ======

def find_game_frame(page):
    """Find the game-core-frame among all frames."""
    for frame in page.frames:
        if 'game-core' in (frame.url or '') or 'game_core' in (frame.url or ''):
            return frame
        try:
            # Check if this frame has captcha content
            h2 = frame.query_selector('#root h2, h2')
            if h2:
                text = (h2.text_content() or '').lower()
                if any(kw in text for kw in ['pick', 'select', 'use the', 'rotate', 'change', 'move', 'connect', 'which', 'match']):
                    return frame
        except:
            pass
    return None


def get_captcha_question(page):
    """Extract question text from game frame h2."""
    frame = find_game_frame(page)
    if not frame:
        return None
    try:
        h2 = frame.query_selector('#root h2, h2')
        if h2:
            text = (h2.text_content() or '').strip()
            if len(text) > 5:
                return text
    except:
        pass
    return None


def parse_round_info(question):
    """Extract (current, total) from '(2 of 3)' in question text."""
    match = re.search(r'\(?\s*(\d+)\s+of\s+(\d+)\s*\)?', question or '')
    if match:
        return int(match.group(1)), int(match.group(2))
    return 1, 1





# ====== Click Actions ======

def click_arrow(page, direction, times=1):
    """Click left/right arrow in game frame."""
    frame = find_game_frame(page)
    if not frame:
        return False
    for _ in range(times):
        sel = 'a[aria-label*="previous" i], button[aria-label*="previous" i]' if direction == 'left' \
            else 'a[aria-label*="next" i], button[aria-label*="next" i]'
        btn = frame.query_selector(sel)
        if btn:
            btn.click()
            page.wait_for_timeout(400)
        else:
            return False
    return True


def click_submit(page):
    """Click Submit button in game frame."""
    frame = find_game_frame(page)
    if not frame:
        return False
    for sel in ['button:has-text("Submit")', 'button.sc-nkuzb1-0', 'button[type="submit"]']:
        try:
            btn = frame.query_selector(sel)
            if btn and btn.is_visible():
                btn.click()
                return True
        except:
            pass
    return False


def detect_try_again(page):
    """Check if 'Try again' button appeared (wrong answer)."""
    frame = find_game_frame(page)
    if not frame:
        return False
    try:
        for sel in ['button:has-text("Try again")', 'button:has-text("try again")', 'button.dJlpAa']:
            btn = frame.query_selector(sel)
            if btn and btn.is_visible():
                return True
    except:
        pass
    return False


def click_try_again(page):
    """Click Try again button."""
    frame = find_game_frame(page)
    if not frame:
        return False
    for sel in ['button:has-text("Try again")', 'button:has-text("try again")', 'button.dJlpAa']:
        try:
            btn = frame.query_selector(sel)
            if btn and btn.is_visible():
                btn.click()
                return True
        except:
            pass
    return False



# ====== Solve Logic ======



# ====== Main Captcha Loop ======

def auto_click_verify(page):
    """Auto-click Verify / Visual challenge button to start captcha."""
    for frame in page.frames:
        try:
            for sel in [
                'button[aria-label*="Visual challenge" i]',
                'button:has-text("Verify")',
                'button[data-theme*="verify" i]',
                'button:has-text("Start")',
            ]:
                btn = frame.query_selector(sel)
                if btn and btn.is_visible():
                    btn.click()
                    print(f"  🔘 Auto-clicked: {sel}")
                    return True
        except:
            continue
    return False


def setup_captcha_interceptor(page, save_dir: Path):
    """Listen for captcha images → auto-solve with multi-round support."""
    counter = [0]
    solving = [False]
    last_image_b64 = [None]  # Store latest captured image for solver

    def on_response(response):
        try:
            url = response.url
            if 'arkoselabs' not in url or '/rtig/image' not in url:
                return
            content_type = response.headers.get('content-type', '')
            if 'image' not in content_type:
                return
            body = response.body()
            if len(body) < 5000:
                return

            counter[0] += 1
            (save_dir / f"captcha_{counter[0]}.jpg").write_bytes(body)
            img_b64 = base64.b64encode(body).decode()
            last_image_b64[0] = img_b64
            print(f"  📸 captcha_{counter[0]} ({len(body)} bytes)")

            if solving[0]:
                return

            # First real image triggers the solve loop
            solving[0] = True
            print(f"\n  🔐 FunCaptcha detected! Starting auto-solve...")

            # Wait for challenge to fully render
            page.wait_for_timeout(1500)

            for round_num in range(MAX_ROUNDS):
                question = get_captcha_question(page)
                if not question:
                    print(f"  ⚠️ No question found, waiting...")
                    page.wait_for_timeout(2000)
                    question = get_captcha_question(page)
                if not question:
                    print(f"  ❌ Cannot detect question — stopping")
                    break

                current, total = parse_round_info(question)
                print(f"\n  === Round {current}/{total} ===")
                print(f"  ❓ {question}")

                # Use the latest intercepted image
                if not last_image_b64[0]:
                    print(f"  ❌ No captcha image available")
                    break

                print(f"  🧠 Solving...")
                result = solve_with_yescaptcha(last_image_b64[0], question)
                if not result:
                    print(f"  ❌ API failed")
                    break

                raw_objects = result.get('objects', [])
                labels = result.get('labels', [])
                display = [x + 1 for x in raw_objects]
                print(f"  ✅ Answer: positions={display} labels={labels}")

                clicks = raw_objects[0] if raw_objects else 0
                if clicks > 0:
                    click_arrow(page, 'right', clicks)
                    print(f"  ➡️ Clicked right x{clicks}")
                    page.wait_for_timeout(500)

                click_submit(page)

                # Last round — done
                if current >= total:
                    page.wait_for_timeout(2000)
                    if detect_try_again(page):
                        print(f"  ⚠️ Wrong answer — clicking Try Again")
                        click_try_again(page)
                        page.wait_for_timeout(2000)
                        last_image_b64[0] = None
                        continue
                    print(f"\n  🎉 Captcha solved!")
                    break

                # Wait for next round — new image will arrive via interceptor
                page.wait_for_timeout(3000)

                # Check try again
                if detect_try_again(page):
                    print(f"  ⚠️ Wrong answer — clicking Try Again")
                    click_try_again(page)
                    page.wait_for_timeout(2000)
                    last_image_b64[0] = None
                    continue

                # Check if captcha is gone
                new_q = get_captcha_question(page)
                if not new_q:
                    print(f"\n  🎉 Captcha solved!")
                    break

            # Cooldown
            page.wait_for_timeout(5000)
            solving[0] = False
            last_image_b64[0] = None

        except Exception as e:
            print(f"  ⚠️ Solver error: {e}")
            page.wait_for_timeout(3000)
            solving[0] = False

    page.on("response", on_response)
    print(f"  👁️ Interceptor active — auto-solve with multi-round support")
    return counter, solving


# ====== Main ======

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
        print("\n  🔍 Verifying proxy IP...")
        page.goto("https://httpbin.org/ip", timeout=15000)
        ip_text = page.text_content("pre") or page.text_content("body")
        print(f"  🌍 IP: {ip_text.strip()}")

        # Navigate to GitHub signup
        print("\n[1/2] Opening GitHub signup...")
        page.goto("https://github.com/signup", wait_until="domcontentloaded", timeout=30000)
        print(f"  URL: {page.url}")

        username = input("  👤 Enter username (for captcha folder name): ").strip()
        if not username:
            username = f"unknown_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        captcha_dir = FUNCAPTCHA_BASE_DIR / username
        captcha_dir.mkdir(parents=True, exist_ok=True)
        print(f"  📁 Captcha images: {captcha_dir}")

        counter, solving = setup_captcha_interceptor(page, captcha_dir)

        print(f"\n[2/2] Fill form in browser. Captcha auto-started + auto-solved.")
        print(f"  Press Ctrl+C to stop.\n")

        try:
            while True:
                page.wait_for_timeout(1000)
                # Only auto-click Verify when not currently solving
                if not solving[0]:
                    auto_click_verify(page)
        except KeyboardInterrupt:
            print("\n\n  Stopping...")

        captured = list(captcha_dir.glob("*.*"))
        print(f"  📸 Total captcha images captured: {len(captured)}")
        if captured:
            print(f"  📁 Saved in: {captcha_dir}")


if __name__ == "__main__":
    github_signup()
