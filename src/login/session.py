"""GitHub login via curl_cffi with Chrome TLS fingerprint + TOTP 2FA."""

import sys
from curl_cffi import requests as cffi_requests

from ..common.headers import NAV_HEADERS, POST_HEADERS, XHR_HEADERS
from ..common.parsers import FormParser


def _resolve_url(location: str) -> str:
    """Turn a Location header into a full URL."""
    if location.startswith("http"):
        return location
    return f"https://github.com{location}"


def _submit_2fa(session, location: str, totp_code: str) -> bool:
    """Handle the 2FA page: GET form, submit TOTP code, verify cookies."""
    tfa_url = _resolve_url(location)
    print(f"\n[3] GET {tfa_url} ...")

    resp = session.get(
        tfa_url,
        headers={
            **NAV_HEADERS,
            "Referer": "https://github.com/session",
            "Sec-Fetch-Site": "same-origin",
        },
    )
    if resp.status_code != 200:
        print(f"    Failed to get 2FA page: {resp.status_code}")
        return False

    parser = FormParser("/sessions/two-factor")
    parser.feed(resp.text)
    tfa_fields = parser.hidden_fields

    if "authenticity_token" not in tfa_fields:
        print("    authenticity_token not found on 2FA page")
        return False

    print(f"    Extracted {len(tfa_fields)} hidden fields")

    form_data = {
        "authenticity_token": tfa_fields["authenticity_token"],
        "app_otp": totp_code,
    }

    print(f"\n[4] POST /sessions/two-factor  (otp={totp_code}) ...")
    resp = session.post(
        "https://github.com/sessions/two-factor",
        data=form_data,
        headers={
            **POST_HEADERS,
            "Referer": tfa_url,
        },
        allow_redirects=False,
    )
    print(f"    Status: {resp.status_code}")
    print(f"    Location: {resp.headers.get('Location', 'none')}")

    logged_in = session.cookies.get("logged_in")
    dotcom_user = session.cookies.get("dotcom_user")

    if logged_in == "yes" and dotcom_user:
        print(f"    2FA success: {dotcom_user}")
        return True

    print("    2FA verification failed")
    return False


def github_login(session, username: str, password: str, totp_secret: str | None = None) -> bool:
    """Login to GitHub using an existing session.

    Args:
        session: curl_cffi session (impersonate="chrome").
        username: GitHub username or email.
        password: Account password.
        totp_secret: Base32 TOTP secret for 2FA (optional).

    Returns:
        True on successful login.
    """
    # --- Step 1: GET /login ---
    print("[1] GET /login ...")
    resp = session.get("https://github.com/login", headers=NAV_HEADERS)
    if resp.status_code != 200:
        print(f"    Failed to get login page: {resp.status_code}")
        return False

    parser = FormParser("/session")
    parser.feed(resp.text)
    fields = parser.hidden_fields

    if "authenticity_token" not in fields:
        print("    authenticity_token not found")
        return False

    print(f"    Extracted {len(fields)} hidden fields")

    # --- Step 2: POST /session ---
    form_data = {
        "commit": "Sign in",
        "authenticity_token": fields["authenticity_token"],
        "login": username,
        "password": password,
        "webauthn-conditional": "undefined",
        "javascript-support": "true",
        "webauthn-support": "supported",
        "webauthn-iuvpaa-support": "unsupported",
        "return_to": "https://github.com/login",
        "allow_signup": "",
        "client_id": "",
        "integration": "",
        "timestamp": fields.get("timestamp", ""),
        "timestamp_secret": fields.get("timestamp_secret", ""),
    }
    for k in fields:
        if k.startswith("required_field_"):
            form_data[k] = ""

    print("\n[2] POST /session ...")
    resp = session.post(
        "https://github.com/session",
        data=form_data,
        headers={**POST_HEADERS, "Referer": "https://github.com/login"},
        allow_redirects=False,
    )
    print(f"    Status: {resp.status_code}")
    print(f"    Location: {resp.headers.get('Location', 'none')}")

    logged_in = session.cookies.get("logged_in")
    dotcom_user = session.cookies.get("dotcom_user")

    if logged_in == "yes" and dotcom_user:
        print(f"    Login success: {dotcom_user}")
        return True

    # --- Step 3-4: Handle 2FA if needed ---
    location = resp.headers.get("Location", "")
    if "/sessions/two-factor" in location:
        if not totp_secret:
            print("    2FA required but no totp_secret provided")
            return False

        import pyotp
        totp = pyotp.TOTP(totp_secret)
        otp_code = totp.now()
        return _submit_2fa(session, location, otp_code)

    print("    Login failed")
    return False


def github_login_standalone(username: str, password: str, totp_secret: str | None = None) -> None:
    """Standalone login with full verification (creates own session)."""
    session = cffi_requests.Session(impersonate="chrome")

    # Step 1: GET /login
    print("[1] GET /login ...")
    print("    TLS: chrome (JA3)")

    resp = session.get("https://github.com/login", headers=NAV_HEADERS)
    print(f"    Status: {resp.status_code}")
    print(f"    HTTP version: {resp.http_version}")

    if resp.status_code != 200:
        print("    Failed to get login page")
        return

    parser = FormParser()
    parser.feed(resp.text)
    fields = parser.hidden_fields

    print(f"    Extracted {len(fields)} hidden fields:")
    for k, v in fields.items():
        display_v = v[:40] + "..." if len(v) > 40 else v
        print(f"      {k} = {display_v}")

    if "authenticity_token" not in fields:
        print("    authenticity_token not found, abort")
        return

    # Step 2: POST /session
    print("\n[2] POST /session ...")

    form_data = {
        "commit": "Sign in",
        "authenticity_token": fields["authenticity_token"],
        "login": username,
        "password": password,
        "webauthn-conditional": "undefined",
        "javascript-support": "true",
        "webauthn-support": "supported",
        "webauthn-iuvpaa-support": "unsupported",
        "return_to": "https://github.com/login",
        "allow_signup": "",
        "client_id": "",
        "integration": "",
        "timestamp": fields.get("timestamp", ""),
        "timestamp_secret": fields.get("timestamp_secret", ""),
    }

    for k, v in fields.items():
        if k.startswith("required_field_"):
            form_data[k] = ""
            print(f"    Honeypot field: {k} (empty)")

    resp = session.post(
        "https://github.com/session",
        data=form_data,
        headers={**POST_HEADERS, "Referer": "https://github.com/login"},
        allow_redirects=False,
    )
    print(f"    Status: {resp.status_code}")
    print(f"    Location: {resp.headers.get('Location', 'none')}")

    # Analyze cookies
    print("\n    Set-Cookie analysis:")
    key_cookies = (
        "user_session", "__Host-user_session_same_site",
        "logged_in", "dotcom_user", "saved_user_sessions",
    )
    for cookie in session.cookies.jar:
        if cookie.name in key_cookies:
            value = cookie.value
            if len(value) > 30:
                value = value[:30] + "..."
            print(f"      {cookie.name} = {value}")
            print(f"        domain={cookie.domain}  secure={cookie.secure}")

    logged_in = session.cookies.get("logged_in")
    dotcom_user = session.cookies.get("dotcom_user")
    location = resp.headers.get("Location", "")

    # Step 3-4: Handle 2FA
    if "/sessions/two-factor" in location:
        print("\n[3-4] 2FA required")
        if not totp_secret:
            print("    No totp_secret provided, cannot complete 2FA")
            return

        import pyotp
        totp = pyotp.TOTP(totp_secret)
        otp_code = totp.now()

        if not _submit_2fa(session, location, otp_code):
            return

        logged_in = session.cookies.get("logged_in")
        dotcom_user = session.cookies.get("dotcom_user")

    # Result
    print("\n[5] Login result:")
    if logged_in == "yes" and dotcom_user:
        print(f"    Login success! User: {dotcom_user}")
    elif resp.status_code == 302 and "/login" in location:
        print("    Login failed: wrong username or password")
    else:
        print(f"    Unknown state, check response")

    # Verify session
    if logged_in == "yes":
        print("\n[6] Verifying session - visiting homepage...")
        resp = session.get(
            "https://github.com/",
            headers={
                **NAV_HEADERS,
                "Referer": "https://github.com/sessions/two-factor",
                "Sec-Fetch-Site": "same-origin",
            },
        )
        print(f"    Status: {resp.status_code}")

        if dotcom_user and dotcom_user in resp.text:
            print(f"    Page contains username '{dotcom_user}', session valid")
        else:
            print("    Username not found in page")

        # XHR request
        print("\n[7] XHR - fetching repo list...")
        resp = session.get(
            "https://github.com/dashboard/my_top_repositories?location=left",
            headers={**XHR_HEADERS, "Referer": "https://github.com/"},
        )
        print(f"    Status: {resp.status_code}")
        if resp.status_code == 200:
            print("    XHR success, session fully valid")

    # Cookie summary
    print("\n===== Cookie Summary =====")
    for cookie in session.cookies.jar:
        value = cookie.value
        if len(value) > 50:
            value = value[:50] + "..."
        print(f"  {cookie.name} = {value}")

    print("\n===== Browser Simulation Summary =====")
    from ..common.headers import CHROME_VERSION
    print(f"  TLS:             curl_cffi chrome impersonate (Chrome JA3)")
    print(f"  HTTP:            HTTP/2+")
    print(f"  Sec-Ch-Ua:       Chrome/{CHROME_VERSION}")
    print(f"  Sec-Fetch-*:     complete (Site/Mode/User/Dest)")
    print(f"  Origin/Referer:  included in POST")
    print(f"  Header order:    curl_cffi Chrome order")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"Usage: python {sys.argv[0]} <username/email> <password> [totp_secret]")
        sys.exit(1)

    totp = sys.argv[3] if len(sys.argv) > 3 else None
    github_login_standalone(sys.argv[1], sys.argv[2], totp)
