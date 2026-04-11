"""GitHub Organization management via curl_cffi (web scraping)."""

import re
from curl_cffi import requests as cffi_requests

from ..common.headers import NAV_HEADERS, POST_HEADERS, XHR_HEADERS
from ..common.parsers import AllFormsParser


class OrgManager:
    """Manage GitHub organizations: list orgs, list members, invite users."""

    def __init__(self, session: cffi_requests.Session):
        self.session = session

    # ── List Organizations ───────────────────────────────────────

    def list_orgs(self) -> list[str]:
        """Get list of organizations the logged-in user belongs to."""
        resp = self.session.get(
            "https://github.com/settings/organizations",
            headers={**NAV_HEADERS, "Sec-Fetch-Site": "same-origin"},
        )
        if resp.status_code != 200:
            print(f"    Failed to get orgs page: {resp.status_code}")
            return []

        # Primary: avatar alt + link pattern from org settings page
        # <img ... alt="OrgName" ...> ... <a href="/OrgName">OrgName</a>
        orgs = re.findall(
            r'<img[^>]*alt="([\w-]+)"[^>]*class="[^"]*avatar[^"]*"[^>]*/>\s*'
            r'(?:<[^>]*>)*\s*<a\s+href="/\1">\1</a>',
            resp.text,
        )

        # Fallback: self-referencing links
        if not orgs:
            orgs = re.findall(r'<a[^>]*href="/([\w][\w-]*)"[^>]*>\s*\1\s*</a>', resp.text)

        # Filter out the user's own username
        dotcom_user = self.session.cookies.get("dotcom_user", "")
        orgs = [o for o in orgs if o != dotcom_user]

        return list(dict.fromkeys(orgs))  # deduplicate, preserve order

    # ── List Members ─────────────────────────────────────────────

    def list_members(self, org: str) -> list[dict]:
        """Get members of an organization."""
        resp = self.session.get(
            f"https://github.com/orgs/{org}/people",
            headers={**NAV_HEADERS, "Sec-Fetch-Site": "same-origin"},
        )
        if resp.status_code != 200:
            print(f"    Failed to get people page: {resp.status_code}")
            return []

        members = []
        seen = set()

        # Pattern: checkbox name="members[]" value="username" + bulk-actions-id
        for m in re.finditer(
            r'data-bulk-actions-id="(\d+)"[\s\S]*?'
            r'name="members\[\]"\s+value="([\w-]+)"',
            resp.text,
        ):
            mid, uname = m.group(1), m.group(2)
            if uname not in seen:
                seen.add(uname)
                members.append({"id": mid, "username": uname})

        return members

    # ── Search User (invitee suggestions) ────────────────────────

    def search_user(self, org: str, query: str) -> list[dict]:
        """Search for users to invite via invitee_suggestions endpoint."""
        resp = self.session.get(
            f"https://github.com/orgs/{org}/invitations/invitee_suggestions?q={query}",
            headers={
                **XHR_HEADERS,
                "Accept": "text/fragment+html",
                "Referer": f"https://github.com/orgs/{org}/people",
            },
        )
        if resp.status_code != 200:
            return []

        results = []
        for m in re.finditer(r'data-autocomplete-value="([^"]+)"', resp.text):
            username = m.group(1)
            # Extract user ID from hydro payload
            user_id = ""
            hydro = re.search(
                rf'"invitee"\s*:\s*"{re.escape(username)}".*?"user_id"\s*:\s*(\d+)',
                resp.text,
            )
            if hydro:
                user_id = hydro.group(1)
            results.append({"username": username, "user_id": user_id})

        return results

    # ── Invite User ──────────────────────────────────────────────

    def invite_user(self, org: str, username: str, role: str = "direct_member") -> bool:
        """Invite a user to the organization. Two-step flow.

        Args:
            org: Organization name.
            username: GitHub username to invite.
            role: "direct_member" or "admin".

        Returns:
            True if invitation was sent successfully.
        """
        # Step 1: Get CSRF from people page (member_adder_add form)
        resp = self.session.get(
            f"https://github.com/orgs/{org}/people",
            headers={**NAV_HEADERS, "Sec-Fetch-Site": "same-origin"},
        )
        if resp.status_code != 200:
            print(f"    Failed to get people page: {resp.status_code}")
            return False

        forms = AllFormsParser()
        forms.feed(resp.text)
        adder_form = next(
            (f for f in forms.forms if "member_adder_add" in f["action"]), None
        )

        if not adder_form or "authenticity_token" not in adder_form["fields"]:
            print("    member_adder_add form not found")
            return False

        csrf = adder_form["fields"]["authenticity_token"]

        # Step 2: POST member_adder_add → get redirect to edit page
        print(f"    [1/3] POST member_adder_add ({username})")
        resp2 = self.session.post(
            f"https://github.com/orgs/{org}/invitations/member_adder_add",
            data={
                "authenticity_token": csrf,
                "enable_tip": "",
                "identifier": username,
            },
            headers={**POST_HEADERS, "Referer": f"https://github.com/orgs/{org}/people"},
            allow_redirects=False,
        )

        edit_url = resp2.headers.get("Location", "")
        if resp2.status_code != 302 or not edit_url:
            print(f"    Step 1 failed: {resp2.status_code}")
            return False

        # Step 3: GET edit page → parse confirm form
        full_edit_url = edit_url if edit_url.startswith("http") else f"https://github.com{edit_url}"
        print(f"    [2/3] GET {edit_url}")
        resp3 = self.session.get(
            full_edit_url,
            headers={**NAV_HEADERS, "Sec-Fetch-Site": "same-origin",
                     "Referer": f"https://github.com/orgs/{org}/people"},
        )
        if resp3.status_code != 200:
            print(f"    Edit page failed: {resp3.status_code}")
            return False

        edit_forms = AllFormsParser()
        edit_forms.feed(resp3.text)

        confirm_form = None
        for f in edit_forms.forms:
            if ("invitation" in f["action"] and f["method"] == "POST"
                    and "invitee_id" in f["fields"]):
                confirm_form = f
                break

        if not confirm_form:
            print("    Confirm form not found")
            return False

        # Step 4: POST confirm invite
        confirm_url = confirm_form["action"]
        if confirm_url.startswith("/"):
            confirm_url = f"https://github.com{confirm_url}"

        confirm_data = dict(confirm_form["fields"])
        confirm_data["role"] = role

        print(f"    [3/3] POST invite (role={role}, invitee_id={confirm_data.get('invitee_id')})")
        resp4 = self.session.post(
            confirm_url,
            data=confirm_data,
            headers={**POST_HEADERS, "Referer": full_edit_url},
            allow_redirects=False,
        )

        if resp4.status_code == 302:
            loc = resp4.headers.get("Location", "")
            if "pending" in loc or "people" in loc:
                print(f"    ✓ Invited {username} to {org}")
                return True

        print(f"    Invite failed: {resp4.status_code}")
        return False

    # ── List Pending Invitations ─────────────────────────────────

    def list_pending(self, org: str) -> list[str]:
        """Get list of pending invitation usernames."""
        resp = self.session.get(
            f"https://github.com/orgs/{org}/people/pending_invitations",
            headers={**NAV_HEADERS, "Sec-Fetch-Site": "same-origin"},
        )
        if resp.status_code != 200:
            return []

        pending = re.findall(r'<a[^>]*href="/([\w-]+)"[^>]*>\s*\1\s*</a>', resp.text)
        return list(dict.fromkeys(pending))
