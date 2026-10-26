from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors = []
    page = browser.new_page(viewport={"width": 1440, "height": 980})
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.goto("http://127.0.0.1:3100", wait_until="networkidle")
    assert page.get_by_role("heading", name="Um lugar calmo para deixar sua criação florescer.").is_visible()
    assert page.locator(".tool-card").count() == 35
    assert page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]').count() == 2
    assert page.locator(".google-symbol").count() > 0
    page.screenshot(path="/tmp/cherry-home.png", full_page=True)
    page.goto("http://127.0.0.1:3100/tools/color-contrast-checker", wait_until="networkidle")
    assert page.get_by_role("heading", name="Contraste").is_visible()
    assert page.get_by_text("Próximo ajuste").is_visible()
    page.screenshot(path="/tmp/cherry-contrast.png", full_page=True)
    page.goto("http://127.0.0.1:3100/tools/typography-scale-generator", wait_until="networkidle")
    assert page.get_by_role("heading", name="Escala tipográfica").is_visible()
    assert "--type-6" in page.locator(".code-block").inner_text()

    page.goto("http://127.0.0.1:3100/tools/google-font-explorer", wait_until="networkidle")
    assert page.get_by_role("heading", name="Google Fonts").is_visible()
    page.locator("#google-font-family").select_option("1")
    page.locator("#google-font-sample").fill("Uma família, muitas direções.")
    with page.expect_download() as google_font_download:
        page.get_by_role("button", name="Baixar PNG").click()
    assert google_font_download.value.suggested_filename == "cherry-google-font.png"

    page.goto("http://127.0.0.1:3100/tools/variable-font-axis-studio", wait_until="networkidle")
    page.locator("#variable-font-weight").press("ArrowRight")
    assert page.locator("canvas[aria-label='Prévia dos eixos de fonte variável']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/typographic-poster", wait_until="networkidle")
    page.locator("#poster-headline").fill("MAIS\nESPAÇO")
    assert page.locator("canvas[aria-label='Prévia de pôster tipográfico']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/text-outline-studio", wait_until="networkidle")
    page.locator("#outline-thickness").press("ArrowRight")
    assert page.locator("canvas[aria-label='Prévia de texto com contorno']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/monogram-generator", wait_until="networkidle")
    page.locator("#monogram-initials").fill("CT")
    assert page.locator("canvas[aria-label='Prévia de monograma']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/text-on-a-path", wait_until="networkidle")
    page.locator("#text-path-curve").press("ArrowRight")
    assert page.locator("canvas[aria-label='Prévia de texto em curva']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/quote-card-generator", wait_until="networkidle")
    page.locator("#quote-author").fill("Um ateliê local")
    assert page.locator("canvas[aria-label='Prévia de cartão de citação']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/kinetic-typography-loop", wait_until="networkidle")
    page.locator("#kinetic-type-motion").select_option("pulse")
    assert page.locator("canvas[aria-label='Prévia de tipografia cinética']").is_visible()
    with page.expect_download() as kinetic_png_download:
        page.get_by_role("button", name="Baixar PNG").click()
    assert kinetic_png_download.value.suggested_filename == "cherry-kinetic-type.png"
    assert page.get_by_role("button", name="Baixar WebM").is_enabled()
    with page.expect_download(timeout=15000) as kinetic_video_download:
        page.get_by_role("button", name="Baixar WebM").click()
    assert kinetic_video_download.value.suggested_filename == "cherry-kinetic-type.webm"

    page.goto("http://127.0.0.1:3100/tools/layout-grid-generator", wait_until="networkidle")
    page.locator("#layout-grid-columns").press("ArrowRight")
    assert page.locator("canvas[aria-label='Prévia de grid de layout']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/button-studio", wait_until="networkidle")
    page.locator("#button-label").fill("Ver coleção")
    assert page.locator("canvas[aria-label='Prévia de botão de interface']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/glass-surface-generator", wait_until="networkidle")
    page.locator("#glass-blur").press("ArrowRight")
    assert page.locator("canvas[aria-label='Prévia de superfície de vidro']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/mesh-gradient-generator", wait_until="networkidle")
    page.locator("#mesh-color-0").fill("#D77988")
    with page.expect_download() as mesh_download:
        page.get_by_role("button", name="Baixar PNG").click()
    assert mesh_download.value.suggested_filename == "cherry-mesh-gradient.png"

    page.goto("http://127.0.0.1:3100/tools/hero-composer", wait_until="networkidle")
    page.locator("#hero-headline").fill("A primeira dobra importa.")
    assert page.locator("canvas[aria-label='Prévia de hero section']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/device-mockup-generator", wait_until="networkidle")
    page.locator("#device-kind").select_option("browser")
    assert page.locator("canvas[aria-label='Prévia de mockup de dispositivo']").is_visible()

    page.goto("http://127.0.0.1:3100/tools/organic-background-loop", wait_until="networkidle")
    page.locator("#organic-speed").press("ArrowRight")
    assert page.locator("canvas[aria-label='Prévia de fundo orgânico animado']").is_visible()
    with page.expect_download() as organic_png_download:
        page.get_by_role("button", name="Baixar PNG").click()
    assert organic_png_download.value.suggested_filename == "cherry-organic-background.png"
    assert page.get_by_role("button", name="Baixar WebM").is_enabled()
    with page.expect_download(timeout=15000) as organic_video_download:
        page.get_by_role("button", name="Baixar WebM").click()
    assert organic_video_download.value.suggested_filename == "cherry-organic-background.webm"

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

    page.goto("http://127.0.0.1:3100/tools/design-inspiration-prompt-generator", wait_until="networkidle")
    page.locator("#prompt-niche").fill("capa de álbum")
    page.get_by_role("button", name="Outra direção").click()
    assert "capa de álbum" in page.locator(".code-block").inner_text()

    page.goto("http://127.0.0.1:3100/tools/moodboard-creator", wait_until="networkidle")
    page.locator("#moodboard-files").set_input_files("/tmp/cherry-home.png")
    assert page.locator(".mood-card").count() == 1
    with page.expect_download() as moodboard_download:
        page.get_by_role("button", name="Exportar PNG").click()
    assert moodboard_download.value.suggested_filename == "cherry-moodboard.png"

    page.goto("http://127.0.0.1:3100/tools/social-media-canvas-studio", wait_until="networkidle")
    page.locator("#social-format").select_option("story")
    assert "1080 × 1920" in page.locator(".social-spec").inner_text()
    with page.expect_download() as social_download:
        page.get_by_role("button", name="Exportar PNG").click()
    assert social_download.value.suggested_filename == "cherry-social-story.png"
    page.screenshot(path="/tmp/cherry-social.png", full_page=True)

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
