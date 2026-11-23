import localFont from "next/font/local";

/**
 * Mona Sans: Text beider Marken und Fahrzeug-Überschriften (font-stretch 125 %).
 * Breitenachse auf 100–125 % begrenzt (die Website nutzt 100, 106, 108, 110 und 125 %): 71 statt 98 KB,
 * gleiche Glyphen und Zeichen, gerendert pixelgleich zur vollen Datei. Schmaler als 100 % gibt es nicht.
 */
export const mona = localFont({
  src: "./fonts/mona-sans-latin-wdth-normal.woff2",
  variable: "--font-mona-face",
  weight: "200 900",
  display: "swap",
  // Without this descriptor the browser clamps font-stretch to 100 % and ignores the wdth axis.
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
});

/**
 * Instrument Serif: Aviation-Überschriften (Redesign 11/2026, ersetzt Cinzel)
 * (Überschriften, Zitate; Kursiv für Akzentwörter). Die Utility heißt weiter `font-serif`, damit die
 * Aviation-Komponenten unverändert bleiben (globals.css).
 */
export const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif-face",
  display: "swap",
});

/** Geist Mono für Daten und Etiketten (Preise, Dauer, Zeiten, ICAO), beide Marken. */
export const mono = localFont({
  src: "./fonts/geist-mono-latin-wght-normal.woff2",
  variable: "--font-mono-face",
  weight: "100 900",
  display: "swap",
});
