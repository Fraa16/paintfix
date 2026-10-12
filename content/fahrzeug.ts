import data from "./fahrzeug.json";

/**
 * Fahrzeug-Inhalte aus design/handoff/content/fahrzeug.json (Kopie in content/fahrzeug.json).
 * Preise sind Platzhalter, bis Paintfix sie bestätigt (README 3).
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
  /** Preise je Fahrzeugklasse in Euro, inkl. MwSt. */
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

export function serviceById(id: ServiceId): Service {
  const s = services.find((x) => x.id === id);
  if (!s) throw new Error(`Unbekannte Leistung: ${id}`);
  return s;
}
