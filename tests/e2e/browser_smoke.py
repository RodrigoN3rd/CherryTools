from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors = []
    page = browser.new_page(viewport={"width": 1440, "height": 980})
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.goto("http://127.0.0.1:3100", wait_until="networkidle")
    assert page.get_by_role("heading", name="Um lugar calmo para deixar sua criação florescer.").is_visible()
    assert page.locator(".tool-card").count() == 20
    page.screenshot(path="/tmp/cherry-home.png", full_page=True)
    page.goto("http://127.0.0.1:3100/tools/color-contrast-checker", wait_until="networkidle")
    assert page.get_by_role("heading", name="Contraste").is_visible()
    assert page.get_by_text("Próximo ajuste").is_visible()
    page.screenshot(path="/tmp/cherry-contrast.png", full_page=True)
    page.goto("http://127.0.0.1:3100/tools/typography-scale-generator", wait_until="networkidle")
    assert page.get_by_role("heading", name="Escala tipográfica").is_visible()
    assert "--type-6" in page.locator(".code-block").inner_text()

    page.goto("http://127.0.0.1:3100/tools/text-shadow-generator", wait_until="networkidle")
    page.locator("#text-shadow-blur").press("ArrowRight")
    assert "text-shadow:" in page.locator(".code-block").inner_text()

    page.goto("http://127.0.0.1:3100/tools/css-box-shadow-generator", wait_until="networkidle")
    page.get_by_role("button", name="Nova camada").click()
    assert page.locator("fieldset.shadow-layer").count() == 2

    page.goto("http://127.0.0.1:3100/tools/svg-shape-generator", wait_until="networkidle")
    page.locator("#svg-kind").select_option("polygon")
    assert page.locator("#svg-sides").is_visible()
    assert "<polygon" in page.locator(".code-block").inner_text()

    page.goto("http://127.0.0.1:3100/tools/css-pattern-generator", wait_until="networkidle")
    page.locator("#pattern-kind").select_option("lines")
    assert "repeating-linear-gradient" in page.locator(".code-block").inner_text()
    page.screenshot(path="/tmp/cherry-pattern.png", full_page=True)

    mobile = browser.new_page(viewport={"width": 375, "height": 812})
    mobile.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    mobile.goto("http://127.0.0.1:3100/tools/border-radius-generator", wait_until="networkidle")
    assert mobile.get_by_role("heading", name="Bordas orgânicas").is_visible()
    assert mobile.get_by_role("button", name="Forma orgânica").is_visible()
    assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    mobile.screenshot(path="/tmp/cherry-radius-mobile.png", full_page=True)
    assert not errors
    mobile.close()
    browser.close()
