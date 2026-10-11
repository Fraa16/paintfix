# Handoff: Paintfix Website (Fahrzeugaufbereitung + Paintfix Aviation)

Stand: 9. Oktober 2026 · Referenz: `reference/Paintfix Website v4.dc.html`

---

## 1. Überblick

Paintfix bereitet in Telgte bei Münster Autos auf und betreut unter „Paintfix Aviation“ zusätzlich Business Jets. Die Website zeigt beides unter einem Dach, mit zwei klar getrennten Auftritten (Prinzip Mercedes-Benz und Maybach).

- **Paintfix (Fahrzeug):** hell, direkt, Preise ab dem ersten Bildschirm. Privatkunden sollen nicht befürchten, dass eine einfache Aufbereitung teuer ist, nur weil Paintfix auch Flugzeuge betreut.
- **Paintfix Aviation:** dunkel, ruhig, prozess- und nachweisorientiert, zweisprachig (DE/EN). Management-Gesellschaften sollen nicht an der Professionalität zweifeln, nur weil Paintfix auch Autos aufbereitet.

Vier Ansichten: Startseite, Leistungen & Preise, Termin anfragen, Paintfix Aviation (eine lange Seite).

## 2. Über die Design-Dateien

Die Dateien in `reference/` sind **Design-Referenzen in HTML**: Prototypen, die Aussehen und Verhalten zeigen. Sie sind kein Produktionscode zum Kopieren. Aufgabe ist, das Design in einer neuen Next.js-Codebasis (Abschnitt 4) mit deren üblichen Mustern nachzubauen.

- Die Referenz ist eine „Design Component“ (`.dc.html`) mit Inline-Styles und einer kleinen Laufzeit (`support.js`). Diese Struktur nicht übernehmen, sondern in Komponenten und Tokens übersetzen.
- Öffnen nur über einen lokalen Server (ES-Module): `npx serve reference`, dann `http://localhost:3000/Paintfix%20Website%20v4.dc.html`.
- Direktaufrufe: `?page=home`, `?page=auto`, `?page=req`, `?page=av`, `?page=av&anchor=av-contact`, `?page=av&type=Challenger%20350&svc=ec`.
- Alle exakten Werte (Abstände, Größen, Farben) stehen im Quelltext der Referenz. Bei Abweichungen zwischen dieser README und der Referenz gilt die Referenz.
- `Paintfix Mobile Mockups.dc.html` zeigt vier Ansichten bei 402 px Breite.

## 3. Fidelity

**High-Fidelity.** Farben, Typografie, Abstände, Layouts, Interaktionen und Animationen sind final und sollen pixelgenau umgesetzt werden.

**Platzhalter, vor dem Launch mit Paintfix zu klären:**
- Alle Fotos (Pexels-Stockfotos, Abschnitt 12). Der Vorher/Nachher-Regler nutzt ein Foto mit Filter und braucht ein echtes Fotopaar.
- Preise, Dauern, Kombipreise, Zusatzleistungen, Öffnungszeiten (Mo–Fr 8–18, Sa 9–14).
- Telefon `02504 000 00 00` / `+49 2504 000 00 00`, E-Mail `hallo@paintfix.de` / `ops@paintfix-aviation.de`, Inhabername im Footer („Inh. Arian Hassanzadeh“).
- Aviation: Nachweise und Normen, Musterbericht (Nr. PA-26-0412, Kennzeichen D-BPFX, Unterschrift „M. Becker“), Flughäfen und Status, Flottenliste, Vertragsmodelle, Dokumentenliste, Richtwerte der Zeitschätzung.
- Impressum, Datenschutz, AGB (Inhalte fehlen).

## 4. Empfohlener Stack (GitHub + Vercel)

| Bereich | Empfehlung |
|---|---|
| Framework | Next.js (App Router) + TypeScript, Repo auf GitHub, Hosting auf Vercel mit Preview-Deployment je Pull Request |
| Styling | Tailwind CSS v4 mit `tokens/tokens.css` (oder CSS Modules), Tokens immer als CSS-Variablen |
| Schriften | `next/font/google`: Mona Sans (variabel, `axes: ['wdth']`, wght 200–900, wdth 75–125) und Cinzel (wght 400–900), Subsets `latin`, `latin-ext`. next/font hostet selbst, es gehen keine Anfragen an Google (DSGVO). Fehlt Mona Sans in der Next-Version: `next/font/local` mit der variablen WOFF2 aus github.com/github/mona-sans |
| Animation | GSAP + ScrollTrigger für gepinnte Abschnitte und Scroll-Fortschritt, Lenis für weiches Scrollen auf Aviation. Einfache Reveals mit IntersectionObserver + CSS |
| Formulare | Server Actions oder Route Handlers, Validierung mit Zod, Versand mit Resend (Mail an Paintfix + Bestätigung an Absender), Spam-Schutz mit Honeypot + Cloudflare Turnstile oder Vercel BotID |
| Lieferantenunterlagen | PDF privat in Vercel Blob, Download-Link nach E-Mail-Eingabe, Lead per Mail (optional CRM) |
| Inhalte | zunächst typisierte Dateien aus `content/`, später optional Headless-CMS |
| Sprachen | Fahrzeug nur Deutsch. Aviation `/aviation` (DE) und `/en/aviation` (EN) mit hreflang |
| Analyse | Vercel Web Analytics (ohne Cookies), kein Tracking ohne Einwilligung |
| Bilder | `next/image`, AVIF/WebP, Hero-Bilder mit `priority` |

Umgebungsvariablen (Vorschlag): `RESEND_API_KEY`, `MAIL_TO_CAR`, `MAIL_TO_AVIATION`, `BLOB_READ_WRITE_TOKEN`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.

## 5. Routen

| Route | Prototyp | Inhalt |
|---|---|---|
| `/` | `page=home` | Startseite Fahrzeug |
| `/leistungen` | `page=auto` | Leistungen & Preise, Anker `#preise`, `#svc-aussen`, `#svc-innen`, `#svc-politur`, `#svc-keramik` |
| `/anfrage` | `page=req` | Termin anfragen, Vorbelegung per Query, z. B. `?leistungen=aussen,innen&klasse=1` |
| `/aviation` | `page=av` | Paintfix Aviation DE, Anker `#av-services`, `#av-process`, `#av-standards`, `#av-fleet`, `#av-terms`, `#av-contact` |
| `/en/aviation` | `page=av` + EN | Paintfix Aviation EN |
| `/impressum`, `/datenschutz`, `/agb` | – | Pflichtseiten |

Route Groups `app/(fahrzeug)/…` und `app/aviation/…` bekommen je ein eigenes Layout (Header, Footer, Grundfarbe, Textgewicht). Später möglich: eigene Domain für Aviation (z. B. paintfix-aviation.de) über Vercel-Domain + Middleware-Rewrite auf `/aviation`.

## 6. Markensystem: ein Haus, zwei Auftritte

| | Paintfix | Paintfix Aviation |
|---|---|---|
| Wirkung | zugänglich, klar, handwerklich | ruhig, diskret, präzise |
| Grundfarben | Weiß, Schwarz, Signalrot | Navy, Creme, Gold |
| Überschriften | Mona Sans 700, Breite 125 % | Cinzel 400 |
| Text | Mona Sans 400, Breite 100 % | Mona Sans 350 |
| Preise | sichtbar: „ab 89 €“, „inkl. MwSt.“ | keine, „Konditionen auf Anfrage“ |
| CTA | „Termin anfragen →“ | „Angebot anfordern“ in Versalien |
| Bilder | Alltagsautos, Details, Halle | Vorfeld, Kabine, blaue Stunde |
| Bewegung | knapp, direkt | langsam, mit Gewicht, weiches Scrollen |
| Sprache | Sie-Form, kurze Sätze | DE + EN, Begriffe der Branche |

Gemeinsam: Mona Sans als Textschrift, eckige Formen, Haarlinien zur Gliederung, viel Weißraum.

**Verbindungen zwischen den Marken (bewusst dezent):**
1. Fahrzeug-Header: Navigationspunkt „Paintfix Aviation ↗“.
2. Startseite: navyfarbenes Band nach dem Ablauf (8.1, Punkt 6).
3. Anfrage-Seite: „Anfrage für ein Flugzeug? Zu Paintfix Aviation ↗“.
4. Fahrzeug-Footer: „Paintfix Aviation ↗“.
5. Aviation-Footer: „Paintfix Aviation ist der Geschäftsbereich Luftfahrt der Paintfix, Telgte.“ + „Fahrzeugaufbereitung ↗“.
6. Beim Wechsel zwischen den Marken läuft eine ganzflächige Blende (9.4).

Regel: Cinzel und Aviation-Farben erscheinen auf Fahrzeugseiten nur in diesen Verbindungselementen. Signalrot erscheint nie auf Aviation-Seiten.

## 7. Design-Tokens

Alle Werte auch in `tokens/tokens.css`.

### 7.1 Farben Fahrzeug

| Token | Wert | Verwendung |
|---|---|---|
| `--car-bg` | `#FFFFFF` | Grundfläche |
| `--car-surface` | `#F5F5F3` | Abschnittsfläche (Ablauf, Seitenkopf), Hover sekundärer Button |
| `--car-ink` | `#0C0D0F` | Text, Primärbutton, starke Linien, dunkle Flächen (CTA, Footer, Kombi-Band, Auswahl) |
| `--car-ink-hover` | `#2A2D31` | Hover Primärbutton |
| `--car-text` | `#4A4E55` | Fließtext |
| `--car-muted` | `#5E636B` | Labels, Metadaten, Overlines |
| `--car-red` | `#C8322A` | Logo-Quadrat, Overline-Quadrat, Hover von Links, letzter Ablaufschritt |
| `--car-line` | `#E1E1DE` | Zeilentrenner, Kartenrahmen |
| `--car-line-ui` | `#E6E6E3` | Header- und Abschnittslinien |
| `--car-line-soft` | `#EEEEEB` | Trenner in Karten und Menü |
| `--car-border` | `#D6D6D2` | Inputs, Segment-Steuerung, Tabellenlinien |
| `--car-track` | `#DCDCD8` | Fortschrittslinie (Hintergrund) |
| `--car-image-bg` | `#EDEDEA` | Bildfläche beim Laden |
| `--car-on-ink` | `#F2F2F0` | Text auf Schwarz |
| `--car-on-ink-muted` | `#B9BDC3` | sekundärer Text auf Schwarz |
| `--car-on-ink-soft` | `#D3D6DA` | Links und Tertiärtext auf Schwarz |
| `--car-ink-line` | `#26292D` | Linien auf Schwarz |
| `--car-open` / `--car-closed` | `#2F8F5B` / `#A2A6AD` | Live-Status-Punkt |
| `--car-input-placeholder` | `#8A8F96` | Placeholder |
| `--car-ba-bg` | `#1A1C1F` | Vorher/Nachher-Fläche |
| Header | `rgba(255,255,255,.94)` + `backdrop-filter: saturate(1.6) blur(16px)` | |

### 7.2 Farben Aviation

| Token | Wert | Verwendung |
|---|---|---|
| `--av-navy` | `#0D1A2C` | dunkle Flächen, Text auf hell |
| `--av-navy-deep` | `#0A1424` | Bildflächen, Formular-Panel der Unterlagen |
| `--av-navy-hover` | `#122440` | Hover Aviation-Band |
| `--av-cream` | `#F4EFE6` | helle Grundfläche, Text auf Navy, Primärbutton |
| `--av-sand` | `#EDE6D9` | zweite helle Fläche (Leistungen, Flotte, Richtwerte) |
| `--av-paper` | `#FBF8F2` | Arbeitsbericht, mobile Karten |
| `--av-gold` | `#C8AE82` | Akzent auf Navy: Overlines, Linien, Ziffern |
| `--av-gold-line` | `#9C7F52` | Goldlinie auf hell |
| `--av-gold-text` | `#7A6340` | Goldtext auf hell, Hover Textlinks |
| `--av-stamp` | `#8A6E43` | Stempel |
| `--av-muted` | `#4C5666` | sekundärer Text auf hell |
| `--av-on-navy` | `#D2CABB` | Fließtext auf Navy |
| `--av-on-navy-hero` | `#E2DBCD` | Hero-Untertitel |
| `--av-on-navy-muted` | `#B8B2A6` | Labels auf Navy |
| `--av-error` | `#E0907F` | Fehler auf Navy |
| Linien hell | `rgba(13,26,44,.14)` · `.18` (stärker) · `.3` (Inputs) | |
| Linien auf Navy | `rgba(244,239,230,.14)` · Gold `rgba(200,174,130,.4)` | |
| Header nach Hero | `rgba(244,239,230,.92)` + `blur(14px)` | |

### 7.3 Schriften

- **Mona Sans** (variabel, Breite 75–125 %, Gewicht 200–900): Text beider Marken und Überschriften Fahrzeug.
- **Cinzel** (variabel, 400–900, nur 400 verwendet): Überschriften, Wortmarke, Ziffern, ICAO-Codes Aviation. Cinzel hat nur Versalien und Kapitälchen und keine Kursive. Akzentzeilen stehen deshalb aufrecht. `font-style: italic` nie auf Cinzel anwenden.
- Basis Fahrzeug: Mona Sans 400. Basis Aviation: Mona Sans 350.
- Formularelemente erben die Schrift (`font: inherit; color: inherit`).

### 7.4 Typo-Skala Fahrzeug

Display = Mona Sans 700, `font-stretch: 125%`.

| Rolle | Größe | Zeilenhöhe | Laufweite |
|---|---|---|---|
| Hero H1 (Container Query) | `clamp(40px, 13.4cqi, 112px)` | 0.92 | -0.02em |
| Seiten-H1 | `clamp(44px, 5.4vw, 88px)` | 0.94 | -0.0175em |
| H2 | `clamp(30.96px, 3.784vw, 55.04px)` | 1.02 | -0.015em |
| CTA-H2 | `clamp(32.68px, 4.3vw, 65.36px)` | 1.0 | -0.0175em |
| Leistungsliste Startseite | `clamp(22.36px, 3.268vw, 51.6px)` | 1 | -0.0175em |
| H2 Leistungsseite | `clamp(22.36px, 2.924vw, 43px)` | 1.02 | -0.015em |
| H2 Danke | `clamp(29.24px, 3.44vw, 48.16px)` | 1.02 | -0.015em |
| Formularschritt | 20.6px | | |
| Titel klein (Karten, Schritte) | 20px, 600, Breite 108 % | | -0.01em |
| FAQ-Frage | 19px, 600, Breite 106 % | | |
| Preis groß | `clamp(40px, 3.6vw, 56px)`, 500, tabellarische Ziffern | 1 | -0.035em |
| Preis Liste | 30px, 500 | | -0.02em |
| Ablaufnummer | 64px, 300 | 1 | -0.04em |
| Fließtext groß | 17–18px | 1.6 | |
| Fließtext | 15–16px | 1.6 | |
| Klein | 13px | | |
| Overline | 12px, 500, Versalien | | 0.18em |
| Navigation | 14px, 500 | | |
| Button | 14px, 600 (Submit 15px) | | |
| Logo | 17px, 700, Breite 125 % | | 0.07em |

Hero H1: Die Textspalte bekommt `container-type: inline-size`, damit „bis ins Detail.“ bei jeder Breite in eine Zeile passt.

### 7.5 Typo-Skala Aviation

Display = Cinzel 400.

| Rolle | Größe | Zeilenhöhe | Laufweite |
|---|---|---|---|
| Hero H1 | `clamp(41.6px, 5.92vw, 99.2px)` | 1 | 0.02em |
| Expand-Text | `clamp(32px, 4.32vw, 73.6px)` | 1.04 | 0.02em |
| H2 Leistungen | `clamp(38.4px, 4.32vw, 73.6px)` | 1 | 0.015em |
| H2 Standard | `clamp(32px, 3.84vw, 60.8px)` | 1.04 | 0.02em |
| H2 Flotte | `clamp(32px, 3.52vw, 54.4px)` | 1.04 | 0.02em |
| H2 Formular | `clamp(35.2px, 4.48vw, 73.6px)` | 1 | 0.015em |
| H3 Unterlagen | `clamp(25.6px, 2.72vw, 41.6px)` | 1.08 | |
| Kategorie-Titel | `clamp(24px, 2.24vw, 35.2px)` | 1 | |
| Eintrag-Titel | `clamp(16.8px, 1.44vw, 21.6px)` bzw. 19.2px / 20.8px | 1.2 | |
| Ablaufziffer | 44.8px, Gold | 1 | |
| Wortmarke Footer | `clamp(38.4px, 6.4vw, 108.8px)` | 0.9 | 0.095em |
| Logo Header | 14.4px | | 0.375em |

Mona Sans auf Aviation:

| Rolle | Größe | Laufweite |
|---|---|---|
| Overline | 11px, Versalien | 0.34em |
| Button | 11px, Versalien | 0.24em |
| Navigation | 11px, Versalien | 0.22em |
| Feldlabel | 10px, Versalien | 0.26em |
| Fließtext | 15–17px, Zeilenhöhe 1.7 | |

Weitere Größen stehen in der Referenz.

### 7.6 Abstände und Raster

| | Fahrzeug | Aviation |
|---|---|---|
| Container | max. 1360px | max. 1440px |
| Seitenrand | `clamp(20px, 4vw, 56px)` | `clamp(20px, 4vw, 64px)` |
| Abschnitt oben/unten | `clamp(88px, 11vw, 160px)` | `clamp(96px, 12vw, 176px)` |
| Header | 76px, sticky | 84px, fixed |
| Scroll-Offset für Anker | 76px | 84px |
| Kopf bis Inhalt | `clamp(48px, 6vw, 80px)` | `clamp(64px, 8vw, 112px)` |
| Spaltenabstand | 24–64px | `clamp(40px, 6vw, 120px)` |

Raster durchgehend als `repeat(auto-fit, minmax(min(100%, Xpx), 1fr))` mit X = 230 (Preisleiste), 240 (Ablauf, Felder), 250 (Leistungskarten), 300 (Zielgruppen), 420–480 (Zweispalter). Abstände in Komponenten: 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48px.

### 7.7 Formen, Linien, Schatten

- `border-radius: 0` überall. Ausnahmen mit 50 %: Status-Punkt, Regler-Griff, Stempel, Kartenpunkte.
- Linien: 1px Standard, 1.5px Textlink-Unterstreichung und Auswahlkarten, 2px Preisleiste, Leistungsliste oben und Fortschrittslinie Fahrzeug.
- Schatten: Hover-Bild `0 40px 80px -40px rgba(12,13,15,.5)`, Regler-Griff `0 12px 32px rgba(0,0,0,.28)`, Arbeitsbericht `0 50px 100px -60px rgba(13,26,44,.5)`, Dokument-Cover `0 30px 60px -28px rgba(0,0,0,.7)`.

### 7.8 Bewegung und Breakpoints

| Kurve | Wert | Einsatz |
|---|---|---|
| `--ease-out` | `cubic-bezier(.2,.7,.2,1)` | Reveals, Listen-Versatz, Hero-Zoom |
| `--ease-mask` | `cubic-bezier(.19,1,.22,1)` | Zeilen-Reveal |
| `--ease-clip` | `cubic-bezier(.77,0,.18,1)` | Bild-Reveal |
| `--ease-curtain` | `cubic-bezier(.76,0,.24,1)` | Markenwechsel |
| `--ease-stamp` | `cubic-bezier(.2,1.6,.4,1)` | Stempel |
| easeInOutCubic | `t<.5 ? 4t³ : 1-(-2t+2)³/2` | scrollgebundene Abläufe |

Breakpoints: **980px** (Hauptumbruch: Desktop-Navigation, Hover-Effekte, Horizontal-Scroll, Mobilleisten), **1200px** (Abschnittsanzeige Aviation), **1240px** (Navigationspunkte Aviation).

Tailwind v4: Tokens in `@theme` spiegeln, z. B. `--color-car-ink: var(--car-ink); --color-av-navy: var(--av-navy); --font-sans: var(--font-mona);`.

## 8. Seiten und Abschnitte

Texte sind wörtlich zu übernehmen. Platzhalter in `{}` kommen aus `content/`.

### 8.0 Gemeinsame Bausteine

- **Logo Fahrzeug:** 22×22px Quadrat `--car-ink`, darin unten rechts 9×9px `--car-red`, daneben „PAINTFIX“ (17px, 700, 125 %, 0.07em), Abstand 12px. Auf Schwarz ist das Quadrat `#F2F2F0`. Im Curtain 30/12px und 24px.
- **Logo Aviation:** „PAINTFIX“ in Cinzel (14.4px, 0.375em), 1×18px Trennlinie (currentColor, 40 %), „AVIATION“ in Mona Sans (10px, 0.38em), Abstand 14px.
- **Overline Fahrzeug:** 7×7px rotes Quadrat + Text 12px, 500, 0.18em, Versalien, `--car-muted`, Abstand 12px.
- **Overline Aviation:** 40×1px Linie (`--av-gold-line` auf hell, `--av-gold` auf Navy) + Text 11px, 0.34em, Versalien (`--av-muted` bzw. `--av-gold`), Abstand 16px.
- **Buttons Fahrzeug:** Primär 56px hoch, Innenabstand 0 28px, `--car-ink`, weiß, 14px 600, Pfeil mit 14px Abstand, Hover `--car-ink-hover`. Sekundär 56px, 1px Rahmen `--car-ink`, transparent, Hover `--car-surface`. Header 44px, 0 20px. Submit 60px, volle Breite, 15px. Textlink 14px 600 mit 1.5px Unterstreichung (4px Abstand), Hover Text und Linie rot.
- **Buttons Aviation:** Primär 56px, 0 30px, `--av-cream` auf Navy (Text Navy), 11px, 0.24em, Versalien, Hover `#FFFFFF`. Sekundär 1px `rgba(244,239,230,.45)`, Hover Rahmen Creme. Header 44px, 0 20px, 1px currentColor, Hover Deckkraft 0.7. Auf hellem Grund: Navy-Fläche, Creme-Text. Textlink: 11px, 0.24em, Versalien + 28×1px Linie, Hover `--av-gold-text`.
- **Inputs Fahrzeug:** Label 13px 600, 8px darüber. Feld 56px hoch, Innenabstand 0 16px, 1px `--car-border`, weiß, 16px, Fokus Rahmen `--car-ink`.
- **Inputs Aviation:** Label 10px, 0.26em, Versalien, `--av-muted`. Feld 48px, nur Unterkante 1px `rgba(13,26,44,.3)`, transparent, 17px, Fokus Unterkante Navy. Auf Navy: Linie `rgba(244,239,230,.35)`, Text Creme, Label `--av-on-navy-muted`, Fehler Linie `--av-error`.
- **Chips Aviation:** 44px, 0 22px, 1px Navy, 11px, 0.22em, Versalien. Gewählt: Navy-Fläche, Creme-Text.
- **Segment-Steuerung Fahrzeug:** Gruppe mit 1px `--car-border`. Segment 44px (Leistungsseite) oder Zeile mit 14px 16px Innenabstand (Anfrage, Label 15px 600 + Beispiel 12px 75 %). Gewählt: `--car-ink`, weiß.

### 8.1 Startseite (`/`)

1. **Header:** sticky, 76px, Hintergrund und Linie laut 7.1. Links Logo (Klick: Startseite). Ab 980px Navigation (14px 500, Abstand 36px, 6px vertikal, 1.5px Unterstreichung bei aktiver Seite, Hover rot): „Leistungen & Preise“, „Ablauf“, „Standort“, „Paintfix Aviation ↗“, rechts „Termin anfragen“ (44px). Unter 980px: Textbutton „Menü“ bzw. „Schließen“, öffnet ein Panel unter dem Header mit denselben Punkten (20px, 600, Breite 110 %, 18px vertikal, Trenner `--car-line-soft`).
2. **Hero:** Raster 2 Spalten (`minmax(460px,1fr)`), Abstand `clamp(40px,5vw,88px)`, unten ausgerichtet, oben `clamp(36px,5vw,72px)`.
   - Links: Overline „Fahrzeugaufbereitung · Telgte bei Münster“, H1 „Gründlich“ / „bis ins Detail.“ (zwei maskierte Zeilen, 28px Abstand oben), Text 16–19px, max. 480px: „Außen, innen, Politur und Keramikversiegelung für Ihr Alltagsauto, in unserer Halle in Telgte. Den Festpreis kennen Sie, bevor wir beginnen.“ Buttons „Termin anfragen →“ (Primär) und „Alle Preise“ (Sekundär), 36px Abstand. Statuszeile 13px: Punkt + `{Öffnungsstatus}` + „·“ + „Marshallstraße 34, Telgte“.
   - Rechts: Bild 4:5, max. Höhe `calc(100vh - 140px)`, min. 420px, Bild mit Parallaxe (Faktor 0.07, Bild 8 % größer oben und unten). Unten Verlauf von transparent zu `rgba(12,13,15,.55)` mit Bildunterschrift 11px 500 0.16em weiß: „VW Golf · Außenaufbereitung“ links, „ab 89 €“ rechts.
   - Darunter Preisleiste: 4 Spalten (`minmax(230px,1fr)`), je 2px Linie oben (Hover rot), Nr. + Dauer 13px, Name 20px 600, „ab“ 14px + Kleinwagenpreis groß. Klick: Leistungsseite am Anker. Darunter 13px: „Preise für Kleinwagen inkl. MwSt. Limousinen, Kombis, SUVs und Vans finden Sie auf der Leistungsseite.“
3. **Leistungen** (`#leistungen`, Linie oben `--car-line-ui`): Kopf zweispaltig. Links Overline „Leistungen“ + H2 „Was wir für Ihr Fahrzeug tun.“. Rechts Text 17px „Vier Leistungen, einzeln oder kombiniert. Außen und innen zusammen kosten weniger als einzeln gebucht.“ + Textlink „Alle Preise und Fahrzeugklassen →“. Liste mit 1px Linie oben: je Zeile Nr. (40px), Name (Leistungsliste), Kurzbeschreibung 15px, Dauer 14px, „ab“ + Preis 30px. Zeilenhöhe durch `clamp(24px,2.8vw,40px)` Innenabstand, Trenner `--car-line`. Hover-Effekt: 9.3.
4. **Vorher/Nachher:** Overline „Politur · Vorher und nachher“, H2 „Derselbe Lack, einen Tag später.“, Text: „Waschanlagen hinterlassen feine Kratzer, in denen sich das Licht kreisförmig bricht. Die Maschinenpolitur trägt sie ab und gibt dem Lack seine Tiefe zurück. Ziehen Sie den Regler.“ Regler 9.5 (Seitenverhältnis 21:9, min. 300px hoch, `width: 100%`). Labels „Vorher“ (Chip `rgba(12,13,15,.78)`, weiß) und „Nachher“ (weißer Chip), 11px 600 0.16em, 20px vom Rand. Unterzeile 13px: „Mercedes-Benz C-Klasse · Politur, 1 Tag“ / „Politur ab 249 € inkl. MwSt.“
5. **Ablauf** (`#ablauf`, `--car-surface`): Overline „Ablauf“, H2 „So läuft Ihr Termin ab.“. Vier Schritte (`minmax(240px,1fr)`, Abstand 40px 32px) mit Fortschrittslinie (9.6), Marker 12×12px (letzter rot), Nummer 64px 300, Titel 20px 600, Text 15px:
   - 01 Anfrage: „Online, telefonisch oder direkt bei uns. Sie nennen Fahrzeug und gewünschte Leistung.“
   - 02 Festpreis: „Nach einer kurzen Sichtung erhalten Sie einen verbindlichen Preis. Ohne Ihre Zustimmung beginnen wir nicht.“
   - 03 Aufbereitung: „In unserer Halle in Telgte, mit Produkten, die wir für jedes Material passend auswählen.“
   - 04 Übergabe: „Sie bekommen Ihr Fahrzeug mit Fotoprotokoll zurück und sehen genau, was gemacht wurde.“
6. **Aviation-Band:** ganze Breite als Button, `--av-navy`, Hover `--av-navy-hover` (0.5s). Innen `clamp(56px,7vw,104px)` vertikal, Flex mit Umbruch: Aviation-Logo, Text in Cinzel `clamp(16.8px,1.52vw,22.4px)` Zeilenhöhe 1.4 „Business Aviation betreuen wir in einem eigenen Bereich, mit eigenem Team und eigener Kalkulation.“, rechts „Zur Flugzeugaufbereitung“ (12px, 0.2em, Versalien) + 44px Goldlinie. Klick: Curtain, dann Aviation.
7. **Standort** (`#standort`): Overline „Standort“, H2 „Marshallstraße 34, Telgte.“, Text „Zwischen Münster und Warendorf, mit Parkplätzen direkt an der Halle.“ Tabelle (Raster 150px / 1fr, 16px vertikal, Linie `--car-border`): Adresse „Marshallstraße 34, 48291 Telgte“, Öffnungszeiten „Mo–Fr 8–18 Uhr · Sa 9–14 Uhr“, Telefon „02504 000 00 00“, E-Mail „hallo@paintfix.de“. Buttons „Termin anfragen →“, „Route planen“ (Google-Maps-Link). Daneben Foto (Halle oder Team).
8. **CTA + Footer:** siehe 8.5.

### 8.2 Leistungen & Preise (`/leistungen`)

1. **Seitenkopf** (`--car-surface`, `clamp(48px,6vw,88px)` oben, `clamp(56px,7vw,96px)` unten): Brotkrumen 13px „Start / Fahrzeugaufbereitung“. H1 „Leistungen und Preise.“ + Text 18px „Alle Preise inklusive Mehrwertsteuer für ein Fahrzeug in normalem Zustand. Nach einer kurzen Sichtung nennen wir Ihnen den Festpreis. Ohne Ihre Zustimmung wird es nicht teurer.“
2. **Klassenleiste** (`#preise`): sticky bei 76px, z-index 30, weiß 94 % + Blur 14px, Linie unten. „Preise für“ (13px 600 0.14em Versalien), Segment-Steuerung mit den 3 Klassen, daneben Beispiel 13px (z. B. „z. B. VW Polo, Mini“). Alle Preise der Seite folgen der gewählten Klasse (Standard: Kleinwagen).
3. **Vier Leistungen** (`#svc-{id}`): Bild + Text. „{no} / 04“ und „Dauer {dur}“ 13px, H2 `{name}`, Beschreibung 17px, „Im Preis enthalten“ (12px 600 0.14em Versalien) + Liste `{incl}`, Preis „ab {Preis der Klasse}“, Zeile „{Klasse} · inkl. MwSt.“, Button „Anfragen →“ (öffnet `/anfrage` mit dieser Leistung und Klasse).
4. **Kombi-Band** (`--car-ink`, Text `--car-on-ink`): Overline „Komplettaufbereitung“, H2 „Außen und innen an einem Termin.“, „ab {Kombipreis}“, „{Klasse} · Sie sparen {Ersparnis} gegenüber der Einzelbuchung.“ (Ersparnis = Außen + Innen − Kombi), Button „Komplett anfragen →“ (Außen + Innen vorgewählt).
5. **Zusatzleistungen:** Überschrift „Zusatzleistungen“, vier Zeilen Name / Preis aus `extras`.
6. **FAQ:** Overline „Häufige Fragen“, H2 „Fragen zu Preis und Ablauf.“. Akkordeon, je Eintrag Linie unten `--car-line`, Frage als Button (24px vertikal, Hover rot), Zeichen „+“ bzw. „–“ (24px 300). Antwort 16px, Zeilenhöhe 1.65, 48px Abstand rechts, 28px unten. Erster Eintrag offen, immer nur einer offen.
7. **CTA + Footer:** 8.5.

### 8.3 Termin anfragen (`/anfrage`)

1. **Kopf:** Brotkrumen „Start / Termin anfragen“, H1 „Termin anfragen.“, Text „Sie erhalten innerhalb eines Werktags einen Festpreis und Terminvorschläge. Die Anfrage ist unverbindlich.“, Link „Anfrage für ein Flugzeug? Zu Paintfix Aviation ↗“.
2. **Formular** (Karte `flex: 1 1 560px`, weiß, 1px `--car-line`). Vier Schritte mit `clamp(24px,3.5vw,44px)` Innenabstand und Trenner `--car-line-soft`, Kopf je Schritt: Nummer 13px + H2 20.6px.
   - **01 Leistungen:** Raster `minmax(250px,1fr)`, Abstand 12px. Karte: 18px Innenabstand, 1.5px Rahmen (`--car-line`, gewählt `--car-ink`, Hover `--car-ink`), Checkbox 22×22px (1.5px Rahmen, gewählt schwarz mit weißem ✓), Name 16px 600, Dauer 13px, Preis 15px 600 „ab {Preis}“. Mehrfachauswahl.
   - **02 Fahrzeug:** Segment-Steuerung (3 Spalten) mit Klasse + Beispiel, darunter Feld „Marke und Modell“.
   - **03 Wunschtermin:** Feld „Datum“, Segment „Abgabe“: Vormittag / Nachmittag / Flexibel (Standard: Flexibel).
   - **04 Kontakt:** „Name“ (Placeholder „Vor- und Nachname“), „Telefon“, „E-Mail“, „Nachricht (optional)“. Checkbox: „Ich bin einverstanden, dass Paintfix meine Angaben zur Bearbeitung der Anfrage verwendet.“ Button „Anfrage senden →“.
3. **Zusammenfassung** (`aside`, `flex: 1 1 320px`, max. 440px, sticky bei 100px): Karte `--car-ink`, 32px Innenabstand. „Ihre Auswahl · {Klasse}“ (12px 600 0.16em, `--car-on-ink-muted`), Positionen Name / Preis, leer: „Noch keine Leistung gewählt.“ Summe 17px 600 „Richtpreis“ / „ab {Summe}“. Hinweise: „Kombipreis für außen + innen berücksichtigt.“ (nur bei Kombi), „Inkl. MwSt. Den Festpreis nennen wir nach kurzer Sichtung, bevor wir beginnen.“ Telefonbox: „Lieber telefonieren?“, „02504 000 00 00“, „Mo–Fr 8–18 Uhr · Sa 9–14 Uhr“.
4. **Danke-Zustand** (ersetzt Formular, scrollt nach oben): 56×56px schwarzes Quadrat mit ✓, H2 „Danke{, Vorname}.“, Text „Ihre Anfrage ist bei uns. Wir melden uns innerhalb eines Werktags mit Festpreis und Terminvorschlägen.“, Buttons „Zur Startseite“ und „Anfrage bearbeiten“ (zurück zum ausgefüllten Formular), Zusammenfassung der Positionen + „Richtpreis · {Klasse}“ / „ab {Summe}“.

Kein CTA-Band auf dieser Seite, Footer ja.

### 8.4 Paintfix Aviation (`/aviation`, `/en/aviation`)

Texte: `content/aviation.json` → `de` bzw. `en`. Schlüssel in Klammern.

0. **Header** (fixed, 84px, Übergang 0.5s): über dem Hero transparent, Text Creme, Linie `rgba(244,239,230,.16)`. Sobald der Inhalt den Header erreicht (Oberkante ≤ 90px): `--av-header-bg` + Blur, Text Navy, Linie `rgba(13,26,44,.12)`. Logo (Klick: nach oben). Ab 1240px Navigation (`nav`): Leistungen, Ablauf, Standards, Flotte, Zusammenarbeit → Anker. „DE / EN“ (inaktiv 50 % Deckkraft). Ab 980px Button `cta`.
1. **Hero** (sticky, 100vh, min. 640px, Navy): Bild mit Parallaxe (Bildfläche ab −30 % oben, `translateY = scrollY × 0.3`), Zoom 1.12 → 1 in 3.2s beim Betreten. Verlauf `linear-gradient(180deg, rgba(13,26,44,.6) 0%, rgba(13,26,44,0) 24%, rgba(13,26,44,0) 40%, rgba(13,26,44,.9) 100%)`. Unten: Overline `heroLabel`, H1 `aT1` / `aT2` (maskierte Zeilen, 300/430ms), `sub` (max. 520px, `--av-on-navy-hero`), Buttons `cta` + `cta2` (nur ab 980px). Der Block blendet beim Scrollen aus (`opacity = 1 − scrollY / (0.6 × vh)`). Rechts mittig vertikal `scroll` + animierte Linie (1×56px, `pf-cue` 2.6s). Unten auf Mobil 132px Abstand wegen Aktionsleiste. Folgende Abschnitte schieben sich über den Hero.
2. **Für wen wir arbeiten:** `audLabel`, `audTitle`, `audIntro`, drei Spalten `aud` (Titel + Text, gestaffelt 140ms).
3. **Expand** (250vh hoch, innen sticky 100vh, Creme): Bild (Nacht, Vorfeld) wächst von `inset(20% 26%)` auf volle Fläche, Text `expLabel` (Gold) und `expT1` / `expT2` erscheinen mittig oben (bei `calc(84px + 7vh)`). Unten Zeile `rampCaption` / „52°08′05″ N · 7°41′04″ E“ (10px, 0.3em). Details 9.7.
4. **Leistungen** (`#av-services`, `--av-sand`), ab 980px als Horizontal-Scroll (9.7): Intro-Panel (Breite `clamp(440px,38vw,640px)`) mit `svcLabel`, `svcTitle`, `svcNote`, unten `hsHint` + 72px Goldlinie + →. Dann drei Kategorie-Panels (Breite `min(1160px,84vw)`, zwei Spalten, Linie links): Bild mit großer Ziffer „01“–„03“ (Cinzel, Creme), rechts Kategorie (`tabs[i]`), „0i / 03“, Liste `svc[i]` mit Nr., Titel, Beschreibung. Unter 980px oder bei reduzierter Bewegung: Tab-Version (drei Tabs mit Nummer, aktive Unterlinie Navy, Liste + Bild).
5. **Kabinen-Zitat:** Höhe `clamp(480px,80vh,860px)`, Kabinenbild, Zitat „„{quote}““ in Cinzel.
6. **Ablauf** (`#av-process`, Navy): `procLabel`, `procTitle`, vier Schritte `proc` mit Fortschrittslinie in Gold (1px), Rauten 8×8px, Ziffern Cinzel 44.8px Gold, Titel Cinzel 20.8px, Text 15px `--av-on-navy`.
7. **Standards** (`#av-standards`, `overflow-x: clip`): links `stdLabel`, `stdTitle`, vier Einträge `std` (gestaffelt 110ms). Rechts sticky bei 124px der **Arbeitsbericht** (`--av-paper`, 1px Rahmen, Schatten Report): Kopf mit Logo, `rep.title`, `rep.no`; Datenzeilen `rep.rows`; `rep.checksLabel` + Checkliste `rep.checks` mit ✓-Kästchen (18px, Navy, gestaffelt 320ms); vier Fotos 1:1; `rep.photos`; Unterschrift „M. Becker“; `rep.notified`. Stempel (9.8) mit `rep.sign` und Datum. Darunter `repCaption`.
8. **Flotte** (`#av-fleet`, `--av-sand`): links `fleetLabel`, `fleetTitle`, Zeilen `fleet` (Klasse 11px Versalien / Muster Cinzel), `fleetNote`. Rechts `baseLabel`, **Einsatzradius-Karte** (Seitenverhältnis 260:236, Creme, Rahmen): Ringe 50 / 100 / 150 km um EDDG (Durchmesser 38.46 / 76.92 / 115.38 % der Breite), Punkte nach echten Koordinaten (links/oben in %): EDDG 50/30.51, EDLP 74.5/55.04, EDLW 48.12/59.53, EDDL 25.88/70.34, EDDK 35.77/90.3, Firmensitz Telgte 52.65/37.75. Darunter Liste `bases` mit ICAO (Cinzel), Name, Entfernung (86 / 69 / 113 / 146 km) und Status. Hover auf einer Zeile hebt den Punkt hervor, zeigt eine gestrichelte Linie von EDDG und die Entfernung, die übrigen Zeilen gehen auf 40 %.
9. **Zusammenarbeit** (`#av-terms`, Creme): `termsLabel`, `termsTitle`, `termsIntro`. Ab 980px Vergleichstabelle (Spalten `minmax(150px,.7fr)` + 3 × 1fr): Kopf je Modell `models` (römische Ziffer Gold, Titel, Beschreibung), fünf Zeilen `rows`, Fußzeile `termsPrice` + Textlink `termsCta` (scrollt zum Formular und wählt das Modell vor). Unter 980px Karten (`--av-paper`). Darunter **Lieferanten-Onboarding** (zwei Spalten, Navy): links `docsLabel`, `docsTitle`, `docsIntro`, sechs Einträge `docs`. Rechts (`--av-navy-deep`) gestapeltes Dokument-Cover (`docsCover`, `docsCoverMeta`), Felder `docsCompany` und `docsEmail`, Button `docsBtn`, Hinweis `docsNote`. Ablauf 10.3.
10. **Kontakt** (`#av-contact`): links `formLabel`, `formTitle`, `formIntro`, Block `direct` mit `opsPhone` und `opsMail` (Cinzel 19.2px). Rechts Formular (10.2). Danke-Zustand: `sentTitle`, `sentText`, Button `again`.
11. **Footer** (Navy): Wortmarke „PAINTFIX“ (Cinzel) + „AVIATION“ (Mona Sans, 0.62em) mit Button `cta`. Vier Spalten: `direct` (Telefon, Mail), `baseLabel` (Flughäfen), `footAddrLabel` (`footAddr`), „Legal“ (`legal`). Unten „© 2026 · {footDiv}“ und Link `footCar` ↗ (zur Fahrzeug-Startseite mit Curtain).
12. **Abschnittsanzeige** (ab 1200px, nach dem Hero): fixed, links 22px, unten 36px, vertikal, `mix-blend-mode: difference`, Text „{I–VI} — {secs[i]}“ (10px, 0.32em) mit 48px Linie darüber.
13. **Mobile Aktionsleiste:** 9.10.

### 8.5 CTA und Footer Fahrzeug

Gemeinsamer schwarzer Abschluss (`--car-ink`, Text `--car-on-ink`).
- **CTA** (nur Startseite und Leistungsseite): H2 „Sagen Sie uns, was Ihr Auto braucht.“ (max. 15ch), Text „Sie erhalten innerhalb eines Werktags einen Festpreis und Terminvorschläge.“ (`--car-on-ink-muted`), Button „Termin anfragen →“, daneben „Oder anrufen“ / „02504 000 00 00“.
- **Footer:** Logo (helles Quadrat) + „Marshallstraße 34“ / „48291 Telgte“. Spalten „Leistungen“ (die vier Leistungen), „Paintfix“ (Ablauf, Standort, Termin anfragen), „Rechtliches“ (Impressum, Datenschutz, AGB). Unten „© 2026 Paintfix · Inh. Arian Hassanzadeh“ und „Paintfix Aviation ↗“.

## 9. Interaktionen und Animationen

Alle Animationen entfallen bei `prefers-reduced-motion: reduce` (Inhalte sofort sichtbar, keine Parallaxe, kein Curtain, kein weiches Scrollen, Tab-Version statt Horizontal-Scroll).

### 9.1 Reveal-System
Einmalig, sobald die Oberkante des Elements unter 92 % der Viewport-Höhe liegt. Startzustände nur setzen, wenn JavaScript läuft (sonst bleibt Inhalt sichtbar).
- **Fade-up:** opacity 0 → 1 (1.1s) und translate 0 32px → 0 (1.2s), `--ease-out`, Verzögerung je Element (0–650ms). Gilt für alle H2.
- **Staffel:** Kinder eines Containers wie Fade-up mit 28px Versatz (opacity 1s, Bewegung 1.1s), Verzögerung Index × Schritt (90 / 110 / 140 / 320ms).
- **Maske:** Zeile in `overflow: hidden`, translate 0 110% → 0, 1.25s `--ease-mask` (Hero-Überschriften).
- **Clip:** `clip-path: inset(100% 0 0 0)` → `inset(0)`, 1.6s `--ease-clip` (Fahrzeug-Hero-Bild).
- Während der Curtain das Bild bedeckt, warten Reveals und starten beim Aufdecken.

### 9.2 Parallaxe
Inneres Bild ist größer als der Rahmen. `translateY = −((Elementmitte − vh/2) × Faktor)`, Faktor 0.07 im Fahrzeug-Hero, weitere Werte in der Referenz (`data-px`). Nur im Sichtbereich ± 300px berechnen.

### 9.3 Leistungsliste mit folgendem Bild (ab 980px)
- Hover auf einer Zeile: übrige Zeilen opacity 0.28 (0.4s), Name der Zeile `translateX(18px)` (0.6s `--ease-out`).
- Bild 4:5, Breite `clamp(220px,19vw,290px)`, Schatten Float, folgt dem Cursor mit Lerp 0.16 pro Frame, Neigung bis ±5° je nach Geschwindigkeit, mittig zur Cursorhöhe, 36px Abstand. Ab 62 % der Listenbreite wechselt es auf die linke Seite des Cursors. Die vier Bilder liegen übereinander und blenden in 0.35s über. Ein- und Ausblenden 0.35s.
- Der Abschnitt braucht `overflow-x: clip`.

### 9.4 Markenwechsel (Curtain)
Nur beim Wechsel zwischen Fahrzeug und Aviation (in beide Richtungen):
1. 0ms: Blende liegt unter dem Viewport (`translateY(100%)`), ohne Übergang.
2. Nächster Frame: `translateY(0)` in 0.85s `--ease-curtain`. Inhalt blendet ein (Aviation: opacity 0.6s, 0.2s Verzögerung; Fahrzeug: 0.5s, 0.15s).
3. 860ms: Seite wechseln, nach oben scrollen.
4. 1220ms: `translateY(−100%)`, Reveals starten.
5. 2200ms: Blende entfernen.

Inhalt Richtung Aviation: Navy, Aviation-Logo (Cinzel `clamp(19.2px,2.08vw,30.4px)`), 56px Goldlinie, „Business Aviation · EDDG“ (10px, 0.34em, Gold). Richtung Fahrzeug: weiß, Logo (30px / 24px) + „Fahrzeugaufbereitung · Telgte“ (11px 500 0.2em). In Next.js als Client-Komponente im Root-Layout, Navigation mit `router.push` bei Schritt 3.

### 9.5 Vorher/Nachher-Regler
- Nachher-Bild vollflächig, Vorher-Bild darüber mit `clip-path: inset(0 {100−v}% 0 0)`.
- Griff: 2px weiße Linie + Kreis 60px weiß mit „‹ ›“, Schatten Handle.
- Pointer Events mit `setPointerCapture`, `touch-action: pan-y`, Cursor `ew-resize`. Tastatur: ← / → ± 5 %. `role="slider"`, `aria-valuenow` mitschreiben.
- Intro, sobald 72 % im Viewport, nach 450ms: 50 → 24 % (750ms), → 76 % (1000ms), → 50 % (750ms), easeInOutCubic. Bricht bei Interaktion ab.
- Produktion: echtes Fotopaar statt Filter.

### 9.6 Fortschrittslinie (Ablauf, beide Marken)
`p = clamp((0.78 × vh − rect.top) / (0.55 × rect.height), 0, 1)`. Linie `scaleX(p)` mit Ursprung links. Schritt i hat opacity 1, sobald `p ≥ (i + 0.35) / 4`, sonst 0.3 (Übergang 0.6s, Aviation 0.7s).

### 9.7 Aviation-Scrollszenen
- **Expand:** `p = clamp(−rect.top / (Höhe − vh))`, `e = easeInOutCubic(min(1, p / 0.6))`. Rahmen `inset(20%·(1−e) 26%·(1−e))`, Bild `scale(1.2 − 0.2e)`. Text und Bildzeile: `t = clamp((p − 0.5) / 0.25)`, opacity t, Text `translateY(28·(1−t)px)`.
- **Horizontal-Scroll:** Abschnittshöhe = (Spurbreite − Viewportbreite) + vh, Spur `translateX(−p × Distanz)`. In GSAP: `ScrollTrigger` mit `pin` und `scrub`.
- **Hero:** Parallaxe, Zoom und Ausblenden wie in 8.4.
- **Header-Wechsel und Abschnittsanzeige:** aktiver Abschnitt = letzter, dessen Oberkante ≤ 45 % vh liegt.
- **Weiches Scrollen:** nur Aviation, ab 980px, nicht bei Touch, nicht bei reduzierter Bewegung. Prototyp: Lerp 0.085 pro 16.67ms, bildratenunabhängig. Produktion: Lenis mit `lerp: 0.085`. Anker-Sprünge laufen über Lenis `scrollTo` mit 84px Offset.

### 9.8 Stempel
124px Kreis, 1.5px `--av-stamp`, innerer Ring 0.75px, `mix-blend-mode: multiply`, Text „PAINTFIX AVIATION“, `rep.sign`, „14 · 10 · 2026“. Erscheint 1.5s nach dem Reveal: aus `scale(1.7) rotate(−20deg)` und opacity 0 in `scale(1) rotate(−8deg)`, opacity 0.3s, Bewegung 0.6s `--ease-stamp`.

### 9.9 Live-Öffnungsstatus
Zeiten: Mo–Fr 8–18, Sa 9–14, So geschlossen. In Zeitzone Europe/Berlin berechnen, minütlich aktualisieren.
- geöffnet: „Heute geöffnet bis 18 Uhr“, grüner Punkt pulsiert (`pf-dot` 2.4s)
- vor Öffnung: „Öffnet heute um 8 Uhr“
- sonst: „Geschlossen · öffnet morgen um 8 Uhr“ bzw. „Geschlossen · öffnet Mo. um 8 Uhr“, Punkt grau

### 9.10 Mobile Aktionsleisten (unter 980px)
- **Fahrzeug** (Startseite und Leistungsseite, nicht bei offenem Menü): fixed unten, Raster 1fr / 1.4fr, Abstand 10px, Innenabstand 10px 12px + `env(safe-area-inset-bottom)`, `--car-bar-bg` + Blur 16px, Linie oben. „Anrufen“ (52px, 1px Rahmen, 15px 600, mit Status-Punkt, `tel:`) und „Termin anfragen →“ (schwarz). Am Seitenende 76px Platzhalter.
- **Aviation:** `--av-bar-bg` + Blur, Linie `rgba(200,174,130,.35)`. „Ops anrufen“ (Rahmen `rgba(244,239,230,.5)`, 11px 0.22em Versalien) und `cta` (Creme). Ausgeblendet, solange der Kontaktabschnitt aktiv ist. 76px Navy-Platzhalter am Ende.

### 9.11 Weitere Hover-Zustände
Navigation und Textlinks Fahrzeug: rot. Preisleiste: obere Linie rot. Aviation-Navigation: opacity 0.6. Kartenpunkte: 7 → 12px (EDDG 10 → 12px) mit Goldring 26px.

## 10. Formulare, Zustände, Logik

### 10.1 Fahrzeug-Anfrage
Zustand: `req { aussen, innen, politur, keramik }` (Standard: nur aussen), `reqClass` (0–2), Felder `name, phone, email, car, date, msg`, `time` (0–2, Standard 2), `consent`, `submitted`.

Preislogik (Klasse c):
```
keramik = sel.keramik
aussen  = sel.aussen && !keramik      // Keramik enthält die Außenaufbereitung
innen   = sel.innen
if (aussen && innen)  → Position „Komplett außen + innen“ = comboPrice[c]
else                  → Außen = services[0].p[c], Innen = services[1].p[c]
if (sel.politur)      → Politur = services[2].p[c]
if (keramik)          → „Keramikversiegelung“ (+ „ (inkl. Außen)“, wenn Außen gewählt) = services[3].p[c]
Summe = Summe aller Positionen
```
Preisformat: `n.toLocaleString('de-DE') + '\u00A0€'`, immer mit „ab“.

Validierung (Produktion): Name Pflicht, Telefon oder E-Mail Pflicht, E-Mail-Format, mindestens eine Leistung, Einwilligung Pflicht, Datum nicht in der Vergangenheit. Fehler unter dem Feld (13px, rot), Fokus aufs erste fehlerhafte Feld. Versand: Mail an Paintfix mit Positionen, Klasse, Richtpreis und Kontakt, Bestätigung an den Kunden.

Vorbelegung über Query (`/anfrage?leistungen=aussen,innen&klasse=1`) aus Leistungsseite, Kombi-Band und Preisleiste.

### 10.2 Aviation-Angebot
Felder: `company`, `name`, `email`, `phone`, Muster (Auswahl, gruppiert), `reg`, `apt` (ICAO), `window`, Leistungen (Chips, mehrfach, Standard: Außen), Zusammenarbeit (Chips, einfach, abwählbar), `notes`, Datenschutz-Hinweis, Senden.

**Muster-Auswahl** (`types`, Faktor f): Turboprop: Pilatus PC-12 0.8, King Air 360 0.9. Light Jet: Citation CJ3+ 1, Citation CJ4 1.05, Phenom 300E 1.05, Pilatus PC-24 1.1. Midsize: Citation Latitude 1.25, Praetor 600 1.35, Challenger 350 1.4. Large Cabin: Falcon 8X 1.8, Gulfstream G650 2, Global 6500 2, Global 7500 2.2. Option „Anderes Muster“ zeigt ein Freitextfeld, dann keine Schätzung.

**Richtwerte** (Box `--av-sand`, 24px Innenabstand), `r(x)` = auf 0.5 runden:
```
Außen:  r(3 × f) Std.,   Techniker: f ≥ 1.8 → 4, f ≥ 1.3 → 3, sonst 2
Kabine: r(2.5 × f) Std., Techniker: f ≥ 1.8 → 3, sonst 2
Schutz: max(1, r(2 × f)) Arbeitstage, Techniker: f ≥ 1.8 → 4, sonst 3
Bodenzeit:
  Schutz gewählt     → Schutz-Dauer + Hinweis est.hangar
  Außen + Kabine     → r(max(Außen, Kabine) + 0.5) Std. + Hinweis est.parallel
  sonst              → Dauer der gewählten Leistung
```
Anzeige „ca. 4,5 Std.“ (Dezimalkomma DE, Punkt EN). Ohne Muster oder Leistung: `est.empty`. Immer `est.note` darunter.

Validierung (Produktion): Unternehmen, Ansprechpartner, E-Mail, Muster und Flughafen Pflicht, ICAO vier Buchstaben, mindestens eine Leistung.

### 10.3 Lieferantenunterlagen
Zustand `docs { email, company }`, `docsSent`, `docsErr`. Prüfung: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`. Fehler: Linie `--av-error` + `docsErr`. Erfolg: `docsDone` (Cinzel), Zeile `docsFile` / `docsMeta`, „{docsDoneSub} {E-Mail}.“, Button `docsAgain`. Produktion: Server speichert Lead, schickt Mail mit Link und gibt einen zeitlich begrenzten Download-Link zurück.

### 10.4 Weitere Zustände
`vClass` (Leistungsseite), `faq` (offener Eintrag, Start 0), `lang` (de/en), `avTab`, `avModel` (−1 = keins), Hover-Index der Liste, `baseHover` (Karte), `menu` (mobiles Menü).

## 11. Inhalte

- `content/fahrzeug.json`: `services` (id, no, name, short, dur, p [Kleinwagen, Limousine & Kombi, SUV & Van], desc, incl, img2), `vehicleClasses`, `comboPrice`, `extras`, `faq`.
- `content/aviation.json`: `de` und `en` mit allen Texten, Listen, Formularlabels, Richtwerten und Mustern.
- Statische Fahrzeugtexte stehen wörtlich in Abschnitt 8.

## 12. Assets

Alle Bilder in `reference/img/` sind Pexels-Platzhalter und werden durch ein eigenes Shooting ersetzt.

| Datei | Verwendung | Benötigtes Motiv |
|---|---|---|
| `car-20381587.jpg` | Fahrzeug-Hero 4:5 | Detail Scheinwerfer mit Wassertropfen, Hochformat |
| `car-6872176.jpg` | Hover-Bild Außen | Handwäsche |
| `car-37809563.jpg` | Hover-Bild Innen, Leistungsseite Innen | Innenraum |
| `car-14615262.jpg` | Hover-Bild Politur | Maschinenpolitur |
| `car-30787396.jpg` | Hover-Bild Keramik | Keramik, Abperleffekt |
| `car-12397895.jpg` | Vorher/Nachher | echtes Fotopaar, gleiche Perspektive |
| `car-31154217.jpg` | Standort | Halle von außen oder Team |
| `car-6873023.jpg` | Leistungsseite Außen | Arbeitsschritt |
| `car-14908957.jpg` | Leistungsseite Politur | Arbeitsschritt |
| `car-29132800.jpg` | Leistungsseite Keramik | Arbeitsschritt |
| `av-28772726.jpg` | Aviation-Hero | Business Jet auf dem Vorfeld |
| `av-25724429.jpg` | Expand | Vorfeld EDDG bei Nacht oder blauer Stunde |
| `av-14983522.jpg` | Leistungen Außen, Berichtsfoto | Außenreinigung am Jet |
| `av-20562278.jpg` | Leistungen Kabine, Berichtsfoto | Kabine |
| `av-32346742.jpg` | Leistungen Schutz, Berichtsfoto | Versiegelung, Hangar |
| `av-20562279.jpg` | Kabinen-Zitat | Kabine, ruhig |
| `av-28776071.jpg` | Berichtsfoto | Detail |

Icons: keine Icon-Bibliothek. Verwendet werden nur Textzeichen (→, ↗, ✓, ‹ ›, ▾, +, –) und CSS-Formen.

## 13. Barrierefreiheit, SEO, Recht

- Sichtbarer Fokus (Vorschlag: Fahrzeug 2px `--car-ink` Outline mit 2px Abstand, Aviation 1px `--av-gold`). Der Prototyp hat dafür noch keine eigenen Stile.
- Dekorative Elemente (folgendes Bild, Curtain, Abschnittsanzeige) mit `aria-hidden`. Alt-Texte für alle Fotos.
- Kontrast mindestens 4,5:1 für Text, Gold `#C8AE82` nur auf Navy.
- SEO: Titel und Beschreibung je Seite, Open-Graph-Bilder, Sitemap, `hreflang` de/en für Aviation. Strukturierte Daten: `AutoWash` bzw. `LocalBusiness` (Adresse, Öffnungszeiten, Telefon) für Fahrzeug, `Organization` + `Service` mit `areaServed` für Aviation.
- Recht: Impressum, Datenschutz (Formulare, Resend, Vercel, Analytics), AGB. Schriften selbst gehostet, keine externen Requests ohne Einwilligung.

## 14. Umsetzungsplan

1. **Setup:** Next.js, TypeScript, Tailwind v4, Tokens, Schriften, Layouts für beide Marken, Deployment auf Vercel.
2. **Statische Seiten** ohne Animation, Inhalte aus `content/`, responsive geprüft bei 360 / 402 / 980 / 1440 / 1920px.
3. **Formulare und API:** Anfrage, Angebot, Unterlagen. Validierung, Mails, Danke-Zustände.
4. **Bewegung:** Reveals, Parallaxe, Curtain, Listen-Hover, Vorher/Nachher, Fortschritt, Expand, Horizontal-Scroll, Lenis, reduzierte Bewegung.
5. **Englisch** für Aviation.
6. **SEO, Recht, Analytics, Performance** (LCP-Bild mit `priority`, Bilder optimiert).
7. **Echte Fotos und Inhalte**, Abnahme mit Paintfix, Domain verbinden, Launch.

Abnahmekriterien: kein horizontales Scrollen von 360 bis 1920px, Lighthouse Performance und Accessibility mindestens 90, reduzierte Bewegung vollständig berücksichtigt, alle Formulare senden Mails, Darstellung entspricht der Referenz.

Bekannte Stolperstellen aus dem Prototyp:
- Elemente, die durch `transform` überstehen (Stempel, folgendes Bild), erzeugen auf dem Handy horizontales Scrollen. Abhilfe: `overflow-x: clip` am Abschnitt (nicht `hidden`, sonst bricht `sticky`).
- Ein Element mit `aspect-ratio` und `min-height` ohne feste Breite wird breiter als der Bildschirm. Abhilfe: `width: 100%`.

## 15. Dateien im Paket

```
design_handoff_paintfix_website/
├── README.md                  diese Dokumentation
├── CLAUDE.md                  Regeln für Claude Code, ins Repo-Root kopieren
├── tokens/tokens.css          alle Design-Tokens als CSS-Variablen
├── content/fahrzeug.json      Leistungen, Preise, Klassen, Extras, FAQ
├── content/aviation.json      alle Aviation-Texte DE/EN, Muster, Richtwerte
└── reference/
    ├── Paintfix Website v4.dc.html     Referenz aller Seiten
    ├── Paintfix Mobile Mockups.dc.html vier Mobilansichten (402 px)
    ├── paintfix-data*.js               Datenquellen der Referenz
    ├── support.js, image-slot.js, ios-frame.jsx   Laufzeit der Referenz
    └── img/                            17 Platzhalterbilder
```

## 16. Start mit Claude Code

1. Neues GitHub-Repo anlegen, diesen Ordner als `design/handoff/` hineinlegen, `CLAUDE.md` ins Root kopieren.
2. Repo in Vercel importieren, Umgebungsvariablen aus Abschnitt 4 anlegen.
3. Claude Code im Repo starten, z. B. mit:

> Lies `CLAUDE.md` und `design/handoff/README.md`. Setze Phase 1 und 2 aus Abschnitt 14 um: Next.js mit TypeScript und Tailwind v4, Tokens aus `tokens/tokens.css`, Mona Sans und Cinzel über next/font, Layouts für Fahrzeug und Aviation, alle Seiten statisch mit Inhalten aus `content/`. Vergleiche jede Seite mit der Referenz in `design/handoff/reference/` (über `npx serve` geöffnet). Noch keine Animationen und keine Formular-Logik.

4. Danach phasenweise weiter (Formulare, Bewegung, Englisch, SEO), je Phase ein Pull Request mit Vercel-Preview.
