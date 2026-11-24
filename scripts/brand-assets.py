"""
Favicons, Apple-Icons und Open-Graph-Bilder für PaintFix, aus der Geometrie von
components/shared/BrandLogo.tsx, den Farben aus app/styles/tokens.css und den Schriften in app/fonts.

Aufruf aus dem Repo-Wurzelverzeichnis (braucht Pillow mit FreeType/Raqm):
    python3 scripts/brand-assets.py

Schreibt app/icon1.png, app/icon2.svg, app/apple-icon.png, die Aviation-Icons in app/(de)/aviation und
app/(en)/en/aviation, opengraph-image.jpg/.alt.txt je Bereich und je Seite einer Leistung
(SERVICE_PAGES unten). Texte der Share-Bilder unten anpassen, wenn sich Headline, Leistungstexte oder
Basisflughafen ändern (Werte aus content/ übernehmen: fahrzeug.json, leistungen.ts, aviation-pages.ts).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
FONTS = ROOT / "app/fonts"
MONA = str(FONTS / "mona-sans-latin-wdth-normal.woff2")
SERIF = str(FONTS / "instrument-serif-latin-400-normal.woff2")
SERIF_ITALIC = str(FONTS / "instrument-serif-latin-400-italic.woff2")
MONO = str(FONTS / "geist-mono-latin-wght-normal.woff2")

# Tokens (app/styles/tokens.css)
CAR_BG, CAR_INK, CAR_RED = "#ffffff", "#0c0d0f", "#c8322a"
CAR_ON_INK, CAR_ON_INK_MUTED = "#f2f2f0", "#b9bdc3"
AV_NAVY, AV_CREAM, AV_GOLD = "#0d1a2c", "#f4efe6", "#c8ae82"

CORNER = 0.53 / 1.3  # BrandLogo: Quadrat 1.3em, Eck 0.53em


def mona(size, wght=700, wdth=125):
    f = ImageFont.truetype(MONA, size)
    f.set_variation_by_axes([wdth, wght])
    return f


def serif(size, italic=False):
    return ImageFont.truetype(SERIF_ITALIC if italic else SERIF, size)


def mono(size, wght=400):
    f = ImageFont.truetype(MONO, size)
    f.set_variation_by_axes([wght])
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


def headline_car(d, lines, max_size, W, P):
    """Headline Fahrzeug wie auf der Website: Mona Sans 600, Breite 100, Laufweite -0.045em."""
    h, size = fit(lambda s: mona(s, 600, 100), lines, max_size, W - 2 * P)
    t = -0.045 * size
    step = round(0.9 * size)
    base = 471 - (len(lines) - 1) * step
    for i, line in enumerate(lines):
        tracked(d, (P - 4, base + i * step), line, h, CAR_ON_INK, t)


def og_car(out):
    W, H, P = 1200, 630, 88
    _bg["c"] = CAR_INK
    img = Image.new("RGB", (W, H), CAR_INK)
    d = ImageDraw.Draw(img)
    logo(d, P, P + 22, 30, CAR_ON_INK, CAR_RED, "Automotive")
    headline_car(d, ["Makellos", "bis ins Detail."], 128, W, P)
    sub = mona(27, 400, 100)
    d.text((P, H - P), "Smart Repair, Lackkorrektur, Leasingrückgabe und Aufbereitung in Telgte", font=sub, fill=CAR_ON_INK_MUTED, anchor="ls")
    img.save(out, quality=88, optimize=True, progressive=True)


def fit(make, lines, max_size, width):
    """Größte Schriftgröße bis max_size, bei der jede Zeile in width passt."""
    size = max_size
    while size > 24 and max(make(size).getlength(l) for l in lines) > width:
        size -= 2
    return make(size), size


def og_car_page(out, lines, sub_text):
    """Share-Bild einer Leistungsseite Fahrzeug: wie og_car, Headline = H1 der Seite."""
    W, H, P = 1200, 630, 88
    _bg["c"] = CAR_INK
    img = Image.new("RGB", (W, H), CAR_INK)
    d = ImageDraw.Draw(img)
    logo(d, P, P + 22, 30, CAR_ON_INK, CAR_RED, "Automotive")
    headline_car(d, lines, 120, W, P)
    sub, _ = fit(lambda s: mona(s, 400, 100), [sub_text], 27, W - 2 * P)
    d.text((P, H - P), sub_text, font=sub, fill=CAR_ON_INK_MUTED, anchor="ls")
    img.save(out, quality=88, optimize=True, progressive=True)


def og_av(out, label, l1, l2, max_size=104):
    W, H, P = 1200, 630, 88
    _bg["c"] = AV_NAVY
    img = Image.new("RGB", (W, H), AV_NAVY)
    d = ImageDraw.Draw(img)
    logo(d, P, P + 22, 30, AV_CREAM, AV_GOLD, "Aviation")
    # Etikett in Geist Mono, Headline in Instrument Serif, zweite Zeile kursiv (wie im Aviation-Hero).
    tracked(d, (P, 318), label.upper(), mono(17), AV_GOLD, 0.08 * 17)
    h, size = fit(serif, [l1, l2], max_size, W - 2 * P)
    hi = serif(size, italic=True)
    d.text((P - 3, 318 + 112), l1, font=h, fill=AV_CREAM, anchor="ls")
    d.text((P - 3, 318 + 112 + round(0.95 * size)), l2, font=hi, fill=AV_CREAM, anchor="ls")
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

# Seiten je Leistung (Auftrag 04.11.2026): Ordner, Headline (H1 der Seite), Unterzeile bzw. Overline.
# Texte aus content/leistungen.ts (h1), fahrzeug.json (focus.short) und aviation-pages.ts (h1).
leistungen = car / "leistungen"
CAR_PAGES = [
    ("smart-repair", ["Smart Repair", "in Telgte."], "Kratzer, Steinschläge und Parkschäden punktuell beheben, ohne Komplettlackierung."),
    ("lackkorrektur", ["Lackkorrektur", "in Telgte."], "Waschkratzer, Hologramme und matter Lack, maschinell auspoliert."),
    ("leasingrueckgabe", ["Gut vorbereitet zur", "Leasingrückgabe."], "Schäden beheben, bevor sie bei der Rückgabe berechnet werden."),
    ("fahrzeugaufbereitung", ["Fahrzeugaufbereitung", "in Telgte."], "Außen, innen und Keramikversiegelung, mit Produkten von CarPro."),
]
for slug, lines, sub_text in CAR_PAGES:
    og_car_page(leistungen / slug / "opengraph-image.jpg", lines, sub_text)
    (leistungen / slug / "opengraph-image.alt.txt").write_text(f"PaintFix Automotive: {' '.join(lines)} {sub_text}")

AV_PAGES = [
    (av_de / "aussenpflege", "Leistungsbereich 01 · Außen", "Außenpflege für", "Business Jets."),
    (av_de / "kabinenpflege", "Leistungsbereich 02 · Kabine", "Kabinenpflege für", "Business Jets."),
    (av_de / "oberflaechenschutz", "Leistungsbereich 03 · Schutz", "Oberflächenschutz", "für Business Jets."),
    (av_en / "exterior-care", "Service area 01 · Exterior", "Exterior care for", "business jets."),
    (av_en / "cabin-care", "Service area 02 · Cabin", "Cabin care for", "business jets."),
    (av_en / "surface-protection", "Service area 03 · Protection", "Surface protection", "for business jets."),
]
for folder, label, l1, l2 in AV_PAGES:
    og_av(folder / "opengraph-image.jpg", label, l1, l2)
    (folder / "opengraph-image.alt.txt").write_text(f"PaintFix Aviation, {label}: {l1} {l2}")
print("ok")
