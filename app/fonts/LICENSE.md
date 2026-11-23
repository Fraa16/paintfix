# Schriften

Alle drei Schriften stehen unter der SIL Open Font License 1.1 und werden selbst gehostet (keine Anfragen an Google).

| Datei                                | Schrift                                                                                         | Quelle                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `mona-sans-latin-wdth-normal.woff2`  | Mona Sans, variabel (wght 200–900, wdth 100–125), Latin-Subset, geänderte Fassung (siehe unten) | github.com/github/mona-sans über `@fontsource-variable/mona-sans` 5.3.0          |
| `instrument-serif-latin-400-*.woff2` | Instrument Serif, Normal und Kursiv, Latin-Subset                                               | github.com/Instrument/instrument-serif über `@fontsource/instrument-serif` 5.3.0 |
| `geist-mono-latin-wght-normal.woff2` | Geist Mono, variabel (wght 100–900), Latin-Subset                                               | github.com/vercel/geist-font über `@fontsource-variable/geist-mono` 5.3.0        |

Copyright 2022 The Mona Sans Project Authors. Copyright 2022 The Instrument Serif Project Authors. Copyright 2024 The Geist Project Authors.

**Änderung an Mona Sans (17.11.2026):** Die Breitenachse ist mit fontTools (`varLib.instancer`) auf 100–125 % begrenzt, weil die Website nichts Schmaleres nutzt (98 → 71 KB, Glyphen, Zeichen und Darstellung im genutzten Bereich unverändert). Weil die Lizenz den Namen „Mona“ reserviert (Reserved Font Name), heißt die geänderte Fassung intern „PF Sans“; Copyright- und Lizenzhinweis in der Datei bleiben. Auf der Website vergibt next/font den Schriftnamen ohnehin selbst.
