"""
KCC smoke test.

Loads every public route across a device matrix from a 320px phone up to a
1920px desktop, in light and dark, and fails on any of:

  - a non-200 response
  - a page that renders almost nothing
  - the route's expected content never appearing
  - a JavaScript error, or a failed script/stylesheet request
  - the page scrolling sideways

    npm run build && npm start -- -p 3111     # in one terminal
    npm run test:smoke                        # in another

First run only:
    npm run test:smoke:setup

Two things this file is deliberate about:

  * It waits on `domcontentloaded`, never `networkidle`. Firestore holds a
    websocket open for the life of the page, so `networkidle` never fires here
    and every navigation would time out.

  * It waits for a named selector per route rather than a fixed sleep. An
    earlier version slept 1.2s and passed a page whose JS and CSS were all
    404ing, because "some text rendered" was the only bar.
"""

import os
import sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get("SMOKE_BASE_URL", "http://localhost:3111")
SHOTS = os.environ.get("SMOKE_SHOT_DIR", "")

# (label, path, selector that proves the page actually worked)
PAGES = [
    ("landing", "/", "h1"),
    # `.leader` is a priced dish row — waiting on the h1 alone would pass a menu
    # that loaded its heading and then failed to fetch a single item.
    ("menu", "/menu", ".leader"),
    ("hotel", "/hotel", "h1"),
    ("aboutus", "/aboutus", "h1"),
    ("contactus", "/contactus", "form"),
    ("login", "/login", "form"),
    ("signup", "/signup", "form"),
    ("admin-login", "/admin/login", "form"),
]

# Real-world widths, smallest supported phone through to a wide desktop.
DEVICES = [
    ("phone-320", 320, 640),      # iPhone SE 1 / small Android
    ("phone-390", 390, 844),      # iPhone 14
    ("phone-430", 430, 932),      # iPhone Pro Max
    ("tablet-768", 768, 1024),    # iPad portrait
    ("tablet-1024", 1024, 768),   # iPad landscape
    ("laptop-1280", 1280, 800),
    ("desktop-1440", 1440, 900),
    ("wide-1920", 1920, 1080),
]

# Firestore refuses reads until rules are deployed, and that is a setup state
# rather than a code defect. Everything else counts.
IGNORE = (
    "permission",
    "insufficient",
    "missing or insufficient",
    "err_blocked_by_client",
)


def ignorable(message: str) -> bool:
    low = message.lower()
    return any(token in low for token in IGNORE)


def check(page, device: str, label: str, path: str, selector: str,
          failures: list, errors: list, shot: str | None):
    errors.clear()

    resp = page.goto(BASE + path, wait_until="domcontentloaded", timeout=30000)
    status = resp.status if resp else 0

    rendered = True
    try:
        page.wait_for_selector(selector, timeout=15000, state="attached")
    except Exception:
        rendered = False
        failures.append(f"{device} {path}: '{selector}' never appeared")

    page.wait_for_timeout(600)

    text_len = page.evaluate("document.body.innerText.length")
    overflow = page.evaluate(
        "document.documentElement.scrollWidth - document.documentElement.clientWidth"
    )

    if shot:
        page.screenshot(path=shot, full_page=False)

    if status != 200:
        failures.append(f"{device} {path}: HTTP {status}")
    if text_len < 200:
        failures.append(f"{device} {path}: only {text_len} chars rendered")
    # A couple of pixels is sub-pixel rounding; anything more is a real bleed.
    if overflow > 2:
        failures.append(f"{device} {path}: overflows by {overflow}px")

    real = [e for e in errors if not ignorable(e)]
    if real:
        failures.append(f"{device} {path}: {real[0][:160]}")

    mark = "ok " if rendered and overflow <= 2 and not real else "FAIL"
    print(f"  {mark} {path:14} {status}  chars={text_len:<6} overflow={overflow}")


def main() -> int:
    failures: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for device, width, height in DEVICES:
            # Exercise dark mode on the two widths people actually use most.
            scheme = "dark" if device in ("phone-390", "desktop-1440") else "light"
            print(f"\n{device}  {width}x{height}  ({scheme})")

            ctx = browser.new_context(
                viewport={"width": width, "height": height},
                color_scheme=scheme,
                device_scale_factor=2 if width < 500 else 1,
                is_mobile=width < 500,
                has_touch=width < 900,
            )
            page = ctx.new_page()

            errors: list[str] = []
            page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
            page.on(
                "console",
                lambda m: errors.append(m.text) if m.type == "error" else None,
            )
            # A 404 on a script or stylesheet is what made an earlier run pass
            # against a completely broken page.
            page.on(
                "requestfailed",
                lambda r: errors.append(f"request failed: {r.url[-70:]}")
                if r.resource_type in ("script", "stylesheet", "document")
                else None,
            )

            for label, path, selector in PAGES:
                shot = (
                    os.path.join(SHOTS, f"{device}-{label}.png") if SHOTS else None
                )
                try:
                    check(page, device, label, path, selector,
                          failures, errors, shot)
                except Exception as ex:
                    print(f"  FAIL {path:14} EXCEPTION {ex}")
                    failures.append(f"{device} {path}: {ex}")

            ctx.close()

        browser.close()

    total = len(DEVICES) * len(PAGES)
    print("\n" + "=" * 68)
    if failures:
        print(f"FAILED — {len(failures)} problem(s) across {total} checks:")
        for f in failures:
            print("  -", f)
        return 1
    print(f"PASSED — {total} checks across {len(DEVICES)} viewports, 320px to 1920px.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
