import data from "./fahrzeug.json";
import type { MediaId } from "./media";

/**
 * Fahrzeug-Inhalte aus design/handoff/content/fahrzeug.json (Kopie in content/fahrzeug.json).
 * Preise sind Platzhalter, bis PaintFix sie bestätigt (README 3).
 *
 * Schwerpunkte (Kundenwunsch 14.10.2026): Smart Repair, Lackkorrektur, Leasingrückgabe und
 * hochwertige Aufbereitung stehen auf der Startseite vorn (`focus`). Smart Repair und
 * Leasingrückgabe (`inspect`) haben noch keinen bestätigten Umfang und keine Preise: Texte und
 * Leistungslisten sind Platzhalter, bis PaintFix sie bestätigt; der Preis heißt „nach Begutachtung“.
 */

export type ServiceId = "aussen" | "innen" | "politur" | "keramik";

/** Index in den Preis-Arrays: 0 Kleinwagen, 1 Limousine & Kombi, 2 SUV & Van. */
export type VehicleClassIndex = 0 | 1 | 2;

export interface Service {
  id: ServiceId;
  /** Nummer „01“ bis „04“ */
  no: string;
  name: string;
  short: string;
  dur: string;
  /** Preise je Fahrzeugklasse in Euro, Endpreise (Kleinunternehmer, § 19 UStG). */
  p: [number, number, number];
  desc: string;
  incl: string[];
  /** Bild der Leistungsseite, Pfad wie in der Referenz („img/car-….jpg“). Auflösen mit mediaByRefPath(). */
  img2: string;
}

export interface VehicleClass {
  label: string;
  /** Beispiel, z. B. „z. B. VW Polo, Mini“ */
  ex: string;
}

export interface Extra {
  name: string;
  /** Fertig formatiert, z. B. „ab 29 €“ */
  price: string;
}

/** Leistung mit Preis nach Begutachtung (Smart Repair, Leasingrückgabe). */
export type InspectId = "smart-repair" | "leasing";

export interface InspectService {
  id: InspectId;
  name: string;
  short: string;
  dur: string;
  desc: string;
  incl: string[];
  media: MediaId;
}

/** Schwerpunkt der Startseite. `id` ist zugleich der Anker auf /leistungen (#svc-{id}). */
export interface FocusArea {
  id: ServiceId | InspectId;
  name: string;
  short: string;
  /** Leistung, deren Kleinwagenpreis „ab …“ zeigt; null = „nach Begutachtung“. */
  price: ServiceId | null;
}

/** Text an Stelle des Preises für Leistungen nach Begutachtung. */
export const INSPECT_PRICE = "nach Begutachtung";

export interface FaqEntry {
  q: string;
  a: string;
}

export const services = data.services as Service[];
export const vehicleClasses = data.vehicleClasses as [VehicleClass, VehicleClass, VehicleClass];
/** Komplettaufbereitung (außen + innen) je Fahrzeugklasse. */
export const comboPrice = data.comboPrice as [number, number, number];
/** Preise mit geschütztem Leerzeichen vor dem Euro-Zeichen (CLAUDE.md, Regel 6). */
export const extras = (data.extras as Extra[]).map((x) => ({
  ...x,
  price: x.price.replace(/ €/g, "\u00A0€"),
}));
export const faq = data.faq as FaqEntry[];
export const inspectServices = data.inspect as InspectService[];
/** Schwarzes Band zur Leasingrückgabe auf der Startseite (Kundenwunsch 14.10.2026). */
export const leasingBand = data.leasingBand as {
  label: string;
  title: string;
  text: string;
  steps: { t: string; d: string }[];
  cta: string;
  more: string;
};
export const focusAreas = data.focus as FocusArea[];

export function isInspectId(id: string): id is InspectId {
  return inspectServices.some((s) => s.id === id);
}

export function serviceById(id: ServiceId): Service {
  const s = services.find((x) => x.id === id);
  if (!s) throw new Error(`Unbekannte Leistung: ${id}`);
  return s;
}
