"""Captcha response interceptor with auto-solve loop."""

import base64
import json
from pathlib import Path

from .config import MAX_ROUNDS
from .captcha import solve_with_yescaptcha, report_task
from .game_frame import (
    find_game_frame,
    get_captcha_question,
    parse_round_info,
    click_arrow,
    click_submit,
    detect_try_again,
    click_try_again,
)


# Questions that should always be reported (success or failure)
SKIP_QUESTIONS = ['verify your account', 'verify your identity']
ALWAYS_REPORT_KEYWORDS = ["click the arrows to sum the dice and match the number on the left"]


def _is_real_question(question):
    """Check if question is a real captcha challenge, not a generic page text."""
    q = (question or "").lower().strip()
    if q in SKIP_QUESTIONS:
        return False
    # Real questions contain action keywords
    return any(kw in q for kw in ['pick', 'select', 'use the', 'rotate', 'change', 'move',
                                   'connect', 'which', 'match', 'click', 'arrows', 'dice'])


def _should_always_report(question):
    """Check if question matches keywords that need reporting regardless of outcome."""
    q = (question or "").lower()
    return any(kw in q for kw in ALWAYS_REPORT_KEYWORDS)


def _extract_captcha_image(page, save_dir, counter):
    """Extract captcha image from game frame — tries img.src, background-image, then canvas.
    Returns raw base64 string (no prefix) or None."""
    frame = find_game_frame(page)
    if not frame:
        print(f"  \033[31m  game frame not found\033[0m")
        return None

    # Strategy 1: Find element with background-image data URI (most common for wires/match type)
    try:
        result = frame.evaluate('''() => {
            // Check all elements for background-image with data URI
            const all = document.querySelectorAll('*');
            for (const el of all) {
                const bg = getComputedStyle(el).backgroundImage;
                if (bg && bg.startsWith('url("data:image')) {
                    const match = bg.match(/url\\("(data:image[^"]+)"\\)/);
                    if (match && match[1].length > 1000) {
                        return { type: 'bg', data: match[1] };
                    }
                }
            }
            // Check img elements with non-empty src (not SVG icons)
            const imgs = document.querySelectorAll('img');
            for (const img of imgs) {
                const src = img.src || '';
                if (src.startsWith('data:image') && !src.includes('svg') && src.length > 1000) {
                    return { type: 'img_data', data: src };
                }
                if (src.startsWith('blob:')) {
                    return { type: 'blob', src: src };
                }
                // img with content but no src — try canvas capture
                if (img.naturalWidth > 100 && img.naturalHeight > 100) {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                        if (dataUrl.length > 1000) {
                            return { type: 'canvas_img', data: dataUrl };
                        }
                    } catch(e) {}
                }
            }
            // Check canvas elements directly
            const canvases = document.querySelectorAll('canvas');
            for (const c of canvases) {
                if (c.width > 100 && c.height > 100) {
                    try {
                        const dataUrl = c.toDataURL('image/jpeg', 0.9);
                        if (dataUrl.length > 1000) {
                            return { type: 'canvas', data: dataUrl };
                        }
                    } catch(e) {}
                }
            }
            return null;
        }''')

        if result:
            print(f"  \033[35m  found image via: {result['type']}\033[0m")
            data = result.get('data', '')
            if data.startswith('data:image'):
                img_b64 = data.split(',', 1)[1]
            else:
                img_b64 = data

            img_bytes = base64.b64decode(img_b64)
            if len(img_bytes) > 5000:
                counter[0] += 1
                (save_dir / f"captcha_{counter[0]}.jpg").write_bytes(img_bytes)
                print(f"  captcha_{counter[0]} ({len(img_bytes)} bytes from {result['type']})")
                return img_b64
            else:
                print(f"  \033[31m  image too small: {len(img_bytes)} bytes\033[0m")

    except Exception as e:
        print(f"  \033[31m  JS extract error: {e}\033[0m")

    # Fallback: screenshot the largest visible img element in game frame
    try:
        all_imgs = frame.query_selector_all('img')
        best = None
        best_area = 0
        for img in all_imgs:
            try:
                if not img.is_visible():
                    continue
                box = img.bounding_box()
                if box and box['width'] > 50 and box['height'] > 50:
                    area = box['width'] * box['height']
                    if area > best_area:
                        best_area = area
                        best = img
            except:
                pass
        if best:
            img_bytes = best.screenshot(type="jpeg", quality=95)
            if len(img_bytes) > 5000:
                counter[0] += 1
                (save_dir / f"captcha_{counter[0]}.jpg").write_bytes(img_bytes)
                img_b64 = base64.b64encode(img_bytes).decode()
                box = best.bounding_box()
                print(f"  captcha_{counter[0]} ({len(img_bytes)} bytes from screenshot {int(box['width'])}x{int(box['height'])})")
                return img_b64
            else:
                print(f"  \033[31m  screenshot too small: {len(img_bytes)} bytes\033[0m")
    except Exception as e:
        print(f"  \033[31m  screenshot fallback error: {e}\033[0m")

    print(f"  \033[31m  captcha image not found in game frame\033[0m")
    return None


def setup_captcha_interceptor(page, save_dir: Path):
    """Listen for captcha images -> auto-solve with multi-round support."""
    counter = [0]
    solving = [False]
    captcha_ready = [False]
    last_image_b64 = [None]

    def on_response(response):
        try:
            url = response.url
            if 'arkoselabs' not in url:
                return
            # Log all arkoselabs network traffic
            content_type = response.headers.get('content-type', '')
            status = response.status
            print(f"  \033[36m[NET]\033[0m \033[33m{status}\033[0m {content_type[:30]} \033[33m{url[:120]}\033[0m")
            if '/rtig/image' not in url:
                return
            # Try to intercept raw image bytes (old approach)
            if 'image' in content_type:
                body = response.body()
                if len(body) > 5000:
                    counter[0] += 1
                    (save_dir / f"captcha_{counter[0]}.jpg").write_bytes(body)
                    last_image_b64[0] = base64.b64encode(body).decode()
                    print(f"  \033[32mcaptcha_{counter[0]} ({len(body)} bytes from network)\033[0m")
            captcha_ready[0] = True
        except:
            pass

    page.on("response", on_response)
    print(f"  Interceptor active — auto-solve with multi-round support")

    def try_solve():
        """Called from main loop when captcha_ready is set."""
        if not captcha_ready[0] or solving[0]:
            return
        captcha_ready[0] = False
        solving[0] = True

        try:
            print(f"\n  FunCaptcha detected! Waiting for challenge to load...")

            # Wait for real question to appear (not generic "Verify your account")
            question = None
            for _ in range(10):
                page.wait_for_timeout(2000)
                question = get_captcha_question(page)
                if question and _is_real_question(question):
                    break
                print(f"  Waiting for challenge... (got: {question or 'none'})")
                question = None

            if not question:
                print(f"  Cannot detect real challenge question — stopping")
                return

            task_ids = []
            always_report = False

            for round_num in range(MAX_ROUNDS):
                if round_num > 0:
                    question = get_captcha_question(page)
                    if not question or not _is_real_question(question):
                        print(f"  No question found, waiting...")
                        page.wait_for_timeout(2000)
                        question = get_captcha_question(page)
                    if not question:
                        print(f"  Cannot detect question — stopping")
                        break

                if _should_always_report(question):
                    always_report = True

                current, total = parse_round_info(question)
                print(f"\n  === Round {current}/{total} ===")
                print(f"  ? {question}")

                # Use network-intercepted image if available, else try DOM extraction
                img_b64 = last_image_b64[0]
                if img_b64:
                    print(f"  Using network-intercepted image")
                else:
                    print(f"  Network image not available, trying DOM extraction...")
                    img_b64 = _extract_captcha_image(page, save_dir, counter)
                if not img_b64:
                    print(f"  No captcha image available")
                    break
                last_image_b64[0] = None

                print(f"  Solving...")
                result, task_id = solve_with_yescaptcha(img_b64, question)
                if task_id:
                    task_ids.append(task_id)

                if not result:
                    print(f"  API failed")
                    if task_ids:
                        report_task(task_ids, is_success=False)
                    break

                raw_objects = result.get('objects', [])
                labels = result.get('labels', [])
                display = [x + 1 for x in raw_objects]
                print(f"  Answer: positions={display} labels={labels}")

                clicks = raw_objects[0] if raw_objects else 0
                if clicks > 0:
                    click_arrow(page, 'right', clicks)
                    print(f"  Clicked right x{clicks}")
                    page.wait_for_timeout(500)

                click_submit(page)

                # Last round — done
                if current >= total:
                    page.wait_for_timeout(2000)
                    if detect_try_again(page):
                        print(f"  Wrong answer — clicking Try Again")
                        report_task(task_ids, is_success=False)
                        task_ids.clear()
                        click_try_again(page)
                        page.wait_for_timeout(2000)
                        continue
                    print(f"\n  Captcha solved!")
                    if always_report and task_ids:
                        report_task(task_ids, is_success=False)
                    break

                # Wait for next round
                page.wait_for_timeout(3000)

                if detect_try_again(page):
                    print(f"  Wrong answer — clicking Try Again")
                    report_task(task_ids, is_success=False)
                    task_ids.clear()
                    click_try_again(page)
                    page.wait_for_timeout(2000)
                    continue

                new_q = get_captcha_question(page)
                if not new_q:
                    print(f"\n  Captcha solved!")
                    if always_report and task_ids:
                        report_task(task_ids, is_success=False)
                    break

            page.wait_for_timeout(3000)
        except Exception as e:
            print(f"  Solver error: {e}")
            page.wait_for_timeout(3000)
        finally:
            solving[0] = False

    return counter, solving, captcha_ready, try_solve
