"""Poll email API for GitHub verification code and auto-fill."""

import re
import time
import requests

EMAIL_API_BASE = "http://localhost:3456"


def get_verification_code(timeout=120, interval=5):
    """Poll email API for GitHub launch code. Returns code string or None."""
    print("  [Email] Waiting for GitHub verification code...")
    start = time.time()

    while time.time() - start < timeout:
        try:
            resp = requests.get(
                f"{EMAIL_API_BASE}/api/emails/search",
                params={"q": "GitHub launch code", "top": 3},
                timeout=10,
            )
            data = resp.json()
            emails = data.get("emails", [])

            for email in emails:
                # Get full email detail
                detail = requests.get(
                    f"{EMAIL_API_BASE}/api/emails/detail",
                    params={"id": email["id"]},
                    timeout=10,
                ).json()

                body = detail.get("email", {}).get("body", {}).get("content", "")
                # Extract code — GitHub uses 6-8 digit codes
                match = re.search(r'(\d{6,8})', body)
                if match:
                    code = match.group(1)
                    print(f"  [Email] Found code: {code}")
                    # Mark as read
                    try:
                        requests.post(
                            f"{EMAIL_API_BASE}/api/emails/mark-read",
                            json={"id": email["id"]},
                            timeout=5,
                        )
                    except:
                        pass
                    return code

        except Exception as e:
            print(f"  [Email] Poll error: {e}")

        elapsed = int(time.time() - start)
        print(f"  [Email] No code yet... ({elapsed}s/{timeout}s)")
        time.sleep(interval)

    print(f"  [Email] Timeout after {timeout}s")
    return None


def fill_verification_code(page, code):
    """Fill the 8-digit verification code into GitHub's input fields."""
    print(f"  [Email] Filling code: {code}")

    # GitHub uses individual digit inputs
    for i, digit in enumerate(code):
        sel = f'input[aria-label*="Digit {i + 1}" i]'
        el = page.query_selector(sel)
        if el:
            el.click()
            page.wait_for_timeout(50)
            page.keyboard.type(digit, delay=30)
            page.wait_for_timeout(50)
        else:
            # Fallback: try nth input in the code container
            inputs = page.query_selector_all('input[type="text"][maxlength="1"], input[type="number"][maxlength="1"], input[autocomplete="one-time-code"]')
            if i < len(inputs):
                inputs[i].click()
                page.wait_for_timeout(50)
                page.keyboard.type(digit, delay=30)
                page.wait_for_timeout(50)
            else:
                print(f"    Digit {i + 1} input not found")
                return False

    print(f"  [Email] Code filled!")
    return True
