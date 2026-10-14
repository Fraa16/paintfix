import {
  isInspectId,
  services,
  type InspectId,
  type ServiceId,
  type VehicleClassIndex,
} from "@/content/fahrzeug";

export type ServiceFlags = Record<ServiceId, boolean>;
/** Smart Repair und Leasingrückgabe: wählbar, Preis nach Begutachtung. */
export type InspectFlags = Record<InspectId, boolean>;

export interface RequestPrefill {
  services: ServiceFlags;
  inspect: InspectFlags;
  vehicleClass: VehicleClassIndex;
}

const SERVICE_IDS = new Set<string>(services.map((s) => s.id));
const CLASS_BY_PARAM = new Map<string, VehicleClassIndex>([
  ["0", 0],
  ["1", 1],
  ["2", 2],
]);

/** Ausgangszustand ohne Vorbelegung (README 10.1): nur Außenaufbereitung, Kleinwagen. */
export function defaultPrefill(): RequestPrefill {
  return {
    services: { aussen: true, innen: false, politur: false, keramik: false },
    inspect: { "smart-repair": false, leasing: false },
    vehicleClass: 0,
  };
}

/**
 * Vorbelegung aus der Adresse, z. B. /anfrage?leistungen=aussen,innen&klasse=1 (README 10.1), auch
 * mit smart-repair und leasing.
 * Unbekannte Leistungen werden ignoriert; ohne gültige Leistung gilt die Standardauswahl.
 * `klasse` muss 0, 1 oder 2 sein, sonst Kleinwagen.
 */
export function parseRequestQuery(params: { get(name: string): string | null }): RequestPrefill {
  const prefill = defaultPrefill();
  const all = (params.get("leistungen") ?? "").split(",").map((id) => id.trim());
  const ids = all.filter((id): id is ServiceId => SERVICE_IDS.has(id));
  const inspectIds = all.filter(isInspectId);
  if (ids.length > 0 || inspectIds.length > 0) {
    prefill.services = { aussen: false, innen: false, politur: false, keramik: false };
    for (const id of ids) prefill.services[id] = true;
    for (const id of inspectIds) prefill.inspect[id] = true;
  }
  prefill.vehicleClass = CLASS_BY_PARAM.get(params.get("klasse") ?? "") ?? 0;
  return prefill;
}
