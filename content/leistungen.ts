import {
  faq,
  focusAreas,
  INSPECT_PRICE,
  serviceById,
  type FaqEntry,
  type FocusArea,
  type InspectId,
  type ServiceId,
} from "./fahrzeug";
import type { MediaId } from "./media";
import { eur } from "@/lib/format";

/**
 * Eigene Seiten je Schwerpunkt unter /leistungen/{slug} (Auftrag 04.11.2026, lokale Suche).
 * Die vier Seiten entsprechen den Schwerpunkten der Startseite (`focus` in fahrzeug.json).
 * Preise und Dauer kommen aus fahrzeug.json (services, inspect), damit jeder Wert nur einmal
 * existiert.
 *
 * PLATZHALTER: Alle Texte dieser Datei sind Entwürfe von Chatifa auf Grundlage der bestehenden
 * Leistungstexte, bis PaintFix die Beschreibungen je Leistung schickt und freigibt. Sie enthalten
 * nur Angaben, die bereits auf der Website stehen; neue Fakten (Einzugsgebiet, Garantien,
 * Zertifikate) kommen erst nach Bestätigung hinzu.
 */

export type CarPageSlug =
  "smart-repair" | "lackkorrektur" | "leasingrueckgabe" | "fahrzeugaufbereitung";

/** Schwerpunkt (focus-ID) → Slug der eigenen Seite. */
export const carPageSlugByFocus: Record<FocusArea["id"], CarPageSlug | undefined> = {
  "smart-repair": "smart-repair",
  politur: "lackkorrektur",
  leasing: "leasingrueckgabe",
  aussen: "fahrzeugaufbereitung",
  innen: undefined,
  keramik: undefined,
};

export interface CarServicePage {
  slug: CarPageSlug;
  /** Schwerpunkt der Startseite, zu dem die Seite gehört (Anker #svc-{focus} auf /leistungen). */
  focus: FocusArea["id"];
  /** Kurzname in Brotkrumen, Links und strukturierten Daten. */
  name: string;
  /** <title> ohne „| PaintFix“ (kommt aus dem Layout). */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Leistungen mit Umfang und Preis auf dieser Seite, in dieser Reihenfolge. */
  offers: ReadonlyArray<ServiceId | InspectId>;
  /** Überschrift über den Leistungen, wenn die Seite nur eine hat (statt deren Namen als H2). */
  offerTitle?: string;
  /** „Wann es sich lohnt“: 3–4 typische Anlässe. */
  reasons: { title: string; items: ReadonlyArray<{ t: string; d: string }> };
  /** Grenzen der Leistung mit Verweis auf eine andere Seite. */
  limit?: { text: string; link: { focus: FocusArea["id"]; label: string } };
  /** Dauer im Seitenkopf, wenn die Seite mehrere Leistungen hat (sonst die der Leistung). */
  dur?: string;
  steps: { title: string; items: ReadonlyArray<{ title: string; text: string }> };
  faq: { title: string; items: ReadonlyArray<FaqEntry> };
  related: ReadonlyArray<FocusArea["id"]>;
  media: MediaId;
}

const politur = serviceById("politur");

/** Allgemeine FAQ „Warum steht bei den Preisen „ab“?“ (fahrzeug.json). */
const faqAb = faq[0];

export const carServicePages: ReadonlyArray<CarServicePage> = [
  {
    slug: "lackkorrektur",
    focus: "politur",
    name: "Lackkorrektur",
    metaTitle: "Lackkorrektur in Telgte bei Münster",
    metaDescription: `Maschinelle Lackkorrektur in Telgte bei Münster: entfernt Waschkratzer, Hologramme und matte Stellen. ${politur.dur.replace(/^ca\./, "Etwa")}, ab ${eur(politur.p[0])} Endpreis. Den Festpreis nennen wir nach einer kostenlosen Begutachtung.`,
    h1: "Lackkorrektur in Telgte.",
    intro:
      "Waschanlagen, falsche Tücher und Jahre auf der Straße hinterlassen feine Kratzer, die in der Sonne als Kreise und Schlieren sichtbar werden. Bei der Lackkorrektur reinigen wir den Lack gründlich und polieren ihn danach maschinell. So verschwinden die Kratzer, und der Lack bekommt seine Tiefe zurück.",
    offers: ["politur"],
    offerTitle: "Umfang und Preis",
    reasons: {
      title: "Wann sich eine Lackkorrektur lohnt.",
      items: [
        {
          t: "Waschkratzer und Hologramme",
          d: "Kreise und Schlieren, die in der Sonne oder unter hellem Licht sichtbar werden, meist von der Waschanlage.",
        },
        {
          t: "Matter, stumpfer Lack",
          d: "Lack, der auch direkt nach der Wäsche nicht mehr richtig glänzt.",
        },
        {
          t: "Vor Verkauf oder Leasingrückgabe",
          d: "Ein gepflegter Lack ist der erste Eindruck, den Käufer oder Gutachter von Ihrem Fahrzeug bekommen.",
        },
        {
          t: "Vor einer Keramikversiegelung",
          d: "Die Versiegelung konserviert den Zustand des Lacks. Deshalb korrigieren wir ihn vorher.",
        },
      ],
    },
    limit: {
      text: "Kratzer, die bis auf die Grundierung reichen, lassen sich nicht auspolieren. Solche Schäden beheben wir punktuell mit Smart Repair.",
      link: { focus: "smart-repair", label: "Mehr zu Smart Repair" },
    },
    steps: {
      title: "So läuft die Lackkorrektur ab.",
      items: [
        {
          title: "Begutachtung",
          text: "Wir sehen uns den Lack unter Licht an, messen die Lackschichtdicke und sagen Ihnen, was die Politur erreichen kann. Kostenlos.",
        },
        {
          title: "Festpreis",
          text: "Sie erhalten einen verbindlichen Festpreis. Ohne Ihre Zustimmung beginnen wir nicht.",
        },
        {
          title: "Reinigung und Politur",
          text: "Wäsche und Dekontamination mit Reinigungsknete, Kunststoffe und Gummis abkleben, dann die maschinelle Politur.",
        },
        {
          title: "Übergabe",
          text: `Nach ${politur.dur.replace(/^ca\./, "etwa")} holen Sie Ihr Fahrzeug mit Fotoprotokoll ab. Eine Versiegelung bekommen Sie auf Wunsch gegen Aufpreis.`,
        },
      ],
    },
    faq: {
      title: "Fragen zur Lackkorrektur.",
      items: [
        {
          q: "Schadet eine Politur dem Lack?",
          a: "Beim Polieren wird eine sehr dünne Schicht Klarlack abgetragen. Deshalb messen wir vorher die Lackschichtdicke und polieren nur so viel wie nötig.",
        },
        {
          q: "Was ist der Unterschied zwischen ein- und mehrstufiger Korrektur?",
          a: "Die einstufige Maschinenpolitur ist im Preis enthalten und entfernt die meisten Waschkratzer und Hologramme. Bei tieferen Spuren polieren wir in mehreren Durchgängen. Das bieten wir auf Anfrage an.",
        },
        {
          q: "Brauche ich danach eine Versiegelung?",
          a: "Nicht zwingend, aber sie schützt das Ergebnis länger vor neuen Kratzern und Umwelteinflüssen. Die Versiegelung ist nicht im Preis enthalten und kostet extra. Den längsten Schutz bietet die Keramikversiegelung, die eine Lackkorrektur bereits enthält.",
        },
        {
          q: "Wie lange hält das Ergebnis?",
          a: "Auspolierte Kratzer sind weg. Wie lange der Lack so bleibt, hängt von der Pflege ab: Jede Fahrt durch die Waschanlage kann neue Kratzer verursachen. Eine Handwäsche und eine Versiegelung halten das Ergebnis am längsten.",
        },
        faqAb,
      ],
    },
    related: ["smart-repair", "leasing", "aussen"],
    media: "carSvcPolitur",
  },
];

export function carServicePage(slug: string): CarServicePage | undefined {
  return carServicePages.find((p) => p.slug === slug);
}

/** Seite für ihren Ordner unter app/(de)/(fahrzeug)/leistungen/{slug}; fehlt sie, bricht der Build ab. */
export function requireCarServicePage(slug: CarPageSlug): CarServicePage {
  const page = carServicePage(slug);
  if (!page) throw new Error(`Keine Inhalte für /leistungen/${slug} in content/leistungen.ts`);
  return page;
}

/**
 * Ziel für einen Schwerpunkt: die eigene Seite, sobald es sie gibt, sonst der Anker auf /leistungen.
 * So bleiben alle Links gültig, solange noch nicht alle Seiten fertig sind.
 */
export function focusHref(id: FocusArea["id"]): string {
  const slug = carPageSlugByFocus[id];
  return slug && carServicePage(slug) ? `/leistungen/${slug}` : `/leistungen#svc-${id}`;
}

/** Schwerpunkt mit Name, Kurztext und Preis für Verweise („Weitere Leistungen“). */
export function focusTeaser(id: FocusArea["id"]) {
  const f = focusAreas.find((x) => x.id === id);
  if (!f) throw new Error(`Unbekannter Schwerpunkt: ${id}`);
  const price = f.price ? `ab ${eur(serviceById(f.price).p[0])}` : `Preis ${INSPECT_PRICE}`;
  return { ...f, href: focusHref(id), price };
}
