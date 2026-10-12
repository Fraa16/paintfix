import data from "./aviation.json";
import type { Locale } from "./aviation-meta";

/**
 * Aviation-Texte DE/EN aus design/handoff/content/aviation.json (Kopie in content/aviation.json).
 * Die Schlüssel sind in README 8.4 beschrieben. Nachweise, Bericht, Flughäfen, Flotte, Vertragsmodelle
 * und Richtwerte sind Platzhalter, bis Paintfix sie bestätigt (README 3).
 */

export type AviationCopy = (typeof data)["de"];

export const aviation: Record<Locale, AviationCopy> = data;

export * from "./aviation-meta";
