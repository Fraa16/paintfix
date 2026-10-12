import { aviation, type Locale } from "@/content/aviation";

/**
 * Richtwerte für das Aviation-Angebot (README 10.2, Referenz v3vals Zeilen 1407–1418).
 * Reine Funktionen ohne Zustand: Muster → Faktor f, daraus Dauer und Team je Leistung und die Bodenzeit.
 */

/** Leistungen in der Reihenfolge von `tabs`: 0 Außen, 1 Kabine, 2 Schutz. */
export type AvService = 0 | 1 | 2;
export const avServices: readonly AvService[] = [0, 1, 2];

export interface AircraftType {
  name: string;
  factor: number;
}

export interface AircraftGroup {
  group: string;
  items: AircraftType[];
}

export interface EstimateRow {
  service: AvService;
  /** Name der Leistung (`tabs[i]`). */
  label: string;
  /** z. B. „ca. 4,5 Std.“ */
  duration: string;
  /** z. B. „3 Techniker“ */
  crew: string;
}

export interface Estimate {
  /** Gewähltes Muster, erscheint rechts neben `est.label`. */
  type: string;
  rows: EstimateRow[];
  /** Bodenzeit, z. B. „ca. 5 Std.“ */
  ground: string;
  /** Hinweise `est.parallel` bzw. `est.hangar`. */
  notes: string[];
}

/** Muster gruppiert nach Klasse, aus `types` ([Name, Faktor]). */
export function aircraftGroups(locale: Locale): AircraftGroup[] {
  return aviation[locale].types.map((g) => ({
    group: g.g,
    items: g.items.map(([name, factor]) => ({ name: String(name), factor: Number(factor) })),
  }));
}

/** Faktor f des Musters, 0 für unbekannte Muster und „Anderes Muster“. */
export function aircraftFactor(name: string, locale: Locale): number {
  for (const g of aircraftGroups(locale)) {
    for (const t of g.items) if (t.name === name) return t.factor;
  }
  return 0;
}

/** r(x): auf 0.5 runden. */
export function roundHalf(h: number): number {
  return Math.round(h * 2) / 2;
}

/** Dezimalkomma auf Deutsch, Punkt auf Englisch („4,5“ / „4.5“). */
export function formatHalf(h: number, locale: Locale): string {
  const s = String(roundHalf(h));
  return locale === "de" ? s.replace(".", ",") : s;
}

/**
 * Richtwerte für Muster `type` und die gewählten Leistungen. `null`, wenn das Muster keinen Faktor hat
 * oder keine Leistung gewählt ist; dann zeigt die Box `est.empty`.
 *
 *   Außen:  r(3 × f) Std.,           Techniker f ≥ 1.8 → 4, f ≥ 1.3 → 3, sonst 2
 *   Kabine: r(2.5 × f) Std.,         Techniker f ≥ 1.8 → 3, sonst 2
 *   Schutz: max(1, r(2 × f)) Tage,   Techniker f ≥ 1.8 → 4, sonst 3
 *   Bodenzeit: Schutz → Schutz-Dauer + est.hangar; Außen + Kabine → r(max + 0.5) Std. + est.parallel;
 *              sonst die Dauer der gewählten Leistung.
 */
export function estimate({
  locale,
  type,
  services,
}: {
  locale: Locale;
  type: string;
  services: readonly AvService[];
}): Estimate | null {
  const f = aircraftFactor(type, locale);
  const sel = avServices.filter((i) => services.includes(i));
  if (!f || sel.length === 0) return null;

  const { est, tabs } = aviation[locale];
  const fmt = (h: number) => formatHalf(h, locale);
  const ext = roundHalf(3 * f);
  const cab = roundHalf(2.5 * f);
  const days = Math.max(1, roundHalf(2 * f));
  const crew = [f >= 1.8 ? 4 : f >= 1.3 ? 3 : 2, f >= 1.8 ? 3 : 2, f >= 1.8 ? 4 : 3];
  const duration = [
    `${est.approx} ${fmt(ext)} ${est.h}`,
    `${est.approx} ${fmt(cab)} ${est.h}`,
    `${est.approx} ${fmt(days)} ${est.d}`,
  ];

  const rows = sel.map((i) => ({
    service: i,
    label: tabs[i] ?? "",
    duration: duration[i],
    crew: `${crew[i]} ${est.crew}`,
  }));

  let ground: string;
  const notes: string[] = [];
  if (sel.includes(2)) {
    ground = duration[2];
    notes.push(est.hangar);
  } else if (sel.includes(0) && sel.includes(1)) {
    ground = `${est.approx} ${fmt(Math.max(ext, cab) + 0.5)} ${est.h}`;
    notes.push(est.parallel);
  } else {
    ground = duration[sel[0]];
  }

  return { type, rows, ground, notes };
}
