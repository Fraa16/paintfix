# Paintfix Website

Website für **Paintfix** (Fahrzeugaufbereitung, Telgte bei Münster) und **Paintfix Aviation** (Business Aviation). Zwei klar getrennte Auftritte unter einem Dach, nach dem Prinzip Mercedes-Benz und Maybach.

|             | Paintfix                      | Paintfix Aviation                      |
| ----------- | ----------------------------- | -------------------------------------- |
| Wirkung     | hell, direkt, Preise sichtbar | dunkel, ruhig, Konditionen auf Anfrage |
| Farben      | Weiß, Schwarz, Signalrot      | Navy, Creme, Gold                      |
| Überschrift | Mona Sans 700, Breite 125 %   | Cinzel 400                             |
| Sprache     | Deutsch                       | Deutsch und Englisch                   |

Die verbindliche Design-Quelle ist der Handoff in [`design/handoff/`](design/handoff/README.md). Regeln für die Arbeit am Code stehen in [`CLAUDE.md`](CLAUDE.md).

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · next/font (Mona Sans, Cinzel, selbst gehostet) · Vercel

## Befehle

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # Produktions-Build
npm run lint
npm run typecheck
npm run format
```

Referenz-Prototyp ansehen: `npx serve design/handoff/reference`, dann `http://localhost:3000/Paintfix%20Website%20v4.dc.html` (Direktaufrufe in `design/handoff/README.md`, Abschnitt 2).

## Seiten

| Route                                | Inhalt                                                               |
| ------------------------------------ | -------------------------------------------------------------------- |
| `/`                                  | Startseite Fahrzeug                                                  |
| `/leistungen`                        | Leistungen und Preise je Fahrzeugklasse                              |
| `/anfrage`                           | Termin anfragen, Vorbelegung per `?leistungen=aussen,innen&klasse=1` |
| `/aviation`, `/en/aviation`          | Paintfix Aviation (DE/EN)                                            |
| `/impressum`, `/datenschutz`, `/agb` | Pflichtseiten (Inhalte folgen)                                       |

## Inhalte ändern

| Was                                      | Wo                                   |
| ---------------------------------------- | ------------------------------------ |
| Preise, Leistungen, Klassen, Extras, FAQ | `content/fahrzeug.json`              |
| Aviation-Texte DE/EN, Muster, Richtwerte | `content/aviation.json`              |
| Adresse, Telefon, E-Mail, Öffnungszeiten | `content/site.ts`                    |
| Fotos                                    | `assets/img/` und `content/media.ts` |
| Farben, Größen, Abstände                 | `app/styles/tokens.css`              |

Alle Fotos sind Pexels-Platzhalter und werden durch ein eigenes Shooting ersetzt. Preise, Kontaktdaten, Nachweise und Flughäfen sind Platzhalter, bis Paintfix sie bestätigt (`design/handoff/README.md`, Abschnitt 3).

## Stand

Umsetzung in Phasen nach `design/handoff/README.md`, Abschnitt 14:

1. Setup: erledigt
2. Statische Seiten mit allen UI-Zuständen: erledigt
3. Formulare und Versand: offen (Entscheidung Resend oder IONOS SMTP steht aus)
4. Bewegung (Reveals, Parallaxe, Curtain, Scroll-Szenen, Lenis): offen
5. Englisch für Aviation: Seite steht, Feinschliff mit Phase 6
6. SEO, Recht, Analytics, Performance: offen
7. Echte Fotos und Inhalte, Abnahme, Launch: offen
