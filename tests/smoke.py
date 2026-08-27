"""
KCC smoke test.

Loads every public route in light, dark and mobile, and fails if a page errors,
renders nothing, or scrolls sideways.

    npm run build && npm start -- -p 3111     # in one terminal
    npm run test:smoke                        # in another

First run only:
    pip install playwright && python -m playwright install chromium

Note the waits below use `domcontentloaded`, not `networkidle`. Firestore holds
a websocket open for as long as the page is alive, so networkidle never fires on
this app and every navigation would time out.
"""

import os
import sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get("SMOKE_BASE_URL", "http://localhost:3111")
SHOTS = os.environ.get("SMOKE_SHOT_DIR", "")

PAGES = [
    ("landing", "/"),
    ("menu", "/menu"),
    ("hotel", "/hotel"),
    ("aboutus", "/aboutus"),
    ("contactus", "/contactus"),
    ("login", "/login"),
    ("signup", "/signup"),
    ("admin-login", "/admin/login"),
]

# Firestore refuses reads until the rules are deployed and content exists. That
# is a setup state, not a code defect, so it must not fail the smoke test.
EXPECTED = ("permission", "insufficient", "firestore", "failed to get document")


def is_expected(message: str) -> bool:
    low = message.lower()
    return any(token in low for token in EXPECTED)


def check(page, label: str, path: str, failures: list, shot: str | None, errors: list):
    # `errors` is owned by the caller and cleared per navigation — registering a
    # listener here would stack a new one on every page.
    errors.clear()

    resp = page.goto(BASE + path, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_selector("body", timeout=10000)
    # Let the client components hydrate and paint.
    page.wait_for_timeout(1200)

    status = resp.status if resp else 0
    text_len = page.evaluate("document.body.innerText.length")
    overflows = page.evaluate(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth + 2"
    )
    dark = page.evaluate("document.documentElement.classList.contains('dark')")

    if shot:
        page.screenshot(path=shot, full_page=False)

    if status != 200:
        failures.append(f"{label} {path}: HTTP {status}")
    if text_len < 200:
        failures.append(f"{label} {path}: rendered only {text_len} chars")
    if overflows:
        failures.append(f"{label} {path}: horizontal overflow")

    real = [e for e in errors if not is_expected(e)]
    if real:
        failures.append(f"{label} {path}: {real[0][:200]}")

    flag = "  <-- " + real[0][:80] if real else ""
    print(f"  {label:8} {path:14} {status}  dark={str(dark):5} "
          f"chars={text_len:<6} overflow={overflows}{flag}")


def main() -> int:
    failures: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for theme in ("light", "dark"):
            print(f"\n{theme} / desktop")
            ctx = browser.new_context(
                viewport={"width": 1440, "height": 950}, color_scheme=theme
            )
            page = ctx.new_page()
            errors: list[str] = []
            page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
            for name, path in PAGES:
                shot = os.path.join(SHOTS, f"{theme}-{name}.png") if SHOTS else None
                try:
                    check(page, theme, path, failures, shot, errors)
                except Exception as ex:
                    print(f"  {theme:8} {path:14} EXCEPTION {ex}")
                    failures.append(f"{theme} {path}: {ex}")
            ctx.close()

        print("\nmobile / 390x844")
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844}, color_scheme="light"
        )
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        for name, path in PAGES:
            shot = os.path.join(SHOTS, f"mobile-{name}.png") if SHOTS else None
            try:
                check(page, "mobile", path, failures, shot, errors)
            except Exception as ex:
                print(f"  mobile   {path:14} EXCEPTION {ex}")
                failures.append(f"mobile {path}: {ex}")
        ctx.close()

        browser.close()

    print("\n" + "=" * 66)
    if failures:
        print(f"FAILED — {len(failures)} problem(s):")
        for f in failures:
            print("  -", f)
        return 1
    print("PASSED — every route rendered, no page errors, no overflow.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
