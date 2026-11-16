"""
Favicons, Apple-Icons und Open-Graph-Bilder für PaintFix, aus der Geometrie von
components/shared/BrandLogo.tsx, den Farben aus app/styles/tokens.css und den Schriften in app/fonts.

Aufruf aus dem Repo-Wurzelverzeichnis (braucht Pillow mit FreeType/Raqm):
    python3 scripts/brand-assets.py

Schreibt app/icon1.png, app/icon2.svg, app/apple-icon.png, die Aviation-Icons in app/(de)/aviation und
app/(en)/en/aviation sowie opengraph-image.jpg/.alt.txt je Bereich. Texte der Share-Bilder unten
anpassen, wenn sich Headline oder Basisflughafen ändern (Werte aus content/ übernehmen).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
FONTS = ROOT / "app/fonts"
MONA = str(FONTS / "mona-sans-latin-wdth-normal.woff2")
CINZEL = str(FONTS / "cinzel-latin-wght-normal.woff2")

# Tokens (app/styles/tokens.css)
CAR_BG, CAR_INK, CAR_RED = "#ffffff", "#0c0d0f", "#c8322a"
CAR_ON_INK, CAR_ON_INK_MUTED = "#f2f2f0", "#b9bdc3"
AV_NAVY, AV_CREAM, AV_GOLD = "#0d1a2c", "#f4efe6", "#c8ae82"

CORNER = 0.53 / 1.3  # BrandLogo: Quadrat 1.3em, Eck 0.53em


def mona(size, wght=700, wdth=125):
    f = ImageFont.truetype(MONA, size)
    f.set_variation_by_axes([wdth, wght])
    return f


def cinzel(size):
    f = ImageFont.truetype(CINZEL, size)
    f.set_variation_by_axes([400])
    return f


def tracked(draw, xy, text, font, fill, tracking):
    """Text mit Laufweite (tracking in px), Kerning über getlength der Präfixe."""
    x, y = xy
    for i, ch in enumerate(text):
        draw.text((x + font.getlength(text[:i]) + i * tracking, y), ch, font=font, fill=fill, anchor="ls")
    return font.getlength(text) + (len(text) - 1) * tracking


def mark(draw, x, y, s, square, accent):
    draw.rectangle([x, y, x + s - 1, y + s - 1], fill=square)
    c = round(s * CORNER)
    draw.rectangle([x + s - c, y + s - c, x + s - 1, y + s - 1], fill=accent)


def mark_svg(square_light, square_dark, accent):
    c = round(100 * CORNER, 2)
    o = round(100 - c, 2)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <style>.q{{fill:{square_light}}}@media (prefers-color-scheme:dark){{.q{{fill:{square_dark}}}}}</style>
  <rect class="q" width="100" height="100"/>
  <rect x="{o}" y="{o}" width="{c}" height="{c}" fill="{accent}"/>
</svg>
"""


def apple_icon(bg, square, accent, out):
    # 180 px, kein Alpha; iOS rundet die Ecken selbst. Zeichen mit Rand wie im Logo.
    img = Image.new("RGB", (180, 180), bg)
    d = ImageDraw.Draw(img)
    s = 104
    mark(d, (180 - s) // 2, (180 - s) // 2, s, square, accent)
    img.save(out, optimize=True)


def icon_png(square, accent, out):
    # 96 px (Google: Vielfaches von 48), für Browser ohne SVG-Favicons (Safari).
    img = Image.new("RGB", (96, 96), square)
    mark(ImageDraw.Draw(img), 0, 0, 96, square, accent)
    img.save(out, optimize=True)


_bg = {}


def blend(color, alpha):
    bg = _bg["c"]
    a = tuple(int(color[i : i + 2], 16) for i in (1, 3, 5))
    b = tuple(int(bg[i : i + 2], 16) for i in (1, 3, 5))
    return tuple(round(b[i] + (a[i] - b[i]) * alpha) for i in range(3))


def logo(draw, x, base, size, color, accent, division):
    """BrandLogo nebeneinander: Quadrat, PAINTFIX, Trennlinie, Bereich. base = Grundlinie Wortmarke."""
    word = mona(size, 700, 125)
    s = round(1.3 * size)
    cap = size * 0.72
    top = base - cap / 2 - s / 2
    mark(draw, x, round(top), s, color, accent)
    x += s + 0.7 * size
    w = tracked(draw, (x, base), "PAINTFIX", word, color, 0.07 * size)
    x += w + 0.7 * size
    line_h = 0.95 * size
    draw.rectangle([x, base - cap / 2 - line_h / 2, x, base - cap / 2 + line_h / 2], fill=blend(color, 0.35))
    x += 1 + 0.7 * size
    tracked(draw, (x, base - 0.5 * (cap - 0.59 * cap)), division.upper(), mona(round(0.59 * size), 500, 100), color, 0.3 * 0.59 * size)


def og_car(out):
    W, H, P = 1200, 630, 88
    _bg["c"] = CAR_INK
    img = Image.new("RGB", (W, H), CAR_INK)
    d = ImageDraw.Draw(img)
    logo(d, P, P + 22, 30, CAR_ON_INK, CAR_RED, "Automotive")
    h = mona(112, 700, 125)
    t = -0.02 * 112
    tracked(d, (P - 4, 368), "Makellos", h, CAR_ON_INK, t)
    tracked(d, (P - 4, 368 + 103), "bis ins Detail.", h, CAR_ON_INK, t)
    sub = mona(27, 400, 100)
    d.text((P, H - P), "Smart Repair, Lackkorrektur, Leasingrückgabe und Aufbereitung in Telgte", font=sub, fill=CAR_ON_INK_MUTED, anchor="ls")
    img.save(out, quality=88, optimize=True, progressive=True)


def og_av(out, label, l1, l2):
    W, H, P = 1200, 630, 88
    _bg["c"] = AV_NAVY
    img = Image.new("RGB", (W, H), AV_NAVY)
    d = ImageDraw.Draw(img)
    logo(d, P, P + 22, 30, AV_CREAM, AV_GOLD, "Aviation")
    tracked(d, (P, 330), label.upper(), mona(17, 500, 100), AV_GOLD, 0.26 * 17)
    h = cinzel(84)
    d.text((P - 3, 330 + 108), l1, font=h, fill=AV_CREAM, anchor="ls")
    d.text((P - 3, 330 + 108 + 92), l2, font=h, fill=AV_CREAM, anchor="ls")
    img.save(out, quality=88, optimize=True, progressive=True)


app = ROOT / "app"
car = app / "(de)/(fahrzeug)"
av_de = app / "(de)/aviation"
av_en = app / "(en)/en/aviation"

icon_png(CAR_INK, CAR_RED, app / "icon1.png")
(app / "icon2.svg").write_text(mark_svg(CAR_INK, CAR_ON_INK, CAR_RED))
apple_icon(CAR_BG, CAR_INK, CAR_RED, app / "apple-icon.png")
for seg in (av_de, av_en):
    icon_png(AV_NAVY, AV_GOLD, seg / "icon1.png")
    (seg / "icon2.svg").write_text(mark_svg(AV_NAVY, AV_CREAM, AV_GOLD))
    apple_icon(AV_CREAM, AV_NAVY, AV_GOLD, seg / "apple-icon.png")

og_car(car / "opengraph-image.jpg")
(car / "opengraph-image.alt.txt").write_text("PaintFix Automotive: Makellos bis ins Detail. Smart Repair, Lackkorrektur, Leasingrückgabe und Aufbereitung in Telgte.")
og_av(av_de / "opengraph-image.jpg", "PaintFix Aviation in Münster/Osnabrück", "Jede Oberfläche,", "dokumentiert.")
(av_de / "opengraph-image.alt.txt").write_text("PaintFix Aviation in Münster/Osnabrück: Jede Oberfläche, dokumentiert.")
og_av(av_en / "opengraph-image.jpg", "PaintFix Aviation at Münster Osnabrück", "Every surface,", "accounted for.")
(av_en / "opengraph-image.alt.txt").write_text("PaintFix Aviation at Münster Osnabrück: Every surface, accounted for.")
print("ok")
