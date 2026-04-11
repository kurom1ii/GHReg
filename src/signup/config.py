"""Proxy and captcha configuration for signup flow."""

from pathlib import Path

# ====== Proxy (HomeProxy.vn) ======
PROXY_HOST = "180.93.2.169"
PROXY_PORT = 3129
PROXY_USER = "garrickbrown685"
PROXY_PASS = "mzm0mjywnta4mq=="

PROXY_ID = "613219"
HOMEPROXY_TOKEN = "homepx42152_207ec828b1f8d1f14a4112f9d6b58e40bf875796949ed9f9c01b88c11414ca62"
HOMEPROXY_MERCHANT_ID = "56cf5b7e-37ec-4589-8f5b-51ff94694126"

ROTATE_IP_API = f"https://app.homeproxy.vn/api/v2/proxies/{PROXY_ID}/rotate"
LIST_PROXY_API = "https://app.homeproxy.vn/api/v2/users/proxies"
CHANGE_INFO_API = "https://app.homeproxy.vn/api/v2/orders/change-info-proxies"

PROXY = {
    "server": f"http://{PROXY_HOST}:{PROXY_PORT}",
    "username": PROXY_USER,
    "password": PROXY_PASS,
}

# ====== YesCaptcha ======
YESCAPTCHA_KEY = "d732aa8b947a7c4c590fefcb82490e75ddf1072081378"
YESCAPTCHA_BASE = "https://api.yescaptcha.com"
YESCAPTCHA_SOFT_ID = 75315

# ====== Paths ======
PROJECT_DIR = Path(__file__).resolve().parent.parent.parent
EXTENSIONS_DIR = PROJECT_DIR / "extensions"
PROFILE_DIR = PROJECT_DIR / ".chrome_profile"
FUNCAPTCHA_BASE_DIR = PROJECT_DIR / "data" / "funcaptcha"

# ====== Captcha ======
MAX_ROUNDS = 15
