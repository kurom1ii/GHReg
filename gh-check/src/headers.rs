use rquest::header::{HeaderMap, HeaderValue};

pub const CHROME_VERSION: &str = "143";

fn hv(s: &str) -> HeaderValue {
    HeaderValue::from_str(s).unwrap()
}

/// Common Sec-CH-UA + UA headers shared by all request types.
fn common() -> HeaderMap {
    let mut h = HeaderMap::new();
    h.insert(
        "sec-ch-ua",
        hv(&format!(
            "\"Chromium\";v=\"{v}\", \"Google Chrome\";v=\"{v}\", \"Not?A_Brand\";v=\"99\"",
            v = CHROME_VERSION
        )),
    );
    h.insert("sec-ch-ua-mobile", hv("?0"));
    h.insert("sec-ch-ua-platform", hv("\"Linux\""));
    h.insert("accept-language", hv("zh-CN,zh;q=0.9,en;q=0.8"));
    h.insert(
        "user-agent",
        hv(&format!(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{v}.0.0.0 Safari/537.36",
            v = CHROME_VERSION
        )),
    );
    h.insert("accept-encoding", hv("gzip, deflate, br, zstd"));
    h
}

/// Navigation (full page GET) headers.
pub fn nav_headers() -> HeaderMap {
    let mut h = common();
    h.insert(
        "accept",
        hv("text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"),
    );
    h.insert("upgrade-insecure-requests", hv("1"));
    h.insert("sec-fetch-site", hv("none"));
    h.insert("sec-fetch-mode", hv("navigate"));
    h.insert("sec-fetch-user", hv("?1"));
    h.insert("sec-fetch-dest", hv("document"));
    h
}

/// POST form submission headers.
pub fn post_headers() -> HeaderMap {
    let mut h = common();
    h.insert(
        "accept",
        hv("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    );
    h.insert(
        "content-type",
        hv("application/x-www-form-urlencoded"),
    );
    h.insert("origin", hv("https://github.com"));
    h.insert("sec-fetch-site", hv("same-origin"));
    h.insert("sec-fetch-mode", hv("navigate"));
    h.insert("sec-fetch-user", hv("?1"));
    h.insert("sec-fetch-dest", hv("document"));
    h
}

/// XHR / fetch headers.
pub fn xhr_headers() -> HeaderMap {
    let mut h = common();
    h.insert(
        "accept",
        hv("text/html, application/json, */*"),
    );
    h.insert("x-requested-with", hv("XMLHttpRequest"));
    h.insert("sec-fetch-site", hv("same-origin"));
    h.insert("sec-fetch-mode", hv("cors"));
    h.insert("sec-fetch-dest", hv("empty"));
    h
}
