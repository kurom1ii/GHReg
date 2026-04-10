"""Arkose FunCaptcha game frame interaction helpers."""

import re


def find_game_frame(page):
    """Find the game-core-frame among all frames."""
    for frame in page.frames:
        if 'game-core' in (frame.url or '') or 'game_core' in (frame.url or ''):
            return frame
        try:
            h2 = frame.query_selector('#root h2, h2')
            if h2:
                text = (h2.text_content() or '').lower()
                if any(kw in text for kw in ['pick', 'select', 'use the', 'rotate', 'change', 'move', 'connect', 'which', 'match']):
                    return frame
        except:
            pass
    return None


def get_captcha_question(page):
    """Extract question text from game frame h2."""
    frame = find_game_frame(page)
    if not frame:
        return None
    try:
        h2 = frame.query_selector('#root h2, h2')
        if h2:
            text = (h2.text_content() or '').strip()
            if len(text) > 5:
                return text
    except:
        pass
    return None


def parse_round_info(question):
    """Extract (current, total) from '(2 of 3)' in question text."""
    match = re.search(r'\(?\s*(\d+)\s+of\s+(\d+)\s*\)?', question or '')
    if match:
        return int(match.group(1)), int(match.group(2))
    return 1, 1


def click_arrow(page, direction, times=1):
    """Click left/right arrow in game frame."""
    frame = find_game_frame(page)
    if not frame:
        return False
    for _ in range(times):
        sel = 'a[aria-label*="previous" i], button[aria-label*="previous" i]' if direction == 'left' \
            else 'a[aria-label*="next" i], button[aria-label*="next" i]'
        btn = frame.query_selector(sel)
        if btn:
            btn.click()
            page.wait_for_timeout(400)
        else:
            return False
    return True


def click_submit(page):
    """Click Submit button in game frame."""
    frame = find_game_frame(page)
    if not frame:
        return False
    for sel in ['button:has-text("Submit")', 'button.sc-nkuzb1-0', 'button[type="submit"]']:
        try:
            btn = frame.query_selector(sel)
            if btn and btn.is_visible():
                btn.click()
                return True
        except:
            pass
    return False


def detect_try_again(page):
    """Check if 'Try again' button appeared (wrong answer)."""
    frame = find_game_frame(page)
    if not frame:
        return False
    try:
        for sel in ['button:has-text("Try again")', 'button:has-text("try again")', 'button.dJlpAa']:
            btn = frame.query_selector(sel)
            if btn and btn.is_visible():
                return True
    except:
        pass
    return False


def click_try_again(page):
    """Click Try again button."""
    frame = find_game_frame(page)
    if not frame:
        return False
    for sel in ['button:has-text("Try again")', 'button:has-text("try again")', 'button.dJlpAa']:
        try:
            btn = frame.query_selector(sel)
            if btn and btn.is_visible():
                btn.click()
                return True
        except:
            pass
    return False


def auto_click_verify(page):
    """Auto-click Verify / Visual challenge button to start captcha."""
    for frame in page.frames:
        try:
            for sel in [
                'button[aria-label*="Visual challenge" i]',
                'button:has-text("Verify")',
                'button[data-theme*="verify" i]',
                'button:has-text("Start")',
            ]:
                btn = frame.query_selector(sel)
                if btn and btn.is_visible():
                    btn.click()
                    print(f"  Auto-clicked: {sel}")
                    return True
        except:
            continue
    return False
