"""Proxy and captcha configuration for signup flow."""

from pathlib import Path

# ====== Proxy (ProxyNo1) ======
PROXY_HOST = "ybdc1.proxyno1.com"
PROXY_PORT = 47244
PROXY_KEY = "XjZcNObANHVu9Ij2aIr59C1775727581"
ROTATE_IP_API = f"https://app.proxyno1.com/api/change-key-ip/{PROXY_KEY}"
ROTATE_WAIT = 10

PROXY = {"server": f"http://{PROXY_HOST}:{PROXY_PORT}"}

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
