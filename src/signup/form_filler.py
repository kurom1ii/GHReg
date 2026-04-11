"""Auto-fill GitHub signup form with simulated human interactions."""

import random


def fast_human_type(page, selector, text, delay_min=1, delay_max=2):
    """Click on element then type char by char with fast delay."""
    el = None
    for sel in selector.split(", "):
        sel = sel.strip()
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                break
            el = None
        except:
            pass

    if not el:
        print(f"    Selector not found: {selector}")
        return False
    el.click()
    for char in text:
        page.keyboard.type(char, delay=random.randint(delay_min, delay_max))
    return True

def _human_type(page, selector, text, delay_min=5, delay_max=15):
    """Click on element then type char by char with fast delay."""
    el = None
    for sel in selector.split(", "):
        sel = sel.strip()
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                break
            el = None
        except:
            pass

    if not el:
        print(f"    Selector not found: {selector}")
        return False
    el.click()
    page.wait_for_timeout(random.randint(50, 100))
    for char in text:
        page.keyboard.type(char, delay=random.randint(delay_min, delay_max))
    page.wait_for_timeout(random.randint(50, 150))
    return True


def _select_country(page, country="Vietnam"):
    """Select country from GitHub's custom dropdown (Primer Button)."""
    # GitHub uses a custom button dropdown, not <select>
    # Find the country dropdown trigger button
    for sel in [
        'button:has-text("Country")',
        'button:has-text("country")',
        'button:has-text("Region")',
        'summary:has-text("Country")',
        'summary:has-text("Region")',
        '[aria-label*="Country" i]',
        '[aria-label*="Region" i]',
        'button.select-menu-button',
    ]:
        try:
            btn = page.query_selector(sel)
            if btn and btn.is_visible():
                btn.click()
                page.wait_for_timeout(500)
                # Now find Vietnam in the dropdown
                option = page.query_selector(f'[role="option"]:has-text("{country}"), [role="menuitemradio"]:has-text("{country}"), li:has-text("{country}"), span:has-text("{country}")')
                if option and option.is_visible():
                    option.click()
                    print(f"    Selected country: {country}")
                    return True
        except:
            pass

    # Fallback: find any button that looks like a country picker (has chevron-down + "Select")
    try:
        buttons = page.query_selector_all('button')
        for btn in buttons:
            try:
                text = (btn.text_content() or "").strip().lower()
                if "country" in text or "region" in text or "select" in text:
                    if btn.is_visible():
                        btn.click()
                        page.wait_for_timeout(500)
                        option = page.query_selector(f'[role="option"]:has-text("{country}"), li:has-text("{country}"), span:text-is("{country}")')
                        if option and option.is_visible():
                            option.click()
                            print(f"    Selected country: {country}")
                            return True
            except:
                pass
    except:
        pass

    # Fallback: standard <select>
    try:
        selects = page.query_selector_all('select')
        for el in selects:
            if el.is_visible():
                options = el.query_selector_all('option')
                for opt in options:
                    if country.lower() in (opt.text_content() or "").lower():
                        el.select_option(label=opt.text_content().strip())
                        print(f"    Selected country: {country}")
                        return True
    except:
        pass

    print(f"    Country selector not found")
    return False


def _click_create_account(page):
    """Click 'Create account' button twice (skip OAuth buttons)."""
    skip_words = ["google", "microsoft", "apple", "github"]

    def _find_and_click():
        # "Create account" button
        for sel in [
            'button:has-text("Create account")',
            'button:has-text("Create Account")',
            'input[value*="Create account" i]',
            'button[type="submit"]',
        ]:
            try:
                btn = page.query_selector(sel)
                if btn and btn.is_visible():
                    text = (btn.text_content() or "").strip().lower()
                    if any(w in text for w in skip_words):
                        continue
                    btn.click()
                    return True
            except:
                pass
        return False

    if _find_and_click():
        print(f"    Clicked Create account")
        page.wait_for_timeout(1000)
        if _find_and_click():
            pass
        if _find_and_click():
            pass
        return True

    print(f"    Create account button not found")
    return False


def fill_signup_form(page, email, password):
    """Auto-fill the GitHub signup form (single page).

    Fill email -> password -> username -> country -> click Create account x2.
    """
    username = email.split("@")[0]
    page.wait_for_timeout(1500)

    # Email
    print("  [Form] Filling email...")
    _human_type(page, '#email, input[name="user[email]"], input[type="email"]', email)
    print(f"    Email: {email}")
    page.wait_for_timeout(500)

    # Password
    print("  [Form] Filling password...")
    _human_type(page, '#password, input[name="user[password]"], input[type="password"]', password)
    print(f"    Password: {'*' * len(password)}")
    page.wait_for_timeout(500)

    # Username
    print("  [Form] Filling username...")
    _human_type(page, '#login, input[name="user[login]"], input[name="login"]', username)
    print(f"    Username: {username}")
    page.wait_for_timeout(500)

    # Country
    # print("  [Form] Selecting country...")
    # _select_country(page, "Vietnam")
    # page.wait_for_timeout(2000)

    # Click Create account x2
    print("  [Form] Clicking Create account...")
    _click_create_account(page)
    page.wait_for_timeout(2000)

    print("  [Form] Done — waiting for captcha...\n")
