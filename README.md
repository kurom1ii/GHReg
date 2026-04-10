# GHReg — GitHub Registration Automation

Dang ky tai khoan GitHub tu dong voi Camoufox (stealth Firefox) + YesCaptcha.

## Cau truc

```
GHReg/
├── src/
│   ├── signup.py            # Main: dang ky GitHub (Camoufox + YesCaptcha auto-solve)
│   ├── github_login.py      # Test login flow (curl_cffi TLS fingerprint)
│   ├── pat_creator.py       # Tao Fine-grained PAT tu dong
│   ├── import_token.py      # Import token vao SQLite pool
│   └── cf_email_routing.py  # Tao email routing tren Cloudflare
├── extensions/
│   └── yescaptcha_firefox/  # YesCaptcha Firefox addon (auto captcha solve)
├── infra/
│   └── deploy_cf_worker.py  # Deploy Cloudflare Worker proxy
├── data/                    # Captcha images (gitignored)
├── pyproject.toml
└── .python-version
```

## Cai dat

```bash
uv sync
uv run camoufox fetch
```

## Su dung

### Dang ky tai khoan GitHub

```bash
uv run python src/signup.py
```

Script se:
1. Rotate IP qua ProxyNo1
2. Mo Camoufox (stealth Firefox) voi fingerprint random
3. Tu dong click Verify khi captcha xuat hien
4. Giai FunCaptcha qua YesCaptcha API
5. Ban tu dien form + nhap verification code

### Tao PAT

```bash
uv run python src/pat_creator.py -u user@mail.com -p password -n "my-token" --preset copilot
```

### Tao email routing (Cloudflare)

```bash
uv run python src/cf_email_routing.py
```

## Yeu cau

- Python >= 3.13
- ProxyNo1 key (residential proxy)
- YesCaptcha API key
