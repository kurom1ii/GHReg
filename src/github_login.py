#!/usr/bin/env python3
"""
GitHub 登录流程模拟脚本
使用 curl_cffi 模拟 Chrome 浏览器的完整登录流程，包括:
- TLS 指纹 (JA3/JA4) 模拟
- HTTP/2 协议
- 完整的 Sec-Ch-Ua / Sec-Fetch-* 头
- 正确的 Header 顺序
- Referer / Origin 链
"""

import sys
from html.parser import HTMLParser

from curl_cffi import requests as cffi_requests


class FormParser(HTMLParser):
    """从 HTML 中提取 login form 的隐藏字段"""

    def __init__(self):
        super().__init__()
        self.hidden_fields = {}
        self.in_form = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "form":
            action = attrs_dict.get("action", "")
            if "/session" in action:
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


# Chrome 143 的完整请求头模板
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

# GET 导航请求头 (Sec-Fetch-* 对应 document 导航)
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

# POST 表单提交头 (same-origin navigate)
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
    "Referer": "https://github.com/login",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    "Priority": "u=0, i",
    "Cache-Control": "max-age=0",
}

# XHR/fetch 请求头 (登录后的 AJAX)
XHR_HEADERS = {
    **COMMON_HEADERS,
    "Accept": "text/html",
    "X-Requested-With": "XMLHttpRequest",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Priority": "u=1, i",
}


def github_login(username: str, password: str) -> None:
    # curl_cffi 会话: impersonate Chrome，自动模拟 TLS 指纹 + HTTP/2
    session = cffi_requests.Session(impersonate="chrome")

    # ========== 第 1 步: GET /login ==========
    print("[1] GET /login - 获取登录页面...")
    print("    TLS 指纹: chrome (JA3 模拟)")
    print("    协议: HTTP/2")

    resp = session.get("https://github.com/login", headers=NAV_HEADERS)
    print(f"    状态码: {resp.status_code}")
    print(f"    HTTP 版本: {resp.http_version}")

    if resp.status_code != 200:
        print("    获取登录页面失败")
        return

    # 解析隐藏字段
    parser = FormParser()
    parser.feed(resp.text)
    fields = parser.hidden_fields

    print(f"    提取到 {len(fields)} 个隐藏字段:")
    for k, v in fields.items():
        display_v = v[:40] + "..." if len(v) > 40 else v
        print(f"      {k} = {display_v}")

    if "authenticity_token" not in fields:
        print("    未找到 authenticity_token，终止")
        return

    # ========== 第 2 步: POST /session ==========
    print("\n[2] POST /session - 提交登录...")

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

    # 蜜罐字段: required_field_xxxx，值必须留空
    for k, v in fields.items():
        if k.startswith("required_field_"):
            form_data[k] = ""
            print(f"    蜜罐字段: {k} (留空)")

    # 提交, 不跟随重定向
    resp = session.post(
        "https://github.com/session",
        data=form_data,
        headers=POST_HEADERS,
        allow_redirects=False,
    )
    print(f"    状态码: {resp.status_code}")
    print(f"    Location: {resp.headers.get('Location', '无')}")

    # 分析 Set-Cookie
    print("\n    Set-Cookie 分析:")
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

    # ========== 第 3 步: 判断登录结果 ==========
    logged_in = session.cookies.get("logged_in")
    dotcom_user = session.cookies.get("dotcom_user")
    location = resp.headers.get("Location", "")

    print("\n[3] 登录结果判断:")
    if logged_in == "yes" and dotcom_user:
        print(f"    登录成功! 用户名: {dotcom_user}")
    elif resp.status_code == 302 and "/sessions/two-factor" in location:
        print("    需要两步验证 (2FA)，登录流程未完成")
    elif resp.status_code == 302 and "/login" in location:
        print("    登录失败: 用户名或密码错误")
    else:
        print(f"    未知状态，请检查响应")

    # ========== 第 4 步: 跟随重定向，验证登录态 ==========
    if logged_in == "yes":
        print("\n[4] 验证登录态 - 访问首页...")
        nav_headers_with_ref = {
            **NAV_HEADERS,
            "Referer": "https://github.com/login",
            "Sec-Fetch-Site": "same-origin",
        }
        resp = session.get("https://github.com/", headers=nav_headers_with_ref)
        print(f"    状态码: {resp.status_code}")

        if dotcom_user and dotcom_user in resp.text:
            print(f"    页面中包含用户名 '{dotcom_user}'，登录态有效")
        else:
            print("    未在页面中找到用户名")

        # 模拟 XHR 请求 (与抓包中的 dashboard 请求一致)
        print("\n[5] 模拟 XHR - 获取仓库列表...")
        xhr_headers = {
            **XHR_HEADERS,
            "Referer": "https://github.com/",
        }
        resp = session.get(
            "https://github.com/dashboard/my_top_repositories?location=left",
            headers=xhr_headers,
        )
        print(f"    状态码: {resp.status_code}")
        if resp.status_code == 200:
            print("    XHR 请求成功，会话完全有效")

    # Cookie 汇总
    print("\n===== Cookie 汇总 =====")
    for cookie in session.cookies.jar:
        value = cookie.value
        if len(value) > 50:
            value = value[:50] + "..."
        print(f"  {cookie.name} = {value}")

    # 对比总结
    print("\n===== 浏览器模拟对比 =====")
    print(f"  TLS 指纹:        curl_cffi chrome impersonate (匹配 Chrome JA3)")
    print(f"  HTTP 协议:       HTTP/2")
    print(f"  Sec-Ch-Ua:       Chrome/{CHROME_VERSION}")
    print(f"  Sec-Fetch-* 头:  完整 (Site/Mode/User/Dest)")
    print(f"  Origin/Referer:  POST 时携带")
    print(f"  Header 顺序:     curl_cffi 模拟 Chrome 顺序")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"用法: python {sys.argv[0]} <用户名/邮箱> <密码>")
        print(f"示例: python {sys.argv[0]} user@example.com mypassword")
        sys.exit(1)

    github_login(sys.argv[1], sys.argv[2])
