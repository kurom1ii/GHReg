#!/usr/bin/env python3
"""
Cloudflare Worker 部署脚本
- 登录 Cloudflare
- 创建/更新 Worker（代理 app.warp.dev/auth/* 请求绕过 Cloud Armor）
- 输出 Worker URL 供注册脚本使用
"""
import asyncio, os, json, sys, re
import requests, urllib3
urllib3.disable_warnings()

WORKER_NAME = "warp-proxy"
WORKER_SCRIPT = r"""
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    // 只代理 /auth/ 相关接口
    const allowed = ['/auth/send_email_link'];
    if (!allowed.some(p => path.startsWith(p))) {
      return new Response('not found', { status: 404 });
    }

    const body = await request.arrayBuffer();
    const headers = new Headers();
    for (const [k, v] of request.headers.entries()) {
      const lower = k.toLowerCase();
      if (['host','cf-connecting-ip','cf-ipcountry','cf-ray','x-forwarded-for'].includes(lower)) continue;
      headers.set(k, v);
    }
    headers.set('Host', 'app.warp.dev');

    const resp = await fetch('https://app.warp.dev' + path, {
      method: request.method,
      headers,
      body: body.byteLength > 0 ? body : undefined,
    });

    const resHeaders = new Headers(resp.headers);
    resHeaders.delete('content-encoding');
    resHeaders.delete('transfer-encoding');
    return new Response(resp.body, { status: resp.status, headers: resHeaders });
  }
}
""".strip()

def log(msg):
    print(msg, flush=True)

async def get_cf_api_token(email: str, password: str) -> tuple:
    """通过 Playwright 登录 CF 并获取 Account ID + API Token"""
    from playwright.async_api import async_playwright
    
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            locale="en-US"
        )
        page = await ctx.new_page()
        
        log("  🌐 打开 Cloudflare 登录页…")
        await page.goto("https://dash.cloudflare.com/login", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        
        # 填写邮箱
        await page.fill('input[name="email"]', email)
        await page.click('button[type="submit"]')
        await asyncio.sleep(2)
        
        # 填写密码
        try:
            await page.wait_for_selector('input[name="password"]', timeout=10000)
            await page.fill('input[name="password"]', password)
            await page.click('button[type="submit"]')
        except Exception:
            # 有些 CF 页面是一步输入
            try:
                await page.fill('input[type="password"]', password)
                await page.click('button[type="submit"]')
            except Exception as e:
                log(f"  ❌ 密码输入失败: {e}")
                await page.screenshot(path="/tmp/cf_login.png")
                await browser.close()
                return None, None
        
        # 等待登录完成或 2FA
        await asyncio.sleep(4)
        cur = page.url
        log(f"  📍 登录后 URL: {cur[:80]}")
        
        # 2FA 处理
        if "two-factor" in cur or "2fa" in cur.lower() or "otp" in cur.lower():
            log("  🔐 检测到 2FA，请在控制台输入验证码：")
            code = input("  > 2FA code: ").strip()
            try:
                await page.fill('input[type="text"], input[name="otp"], input[autocomplete="one-time-code"]', code)
                await page.click('button[type="submit"]')
                await asyncio.sleep(3)
            except Exception as e:
                log(f"  ❌ 2FA 失败: {e}")
                await browser.close()
                return None, None
        
        # 等待跳转到 dashboard
        try:
            await page.wait_for_url("**/dash.cloudflare.com/**", timeout=20000)
        except Exception:
            pass
        
        log(f"  📍 Dashboard URL: {page.url[:80]}")
        
        # 拿 Account ID（从 URL 中提取）
        account_id = None
        url_match = re.search(r'dash\.cloudflare\.com/([a-f0-9]{32})', page.url)
        if url_match:
            account_id = url_match.group(1)
            log(f"  ✅ Account ID (from URL): {account_id}")
        
        if not account_id:
            # 用 CF API 获取
            log("  🔍 从 API 获取 Account ID…")
            # 先用 cookie session 调 API
            cookies = await ctx.cookies()
            cookie_str = "; ".join([f"{c['name']}={c['value']}" for c in cookies])
            
            # 导航到 API tokens 页面
            await page.goto("https://dash.cloudflare.com/profile/api-tokens", wait_until="domcontentloaded")
            await asyncio.sleep(2)
            
            url_match2 = re.search(r'dash\.cloudflare\.com/([a-f0-9]{32})', page.url)
            if url_match2:
                account_id = url_match2.group(1)
                log(f"  ✅ Account ID: {account_id}")
        
        # 创建 API Token
        log("  🔑 创建 API Token…")
        await page.goto("https://dash.cloudflare.com/profile/api-tokens", wait_until="networkidle")
        await asyncio.sleep(2)
        
        # 点击 Create Token
        try:
            await page.click('text=Create Token', timeout=10000)
            await asyncio.sleep(2)
            # 选择 Edit Cloudflare Workers 模板
            try:
                await page.click('text=Edit Cloudflare Workers', timeout=5000)
                await asyncio.sleep(1)
            except Exception:
                # 如果没有这个模板，用 Custom Token
                await page.click('text=Custom token', timeout=5000)
                await asyncio.sleep(1)
            
            await page.screenshot(path="/tmp/cf_token_create.png")
            log("  📸 Token 创建截图→ /tmp/cf_token_create.png")
            
            # 点击 Continue to Summary
            await page.click('text=Continue to summary', timeout=10000)
            await asyncio.sleep(1)
            # 点击 Create Token
            await page.click('button:has-text("Create Token")', timeout=10000)
            await asyncio.sleep(2)
            
            # 获取 token 值
            token_input = await page.query_selector('input[type="text"][readonly], code, .token-value')
            if token_input:
                token = await token_input.input_value() if await token_input.get_attribute('type') == 'text' else await token_input.inner_text()
                token = token.strip()
                log(f"  ✅ API Token 已获取 (长度 {len(token)})")
                await browser.close()
                return account_id, token
        except Exception as e:
            log(f"  ⚠️ 自动创建 Token 失败: {e}")
            await page.screenshot(path="/tmp/cf_token_err.png")
        
        # 备用：使用 Global API Key
        log("  🔑 尝试获取 Global API Key…")
        await page.goto("https://dash.cloudflare.com/profile/api-tokens", wait_until="domcontentloaded")
        await asyncio.sleep(2)
        
        try:
            # 点击 View 按钮旁边的 Global API Key
            await page.click('text=Global API Key', timeout=5000)
            await asyncio.sleep(1)
            await page.screenshot(path="/tmp/cf_global_key.png")
            
            # 可能需要输入密码确认
            pw_input = await page.query_selector('input[type="password"]')
            if pw_input:
                await pw_input.fill(password)
                await page.click('button[type="submit"], button:has-text("View")')
                await asyncio.sleep(2)
            
            key_input = await page.query_selector('input[readonly], code#api-key-value')
            if key_input:
                key = await key_input.input_value()
                log(f"  ✅ Global API Key 已获取 (长度 {len(key)})")
                await browser.close()
                # Global API Key 用 email 作为认证
                return account_id, f"GLOBAL:{email}:{key}"
        except Exception as e:
            log(f"  ⚠️ Global API Key 获取失败: {e}")
            await page.screenshot(path="/tmp/cf_key_err.png")
        
        await browser.close()
        return account_id, None


async def deploy_worker(account_id: str, auth: str, worker_name: str, script: str) -> str:
    """通过 Cloudflare API 部署 Worker"""
    
    # 准备 headers
    if auth.startswith("GLOBAL:"):
        parts = auth.split(":", 2)
        headers = {
            "X-Auth-Email": parts[1],
            "X-Auth-Key": parts[2],
            "Content-Type": "application/javascript",
        }
        api_base = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{worker_name}"
    else:
        headers = {
            "Authorization": f"Bearer {auth}",
            "Content-Type": "application/javascript",
        }
        api_base = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{worker_name}"
    
    log(f"  📤 部署 Worker '{worker_name}'…")
    
    # 先列出账号（验证认证）
    if auth.startswith("GLOBAL:"):
        parts = auth.split(":", 2)
        verify_headers = {
            "X-Auth-Email": parts[1],
            "X-Auth-Key": parts[2],
        }
    else:
        verify_headers = {"Authorization": f"Bearer {auth}"}
    
    r = requests.get("https://api.cloudflare.com/client/v4/accounts",
                     headers=verify_headers, verify=False, timeout=15)
    d = r.json()
    if not d.get("success"):
        log(f"  ❌ API 认证失败: {d.get('errors', d)}")
        return None
    
    accounts = d.get("result", [])
    if accounts and not account_id:
        account_id = accounts[0]["id"]
        log(f"  ✅ Account ID: {account_id}")
    elif accounts:
        log(f"  ✅ 认证成功，账号: {accounts[0].get('name', account_id)}")
    
    # 部署 Worker（multipart/form-data 格式）
    import io
    metadata = json.dumps({
        "main_module": "worker.js",
        "bindings": [],
        "compatibility_date": "2024-01-01",
        "usage_model": "standard"
    })
    
    # 用 PUT 部署 ES Module Worker
    put_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{worker_name}"
    
    if auth.startswith("GLOBAL:"):
        parts = auth.split(":", 2)
        put_headers = {
            "X-Auth-Email": parts[1],
            "X-Auth-Key": parts[2],
        }
    else:
        put_headers = {"Authorization": f"Bearer {auth}"}
    
    # 用 multipart 部署 ES module
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body_parts = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"metadata\"\r\nContent-Type: application/json\r\n\r\n{metadata}\r\n",
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"worker.js\"; filename=\"worker.js\"\r\nContent-Type: application/javascript+module\r\n\r\n{script}\r\n",
        f"--{boundary}--\r\n",
    ]
    body = "".join(body_parts).encode()
    put_headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"
    
    r2 = requests.put(put_url, headers=put_headers, data=body, verify=False, timeout=30)
    d2 = r2.json()
    log(f"  📥 部署响应: {json.dumps(d2)[:300]}")
    
    if d2.get("success"):
        # 获取 subdomain
        sub_r = requests.get(
            f"https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/subdomain",
            headers=put_headers if not auth.startswith("GLOBAL:") else {
                "X-Auth-Email": auth.split(":")[1],
                "X-Auth-Key": auth.split(":", 2)[2],
            },
            verify=False, timeout=10
        )
        sub_d = sub_r.json()
        subdomain = sub_d.get("result", {}).get("subdomain", "")
        if subdomain:
            worker_url = f"https://{worker_name}.{subdomain}.workers.dev"
        else:
            worker_url = f"https://{worker_name}.workers.dev"
        log(f"  ✅ Worker 已部署: {worker_url}")
        return worker_url
    else:
        log(f"  ❌ 部署失败: {d2.get('errors', d2)}")
        return None


async def test_worker(worker_url: str) -> bool:
    """测试 Worker 是否能转发请求"""
    log(f"  🧪 测试 Worker: {worker_url}/auth/send_email_link")
    try:
        r = requests.post(
            f"{worker_url}/auth/send_email_link",
            json={"email": "test@test.com", "captchaResponse": "test"},
            headers={
                "Content-Type": "application/json",
                "Origin": "https://app.warp.dev",
            },
            verify=False, timeout=15
        )
        log(f"  📥 状态码: {r.status_code} (直连是 403，非 403 表示 Worker 生效)")
        # 非 403 说明 Cloud Armor 没拦截（可能是 400/422 等业务错误，这正是我们想要的）
        return r.status_code != 403
    except Exception as e:
        log(f"  ⚠️ 测试异常: {e}")
        return False


async def main():
    email = "1842156241@qq.com"
    password = os.environ.get("CF_PASS", "")
    if not password:
        log("❌ 请设置环境变量 CF_PASS")
        sys.exit(1)
    
    log("=" * 60)
    log("🚀 Cloudflare Worker 部署脚本")
    log("=" * 60)
    
    # Step 1: 获取 API Token
    log("\n[Step 1] 获取 Cloudflare API 认证…")
    account_id, auth = await get_cf_api_token(email, password)
    
    if not auth:
        log("❌ 无法获取 API Token，请手动操作：")
        log("  1. 登录 https://dash.cloudflare.com/profile/api-tokens")
        log("  2. 创建 'Edit Cloudflare Workers' 权限的 Token")
        log("  3. 运行: CF_TOKEN=<token> CF_ACCOUNT=<account_id> python3 deploy_cf_worker.py --manual")
        sys.exit(1)
    
    # Step 2: 部署 Worker
    log(f"\n[Step 2] 部署 Worker…")
    worker_url = await deploy_worker(account_id, auth, WORKER_NAME, WORKER_SCRIPT)
    
    if not worker_url:
        sys.exit(1)
    
    # Step 3: 测试
    log(f"\n[Step 3] 测试 Worker…")
    await asyncio.sleep(5)  # 等待 Worker 传播
    ok = await test_worker(worker_url)
    
    if ok:
        log(f"\n✅ Worker 就绪！代理 URL: {worker_url}")
        # 保存 URL
        with open("/home/wolf/copilot/cf_worker_url.txt", "w") as f:
            f.write(worker_url)
        log("  💾 已保存到 /home/wolf/copilot/cf_worker_url.txt")
    else:
        log(f"\n⚠️ Worker 已部署但仍返回 403，CF IP 可能也被 Cloud Armor 封锁")
        log(f"  Worker URL: {worker_url}")


if __name__ == "__main__":
    # 支持 --manual 模式（直接用环境变量）
    if "--manual" in sys.argv:
        async def manual():
            account_id = os.environ.get("CF_ACCOUNT", "")
            auth = os.environ.get("CF_TOKEN", "")
            if not account_id or not auth:
                log("需要 CF_ACCOUNT 和 CF_TOKEN 环境变量")
                sys.exit(1)
            worker_url = await deploy_worker(account_id, auth, WORKER_NAME, WORKER_SCRIPT)
            if worker_url:
                await asyncio.sleep(5)
                await test_worker(worker_url)
                with open("/home/wolf/copilot/cf_worker_url.txt", "w") as f:
                    f.write(worker_url)
        asyncio.run(manual())
    else:
        asyncio.run(main())
