# CLAUDE.md · PaintFix Website

@AGENTS.md

## Projekt

Website für PaintFix (Fahrzeugaufbereitung, Telgte) und PaintFix Aviation (Business Aviation). Zwei Marken, ein Repo.

Schreibweise im Text: „PaintFix“ (bestätigt 14.10.2026). Das Logo zeigt „PAINTFIX“ plus Bereich (Automotive, Aviation, später Marine), siehe `components/shared/BrandLogo.tsx`.

- Design-Quelle: `design/handoff/README.md` (verbindlich)
- Tokens: `design/handoff/tokens/tokens.css`, Produktionskopie in `app/styles/tokens.css`
- Inhalte: `design/handoff/content/*.json`, Produktionskopie in `content/` (typisiert)
- Referenz-Prototyp: `design/handoff/reference/` (mit `npx serve design/handoff/reference` öffnen, Seite „PaintFix Website v4.dc.html“). Bei Unklarheiten gilt die Referenz. Alle exakten Werte stehen als Inline-Styles in ihrem Quelltext.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · next/font/local (Mona Sans, Cinzel) · GSAP + ScrollTrigger · Lenis · Zod · Vercel

Formulare: Server Actions in `lib/forms/actions.ts`, Regeln in `lib/forms/rules.ts` (Browser und Server, ohne Zod), Zod nur auf dem Server (`lib/forms/schemas.ts`). Mailversand über die Resend-API (`lib/forms/mail.ts`, Umgebungsvariablen siehe `.env.example`); ohne Einrichtung meldet die Produktion einen Fehler mit Telefonnummer, nie einen Scheinerfolg. Spam-Schutz: Honeypot + Mindest-Ausfüllzeit (`components/shared/FormGuard.tsx`), kein Cloudflare Turnstile (Drittanbieter-Request, Regel 10).

Next.js 16 weicht von älteren Versionen ab. Vor neuen APIs die Doku in `node_modules/next/dist/docs/` lesen.

## Befehle

`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` · `npm run format`

## Struktur

- `app/(de)/layout.tsx` Root-Layout `<html lang="de">`, `app/(en)/layout.tsx` Root-Layout `<html lang="en">` (zwei Root-Layouts, damit `lang` stimmt; Wechsel zwischen ihnen lädt die Seite neu)
- `app/(de)/(fahrzeug)/` mit eigenem Layout (Header, Footer, Aktionsleiste): `/`, `/leistungen`, `/anfrage`, `/impressum`, `/datenschutz`, `/agb`
- `app/(de)/aviation/` und `app/(en)/en/aviation/` mit eigenem Layout (`components/aviation/AviationShell.tsx`), Seite aus `components/aviation/AviationPage.tsx`
- `app/global-not-found.tsx` 404 für beide Root-Layouts
- `components/fahrzeug`, `components/aviation`, `components/shared` (Action, OpeningStatus, SkipLink; `motion/` Boot-Skript, Reveals, Scroll-Takt; `curtain/` Markenwechsel)
- `content/` Inhalte (`fahrzeug.ts`, `aviation.ts`, `site.ts`), Bildregister `media.ts`; `aviation-meta.ts` enthält Aviation-Daten ohne Texte (Anker, Karte, Musterbericht) für Client-Komponenten
- `lib/` Hilfsfunktionen (Preisformat, Öffnungsstatus, Preislogik, `forms/`, `structured-data.ts` für JSON-LD)
- Icons, Share-Bilder, `sitemap.ts`, `robots.ts` als Metadaten-Dateien in `app/` (Aviation mit eigenen Icons und Share-Bildern in seinen Segmenten)
- `assets/img/` Fotos (derzeit Pexels-Platzhalter)

## Designregeln

1. Nur Tokens verwenden. Keine neuen Farben, Schriften oder Schatten erfinden. Fehlt ein Wert der Referenz, kommt er als Token in `app/styles/tokens.css` (Abschnitt „Ergänzungen aus der Referenz“) und wird in `app/globals.css` gespiegelt.
2. Schriften nur über next/font (selbst gehostet, `app/fonts.ts`). Keine Links zu fonts.googleapis.com.
3. Fahrzeug-Überschriften: Mona Sans 700, `font-stretch: 125%`. Aviation-Überschriften: Cinzel 400, nie kursiv.
4. `border-radius: 0` überall. Ausnahmen (50 %): Status-Punkt, Regler-Griff, Stempel, Kartenpunkte.
5. Marken getrennt halten: Signalrot nie auf Aviation-Seiten (außer im Curtain Richtung Fahrzeug). Navy und Cinzel auf Fahrzeugseiten nur im Aviation-Band, im Curtain und in Links zu Aviation.
6. Texte wörtlich aus `content/` bzw. README übernehmen. Preise im Format „ab 89 €“ (geschütztes Leerzeichen vor €, `lib/format.ts`). PaintFix ist Kleinunternehmer: Preise sind Endpreise, nie „inkl. MwSt.“, sondern Hinweis `site.vatNote` (§ 19 UStG). Aviation zeigt keine Preise.
7. Jede Animation respektiert `prefers-reduced-motion`. Lenis nur auf Aviation, nur ab 980 px und nicht bei Touch-Eingabe.
8. Kein horizontales Scrollen von 360 bis 1920 px. Abschnitte mit überstehenden transformierten Elementen bekommen `overflow-x: clip` (nicht `hidden`, sonst bricht `position: sticky`).
9. Barrierefreiheit: sichtbarer Fokus, Tastaturbedienung (auch Vorher/Nachher-Regler), Alt-Texte, Textkontrast mindestens 4,5:1. Interaktive Elemente sind `<button>` oder Links, nie klickbare `<div>`.
10. DSGVO: keine Drittanbieter-Requests ohne Einwilligung. Formulare mit Einwilligungstext. Öffnungsstatus in Zeitzone Europe/Berlin berechnen.
11. Platzhalter ehrlich halten: Stock-Fotos nie als eigene Arbeit ausgeben (UWG § 5). Unbestätigte Fakten (Preise, Kontakt, Nachweise, Flughäfen) stehen zentral in `content/` und sind dort als Platzhalter kommentiert, nie verstreut im Code.

## Tailwind-Konventionen

- Tokens als Utilities: `bg-car-ink`, `text-car-muted`, `border-car-line`, `bg-av-navy`, `text-av-gold` usw. Transparenz über Modifier (`bg-av-navy/12` statt `rgba(13,26,44,.12)`).
- Typo-Rollen: `text-car-hero`, `text-car-h2`, `text-av-hero`, `text-av-h2` usw. Schriften: `font-sans`, `font-cinzel`. Breite: `font-stretch-125%`.
- Layout: `max-w-car`/`max-w-av`, `px-car-gutter`/`px-av-gutter`, `py-car-section`/`py-av-section`.
- Breakpoints nur `wide:` (980 px), `sec:` (1200 px), `avnav:` (1240 px), jeweils auch `max-wide:` usw. Tailwinds `sm/md/lg/xl` sind abgeschaltet.
- Schatten und Kurven direkt über die Token-Variablen: `shadow-(--shadow-float)`, `ease-(--ease-mask)`.
- Fokus: `:focus-visible` nutzt `--focus`. Auf dunklen Flächen `[--focus:var(--car-on-ink)]` bzw. `[--focus:var(--av-gold)]` setzen.
- Gemeinsame Bausteine nutzen: `CarButton`, `CarTextLink`, `CarOverline`, `CarLogo`, `CarH2`, `CarBreadcrumb`, `CarFacts`, `CarAviationLink` (einziger Navy/Cinzel-Link auf Fahrzeugseiten), `AvButton`, `AvTextLink`, `AvOverline`, `AvLogo`, `Action`, `OpeningStatus`/`LiveDot`, `SkipLink`. Bilder über `next/image` mit Einträgen aus `content/media.ts`.

## Fallstricke (Next.js 16)

- Next hält besuchte Seiten versteckt im DOM (`<Activity>`, display: none). Deshalb keine seitenabhängigen Stile über `html:has(…)`: versteckte Seiten würden mitzählen. Werte am `<html>` per Effekt setzen (`useRootVar` in `components/shared/root-scroll.ts`); React räumt Effekte versteckter Seiten auf.
- Feste und klebende Leisten melden ihre Höhe für `scroll-padding` (`--pf-header-h`, `--pf-sticky-h`, `--pf-bar-car`, `--pf-bar-av`), damit Anker und Tastaturfokus nie dahinter landen (WCAG 2.4.11).
- Client-Komponenten importieren nie `content/aviation.ts` (zieht beide Sprachen ins Bundle). Texte kommen als Props von der Server-Komponente, Daten aus `content/aviation-meta.ts`; Typen per `import type`.
- Reveals: Attribute `data-rv`/`data-rvs`/`data-rvm`/`data-rvc`/`data-stamp` (Wert = Verzögerung in ms) genügen, auch in Server-Komponenten. Nicht auf Elemente mit eigenen translate/scale/rotate/opacity/clip-path-Utilities setzen und nicht auf Anker-Ziele (Wrapper verwenden). Sichtbare Reveals startet `motion/early.ts` vor der Hydration (nur Produktion), den Rest `motion/Reveals.tsx`.
- `useSearchParams` nur in `<Suspense>`. Der Fallback zeigt nie einen Zustand, der falsch sein kann (z. B. Preise), sondern einen neutralen Platzhalter.

## Stand

- Phase 1 + 2 (Setup, statische Seiten mit UI-Zuständen): umgesetzt
- Phase 4 (Bewegung: Reveals, Parallaxe, Curtain, Scroll-Szenen, Lenis): umgesetzt
- Phase 3 (Formular-Versand): umgesetzt, Resend-Konto und Postfächer noch einzurichten
- Phase 6: SEO-Grundlagen umgesetzt (Icons, Share-Bilder, Sitemap, robots, Canonicals, hreflang, JSON-LD); Recht und Analytics offen
- Phase 7 (echte Fotos, Launch): offen

## Vor jedem PR

- Build, Lint und Typecheck grün
- Geprüft bei 360, 402, 980, 1440 und 1920 px
- Lighthouse Performance und Accessibility mindestens 90
