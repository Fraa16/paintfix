import data from "./aviation.json";

/**
 * Aviation-Texte DE/EN aus design/handoff/content/aviation.json (Kopie in content/aviation.json).
 * Die Schlüssel sind in README 8.4 beschrieben. Nachweise, Bericht, Flughäfen, Flotte, Vertragsmodelle
 * und Richtwerte sind Platzhalter, bis Paintfix sie bestätigt (README 3).
 */

export type Locale = "de" | "en";
export type AviationCopy = (typeof data)["de"];

export const aviation: Record<Locale, AviationCopy> = data;

/** Anker der Aviation-Seite in der Reihenfolge von nav/secs (README 8.4). */
export const aviationSectionIds = [
  "av-services",
  "av-process",
  "av-standards",
  "av-fleet",
  "av-terms",
  "av-contact",
] as const;

export const aviationPath: Record<Locale, string> = { de: "/aviation", en: "/en/aviation" };
