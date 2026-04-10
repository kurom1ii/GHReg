"""Fine-grained PAT creation and token extraction."""

import re

from ..common.headers import NAV_HEADERS, POST_HEADERS
from ..common.parsers import AuthTokenParser, AllFormsParser
from .permissions import build_pat_permissions


def create_pat(session, token_name, password, expires_days=30, preset="minimal",
               custom_perms=None):
    """
    Create a Fine-grained PAT.
    Returns token string or None.
    """
    # Step 1: Get creation page
    print("\n[3] GET /settings/personal-access-tokens/new ...")
    resp = session.get(
        "https://github.com/settings/personal-access-tokens/new",
        headers={
            **NAV_HEADERS,
            "Referer": "https://github.com/settings/tokens",
            "Sec-Fetch-Site": "same-origin",
        },
    )
    print(f"    Status: {resp.status_code}")

    if resp.status_code != 200:
        print("    Failed to get PAT creation page")
        return None

    page_html = resp.text

    # Parse all forms
    forms_parser = AllFormsParser()
    forms_parser.feed(page_html)

    print(f"    Found {len(forms_parser.forms)} forms:")
    pat_form = None
    for i, form in enumerate(forms_parser.forms):
        action = form["action"]
        method = form["method"]
        field_count = len(form["fields"])
        field_names = list(form["fields"].keys())
        print(f"      [{i}] {method} {action} ({field_count} fields): {field_names[:8]}...")

        if ("personal-access-tokens" in action and method == "POST"
                and "authenticity_token" in form["fields"]):
            pat_form = form

    if pat_form is None:
        for form in forms_parser.forms:
            for k in form["fields"]:
                if "user_programmatic_access" in k or "integration" in k:
                    pat_form = form
                    break
            if pat_form:
                break

    if pat_form is None:
        print("    PAT creation form not found")
        token_parser = AuthTokenParser()
        token_parser.feed(page_html)
        csrf_token = token_parser.token
        if csrf_token:
            print(f"    Using fallback CSRF token: {csrf_token[:30]}...")
        else:
            print("    No CSRF token found")
            return None
        pat_form = {
            "action": "/settings/personal-access-tokens",
            "method": "POST",
            "fields": {"authenticity_token": csrf_token},
        }

    print(f"\n    Using form: {pat_form['method']} {pat_form['action']}")
    print(f"    Original fields: {list(pat_form['fields'].keys())}")

    csrf_token = pat_form["fields"].get("authenticity_token", "")
    print(f"    CSRF token: {csrf_token[:30]}...")

    # Step 2: Build form data
    form_data = dict(pat_form["fields"])

    form_data.update({
        "user_programmatic_access[name]": token_name,
        "user_programmatic_access[description]": "",
        "user_programmatic_access[default_expires_at]": str(expires_days),
        "user_programmatic_access[custom_expires_at]": "",
    })

    form_data["install_target"] = "all"
    form_data.setdefault("target_name", "")
    form_data.setdefault("reason", "")

    permissions = build_pat_permissions(preset, custom_perms)
    form_data.update(permissions)

    # Determine POST URL
    post_action = pat_form["action"]
    if post_action.startswith("/"):
        post_url = "https://github.com" + post_action
    elif post_action.startswith("http"):
        post_url = post_action
    else:
        post_url = "https://github.com/settings/personal-access-tokens"

    # Step 3: Submit
    print(f"\n[4] POST {post_action} ...")
    print(f"    Token name: {token_name}")
    print(f"    Expires in: {expires_days} days")
    print(f"    Permission preset: {preset}")
    print(f"    Form fields count: {len(form_data)}")

    resp = session.post(
        post_url,
        data=form_data,
        headers={
            **POST_HEADERS,
            "Referer": "https://github.com/settings/personal-access-tokens/new",
        },
        allow_redirects=True,
    )
    print(f"    Status: {resp.status_code}")
    print(f"    Response URL: {resp.url}")
    print(f"    Response length: {len(resp.text)}")

    # Step 4: Handle confirm dialog (two-step creation)
    confirm_parser = AllFormsParser()
    confirm_parser.feed(resp.text)

    confirm_form = None
    for form in confirm_parser.forms:
        fields = form["fields"]
        if ("confirm" in fields
                and "personal-access-tokens" in form.get("action", "")):
            confirm_form = form
            break
        if any(k in fields for k in ["sudo_password", "password"]):
            confirm_form = form
            break

    if confirm_form and "confirm" in confirm_form["fields"]:
        print("\n[5] Confirm dialog detected, submitting second POST (confirm=1) ...")
        confirm_data = dict(confirm_form["fields"])

        if "sudo_password" in confirm_data:
            confirm_data["sudo_password"] = password
        elif "password" in confirm_data:
            confirm_data["password"] = password

        confirm_action = confirm_form["action"]
        if confirm_action.startswith("/"):
            confirm_url = "https://github.com" + confirm_action
        elif confirm_action.startswith("http"):
            confirm_url = confirm_action
        else:
            confirm_url = "https://github.com/settings/personal-access-tokens"

        print(f"    Confirm form action: {confirm_action}")
        print(f"    Confirm form fields: {len(confirm_data)}")

        resp = session.post(
            confirm_url,
            data=confirm_data,
            headers={
                **POST_HEADERS,
                "Referer": "https://github.com/settings/personal-access-tokens/new",
            },
            allow_redirects=True,
        )
        print(f"    Confirm status: {resp.status_code}")
        print(f"    Confirm URL: {resp.url}")
        print(f"    Confirm length: {len(resp.text)}")

    elif "sudo_password" in resp.text:
        print("\n[5] Password confirmation required (sudo) ...")
        for form in confirm_parser.forms:
            if any(k in form["fields"] for k in ["sudo_password", "password"]):
                confirm_form = form
                break
        if confirm_form:
            confirm_data = dict(confirm_form["fields"])
            if "sudo_password" in confirm_data:
                confirm_data["sudo_password"] = password
            elif "password" in confirm_data:
                confirm_data["password"] = password
            confirm_action = confirm_form["action"]
            if confirm_action.startswith("/"):
                confirm_url = "https://github.com" + confirm_action
            else:
                confirm_url = confirm_action
            resp = session.post(
                confirm_url, data=confirm_data,
                headers={**POST_HEADERS, "Referer": resp.url},
                allow_redirects=True,
            )
            print(f"    sudo confirm status: {resp.status_code}")

    # Step 5: Extract token
    token = _extract_token(resp.text)
    if token:
        print(f"\n    Token created successfully!")
        print(f"    Token: {token[:20]}...{token[-6:]}")
        return token

    # Fallback: GET listing page
    print("    Token not found in response, trying listing page ...")
    listing_resp = session.get(
        "https://github.com/settings/personal-access-tokens",
        headers={
            **NAV_HEADERS,
            "Referer": resp.url,
            "Sec-Fetch-Site": "same-origin",
        },
    )
    print(f"    Listing page status: {listing_resp.status_code}")

    token = _extract_token(listing_resp.text)
    if token:
        print(f"\n    Token created successfully! (from listing page)")
        print(f"    Token: {token[:20]}...{token[-6:]}")
        return token

    # Check for real errors
    for html_text in [resp.text, listing_resp.text]:
        for m in re.finditer(
            r'<div[^>]*class="[^"]*flash-error[^"]*"[^>]*>(.*?)</div>',
            html_text, re.DOTALL
        ):
            full_tag = m.group(0)
            if 'id="ajax-error-message"' in full_tag or 'hidden' in full_tag:
                continue
            clean = re.sub(r'<[^>]+>', '', m.group(1)).strip()
            if clean:
                print(f"    Error: {clean}")

    print("    Failed to extract token from response")
    return None


def _extract_token(html):
    """Extract github_pat_ token from HTML. Returns token string or None."""
    m = re.search(r'id="new-access-token"[^>]*value="(github_pat_[^"]+)"', html)
    if m:
        return m.group(1)
    m = re.search(r'value="(github_pat_[^"]+)"[^>]*id="new-access-token"', html)
    if m:
        return m.group(1)
    patterns = [
        r'value="(github_pat_[^"]+)"',
        r'>(github_pat_[A-Za-z0-9_]+)<',
        r'(github_pat_[A-Za-z0-9_]{20,})',
    ]
    for pat in patterns:
        m = re.search(pat, html)
        if m:
            return m.group(1)
    return None
