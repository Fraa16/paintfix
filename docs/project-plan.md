# Paintfix — Website Project Plan (Start → Launch → Handover)

## Context

**Client:** Paintfix, Arian Hassanzadeh, Marshallstraße 34, 48291 Telgte. The business does car detailing (Fahrzeugaufbereitung) and specialises in aircraft detailing (Flugzeugaufbereitung).
**Offer 2026-09-04 (accepted):** pages Home, Fahrzeugaufbereitung, Flugzeugaufbereitung, Kontakt, Rechtliches · SEO + GEO/AEO · DE/EN · logo · design · domain & mail setup · new Google Business Profile · directory listings · texts & images. Delivery in roughly 14 days. Payments: 500 € on 30.09 / 31.10 / 30.11 and 600 € on 31.12.2026.
**Stack decided:** GitHub (this repo, currently empty) → Vercel. Domain and mail stay at IONOS.
**Brand decided:** master brand **Paintfix** plus the endorsed sub-brand **Paintfix Aviation**, following the Mercedes-Benz / Mercedes-Maybach model. A sub-brand is only a business designation (Geschäftsbezeichnung), so it needs **no separate Gewerbe**. One check applies either way: the existing Gewerbeanmeldung must cover aircraft cleaning (see Phase 0). If it can't, we fall back to "one brand, two themes" with no rework, because only the logo lockup changes.
**Imagery:** there is no aircraft material and only a few car photos. Francesco supplies AI/stock imagery as a bridge. The client delivers real photos during and after the project.
**Car prices:** published as "ab"-prices per package.

**The core problem to solve.** It runs in two directions:

1. A car owner must not think "they do jets, so they must be expensive".
2. An aircraft management company must not think "they're a car wash, so they're not serious".

**The core answer: a bridge and a firewall.**

- **Firewall.** Each division is a self-contained world with its own header lockup, colour world, typography accent, tone, CTA, form, FAQ and schema. Aviation pages never show car prices. Car pages never use "on request" language. The client already runs **separate product lines** per division (CarPro vs. Aero-Sense/NUVITE). That fact is the proof that the divisions are run as separate operations, and we make it visible: _"Eigene Produkte. Eigene Verfahren. Eigener Ansprechpartner."_
- **Bridge.** On the car side, aviation appears only as a _quality proof, never as a price signal_: _"Die Sorgfalt aus dem Hangar. Die Preise für Ihr Auto."_ Visible "ab"-prices, everyday cars in the imagery (Golf, Tiguan, family SUVs, not only Porsches), Google reviews and local wording all keep the car side approachable. On the aviation side, a single quiet line ("Paintfix Aviation — a division of Paintfix, Telgte") keeps things honest without diluting the premium feel.

---

## 1. Brand & Design System

### 1.0 Reference analysis (from the screenshots)

| Reference                                     | What we take                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | What we leave out (and do better)                                                                                                                                                                                                                                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Liberty Aviation**, the primary inspiration | Expanded, wide uppercase headlines · midnight navy + champagne gold · full-bleed golden-hour and above-the-clouds photography with **parallax depth**, including clouds that cross section borders · split panels (image ↔ navy text panel) · giant section words ("INTERIOR" / "EXTERIOR") with 2-up image cards and small tracked-caps captions · two-tone headlines ("AERO" grey / "DESIGN" navy) · thin outlined CTAs with "›" · monogram-in-ring logo · recurring small brand motif · navy "Get in touch" band and navy footer | Hero **slider** (hurts LCP, nobody sees slide 3) → one cinematic hero · **multi-coloured circle icons** (look cheap next to the gold) → gold line icons · tiny, low-contrast body text → ≥ 16 px, AA contrast · arrow carousels over images → static 2-up grids with scroll-snap on mobile · generic copy → specific facts |
| **GlobalJet**                                 | Restraint: huge whitespace, thin hairline geometry (rings, lines), atmospheric sections, gold used like jewellery                                                                                                                                                                                                                                                                                                                                                                                                                   | Grey-on-grey text, ornamental diamond layouts that hide the content                                                                                                                                                                                                                                                        |
| **Private Jet Clean**                         | Operational B2B substance: **stats strip** under the hero (24H · ONE contact · EXTERIOR + CABIN · RON), "timed to your turnaround" language, **4-step process**, **coverage list with ICAO codes**, concrete one-line testimonials, two-column FAQ, closing CTA "timed to your next departure"                                                                                                                                                                                                                                      | Cookie banner (we need none), airport lists we can't actually serve                                                                                                                                                                                                                                                        |

**Formula:** Aviation = Liberty's visual language + GlobalJet's restraint + Private Jet Clean's operational substance. Automotive = the **same layout grammar in the "Mercedes-Benz" register**, like two models built on the same platform with different trim.

### 1.1 Two worlds, one DNA

|         | **Paintfix** (master brand / automotive), the "Mercedes-Benz" side                                                                                                                      | **Paintfix Aviation**, the "Maybach" side                                                                                                                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feeling | Precise, confident, approachable-premium, daylight                                                                                                                                      | Cinematic, golden hour above the clouds, spacious, hushed                                                                                                                             |
| Base    | White `#FFFFFF` / `#F5F5F3`, **graphite panels** `#1A1D21` (the counterpart to Liberty's navy panel), ink `#111418`, muted `#5B6168`, hairline `#E3E4E1`                                | **Midnight navy** `#0E1830` (page) / `#16223F` (panels), cloud-white text `#F5F3EE`, muted `#A7AEBF`, ivory interludes `#F4F1EA` and white sections for rhythm                        |
| Accent  | One signature colour, chosen with the logo (candidates: lacquer red or cobalt), used only for CTAs and price tags                                                                       | **Champagne gold** `#C2A36B` (7:1 on navy) for kickers, hairlines, icons and outlined CTAs. On light backgrounds gold is used only for lines/icons; text uses gold-ink `#7A5E30` (AA) |
| Type    | **One variable family with a width axis** (candidate **Mona Sans**, wdth 75–125; alternative **Archivo**, wdth 62–125). Automotive: **normal width**, semibold, sentence-case headlines | **Same family, expanded (wdth 125), uppercase, tracked** headlines in Liberty's stance; same body text. The same typeface in a different stance mirrors the Benz/Maybach relationship |
| Buttons | Solid fill (accent or graphite), 2–4 px radius                                                                                                                                          | 1 px gold hairline outline, square, tracked caps + "›"                                                                                                                                |
| Motif   | "Gloss line": a thin diagonal sheen on dividers and cards                                                                                                                               | Gold horizon hairline with the PF monogram in the centre (our answer to Liberty's dotted line with plane icon)                                                                        |
| Icons   | Monochrome 1.5 px line icons, graphite                                                                                                                                                  | The same icon set in gold. **Never multi-coloured**                                                                                                                                   |
| Density | Normal rhythm, prices visible                                                                                                                                                           | ~1.5× section spacing, fewer words per screen, no prices                                                                                                                              |
| Motion  | Crisp 200–300 ms, subtle image parallax only                                                                                                                                            | Full parallax system (§1.3), slow 600–1200 ms eases                                                                                                                                   |
| Voice   | Chatifa copy rules: direct, concrete, formal "Sie", no buzzwords                                                                                                                        | Understated, specification-like, precise aviation terminology (turnaround, RON, FBO, AMM), EN-grade quality                                                                           |

All tokens live as CSS custom properties scoped by `[data-theme="auto"|"aviation"]`. Themes can nest, so the aviation interlude on Home simply renders inside `data-theme="aviation"`. Fonts are **self-hosted** (variable woff2, subset). Loading Google Fonts remotely is a known DSGVO risk in Germany (LG München 2022).

### 1.2 Logo (part of the offer)

- **Master wordmark "PAINTFIX":** set in the brand family and custom-kerned. Engineered and calm. It must be visually distinct from the franchise **"Paint Fix Pro"** (see risk R2).
- **PF monogram:** our own drawing, used as the favicon, social avatar and seal.
- **Sub-brand lockup:** the PF monogram in a **thin gold ring** + "PAINTFIX AVIATION" in expanded caps. It has Liberty-level presence without copying their "LA" ring.
- **Automotive lockup:** the wordmark in graphite with a solid monogram.
- Process: 2–3 directions → 1 refinement round → final set: SVG, PNG and PDF; positive/negative/mono; horizontal/stacked; favicon/app icons; GBP logo & cover; LinkedIn; email signatures (both brands).

### 1.3 Signature details (what makes it read as €15k and not a template)

- **Parallax system (Liberty-grade).** Full strength on the aviation page and the Home aviation interlude; subtle on car pages.
  1. **Hero depth:** sky plate (slowest) · aircraft (medium, with a slight scroll-linked climb) · a foreground cloud layer (fastest) drifting over the headline.
  2. **Clouds crossing section borders:** transparent cloud layers overlap the split panel and the next image, as on Liberty's "Who we are".
  3. **Full-bleed image sections** move at ~0.8× scroll speed against 1× content. The giant section words ("INTERIOR" / "EXTERIOR") drift slightly sideways.
  4. **Closing flyby:** in the final CTA, the aircraft crosses the section horizontally, tied to scroll.
  5. **Guardrails:** everything is off with `prefers-reduced-motion`; reduced amplitude on touch and low-end devices; no `background-attachment: fixed` (broken on iOS); transforms only, so no layout thrash.
- **Home diptych:** two panels, light _Fahrzeug_ and navy _Flugzeug_. The car panel carries a price anchor ("Pakete ab XX €"); the aviation panel says "Auf Anfrage · Aircraft detailing". On desktop, the hovered panel widens. On mobile, the panels stack with car first.
- **"Threshold" transition into aviation:** native cross-document View Transitions (CSS `@view-transition`, no JS). The screen fades to navy and the ring lockup appears. Browsers without support just navigate normally.
- **Stats strip** (Private Jet Clean pattern) at the foot of the aviation hero, using facts the client confirms, e.g. "≤ X h Antwortzeit · 1 Ansprechpartner · Exterior + Kabine · In Ihrem Hangar".
- **Product/standards plates:** understated "spec cards" (product, grade, purpose) instead of big logo walls.
- **Everything real-first:** the before/after component only accepts client photos (enforced in the schema, §3.3).

---

## 2. Information Architecture & Page Blueprints

### 2.1 Sitemap & routes (Astro i18n, DE default without prefix)

| Page                                    | DE                           | EN                                | Theme                                     |
| --------------------------------------- | ---------------------------- | --------------------------------- | ----------------------------------------- |
| Home                                    | `/`                          | `/en/`                            | master (light) + aviation band            |
| Fahrzeugaufbereitung                    | `/fahrzeugaufbereitung`      | `/en/car-detailing`               | auto                                      |
| Flugzeugaufbereitung                    | `/flugzeugaufbereitung`      | `/en/aircraft-detailing`          | aviation (own header lockup)              |
| Kontakt                                 | `/kontakt`                   | `/en/contact`                     | master; form area switches theme by track |
| Impressum / Datenschutz ("Rechtliches") | `/impressum`, `/datenschutz` | `/en/legal-notice`, `/en/privacy` | master                                    |
| 404                                     | `/404`                       | —                                 | master                                    |

The language switcher maps each page to its counterpart through a slug map, with `hreflang` pairs plus `x-default`.

### 2.2 Home (brand gateway)

1. Header (Paintfix): Fahrzeugaufbereitung · Flugzeugaufbereitung · Kontakt · phone · DE/EN
2. Hero: H1 _"Fahrzeug- und Flugzeugaufbereitung aus Telgte"_, then the **diptych** (the two entry points)
3. Split panel "Wer wir sind": image on one side, graphite panel with the owner, Arian Hassanzadeh (portrait plus a short statement), on the other
4. Car teaser: 3 packages with "ab"-prices → car page
5. **Full-bleed parallax aviation interlude** (`data-theme="aviation"`): navy sky, clouds, the aircraft passing through. This is a window into the other world, our version of Liberty's "Precision care for prestigious aircraft" section → aviation page
6. "Ein Anspruch": 3 principles (material knowledge · documented work · specialised products per division: CarPro | Aero-Sense | NUVITE)
7. Google reviews (real only, added after GBP collects them)
8. Service area (Telgte, Münster, Warendorf, Ostbevern, Everswinkel, Sendenhorst … to be confirmed)
9. FAQ (general, 4–5 questions) → graphite CTA band → Footer (NAP, both brands, legal)

### 2.3 Fahrzeugaufbereitung (automotive world: Liberty's services-page grammar in the Benz register)

1. Hero: full-bleed photo (an everyday premium car in a daylight studio) with subtle parallax. H1 "Fahrzeugaufbereitung in Telgte & Münster". Subline: "Innen, außen, Lack. Mit CarPro-Produkten. Pakete ab XX €." CTAs: _Termin anfragen_ · _Pakete ansehen_ · phone
2. Statement band (graphite, split): headline left, intro right, following Liberty's "Perfection in every detail" band
3. **Giant section words** in normal width: "Innenraum" / "Außen & Lack" / "Keramik". Each has 2-up image cards with a tracked caption and a one-line description, and links to its package
4. **Packages** (data-driven, suggested structure to be validated in the workshop): Innenaufbereitung · Außenaufbereitung · Komplettaufbereitung ("Beliebt") · Lackkorrektur & Keramikversiegelung (CQuartz). Each shows an "ab"-price, duration, what's included and a vehicle-class note (Kleinwagen / Kompakt-Mittelklasse / SUV-Van)
5. Add-ons à la carte (pet hair, odour/ozone, leather care, headlight restoration, wheel coating, engine bay, lease-return check to be confirmed)
6. Bridge line: _"Die Sorgfalt aus dem Hangar. Die Preise für Ihr Auto."_ plus a small link to Paintfix Aviation
7. CarPro section: why only CarPro, and which products (plus "Accredited Installer" only if confirmed)
8. Process in 4 steps (Anfrage → Termin/Begutachtung → Aufbereitung → Übergabe mit Pflegehinweis). HowTo-friendly
9. Before/after (client photos only; the section stays hidden until real pairs exist)
10. Reviews → FAQ ("Was kostet …", "Wie lange …", "Hol- & Bringservice?", "Leasingrückgabe?") → quick-quote form → graphite CTA band

### 2.4 Flugzeugaufbereitung (Paintfix Aviation: Liberty structure + Private Jet Clean substance)

**Header:** transparent over the hero, solid navy with blur once scrolled. Ring lockup · tracked-caps in-page nav (Leistungen · Standards · Ablauf · Einsatzgebiet · Anfrage) · subtle "Paintfix" link · outlined gold CTA _"ANFRAGE ›" / "REQUEST A QUOTE ›"_.

1. **Cinematic hero:** golden-hour aircraft above the clouds with layered parallax (§1.3). H1 in expanded caps "FLUGZEUGAUFBEREITUNG" / "AIRCRAFT DETAILING". Subline direction: _"Exterior, Brightwork und Kabine. Nach Herstellervorgaben, dokumentiert, geplant um Ihre Bodenzeit."_ (claims to be confirmed). **Stats strip** at the foot of the hero.
2. **Split panel "Wer wir sind / Who we are":** cabin image (cream leather, wood veneer) on one side; navy panel with gold kicker, expanded headline and 3 sentences on the other. Clouds cross the border. Carries the division line: _"Eigene Produkte. Eigene Verfahren. Eigener Ansprechpartner."_
3. **Core services over a full-bleed parallax hangar background:** headline + short lead + 4–6 services with **gold line icons**: Exterior wash (wet/dry) · **Brightwork polishing** · paint enhancement & protection · cabin detailing (leather, veneer, carpets, galley, lav) · pre-sale/pre-delivery detailing · **recurring care programmes** (fixed intervals for management companies and operators). Scope to be confirmed by the client.
4. **"EXTERIOR" / "INTERIOR" giant words** (Liberty services page): each with 2-up image cards, a tracked-caps caption and a one-line description. Exterior: Hybrid-/Dry-Wash, Brightwork, Lackschutz. Interior: leather, veneer, carpet extraction, galley/lav.
5. **Mood interstitial:** a full-bleed cabin detail with the gold PF monogram. Pure atmosphere.
6. **Typographic statement** on ivory: two-tone expanded headline (e.g. "PRÄZISION" in light grey / "IM DETAIL" in navy), gold small-caps subline and the horizon motif.
7. **Standards / spec plates** ("Eigene Produkte. Eigene Verfahren."):
   - **Aero-Sense** (Belgian aviation chemicals). Cite only the specs on the datasheets of the products actually used, e.g. AMS 1526C / Airbus AIMS 09-00-002 / Boeing BSS 7432 for the exterior cleaner.
   - **NUVITE NuShine II**, a graded polishing system. **Grade G6** for heavy oxidation, light corrosion and scratch blending; **Grade S** for the deep, clear final finish on oxidation-free aluminium.
   - Masking of sensors and ports per AMM · a photo documentation report per job · insurance coverage (confirm).
8. **Process in 4 steps** (Private Jet Clean pattern, navy): 01 Bodenzeit & Standort senden · 02 Umfang & Angebot bestätigt · 03 Aufbereitung vor Ort · 04 Dokumentierte Übergabe, "ready to fly".
9. **Coverage with ICAO codes** (Private Jet Clean pattern) on a thin-line NRW map in GlobalJet style: EDLT Telgte · EDDG Münster/Osnabrück · EDLP Paderborn/Lippstadt · EDLW Dortmund · EDDL Düsseldorf … Show **only airfields the client confirms**.
10. Who it's for: management companies · operators/charter · FBOs & MROs · private owners · flight schools & clubs (GA).
11. **Two-column B2B FAQ:** aircraft types, working in the client's hangar, RON/overnight, insurance, product approvals, typical durations, invoicing to the management company.
12. **Closing CTA with the parallax flyby:** _"Anfrage — geplant um Ihren nächsten Abflug"_ → B2B request form, plus a direct line and `aviation@`.
13. Navy CTA band + navy footer with the line "Paintfix Aviation — a division of Paintfix, Telgte".

Testimonials stay hidden until real ones exist. When they do, use Private Jet Clean-style concrete one-liners ("Booked at 21:00, signed off before the 06:30 departure").

**No fake references.** No invented clients, logos, testimonials or fleet photos. Credibility comes from specificity: products, grades, process, insurance, documentation and response times.

### 2.5 Kontakt

A segmented control, **Fahrzeug | Flugzeug** (deep-linkable `?track=aviation`), switches the form and its theme. NAP and hours sit alongside. No Google Maps embed; a static map image links out to Maps (no consent needed).

- Car form: name, phone/email, vehicle model & class, package(s), preferred date, message
- Aviation form: company, name, role, email/phone, aircraft type, registration (optional), location (ICAO), timeframe, services checklist, message

### 2.6 Rechtliches

Impressum per **§ 5 DDG** (full name of the owner + "Paintfix"/"Paintfix Aviation" as designations, address, contact, tax IDs), plus image credits covering stock licences and a line noting that some images are AI-generated illustrations. Datenschutz covers Vercel hosting (DPA; functions in `fra1`), IONOS mail, the contact form, server logs, self-hosted fonts and cookieless analytics. **No cookies, so no cookie banner.** Trademark notice: "CARPRO, CQuartz, Aero-Sense, NUVITE und NuShine sind Marken ihrer jeweiligen Inhaber."

---

## 3. Technical Architecture (in this repo)

### 3.1 Stack

- **Astro** (current stable) with static output; `@astrojs/vercel` adapter only for the on-demand form endpoint (`prerender = false`, region `fra1`)
- **Tailwind CSS v4** mapped to CSS-variable tokens (two themes); TypeScript strict
- Astro **i18n routing** (`defaultLocale: 'de'`, `locales: ['de','en']`, `prefixDefaultLocale: false`) plus a localized slug map
- **Content collections** (Zod-validated YAML) for packages/prices, add-ons, aviation services, FAQs and the media registry. **Prices live in one file.**
- `astro:assets` `<Picture>` → AVIF/WebP, responsive `srcset`, explicit dimensions (CLS ≈ 0)
- Motion, split by world:
  - **Aviation page + Home interlude:** GSAP + ScrollTrigger (free since 2025) for the layered parallax, border-crossing clouds and flyby, plus **Lenis** smooth scroll for Liberty's gliding feel. Loaded **only on those pages** as an Astro island script.
  - **Car pages:** CSS + a tiny IntersectionObserver for reveals and subtle image parallax, with no library.
  - `prefers-reduced-motion` switches all of it off, including Lenis.
- Forms: `/api/contact` → Zod validation, honeypot + minimum fill time → **nodemailer via IONOS SMTP** (`smtp.ionos.de:587`, STARTTLS) to `info@` / `aviation@`, plus an auto-reply. Secrets in Vercel env vars. Mail never leaves IONOS, so no extra processor.
- Analytics: Vercel Web Analytics (cookieless) + Google Search Console + Bing Webmaster Tools. Track calls/mail clicks/form submissions as events.

### 3.2 Repo structure

```
astro.config.mjs            # i18n, sitemap, vercel adapter
src/styles/tokens.css       # shared + [data-theme] tokens, font-face
src/layouts/BaseLayout.astro  # <html lang data-theme>, <SEO>, hreflang, JSON-LD slot, view-transition CSS
src/components/global/      # Header (variant: master|aviation), Footer, LangSwitch, SkipLink, Logo
src/components/sections/    # Diptych, Hero, PackageGrid, PriceCard, AddOns, ProcessSteps,
                            # StandardsPlates, AudienceGrid, Coverage, FAQ, CTA, BeforeAfter, Reviews
src/components/forms/       # CarInquiryForm, AviationInquiryForm (shared field primitives)
src/components/seo/         # SEO.astro, JsonLd.astro
src/content/                # packages.yaml, addons.yaml, aviation-services.yaml, faqs/*.yaml, media.yaml
src/i18n/                   # ui.ts (strings), routes.ts (slug map DE↔EN)
src/views/                  # HomeView, CarView, AviationView, ContactView, LegalViews (take `locale`)
src/pages/ + src/pages/en/  # thin route files that render the views
src/pages/api/contact.ts    # form endpoint (on-demand)
public/                     # favicons, robots.txt, llms.txt, og/*.png
docs/                       # brand-guide.md, client-checklist.md, photo-shotlist.md, content-update-guide.md,
                            # image-brief.md (every image slot: aspect ratio, layer needs, AI prompt direction for Francesco)
src/scripts/parallax.ts     # GSAP/ScrollTrigger + Lenis setup, loaded only on the aviation page + Home interlude
tests/                      # Playwright smoke + axe
```

Pages are thin: DE and EN route files render the same `views/*` with a `locale` prop, so there's no duplicated markup.

### 3.3 Imagery pipeline (AI/stock now, real photos later)

- `media.yaml` holds every image slot: `id, file, aspect, alt_de, alt_en, source: ai|stock|client, license, credit`. Swapping in a real photo means replacing the file and changing `source`. No code changes.
- **Schema guardrail:** `BeforeAfter` and any "our work" context only accept `source: client`. AI/stock images are **mood only** and are never presented as Paintfix's own work (UWG § 5 misleading-advertising risk). The Impressum image credits list stock sources and note the AI illustrations.
- Art direction for AI/stock images:
  - **Aviation, in Liberty's look:**
    - Golden-hour skies above the clouds (warm amber against deep navy).
    - Cabins with cream leather and wood veneer.
    - Desaturated hangar and ramp scenes.
    - Polished-aluminium and gloved-hand detail macros.
  - **Aviation parallax assets are made as layers:** a sky plate, an aircraft cut-out with alpha, and 3–4 transparent cloud layers. Generate the aircraft on a neutral background, then cut it out.
  - **No visible registrations, airline liveries or manufacturer badges**, and no stock faces implied to be staff. Lifestyle shots (a passenger in the cabin, as on Liberty) are allowed as clear mood images.
  - Automotive: daylight studio, neutral grey, crisp reflections, **everyday cars included**, detail macros.
  - Consistent grading per world: warm/navy for aviation, neutral daylight for automotive.
- Client shot list (`docs/photo-shotlist.md`, sent on day 1): before/after from the same angle, process macros, products on the shelf, owner portrait, equipment/van, workshop. Aviation: **arrange one real documented GA job at EDLT Telgte ASAP** (for example discounted in exchange for photo rights). That turns "no references" into "one real case".

### 3.4 SEO / GEO / AEO

- Titles and descriptions per page and locale; canonical tags; `hreflang`; `@astrojs/sitemap` (i18n); robots.txt; one designed OG image per theme.
- **JSON-LD:** `Organization` (Paintfix) with `department` → Paintfix Aviation · `AutomotiveBusiness`/`LocalBusiness` (NAP, geo, hours, `areaServed`) · `Service` + `Offer`/`PriceSpecification` (`minPrice` for the "ab"-prices) · `Service` for aviation (no price) · `FAQPage` · `BreadcrumbList` · `Person` (owner).
- Keyword map:
  - Car DE: Autoaufbereitung Telgte, Fahrzeugaufbereitung Münster, Keramikversiegelung Münster, Innenreinigung Auto Telgte/Warendorf, Aufbereitung Leasingrückgabe.
  - Aviation DE: Flugzeugaufbereitung NRW, Flugzeugreinigung, Flugzeugpolitur, Brightwork-Politur.
  - Aviation EN: aircraft detailing Germany, business jet detailing, aircraft brightwork polishing, private jet cleaning Münster/Osnabrück.
- GEO/AEO: entity sentence on Home and in the footer; fact-dense leads (prices, durations, product grades); FAQ answers of 40–60 words; question-form H2s; `llms.txt`; identical NAP everywhere.

### 3.5 Quality budgets

- LCP < 2.0 s on car pages and < 2.5 s on the aviation page (mobile 4G); CLS < 0.05; INP < 200 ms.
- JavaScript: car pages ≤ 30 KB gz. Aviation page ≤ 70 KB gz (GSAP + ScrollTrigger + Lenis ≈ 45 KB).
- The aviation LCP element is the sky plate (AVIF, ≈ 150 KB, preloaded). The aircraft and cloud layers decode after it.
- Parallax scrolling holds ~60 fps on a mid-range Android: no long tasks > 50 ms while scrolling, transforms only.
- Lighthouse ≥ 95 on Perf/A11y/SEO/BP (aviation Perf ≥ 90).
- WCAG 2.2 AA, including body text ≥ 16 px (Liberty's tiny grey text is exactly what we avoid).

---

## 4. Off-site Deliverables (Francesco / client)

- **Domain & mail (IONOS):**
  - DNS: apex `A` → Vercel, `www` `CNAME` → Vercel (use the values shown in the Vercel dashboard); keep the IONOS MX records.
  - SPF `include:_spf-eu.ionos.com`, DKIM on, DMARC `p=none` → `quarantine` after 2–4 weeks.
  - Mailboxes/aliases: `info@`, `aviation@`, owner. Email signatures for both brands. Target mail-tester score ≥ 9/10.
- **Vercel:** Hobby is **non-commercial only**, so the site goes on a **Pro** team (e.g. Chatifa's team). This is a running cost outside the offer; tell the client. Client review happens on preview URLs, which vercel.app serves as noindex.
- **Google Business Profile (new setup):**
  - **One** profile "Paintfix" (a second profile for a sub-brand at the same address breaks the guidelines and risks suspension).
  - Primary category Autoaufbereitung; aviation listed under services. Service-area business if customers don't visit Marshallstraße 34 (it's a residential new build).
  - Website link points to `/fahrzeugaufbereitung` (with UTM), so local car searchers land in the car world.
  - Photos, services with prices, a first post, a review QR card/link for the client.
- **Directories (consistent NAP sheet):**
  - Automotive/local: Bing Places, Apple Business Connect, Gelbe Seiten / Das Örtliche / Das Telefonbuch, 11880, Cylex, Yelp, meinestadt.de, werkenntdenBESTEN, Facebook/Instagram.
  - Aviation: LinkedIn company or showcase page "Paintfix Aviation" (key for B2B), globalair.com services directory.

---

## 5. Timeline (~14 working days, starting 30.09.2026)

| Days      | Phase                    | Output                                                                                                                                                                                                                                                                     | Owner                                                      |
| --------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1–2       | **0 Kickoff & checks**   | 90-min content workshop (checklist §6), access to IONOS/GBP, **trademark check "Paintfix"** (DPMA/EUIPO), Gewerbe/insurance confirmation, repo scaffold                                                                                                                    | Francesco + client; Claude scaffold                        |
| 2–4       | **1 Strategy & brand**   | Positioning & messaging doc, sitemap, logo directions → final, token set for both themes                                                                                                                                                                                   | Claude drafts / Francesco decides                          |
| 3–7       | **2 Design in code**     | Image brief handed to Francesco on day 3 (the parallax layers are on the critical path). Home diptych, car page and aviation page (hero parallax first) as a live **Vercel preview**, reviewed side by side with the Liberty screenshots. Client feedback ≤ 3 working days | Claude builds, Francesco makes the imagery, client reviews |
| 5–11      | **3 Build**              | All components, pages DE/EN, forms, SEO/schema, legal pages, analytics                                                                                                                                                                                                     | Claude                                                     |
| 3–10      | **4 Content** (parallel) | DE copy (Chatifa copy rules), native-quality EN (aviation terminology), prices YAML, AI/stock imagery per art direction                                                                                                                                                    | Claude drafts, Francesco imagery, client facts             |
| 11–13     | **5 QA & launch**        | Test matrix (§7), DNS cut-over, SSL, Search Console/Bing, sitemap submitted                                                                                                                                                                                                | Claude + Francesco                                         |
| 12–14     | **6 Local presence**     | GBP set up & verification started, directory listings, LinkedIn page                                                                                                                                                                                                       | Francesco                                                  |
| Weeks 3–8 | **Post-launch**          | Swap in real photos as they arrive, publish before/after, collect reviews, 30-day SEO check, handover pack                                                                                                                                                                 | Francesco / Claude                                         |

**Handover pack:** live site + repo · brand mini-guide (logos, colours, fonts, do/don't for both worlds) · email signatures · GBP & directory logins sheet · NAP sheet · shot list · content-update guide (how to change prices) · review QR card.

---

## 6. Client Inputs Required (kickoff checklist → `docs/client-checklist.md`)

- **Business/legal:** legal form & full name (Impressum), USt-ID or small-business status, **does the Gewerbe activity text cover aircraft?** (if not, a quick Gewerbe-Ummeldung; confirm with Gewerbeamt Telgte / IHK Nord Westfalen), liability insurance covering aircraft work (amount), where work happens (workshop? mobile? at the client's site?), hours, phone/WhatsApp, service area, **domain name**.
- **Automotive:** packages with "ab"-prices, durations, vehicle-class surcharges, add-ons, exact CarPro products, **CQuartz accredited-installer status** (only then use CarPro logos or the "certified" claim), coating warranty terms, pick-up service, payment methods.
- **Aviation:** aircraft categories (piston/turboprop/jets/helicopters), service list, base and radius, airside access (ZÜP / airport ID at FMO?), hangar access, capacity/team, response time, documentation practice, **exact Aero-Sense product names** (so we cite correct specs), NUVITE grades used besides G6/S, water and equipment (dry wash / de-ionised water), any real jobs so far (even anonymised).
- **Brand:** existing logo/colours, sub-brand approval, social accounts.

---

## 7. Risks & Mitigations

| #   | Risk                                                                                        | Mitigation                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | No aviation references, so a credibility gap                                                | Specificity instead of claims (products, grades, process, insurance, SLAs); get one real GA job documented at EDLT early; never fabricate |
| R2  | **Name conflict with the "Paint Fix Pro" franchise** (nationwide paint repair/Aufbereitung) | Trademark search before the logo is final; wordmark visually distinct; decide with the client if there's a conflict                       |
| R3  | AI/stock images read as "fake" or misleading                                                | Mood-only use, schema guardrail, image credits, no registrations or logos, progressive real-photo swaps                                   |
| R4  | Product/OEM claims overstated                                                               | Quote only manufacturer datasheet specs; no "official partner" claim without confirmation; logos only with permission                     |
| R5  | 14-day timeline vs. content dependencies                                                    | Workshop on day 1, placeholders flagged in YAML, 3-day feedback rule (Mitwirkungspflicht in the offer)                                    |
| R6  | DSGVO                                                                                       | Self-hosted fonts, no Maps/YouTube embeds, cookieless analytics, Vercel DPA, form mail via IONOS                                          |
| R7  | Car visitors are put off by the aviation content                                            | GBP → car page, price anchors in the first viewport, everyday cars in imagery, 5-second test (below)                                      |

**Out of scope (possible follow-up offers):** online booking, per-city landing pages (Münster, Warendorf), **aviation capability one-pager PDF** for management companies (highly recommended for B2B outreach), blog, review management.

---

## 8. Verification (Definition of Done)

- `npm run build` and `astro check` pass with no errors or warnings; lint/format clean.
- **Playwright (preinstalled Chromium):** every DE/EN route returns 200; the language switch maps to the correct counterpart; `hreflang` pairs are reciprocal; both forms validate client- and server-side; no console errors; screenshots at 375/768/1440 for both themes; **@axe-core/playwright** reports 0 serious/critical issues.
- Lighthouse (mobile) on the Vercel preview meets the §3.5 budgets.
- Chrome DevTools performance trace of the aviation page (4× CPU throttle): parallax stays smooth with no long tasks while scrolling. With reduced motion emulated, the page is fully static and readable. iOS Safari is checked on a real device.
- Side-by-side design review against the Liberty screenshots: the same premium level, with none of the listed weaknesses (slider, multi-coloured icons, low-contrast text).
- JSON-LD passes the Schema.org validator and Google Rich Results Test; the sitemap lists all 12 URLs.
- A form submission arrives in the IONOS mailbox and the auto-reply is received; mail-tester ≥ 9/10; SPF/DKIM/DMARC pass.
- Post-DNS: HTTPS on apex and www, one canonical host, 404 page works, preview deployments noindex.
- **Caveat test (5-second test, 2–3 people per persona):**
  - Car owner: "What does an interior cleaning cost here? Is this for you?" They must find a price in ≤ 10 s and say "yes".
  - Aviation manager: "Would you let them work on a Citation?" They must name ≥ 2 concrete trust reasons and not mention "car wash".
- Legal: Impressum/Datenschutz complete, image credits present, trademark notice present, no third-party requests before consent (checked in the DevTools network tab).
