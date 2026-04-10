"""GitHub sudo mode confirmation."""

from ..common.headers import COMMON_HEADERS, NAV_HEADERS, POST_HEADERS
from ..common.parsers import AllFormsParser


def github_sudo(session, password):
    """Enter sudo mode (re-confirm password for sensitive operations)."""
    print("\n[2.5] Entering sudo mode ...")

    resp = session.get(
        "https://github.com/sessions/sudo_modal",
        headers={
            **COMMON_HEADERS,
            "Accept": "text/html, application/xhtml+xml",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://github.com/settings/personal-access-tokens/new",
            "X-Requested-With": "XMLHttpRequest",
        },
    )

    if resp.status_code != 200:
        for alt_url in [
            "https://github.com/settings/sudo",
            "https://github.com/sessions/verified-device/confirm",
        ]:
            resp = session.get(alt_url, headers=NAV_HEADERS)
            if resp.status_code == 200:
                print(f"    Using fallback sudo path: {alt_url}")
                break
        else:
            print(f"    Failed to get sudo page: {resp.status_code}")
            return False

    forms_parser = AllFormsParser()
    forms_parser.feed(resp.text)

    sudo_form = None
    for form in forms_parser.forms:
        if any(k in form["fields"] for k in ["sudo_password", "password"]):
            sudo_form = form
            break
        if "sudo" in form.get("action", ""):
            sudo_form = form
            break

    if sudo_form is None:
        print("    sudo form not found")
        print(f"    Response length: {len(resp.text)}")
        if forms_parser.forms:
            for i, form in enumerate(forms_parser.forms):
                print(f"    Form[{i}]: {form['method']} {form['action']} fields={list(form['fields'].keys())}")
        return False

    csrf_token = sudo_form["fields"].get("authenticity_token", "")
    print(f"    sudo CSRF token: {csrf_token[:30]}...")
    print(f"    sudo form action: {sudo_form['action']}")
    print(f"    sudo form fields: {list(sudo_form['fields'].keys())}")

    form_data = dict(sudo_form["fields"])
    if "sudo_password" in form_data:
        form_data["sudo_password"] = password
    elif "password" in form_data:
        form_data["password"] = password
    else:
        form_data["sudo_password"] = password

    action = sudo_form["action"]
    if action.startswith("/"):
        post_url = "https://github.com" + action
    elif action.startswith("http"):
        post_url = action
    else:
        post_url = "https://github.com/sessions/sudo"

    resp = session.post(
        post_url,
        data=form_data,
        headers={
            **POST_HEADERS,
            "Referer": "https://github.com/settings/personal-access-tokens/new",
        },
        allow_redirects=True,
    )
    print(f"    sudo status: {resp.status_code}")

    if resp.status_code in (200, 302, 303):
        print("    sudo mode activated")
        return True

    print("    sudo confirmation failed")
    return False
