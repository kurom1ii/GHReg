"""Post-signup automation: login, 2FA setup, save account."""

import re
import pyotp
from pathlib import Path

ACCOUNTS_FILE = Path("/home/kuromi/work/mywork/GHReg/gh-check/data/accounts.txt")


def _fast_type(page, selector, text):
    """Click element and type text instantly (0ms delay)."""
    el = None
    for sel in selector.split(", "):
        sel = sel.strip()
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                break
            el = None
        except:
            pass
    if not el:
        print(f"    Selector not found: {selector}")
        return False
    el.click()
    page.keyboard.type(text, delay=0)
    return True


def _click(page, selectors):
    """Click first visible element from selector list. Returns text of clicked element."""
    if isinstance(selectors, str):
        selectors = [selectors]
    for sel in selectors:
        try:
            btn = page.query_selector(sel)
            if btn and btn.is_visible():
                text = (btn.text_content() or "").strip()
                btn.click()
                return text
        except:
            pass
    return None


def auto_login(page, email, password):
    """Auto-login on GitHub /login page after successful signup."""
    print("\n[5/7] Auto-login...")
    page.wait_for_timeout(2000)

    if "/login" not in page.url:
        print(f"  Not on login page: {page.url}")
        return False

    print("  Filling credentials...")
    _fast_type(page, '#login_field, input[name="login"]', email)
    _fast_type(page, '#password, input[name="password"]', password)

    clicked = _click(page, [
        'input[type="submit"][value*="Sign in"]',
        'button:has-text("Sign in")',
        'input[name="commit"]',
    ])
    if clicked:
        print(f"  Clicked Sign in")

    page.wait_for_timeout(3000)

    if "/login" not in page.url:
        print(f"  Login success! URL: {page.url}")
        return True

    print(f"  Login may have failed. URL: {page.url}")
    return False


def setup_2fa(page):
    """Enable 2FA on GitHub and return the TOTP secret key."""
    print("\n[6/7] Setting up 2FA...")

    page.goto("https://github.com/settings/security", wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(2000)

    # Click "Enable two-factor authentication"
    clicked = _click(page, [
        'a:has-text("Enable two-factor authentication")',
        'button:has-text("Enable two-factor authentication")',
        'a[href*="two_factor_authentication"]',
    ])
    if clicked:
        print(f"  Clicked Enable 2FA")
    page.wait_for_timeout(2000)

    # Click "setup key" to reveal TOTP secret
    clicked = _click(page, [
        'a:has-text("setup key")',
        'button:has-text("setup key")',
        'a:has-text("Setup key")',
        'button:has-text("Setup key")',
    ])
    if clicked:
        print(f"  Clicked setup key")
    page.wait_for_timeout(1500)

    # Extract the TOTP secret key
    secret = _extract_totp_secret(page)
    if not secret:
        print("  2FA secret key not found!")
        return None

    print(f"  2FA Secret: {secret}")

    # Close the setup key dialog/modal (click X button)
    _click(page, [
        'dialog#two-factor-setup-verification-mashed-secret button.Overlay-closeButton',
        'dialog#two-factor-setup-verification-mashed-secret button.close-button',
        'button.Overlay-closeButton',
        'button:has(.octicon-x)',
        'button[aria-label="Close"]',
        'button[aria-label="Close dialog"]',
        'button[data-close-dialog]',
        'button[data-close-dialog-id]',
        'button.close-button',
        'button:has-text("Close")',
        '[data-close-dialog]',
    ])
    page.wait_for_timeout(1000)

    # Generate TOTP code
    totp = pyotp.TOTP(secret)
    code = totp.now()
    print(f"  TOTP Code: {code}")

    # Fill TOTP code
    for sel in [
        'input[id*="totp" i]',
        'input[name*="otp" i]',
        'input[name*="totp" i]',
        'input[aria-label*="code" i]',
        'input[placeholder*="code" i]',
        'input[placeholder*="XXXXXX" i]',
    ]:
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click()
                page.keyboard.type(code, delay=0)
                print(f"  Filled TOTP code")
                break
        except:
            pass

    # Click Continue/Verify
    clicked = _click(page, [
        'button:has-text("Continue")',
        'button[type="submit"]',
    ])
    if clicked:
        print(f"  Clicked: {clicked}")

    # Click Download recovery codes
    clicked = _click(page, [
        'button:has-text("Download")',
        'a:has-text("Download")',
    ])
    if clicked:
        print("  Clicked Download")

    # Click "I have saved my recovery codes"
    clicked = _click(page, [
        'button:has-text("I have saved my recovery codes")',
        'button:has-text("saved my recovery")',
        'button:has-text("Done")',
    ])
    if clicked:
        print(f"  Clicked: {clicked}")
    page.wait_for_timeout(1500)

    # Verify 2FA enabled
    try:
        body_text = page.text_content('body') or ""
        if "two-factor authentication" in body_text.lower() and "enabled" in body_text.lower():
            print("  2FA enabled successfully!")
    except:
        pass

    return secret


def _extract_totp_secret(page):
    """Extract TOTP secret key (base32 string) from page."""
    for sel in ['code', '.two-factor-secret', 'pre', 'input[readonly]', 'dd']:
        try:
            els = page.query_selector_all(sel)
            for el in els:
                text = (el.text_content() or "").strip()
                if re.match(r'^[A-Z2-7]{16,}$', text):
                    return text
        except:
            pass

    # Fallback: scan page text
    try:
        body_text = page.text_content('body') or ""
        match = re.search(r'\b([A-Z2-7]{16,})\b', body_text)
        if match:
            return match.group(1)
    except:
        pass
    return None


def save_account(email, username, password, secret_2fa, token=None):
    """Save account to file in email|username|password|2FA|token format. Skips duplicates."""
    ACCOUNTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    line = f"{email}|{username}|{password}|{secret_2fa}"
    if token:
        line += f"|{token}"

    # Check for duplicates
    if ACCOUNTS_FILE.exists():
        existing = ACCOUNTS_FILE.read_text()
        if line in existing:
            print(f"\n[7/7] Account already exists, skipped.")
            return
        # Ensure file ends with newline before appending
        if existing and not existing.endswith('\n'):
            with open(ACCOUNTS_FILE, "a") as f:
                f.write('\n')

    with open(ACCOUNTS_FILE, "a") as f:
        f.write(line + '\n')
    print(f"\n[7/7] Account saved to {ACCOUNTS_FILE}")
    print(f"  {line}")
