# CLAUDE.md · Paintfix Website

Diese Datei ins Root des Repos kopieren. Den Handoff-Ordner als `design/handoff/` ins Repo legen.

## Projekt
Website für Paintfix (Fahrzeugaufbereitung, Telgte) und Paintfix Aviation (Business Aviation). Zwei Marken, ein Repo.
- Design-Quelle: `design/handoff/README.md` (verbindlich)
- Tokens: `design/handoff/tokens/tokens.css`
- Inhalte: `design/handoff/content/*.json`
- Referenz-Prototyp: `design/handoff/reference/` (mit `npx serve design/handoff/reference` öffnen). Bei Unklarheiten gilt die Referenz.

## Stack
Next.js (App Router) · TypeScript · Tailwind CSS v4 · next/font (Mona Sans, Cinzel) · GSAP + ScrollTrigger · Lenis · Zod · Resend · Vercel

## Befehle
`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`

## Struktur
- `app/(fahrzeug)/page.tsx`, `app/(fahrzeug)/leistungen/`, `app/(fahrzeug)/anfrage/` mit eigenem Layout (Header, Footer)
- `app/aviation/` und `app/en/aviation/` mit eigenem Layout
- `app/api/` bzw. Server Actions für Formulare
- `components/fahrzeug`, `components/aviation`, `components/shared` (Reveal, Parallax, Curtain, Logo)
- `content/` (aus `design/handoff/content` übernommen, typisiert)

## Designregeln
1. Nur Tokens verwenden. Keine neuen Farben, Schriften oder Schatten erfinden.
2. Schriften nur über next/font (selbst gehostet). Keine Links zu fonts.googleapis.com.
3. Fahrzeug-Überschriften: Mona Sans 700, `font-stretch: 125%`. Aviation-Überschriften: Cinzel 400, nie kursiv.
4. `border-radius: 0` überall. Ausnahmen (50 %): Status-Punkt, Regler-Griff, Stempel, Kartenpunkte.
5. Marken getrennt halten: Signalrot nie auf Aviation-Seiten. Navy und Cinzel auf Fahrzeugseiten nur im Aviation-Band, im Curtain und in Links zu Aviation.
6. Texte wörtlich aus `content/` bzw. README übernehmen. Preise im Format „ab 89 €“ (geschütztes Leerzeichen vor €) mit „inkl. MwSt.“. Aviation zeigt keine Preise.
7. Jede Animation respektiert `prefers-reduced-motion`. Lenis nur auf Aviation, nur ab 980 px und nicht bei Touch-Eingabe.
8. Kein horizontales Scrollen von 360 bis 1920 px. Abschnitte mit überstehenden transformierten Elementen bekommen `overflow-x: clip` (nicht `hidden`, sonst bricht `position: sticky`).
9. Barrierefreiheit: sichtbarer Fokus, Tastaturbedienung (auch Vorher/Nachher-Regler), Alt-Texte, Textkontrast mindestens 4,5:1.
10. DSGVO: keine Drittanbieter-Requests ohne Einwilligung. Formulare mit Einwilligungstext. Öffnungsstatus in Zeitzone Europe/Berlin berechnen.

## Vor jedem PR
- Build, Lint und Typecheck grün
- Geprüft bei 360, 402, 980, 1440 und 1920 px
- Lighthouse Performance und Accessibility mindestens 90
