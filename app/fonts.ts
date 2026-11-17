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

/** Cinzel: Aviation-Überschriften, Wortmarke, Ziffern. Nur Gewicht 400, nie kursiv. */
export const cinzel = localFont({
  src: "./fonts/cinzel-latin-wght-normal.woff2",
  variable: "--font-cinzel-face",
  weight: "400 900",
  display: "swap",
});
