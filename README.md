# GHReg — GitHub Registration Automation

# octocaptcha.com, arkose, funcaptcha

> **NOTE / 注意**
>
> As of April 2026, the best way to register GitHub accounts:
>
> 1. **Use a rotating residential proxy** — datacenter proxies will NOT work, they get flagged immediately.
> 2. **Use Cloudflare Worker Email Routing with your own domain** — set up a custom domain and route emails through Cloudflare Workers.
> 3. **Do NOT use Hotmail, Gmail, or Outlook** — these providers significantly reduce success rate and frequently trigger FunCaptcha flags, making registration much harder.
>
> ---
>
> 截至2026年4月，注册GitHub账号的最佳方式：
>
> 1. **必须使用旋转住宅代理** — 数据中心代理不行，会被立即标记。
> 2. **必须使用 Cloudflare Worker 邮件路由 + 自定义域名** — 注册自己的域名，通过 Cloudflare Workers 转发邮件。
> 3. **不要使用 Hotmail、Gmail 或 Outlook** — 这些邮箱会大幅降低成功率，频繁触发 FunCaptcha 验证，导致注册更困难。

## Structure

```
GHReg/
├── src/
│   ├── common/
│   │   ├── headers.py           # Chrome request header templates
│   │   └── parsers.py           # HTML form parsers
│   ├── signup/
│   │   ├── config.py            # Proxy, YesCaptcha, paths config
│   │   ├── proxy.py             # IP rotation
│   │   ├── captcha.py           # YesCaptcha API client
│   │   ├── game_frame.py        # FunCaptcha frame interactions
│   │   ├── interceptor.py       # Auto-solve loop
│   │   └── flow.py              # Main signup orchestration
│   ├── login/
│   │   └── session.py           # GitHub login (curl_cffi TLS fingerprint)
│   ├── pat/
│   │   ├── permissions.py       # Fine-grained PAT permissions & presets
│   │   ├── sudo.py              # GitHub sudo mode
│   │   ├── creator.py           # PAT creation flow
│   │   ├── storage.py           # Token file storage
│   │   └── cli.py               # CLI entry point
│   └── import_token.py          # Import token to SQLite pool
├── extensions/
│   └── yescaptcha_firefox/      # YesCaptcha Firefox addon
├── data/                        # Captcha images (gitignored)
├── pyproject.toml
└── .python-version
```

## Install

```bash
uv sync
uv run camoufox fetch
```

## Usage

### Register GitHub account

```bash
python -m src.signup
```

Flow:
1. Rotate IP via proxy
2. Launch Camoufox (stealth Firefox) with random fingerprint
3. Auto-click Verify when captcha appears
4. Solve FunCaptcha via YesCaptcha API
5. You fill form + enter verification code

### Login test

```bash
python -m src.login <username> <password>
```

### Create PAT

```bash
python -m src.pat -u user@mail.com -p password -n "my-token" --preset copilot
```

## Requirements

- Python >= 3.13
- Rotating residential proxy (NOT datacenter)
- YesCaptcha API key
- Custom domain with Cloudflare Email Routing
