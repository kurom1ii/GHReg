"""Poll Outlook inbox for GitHub verification code and auto-fill."""

import re
import time
from datetime import datetime, timezone
from pathlib import Path

from ..outlook import OutlookClient

OUTLOOK_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "outlook.txt"
GITHUB_SENDER = "noreply@github.com"
MAX_EMAIL_AGE_SECONDS = 100


def _load_outlook_client() -> OutlookClient | None:
    """Load first Outlook account from data/outlook.txt."""
    if not OUTLOOK_FILE.exists():
        print(f"  [Email] outlook.txt not found: {OUTLOOK_FILE}")
        return None
    for line in OUTLOOK_FILE.read_text().strip().splitlines():
        parts = line.strip().split("|")
        if len(parts) >= 4:
            try:
                client = OutlookClient(parts[0], parts[1], parts[2], parts[3])
                print(f"  [Email] Connected: {client.display_name} <{client.email}>")
                return client
            except Exception as e:
                print(f"  [Email] Outlook login failed ({parts[0]}): {e}")
    return None


def get_verification_code(signup_email, timeout=120, interval=5, exclude_codes=None):
    """Poll Outlook inbox for GitHub launch code sent to signup_email.
    Returns 8-digit code string or None."""
    print(f"  [Email] Waiting for GitHub launch code to {signup_email}...")

    client = _load_outlook_client()
    if not client:
        return None

    start = time.time()
    seen_ids = set()
    exclude = exclude_codes or set()

    while time.time() - start < timeout:
        try:
            msgs, _ = client.list_messages(top=10)

            for msg in msgs:
                if msg.id in seen_ids:
                    continue

                # Check sender is GitHub
                if GITHUB_SENDER not in msg.sender_email.lower():
                    seen_ids.add(msg.id)
                    continue

                # Check subject contains launch code
                if "launch code" not in msg.subject.lower():
                    seen_ids.add(msg.id)
                    continue

                # Check email is fresh
                if msg.date:
                    try:
                        received_dt = datetime.fromisoformat(msg.date.replace("Z", "+00:00"))
                        age = (datetime.now(timezone.utc) - received_dt).total_seconds()
                        if age > MAX_EMAIL_AGE_SECONDS:
                            seen_ids.add(msg.id)
                            continue
                    except:
                        pass

                # Get full message to check recipient and extract code
                full_msg = client.get_message(msg.id)
                body = full_msg.body_text or full_msg.preview

                # Extract 8-digit code
                match = re.search(r'(\d{8})', body)
                if match:
                    code = match.group(1)
                    if code in exclude:
                        seen_ids.add(msg.id)
                        continue
                    print(f"  [Email] Found code: {code} (from: {msg.sender_email})")
                    # Mark as read
                    try:
                        client.mark_read(msg.id)
                    except:
                        pass
                    return code

                seen_ids.add(msg.id)

        except Exception as e:
            print(f"  [Email] Poll error: {e}")

        elapsed = int(time.time() - start)
        print(f"  [Email] No code yet... ({elapsed}s/{timeout}s)")
        time.sleep(interval)

    print(f"  [Email] Timeout after {timeout}s")
    return None


def fill_verification_code(page, code):
    """Fill the 8-digit verification code into GitHub's input fields.
    Clears existing input first."""
    print(f"  [Email] Filling code: {code}")

    # Clear all digit inputs first
    digit_inputs = []
    for i in range(8):
        sel = f'input[aria-label*="Digit {i + 1}" i]'
        el = page.query_selector(sel)
        if el:
            digit_inputs.append(el)
    if not digit_inputs:
        digit_inputs = page.query_selector_all(
            'input[type="text"][maxlength="1"], input[type="number"][maxlength="1"], input[autocomplete="one-time-code"]'
        )

    # Clear existing values
    for el in digit_inputs:
        try:
            el.click()
            el.fill("")
        except:
            pass

    # Fill digits
    for i, digit in enumerate(code):
        if i < len(digit_inputs):
            digit_inputs[i].click()
            page.keyboard.type(digit, delay=0)
        else:
            print(f"    Digit {i + 1} input not found")
            return False

    print(f"  [Email] Code filled!")
    return True
