import {
  comboPrice,
  serviceById,
  type ServiceId,
  type VehicleClassIndex,
} from "@/content/fahrzeug";

/** Gewählte Leistungen, z. B. { aussen: true, innen: true }. Fehlende Schlüssel gelten als nicht gewählt. */
export type ServiceSelection = Readonly<Partial<Record<ServiceId, boolean>>>;

export interface PriceLine {
  name: string;
  /** Preis in Euro, inkl. MwSt. */
  price: number;
}

export interface PriceEstimate {
  lines: PriceLine[];
  /** Summe aller Positionen in Euro („Richtpreis ab …“). */
  sum: number;
  /** true, wenn außen + innen zum Kombipreis zusammengefasst wurden. */
  combo: boolean;
}

/** Positionsname, wenn Außen- und Innenaufbereitung zusammen gewählt sind (README 10.1). */
export const COMBO_NAME = "Komplett außen + innen";
/** Zusatz zur Keramikversiegelung, wenn Außen gewählt ist: Keramik enthält die Außenaufbereitung. */
export const CERAMIC_INCLUDES_EXTERIOR = " (inkl. Außen)";

/**
 * Richtpreis der Fahrzeug-Anfrage (README 10.1, Referenz `total(sel, c)`).
 *
 * - Keramik enthält die Außenaufbereitung: Außen zählt dann nicht extra.
 * - Außen + innen ergibt die Position „Komplett außen + innen“ zum Kombipreis der Klasse.
 * - Keramik bekommt „ (inkl. Außen)“, wenn Außen ebenfalls gewählt ist.
 * - Summe = Summe aller Positionen.
 */
export function estimatePrice(
  sel: ServiceSelection,
  vehicleClass: VehicleClassIndex,
): PriceEstimate {
  const keramik = !!sel.keramik;
  const aussen = !!sel.aussen && !keramik;
  const innen = !!sel.innen;
  const price = (id: ServiceId) => serviceById(id).p[vehicleClass];
  const lines: PriceLine[] = [];
  let combo = false;

  if (aussen && innen) {
    lines.push({ name: COMBO_NAME, price: comboPrice[vehicleClass] });
    combo = true;
  } else {
    if (aussen) lines.push({ name: serviceById("aussen").name, price: price("aussen") });
    if (innen) lines.push({ name: serviceById("innen").name, price: price("innen") });
  }
  if (sel.politur) lines.push({ name: serviceById("politur").name, price: price("politur") });
  if (keramik) {
    lines.push({
      name: serviceById("keramik").name + (sel.aussen ? CERAMIC_INCLUDES_EXTERIOR : ""),
      price: price("keramik"),
    });
  }

  return { lines, sum: lines.reduce((total, line) => total + line.price, 0), combo };
}
