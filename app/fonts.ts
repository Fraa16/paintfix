import localFont from "next/font/local";

/** Mona Sans: Text beider Marken und Fahrzeug-Überschriften (font-stretch 125 %). */
export const mona = localFont({
  src: "./fonts/mona-sans-latin-wdth-normal.woff2",
  variable: "--font-mona-face",
  weight: "200 900",
  display: "swap",
  // Without this descriptor the browser clamps font-stretch to 100 % and ignores the wdth axis.
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});

/** Cinzel: Aviation-Überschriften, Wortmarke, Ziffern. Nur Gewicht 400, nie kursiv. */
export const cinzel = localFont({
  src: "./fonts/cinzel-latin-wght-normal.woff2",
  variable: "--font-cinzel-face",
  weight: "400 900",
  display: "swap",
});
