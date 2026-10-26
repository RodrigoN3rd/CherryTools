from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 980})
    page.goto("http://127.0.0.1:3100", wait_until="networkidle")
    assert page.get_by_role("heading", name="Um lugar calmo para deixar sua criação florescer.").is_visible()
    assert page.locator(".tool-card").count() == 20
    page.screenshot(path="/tmp/cherry-home.png", full_page=True)
    page.goto("http://127.0.0.1:3100/tools/color-contrast-checker", wait_until="networkidle")
    assert page.get_by_role("heading", name="Contraste").is_visible()
    assert page.get_by_text("Próximo ajuste").is_visible()
    page.screenshot(path="/tmp/cherry-contrast.png", full_page=True)
    assert not [entry for entry in page.evaluate("window.__errors || []")]
    browser.close()
