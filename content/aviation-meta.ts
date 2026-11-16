/**
 * Aviation-Daten ohne Texte: Anker, Pfade, Karte, Musterbericht. Bewusst ohne aviation.json, damit
 * Client-Komponenten diese Werte importieren können, ohne beide Sprachen ins Browser-Bundle zu ziehen.
 * Texte bekommen Client-Komponenten als Props von ihrer Server-Komponente (nur die aktuelle Sprache).
 */

export type Locale = "de" | "en";

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

/**
 * Einsatzradius-Karte (README 8.4 Punkt 8), in derselben Reihenfolge wie `bases` in aviation.json.
 * Platzhalter: Flughäfen, Status und Entfernungen bestätigt PaintFix vor dem Launch (README 3).
 * Positionen in % der Karte (links, oben) nach echten Koordinaten, Mittelpunkt EDDG.
 */
export interface BaseOnMap {
  icao: string;
  /** Ortsname auf der Karte (kurz, in beiden Sprachen gleich). */
  mapLabel: string;
  pos: readonly [left: number, top: number];
  /** Entfernung ab EDDG, leer für EDDG selbst. */
  km: string;
  /** Gestrichelte Linie ab EDDG: Länge in % der Kartenbreite und Winkel in Grad. */
  line: readonly [length: number, angle: number] | null;
  labelSide: "left" | "right";
}

export const baseMap: readonly BaseOnMap[] = [
  {
    icao: "EDDG",
    mapLabel: "Münster/Osnabrück",
    pos: [50, 30.51],
    km: "",
    line: null,
    labelSide: "right",
  },
  {
    icao: "EDLP",
    mapLabel: "Paderborn",
    pos: [74.5, 55.04],
    km: "86 km",
    line: [33.11, 42.27],
    labelSide: "right",
  },
  {
    icao: "EDLW",
    mapLabel: "Dortmund",
    pos: [48.12, 59.53],
    km: "69 km",
    line: [26.41, 94.09],
    labelSide: "left",
  },
  {
    icao: "EDDL",
    mapLabel: "Düsseldorf",
    pos: [25.88, 70.34],
    km: "113 km",
    line: [43.46, 123.71],
    labelSide: "right",
  },
  {
    icao: "EDDK",
    mapLabel: "Köln/Bonn",
    pos: [35.77, 90.3],
    km: "146 km",
    line: [56.1, 104.69],
    labelSide: "right",
  },
];

/** Firmensitz Telgte auf der Karte (Referenz: 52.65 % / 37.75 %). */
export const seatOnMap = { pos: [52.65, 37.75] as const };

/**
 * Musterbericht im Abschnitt Standards (README 3): Unterschrift und Stempeldatum. Platzhalter wie
 * Nummer und Kennzeichen in aviation.json (rep). Name und Kennzeichen müssen erkennbar fiktiv sein
 * oder durch einen echten, freigegebenen Bericht ersetzt werden.
 */
export const sampleReport = { signer: "M. Becker", date: "14.10.2026" } as const;

/**
 * Seiten je Leistungsbereich (Auftrag 04.11.2026, lokale Suche), in der Reihenfolge von `tabs`.
 * Slugs je Sprache; die Texte stehen in aviation-pages.ts (nur Server).
 */
export type AvPageId = "exterior" | "cabin" | "protection";

export interface AvPageMeta {
  id: AvPageId;
  /** Index in tabs/svc von aviation.json und Leistung im Angebotsformular. */
  tab: 0 | 1 | 2;
  slug: Record<Locale, string>;
}

export const aviationPageMeta: readonly AvPageMeta[] = [
  { id: "exterior", tab: 0, slug: { de: "aussenpflege", en: "exterior-care" } },
  { id: "cabin", tab: 1, slug: { de: "kabinenpflege", en: "cabin-care" } },
  { id: "protection", tab: 2, slug: { de: "oberflaechenschutz", en: "surface-protection" } },
];

export function aviationPagePath(id: AvPageId, locale: Locale): string {
  const meta = aviationPageMeta.find((p) => p.id === id)!;
  return `${aviationPath[locale]}/${meta.slug[locale]}`;
}

/** Dieselbe Aviation-Seite in der Sprache `to` (Sprachumschalter); sonst die Aviation-Startseite. */
export function aviationAlternatePath(pathname: string, to: Locale): string {
  for (const p of aviationPageMeta) {
    for (const l of ["de", "en"] as const) {
      if (pathname === aviationPagePath(p.id, l)) return aviationPagePath(p.id, to);
    }
  }
  return aviationPath[to];
}

/** true auf /aviation und /en/aviation (nicht auf den Seiten je Bereich). */
export function isAviationHome(pathname: string): boolean {
  return pathname === aviationPath.de || pathname === aviationPath.en;
}
