import { services, type ServiceId, type VehicleClassIndex } from "@/content/fahrzeug";

export type ServiceFlags = Record<ServiceId, boolean>;

export interface RequestPrefill {
  services: ServiceFlags;
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
    vehicleClass: 0,
  };
}

/**
 * Vorbelegung aus der Adresse, z. B. /anfrage?leistungen=aussen,innen&klasse=1 (README 10.1).
 * Unbekannte Leistungen werden ignoriert; ohne gültige Leistung gilt die Standardauswahl.
 * `klasse` muss 0, 1 oder 2 sein, sonst Kleinwagen.
 */
export function parseRequestQuery(params: { get(name: string): string | null }): RequestPrefill {
  const prefill = defaultPrefill();
  const ids = (params.get("leistungen") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id): id is ServiceId => SERVICE_IDS.has(id));
  if (ids.length > 0) {
    prefill.services = { aussen: false, innen: false, politur: false, keramik: false };
    for (const id of ids) prefill.services[id] = true;
  }
  prefill.vehicleClass = CLASS_BY_PARAM.get(params.get("klasse") ?? "") ?? 0;
  return prefill;
}
