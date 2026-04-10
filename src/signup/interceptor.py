"""Captcha response interceptor with auto-solve loop."""

import base64
from pathlib import Path

from .config import MAX_ROUNDS
from .captcha import solve_with_yescaptcha, report_task
from .game_frame import (
    get_captcha_question,
    parse_round_info,
    click_arrow,
    click_submit,
    detect_try_again,
    click_try_again,
)


# Questions that should always be reported (success or failure)
ALWAYS_REPORT_KEYWORDS = ["Click the arrows to sum the dice and match the number on the left"]


def _should_always_report(question):
    """Check if question matches keywords that need reporting regardless of outcome."""
    q = (question or "").lower()
    return any(kw in q for kw in ALWAYS_REPORT_KEYWORDS)


def setup_captcha_interceptor(page, save_dir: Path):
    """Listen for captcha images -> auto-solve with multi-round support."""
    counter = [0]
    solving = [False]
    last_image_b64 = [None]

    def on_response(response):
        try:
            url = response.url
            if 'arkoselabs' not in url or '/rtig/image' not in url:
                return
            content_type = response.headers.get('content-type', '')
            if 'image' not in content_type:
                return
            body = response.body()
            if len(body) < 5000:
                return

            counter[0] += 1
            (save_dir / f"captcha_{counter[0]}.jpg").write_bytes(body)
            img_b64 = base64.b64encode(body).decode()
            last_image_b64[0] = img_b64
            print(f"  captcha_{counter[0]} ({len(body)} bytes)")

            if solving[0]:
                return

            solving[0] = True
            print(f"\n  FunCaptcha detected! Starting auto-solve...")

            page.wait_for_timeout(1500)

            task_ids = []  # Track task IDs for reporting
            always_report = False  # Flag for special question types

            for round_num in range(MAX_ROUNDS):
                question = get_captcha_question(page)
                if not question:
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

                if not last_image_b64[0]:
                    print(f"  No captcha image available")
                    break

                print(f"  Solving...")
                result, task_id = solve_with_yescaptcha(last_image_b64[0], question)
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
                        last_image_b64[0] = None
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
                    last_image_b64[0] = None
                    continue

                new_q = get_captcha_question(page)
                if not new_q:
                    print(f"\n  Captcha solved!")
                    if always_report and task_ids:
                        report_task(task_ids, is_success=False)
                    break

            page.wait_for_timeout(5000)
            solving[0] = False
            last_image_b64[0] = None

        except Exception as e:
            print(f"  Solver error: {e}")
            page.wait_for_timeout(3000)
            solving[0] = False

    page.on("response", on_response)
    print(f"  Interceptor active — auto-solve with multi-round support")
    return counter, solving
