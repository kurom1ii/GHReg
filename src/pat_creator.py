#!/usr/bin/env python3
"""
GitHub 全自动化脚本: 登录 + 创建 Fine-grained PAT + 保存 Token
"""

import re
import sys
import json
import argparse
from html.parser import HTMLParser
from urllib.parse import unquote

from curl_cffi import requests as cffi_requests


# ============================================================
# HTML 解析器
# ============================================================

class FormParser(HTMLParser):
    """提取指定 form action 的所有隐藏字段"""

    def __init__(self, action_match="/session"):
        super().__init__()
        self.action_match = action_match
        self.hidden_fields = {}
        self.in_form = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "form":
            action = attrs_dict.get("action", "")
            if self.action_match in action:
                self.in_form = True
        if tag == "input" and self.in_form:
            input_type = attrs_dict.get("type", "")
            name = attrs_dict.get("name", "")
            value = attrs_dict.get("value", "")
            if input_type == "hidden" and name:
                self.hidden_fields[name] = value

    def handle_endtag(self, tag):
        if tag == "form" and self.in_form:
            self.in_form = False


class AuthTokenParser(HTMLParser):
    """从任意页面提取 authenticity_token（取第一个匹配的）"""

    def __init__(self):
        super().__init__()
        self.token = None

    def handle_starttag(self, tag, attrs):
        if tag == "input" and self.token is None:
            attrs_dict = dict(attrs)
            if attrs_dict.get("name") == "authenticity_token":
                self.token = attrs_dict.get("value", "")


class AllFormsParser(HTMLParser):
    """提取页面上所有 form 及其所有 input 字段"""

    def __init__(self):
        super().__init__()
        self.forms = []       # [{action, method, fields: {name: value}}]
        self._current = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "form":
            self._current = {
                "action": attrs_dict.get("action", ""),
                "method": attrs_dict.get("method", "GET").upper(),
                "fields": {},
            }
        if tag == "input" and self._current is not None:
            name = attrs_dict.get("name", "")
            value = attrs_dict.get("value", "")
            input_type = attrs_dict.get("type", "").lower()
            if name:
                # radio/checkbox: 只保留 checked 的值
                if input_type == "radio":
                    if "checked" in attrs_dict:
                        self._current["fields"][name] = value
                    elif name not in self._current["fields"]:
                        pass  # 不覆盖，等 checked 的那个
                else:
                    self._current["fields"][name] = value

    def handle_endtag(self, tag):
        if tag == "form" and self._current is not None:
            self.forms.append(self._current)
            self._current = None


# ============================================================
# Chrome 模拟 Headers
# ============================================================

CHROME_VERSION = "143"
COMMON_HEADERS = {
    "Sec-Ch-Ua": f'"Chromium";v="{CHROME_VERSION}", "Not A(Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Accept-Language": "zh-CN,zh;q=0.9",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        f"Chrome/{CHROME_VERSION}.0.0.0 Safari/537.36"
    ),
    "Accept-Encoding": "gzip, deflate, br",
}

NAV_HEADERS = {
    **COMMON_HEADERS,
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,image/apng,*/*;q=0.8,"
        "application/signed-exchange;v=b3;q=0.7"
    ),
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    "Priority": "u=0, i",
}

POST_HEADERS = {
    **COMMON_HEADERS,
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,image/apng,*/*;q=0.8,"
        "application/signed-exchange;v=b3;q=0.7"
    ),
    "Content-Type": "application/x-www-form-urlencoded",
    "Upgrade-Insecure-Requests": "1",
    "Origin": "https://github.com",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    "Priority": "u=0, i",
    "Cache-Control": "max-age=0",
}


# ============================================================
# Fine-grained PAT 权限定义
# ============================================================

# 所有 fine-grained PAT 权限，默认 none
ALL_PERMISSIONS = [
    # Repository permissions
    "actions", "administration", "artifact_metadata", "attestations",
    "security_events", "codespaces", "codespaces_lifecycle_admin",
    "codespaces_metadata", "codespaces_secrets", "statuses", "contents",
    "repository_custom_properties", "vulnerability_alerts",
    "dependabot_secrets", "deployments", "discussions", "environments",
    "issues", "merge_queues", "metadata", "pages", "pull_requests",
    "repository_advisories", "repo_secret_scanning_dismissal_requests",
    "secret_scanning_alerts", "secret_scanning_bypass_requests",
    "secrets", "actions_variables", "repository_hooks", "workflows",
    # Organization permissions
    "organization_api_insights", "organization_administration",
    "organization_user_blocking", "organization_campaigns",
    "org_copilot_content_exclusion", "organization_custom_org_roles",
    "organization_custom_properties", "custom_properties_for_organizations",
    "organization_custom_roles", "organization_events",
    "organization_copilot_seat_management",
    "organization_runner_custom_images", "issue_fields", "issue_types",
    "members", "organization_models",
    "organization_network_configurations", "organization_copilot_metrics",
    "organization_announcement_banners",
    "organization_secret_scanning_bypass_requests",
    "organization_codespaces", "organization_codespaces_secrets",
    "organization_codespaces_settings", "organization_credentials",
    "organization_dependabot_secrets",
    "organization_dependabot_dismissal_requests",
    "organization_code_scanning_dismissal_requests",
    "organization_private_registries", "organization_plan",
    "organization_projects", "secret_scanning_dismissal_requests",
    "organization_secrets", "organization_self_hosted_runners",
    "organization_actions_variables", "organization_hooks",
    # User permissions
    "blocking", "codespaces_user_secrets", "copilot_messages",
    "copilot_editor_context", "user_copilot_requests", "emails",
    "user_events", "followers", "gpg_keys", "gists", "keys",
    "interaction_limits", "user_models", "plan",
    "private_repository_invitations", "profile",
    "git_signing_ssh_public_keys", "starring", "watching",
    # Enterprise permissions
    "enterprise_custom_enterprise_roles", "enterprise_custom_properties",
    "enterprise_ai_controls", "enterprise_copilot_metrics",
    "enterprise_credentials", "enterprise_custom_org_roles",
    "enterprise_custom_properties_for_organizations",
    "enterprise_organizations", "enterprise_people", "enterprise_sso",
]


# ============================================================
# 预设权限模板
# ============================================================

PERMISSION_PRESETS = {
    "minimal": {},  # 全部 none
    "readonly": {
        "contents": "read",
        "metadata": "read",
    },
    "copilot": {
        "copilot_messages": "read",
        "copilot_editor_context": "read",
        "user_copilot_requests": "read",
    },
    "full_repo": {
        "actions": "write",
        "administration": "write",
        "contents": "write",
        "issues": "write",
        "metadata": "read",
        "pull_requests": "write",
        "workflows": "write",
        "secrets": "write",
        "actions_variables": "write",
    },
}


def github_sudo(session, password):
    """进入 sudo 模式（敏感操作需要重新确认密码）"""
    print("\n[2.5] 进入 sudo 模式 ...")

    # 获取 sudo 模态框 (AJAX 请求)
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
        # 如果模态框失败，尝试 /settings/sudo 或 /sessions/verified-device
        for alt_url in [
            "https://github.com/settings/sudo",
            "https://github.com/sessions/verified-device/confirm",
        ]:
            resp = session.get(alt_url, headers=NAV_HEADERS)
            if resp.status_code == 200:
                print(f"    使用备用 sudo 路径: {alt_url}")
                break
        else:
            print(f"    获取 sudo 页面失败: {resp.status_code}")
            return False

    # 解析表单
    forms_parser = AllFormsParser()
    forms_parser.feed(resp.text)

    sudo_form = None
    for form in forms_parser.forms:
        # 找包含 sudo_password 或 password 字段的表单
        if any(k in form["fields"] for k in ["sudo_password", "password"]):
            sudo_form = form
            break
        # 或者 action 包含 sudo
        if "sudo" in form.get("action", ""):
            sudo_form = form
            break

    if sudo_form is None:
        print("    未找到 sudo 表单")
        print(f"    响应长度: {len(resp.text)}")
        # 保存响应用于调试
        debug_file = "/home/wolf/copilot/debug_sudo_response.html"
        with open(debug_file, "w", encoding="utf-8") as f:
            f.write(resp.text)
        print(f"    sudo 响应已保存到: {debug_file}")
        # 如果找到了任何表单，打印它们
        if forms_parser.forms:
            for i, form in enumerate(forms_parser.forms):
                print(f"    表单[{i}]: {form['method']} {form['action']} 字段={list(form['fields'].keys())}")
        return False

    csrf_token = sudo_form["fields"].get("authenticity_token", "")
    print(f"    sudo CSRF token: {csrf_token[:30]}...")
    print(f"    sudo 表单 action: {sudo_form['action']}")
    print(f"    sudo 表单字段: {list(sudo_form['fields'].keys())}")

    # 构建提交数据
    form_data = dict(sudo_form["fields"])
    # 填入密码（可能是 sudo_password 或 password）
    if "sudo_password" in form_data:
        form_data["sudo_password"] = password
    elif "password" in form_data:
        form_data["password"] = password
    else:
        form_data["sudo_password"] = password

    # 确定 POST URL
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
    print(f"    sudo 状态码: {resp.status_code}")

    if resp.status_code in (200, 302, 303):
        print("    sudo 模式已激活")
        return True

    print("    sudo 确认失败")
    return False


def build_pat_permissions(preset="minimal", custom_perms=None):
    """构建权限字典，preset 作为基础，custom_perms 覆盖"""
    base = PERMISSION_PRESETS.get(preset, {})
    if custom_perms:
        base.update(custom_perms)
    result = {}
    for perm in ALL_PERMISSIONS:
        result[f"integration[default_permissions][{perm}]"] = base.get(perm, "none")
    return result


# ============================================================
# 核心功能
# ============================================================

def github_login(session, username, password):
    """登录 GitHub，返回是否成功"""
    print("[1] GET /login ...")
    resp = session.get("https://github.com/login", headers=NAV_HEADERS)
    if resp.status_code != 200:
        print(f"    获取登录页失败: {resp.status_code}")
        return False

    parser = FormParser("/session")
    parser.feed(resp.text)
    fields = parser.hidden_fields

    if "authenticity_token" not in fields:
        print("    未找到 authenticity_token")
        return False

    print(f"    提取到 {len(fields)} 个隐藏字段")

    form_data = {
        "commit": "Sign in",
        "authenticity_token": fields.get("authenticity_token", ""),
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
    print(f"    状态码: {resp.status_code}")
    print(f"    Location: {resp.headers.get('Location', '无')}")

    logged_in = session.cookies.get("logged_in")
    dotcom_user = session.cookies.get("dotcom_user")

    if logged_in == "yes" and dotcom_user:
        print(f"    登录成功: {dotcom_user}")
        return True

    location = resp.headers.get("Location", "")
    if "/sessions/two-factor" in location:
        print("    需要 2FA，暂不支持")
    else:
        print("    登录失败")
    return False


def create_pat(session, token_name, password, expires_days=30, preset="minimal",
               custom_perms=None):
    """
    创建 Fine-grained PAT
    返回 token 字符串或 None
    """
    # 步骤 1: 获取创建页面
    print("\n[3] GET /settings/personal-access-tokens/new ...")
    resp = session.get(
        "https://github.com/settings/personal-access-tokens/new",
        headers={
            **NAV_HEADERS,
            "Referer": "https://github.com/settings/tokens",
            "Sec-Fetch-Site": "same-origin",
        },
    )
    print(f"    状态码: {resp.status_code}")

    if resp.status_code != 200:
        print("    获取 PAT 创建页面失败")
        return None

    page_html = resp.text

    # 保存页面 HTML 用于调试
    debug_new_page = "/home/wolf/copilot/debug_pat_new_page.html"
    with open(debug_new_page, "w", encoding="utf-8") as f:
        f.write(page_html)
    print(f"    页面已保存到: {debug_new_page}")

    # 解析所有 form
    forms_parser = AllFormsParser()
    forms_parser.feed(page_html)

    print(f"    找到 {len(forms_parser.forms)} 个表单:")
    pat_form = None
    for i, form in enumerate(forms_parser.forms):
        action = form["action"]
        method = form["method"]
        field_count = len(form["fields"])
        field_names = list(form["fields"].keys())
        print(f"      [{i}] {method} {action} ({field_count} 字段): {field_names[:8]}...")

        # 找 PAT 创建相关的表单
        if ("personal-access-tokens" in action and method == "POST"
                and "authenticity_token" in form["fields"]):
            pat_form = form

    if pat_form is None:
        # 回退: 找任何包含 user_programmatic_access 字段的表单
        for form in forms_parser.forms:
            for k in form["fields"]:
                if "user_programmatic_access" in k or "integration" in k:
                    pat_form = form
                    break
            if pat_form:
                break

    if pat_form is None:
        print("    未找到 PAT 创建表单")
        # 尝试用旧方式: 从 meta tag 或第一个 authenticity_token
        token_parser = AuthTokenParser()
        token_parser.feed(page_html)
        csrf_token = token_parser.token
        if csrf_token:
            print(f"    使用回退 CSRF token: {csrf_token[:30]}...")
        else:
            print("    未找到任何 CSRF token")
            return None
        # 使用默认表单结构
        pat_form = {
            "action": "/settings/personal-access-tokens",
            "method": "POST",
            "fields": {"authenticity_token": csrf_token},
        }

    print(f"\n    使用表单: {pat_form['method']} {pat_form['action']}")
    print(f"    表单原始字段: {list(pat_form['fields'].keys())}")

    csrf_token = pat_form["fields"].get("authenticity_token", "")
    print(f"    CSRF token: {csrf_token[:30]}...")

    # 步骤 2: 构建表单数据 — 以页面表单字段为基础，覆盖我们需要设置的值
    form_data = dict(pat_form["fields"])  # 保留所有原始字段

    # 覆盖/添加 PAT 字段
    form_data.update({
        "user_programmatic_access[name]": token_name,
        "user_programmatic_access[description]": "",
        "user_programmatic_access[default_expires_at]": str(expires_days),
        "user_programmatic_access[custom_expires_at]": "",
    })

    # 确保这些字段存在
    form_data["install_target"] = "all"   # all=全部仓库, none=仅公开仓库
    form_data.setdefault("target_name", "")
    form_data.setdefault("reason", "")

    # 添加权限
    permissions = build_pat_permissions(preset, custom_perms)
    form_data.update(permissions)

    # 确定 POST URL
    post_action = pat_form["action"]
    if post_action.startswith("/"):
        post_url = "https://github.com" + post_action
    elif post_action.startswith("http"):
        post_url = post_action
    else:
        post_url = "https://github.com/settings/personal-access-tokens"

    # 步骤 3: 提交创建
    print(f"\n[4] POST {post_action} ...")
    print(f"    Token 名称: {token_name}")
    print(f"    过期天数: {expires_days}")
    print(f"    权限预设: {preset}")
    print(f"    表单字段数: {len(form_data)}")

    resp = session.post(
        post_url,
        data=form_data,
        headers={
            **POST_HEADERS,
            "Referer": "https://github.com/settings/personal-access-tokens/new",
        },
        allow_redirects=True,
    )
    print(f"    状态码: {resp.status_code}")
    print(f"    响应 URL: {resp.url}")
    print(f"    响应长度: {len(resp.text)}")

    # 保存响应用于调试
    debug_file = "/home/wolf/copilot/debug_pat_post_response.html"
    with open(debug_file, "w", encoding="utf-8") as f:
        f.write(resp.text)
    print(f"    响应已保存到: {debug_file}")

    # ---- 步骤 4: 处理确认对话框（两步创建流程） ----
    # 第一次 POST 返回确认页面，包含 confirm=1 的表单，需要再次提交
    confirm_parser = AllFormsParser()
    confirm_parser.feed(resp.text)

    confirm_form = None
    for form in confirm_parser.forms:
        fields = form["fields"]
        # 找包含 confirm 字段且 action 指向 personal-access-tokens 的表单
        if ("confirm" in fields
                and "personal-access-tokens" in form.get("action", "")):
            confirm_form = form
            break
        # 或者包含 sudo_password 的表单（sudo 确认）
        if any(k in fields for k in ["sudo_password", "password"]):
            confirm_form = form
            break

    if confirm_form and "confirm" in confirm_form["fields"]:
        print("\n[5] 检测到确认对话框，提交第二次 POST (confirm=1) ...")
        confirm_data = dict(confirm_form["fields"])

        # 如果有密码字段，填入密码
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

        print(f"    确认表单 action: {confirm_action}")
        print(f"    确认表单字段数: {len(confirm_data)}")

        resp = session.post(
            confirm_url,
            data=confirm_data,
            headers={
                **POST_HEADERS,
                "Referer": "https://github.com/settings/personal-access-tokens/new",
            },
            allow_redirects=True,
        )
        print(f"    确认状态码: {resp.status_code}")
        print(f"    确认响应 URL: {resp.url}")
        print(f"    确认响应长度: {len(resp.text)}")

        # 保存确认响应
        debug_confirm = "/home/wolf/copilot/debug_confirm_response.html"
        with open(debug_confirm, "w", encoding="utf-8") as f:
            f.write(resp.text)
        print(f"    确认响应已保存到: {debug_confirm}")

    elif "sudo_password" in resp.text:
        # 纯 sudo 确认（没有 confirm 字段）
        print("\n[5] 需要确认密码 (sudo) ...")
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
            print(f"    sudo 确认状态码: {resp.status_code}")

    # ---- 步骤 5: 从响应中提取 token ----
    token = _extract_token(resp.text)
    if token:
        print(f"\n    Token 创建成功!")
        print(f"    Token: {token[:20]}...{token[-6:]}")
        return token

    # 如果响应重定向到了列表页但 token 不在响应中，再 GET 一次
    print("    响应中未找到 token，尝试 GET 列表页 ...")
    listing_resp = session.get(
        "https://github.com/settings/personal-access-tokens",
        headers={
            **NAV_HEADERS,
            "Referer": resp.url,
            "Sec-Fetch-Site": "same-origin",
        },
    )
    print(f"    列表页状态码: {listing_resp.status_code}")

    debug_list = "/home/wolf/copilot/debug_pat_list_page.html"
    with open(debug_list, "w", encoding="utf-8") as f:
        f.write(listing_resp.text)
    print(f"    列表页已保存到: {debug_list}")

    token = _extract_token(listing_resp.text)
    if token:
        print(f"\n    Token 创建成功! (从列表页提取)")
        print(f"    Token: {token[:20]}...{token[-6:]}")
        return token

    # 检查真正的错误（排除隐藏的 ajax-error-message 模板）
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
                print(f"    错误: {clean}")

    print("    未能从响应中提取 token，可能创建失败")
    return None


def _extract_token(html):
    """从 HTML 中提取 github_pat_ token，返回 token 字符串或 None"""
    # 优先匹配 <input id="new-access-token" ... value="github_pat_...">
    m = re.search(r'id="new-access-token"[^>]*value="(github_pat_[^"]+)"', html)
    if m:
        return m.group(1)
    # value 在 id 前面的情况
    m = re.search(r'value="(github_pat_[^"]+)"[^>]*id="new-access-token"', html)
    if m:
        return m.group(1)
    # 通用匹配
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


def save_token(token, token_name, output_file):
    """保存 token 到文件"""
    entry = {
        "name": token_name,
        "token": token,
    }

    # 尝试追加到已有 JSON 文件
    try:
        with open(output_file, "r") as f:
            data = json.load(f)
            if not isinstance(data, list):
                data = [data]
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    data.append(entry)

    with open(output_file, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n[5] Token 已保存到: {output_file}")


def main():
    parser = argparse.ArgumentParser(
        description="GitHub 登录 + 创建 Fine-grained PAT",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
权限预设 (--preset):
  minimal   - 无任何权限 (默认)
  readonly  - contents:read + metadata:read
  copilot   - copilot 相关权限 read
  full_repo - 完整仓库读写权限

自定义权限 (--perm):
  --perm contents=write --perm issues=read

示例:
  %(prog)s -u user@mail.com -p password -n "my-token"
  %(prog)s -u user@mail.com -p password -n "ci-token" --preset full_repo
  %(prog)s -u user@mail.com -p password -n "api-token" --perm contents=write --perm issues=read
  %(prog)s -u user@mail.com -p password -n "token1" -o tokens.json
""",
    )
    parser.add_argument("-u", "--username", required=True)
    parser.add_argument("-p", "--password", required=True)
    parser.add_argument("-n", "--name", required=True, help="Token 名称")
    parser.add_argument("-e", "--expires", type=int, default=30,
                        help="过期天数 (默认 30)")
    parser.add_argument("--preset", default="minimal",
                        choices=list(PERMISSION_PRESETS.keys()),
                        help="权限预设")
    parser.add_argument("--perm", action="append", default=[],
                        help="自定义权限 key=value, 可多次指定")
    parser.add_argument("-o", "--output", default="github_tokens.json",
                        help="Token 保存文件 (默认 github_tokens.json)")

    args = parser.parse_args()

    # 解析自定义权限
    custom_perms = {}
    for p in args.perm:
        if "=" in p:
            k, v = p.split("=", 1)
            custom_perms[k] = v

    # 创建会话
    session = cffi_requests.Session(impersonate="chrome")

    # 登录
    if not github_login(session, args.username, args.password):
        sys.exit(1)

    # 进入 sudo 模式（创建 token 需要）
    if not github_sudo(session, args.password):
        print("sudo 模式激活失败，尝试继续...")

    # 创建 PAT
    token = create_pat(
        session,
        token_name=args.name,
        password=args.password,
        expires_days=args.expires,
        preset=args.preset,
        custom_perms=custom_perms if custom_perms else None,
    )

    if token:
        save_token(token, args.name, args.output)
        print(f"\n===== 完成 =====")
        print(f"  Token: {token}")
        print(f"  保存到: {args.output}")
    else:
        print("\nToken 创建失败")
        sys.exit(1)


if __name__ == "__main__":
    main()
