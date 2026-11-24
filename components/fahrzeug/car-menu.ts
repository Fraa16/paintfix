import type { StaticImageData } from "next/image";
import { TILE_IMAGE } from "@/components/fahrzeug/design/ui";
import { allFocusAreas, INSPECT_PRICE, serviceById, type FocusArea } from "@/content/fahrzeug";
import { focusHref } from "@/content/leistungen";
import { media } from "@/content/media";
import { eur } from "@/lib/format";

export interface CarMenuItem {
  id: FocusArea["id"];
  href: string;
  name: string;
  short: string;
  /** „ab 249 €“ oder „nach Begutachtung“. */
  price: string;
  /** Vorschaubild im Mega-Menü (dekorativ, der Linktext benennt die Leistung). */
  image: StaticImageData;
  /** „Symbolbild, KI-generiert“ für Platzhalterbilder (UWG § 5, KI-VO Art. 50), sonst leer. */
  caption?: string;
}

export interface CarMenu {
  groups: ReadonlyArray<{ label: string; items: ReadonlyArray<CarMenuItem> }>;
  overview: { href: string; label: string };
}

/** Gruppen im Mega-Menü: alle sechs Leistungen mit eigener Seite. */
const GROUPS: ReadonlyArray<{ label: string; ids: ReadonlyArray<FocusArea["id"]> }> = [
  { label: "Reparatur und Lack", ids: ["smart-repair", "politur", "leasing"] },
  { label: "Pflege und Schutz", ids: ["aussen", "innen", "keramik"] },
];

function item(id: FocusArea["id"]): CarMenuItem {
  const f = allFocusAreas.find((x) => x.id === id);
  if (!f) throw new Error(`Unbekannte Leistung im Menü: ${id}`);
  const m = media[TILE_IMAGE[id]];
  const source: string = m.source;
  return {
    id,
    href: focusHref(id),
    name: f.name,
    short: f.short,
    price: f.price ? `ab ${eur(serviceById(f.price).p[0])}` : INSPECT_PRICE,
    image: m.src,
    caption:
      source === "ai" ? "Symbolbild, KI-generiert" : source === "stock" ? "Symbolbild" : undefined,
  };
}

/**
 * Daten für Mega-Menü und mobiles Menü des Fahrzeug-Headers. Auf dem Server gebaut (Layout) und als
 * Props übergeben, damit der Client-Header keine Inhaltsdateien ins Bundle zieht.
 */
export function carMenu(): CarMenu {
  return {
    groups: GROUPS.map((g) => ({ label: g.label, items: g.ids.map(item) })),
    overview: { href: "/leistungen", label: "Alle Leistungen und Preise" },
  };
}
