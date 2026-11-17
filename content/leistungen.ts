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
  /** Lange Wörter in Überschriften (h1, faq.title) mit weichem Trennstrich (\u00AD), damit sie bei
   * 360px umbrechen (Regel 8). */
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
  /** Komplettpreis (außen + innen) und Zusatzleistungen wie auf /leistungen zeigen. */
  extras?: boolean;
  steps: { title: string; items: ReadonlyArray<{ title: string; text: string }> };
  faq: { title: string; items: ReadonlyArray<FaqEntry> };
  related: ReadonlyArray<FocusArea["id"]>;
  media: MediaId;
}

const politur = serviceById("politur");
const keramik = serviceById("keramik");

/** Allgemeine FAQ (fahrzeug.json): „ab“-Preise, Dauer, Keramik, Produkte, Flotten. */
const [faqAb, faqDauer, faqKeramik, faqProdukte, faqFlotten] = faq;

/** Begutachtung und Festpreis: die ersten beiden Schritte jeder Leistung. */
const festpreis = {
  title: "Festpreis",
  text: "Sie erhalten einen verbindlichen Festpreis. Ohne Ihre Zustimmung beginnen wir nicht.",
};

export const carServicePages: ReadonlyArray<CarServicePage> = [
  {
    slug: "smart-repair",
    focus: "smart-repair",
    name: "Smart Repair",
    metaTitle: "Smart Repair in Telgte bei Münster",
    metaDescription:
      "Smart Repair in Telgte bei Münster: Kratzer, kleine Dellen, Steinschläge und Bordsteinschäden an Felgen punktuell beheben, ohne Komplettlackierung. Festpreis nach kostenloser Begutachtung.",
    h1: "Smart Repair in Telgte.",
    intro:
      "Ein Kratzer in der Tür, eine Delle vom Parkplatz, ein Steinschlag auf der Haube: Kleine Schäden reparieren wir dort, wo sie sind, statt ganze Bauteile neu zu lackieren. Das spart Zeit und Kosten, und Ihr Fahrzeug behält so viel Originallack wie möglich.",
    offers: ["smart-repair"],
    offerTitle: "Umfang und Preis",
    reasons: {
      title: "Wann sich Smart Repair lohnt.",
      items: [
        {
          t: "Kratzer und Schrammen",
          d: "Einzelne Kratzer im Lack, die mit einer Politur allein nicht verschwinden.",
        },
        {
          t: "Kleine Dellen",
          d: "Parkrempler und Dellen, bei denen der Lack nicht großflächig beschädigt ist.",
        },
        {
          t: "Steinschläge",
          d: "Abplatzer an Haube und Front, bevor Feuchtigkeit darunter gelangt.",
        },
        {
          t: "Bordsteinschäden an Felgen",
          d: "Schrammen an der Felge, die bei jedem Blick auf das Rad auffallen.",
        },
      ],
    },
    limit: {
      text: "Feine Waschkratzer und Hologramme über den ganzen Lack reparieren wir nicht Stelle für Stelle, sondern mit einer Lackkorrektur.",
      link: { focus: "politur", label: "Mehr zur Lackkorrektur" },
    },
    steps: {
      title: "So läuft Smart Repair ab.",
      items: [
        {
          title: "Begutachtung",
          text: "Wir sehen uns die Schäden an und sagen Ihnen, welche sich punktuell reparieren lassen. Kostenlos.",
        },
        festpreis,
        {
          title: "Reparatur",
          text: "Wir bearbeiten nur die beschädigte Stelle und passen den Farbton an den Originallack an.",
        },
        {
          title: "Übergabe",
          text: "Sie holen Ihr Fahrzeug mit Fotoprotokoll ab und sehen genau, was gemacht wurde.",
        },
      ],
    },
    faq: {
      title: "Fragen zu Smart Repair.",
      items: [
        {
          q: "Sieht man die Reparatur danach?",
          a: "Ziel ist, dass die Stelle im Alltag nicht mehr auffällt. Wie unauffällig das Ergebnis wird, hängt von Schaden, Farbton und Bauteil ab. Das sagen wir Ihnen bei der Begutachtung, bevor wir beginnen.",
        },
        {
          q: "Was kostet Smart Repair?",
          a: "Das hängt von Art, Größe und Anzahl der Schäden ab. Deshalb nennen wir den Preis nach einer kostenlosen Begutachtung, als Festpreis vor Beginn der Arbeiten.",
        },
        {
          q: "Wie lange dauert die Reparatur?",
          a: "Das hängt vom Umfang ab. Termin und Dauer nennen wir Ihnen zusammen mit dem Festpreis.",
        },
        {
          q: "Reparieren Sie auch Felgen?",
          a: "Ja, Bordsteinschäden an Felgen gehören zu Smart Repair.",
        },
        {
          q: "Lohnt sich Smart Repair vor der Leasingrückgabe?",
          a: "Oft ja, denn kleine Schäden werden bei der Rückgabe protokolliert und berechnet. Welche Reparatur sich rechnet, sehen wir bei der Begutachtung.",
        },
      ],
    },
    related: ["politur", "leasing", "aussen"],
    media: "carSvcSmartRepair",
  },
  {
    slug: "lackkorrektur",
    focus: "politur",
    name: "Lackkorrektur",
    metaTitle: "Lackkorrektur in Telgte bei Münster",
    metaDescription: `Maschinelle Lackkorrektur in Telgte bei Münster: entfernt Waschkratzer, Hologramme und matte Stellen. ${politur.dur.replace(/^ca\./, "Etwa")}, ab ${eur(politur.p[0])} Endpreis. Den Festpreis nennen wir nach einer kostenlosen Begutachtung.`,
    h1: "Lack\u00ADkorrektur in Telgte.",
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
        festpreis,
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
  {
    slug: "leasingrueckgabe",
    focus: "leasing",
    name: "Leasingrückgabe",
    metaTitle: "Leasingrückgabe vorbereiten in Telgte bei Münster",
    metaDescription:
      "Vorbereitung auf die Leasingrückgabe in Telgte bei Münster: Begutachtung vor dem Rückgabetermin, Smart Repair, Lackkorrektur und Aufbereitung, Fotoprotokoll vor der Übergabe. Festpreis nach kostenloser Begutachtung.",
    h1: "Gut vorbereitet zur Leasing\u00ADrückgabe.",
    intro:
      "Bei der Rückgabe wird jeder Kratzer protokolliert und oft teuer berechnet. Wir sehen uns Ihr Fahrzeug vorher an, beheben, was sich lohnt, und bereiten es innen und außen auf. Was gemacht wird, entscheiden Sie nach der kostenlosen Begutachtung.",
    offers: ["leasing"],
    offerTitle: "Umfang und Preis",
    reasons: {
      title: "Wann sich die Vorbereitung lohnt.",
      items: [
        {
          t: "Kratzer, Dellen, Steinschläge",
          d: "Kleine Schäden, die beim Rückgabegutachten protokolliert und berechnet würden.",
        },
        {
          t: "Stumpfer Lack, verschmutzter Innenraum",
          d: "Ein gepflegtes Fahrzeug macht bei der Übergabe den ersten Eindruck.",
        },
        {
          t: "Einige Wochen vor dem Termin",
          d: "Dann bleibt genug Zeit, die Arbeiten in Ruhe zu planen.",
        },
        {
          t: "Firmenwagen und Flotten",
          d: "Für Händler, Leasingrückläufer und Firmenflotten vereinbaren wir feste Konditionen.",
        },
      ],
    },
    steps: {
      title: "So läuft die Vorbereitung ab.",
      items: [
        {
          title: "Begutachtung",
          text: "Wir prüfen Lack, Felgen und Innenraum vor Ihrem Rückgabetermin. Kostenlos.",
        },
        {
          title: "Festpreis",
          text: "Sie entscheiden, was gemacht wird, und erhalten dafür einen verbindlichen Festpreis.",
        },
        {
          title: "Reparatur und Aufbereitung",
          text: "Kleine Schäden beheben, Lack korrigieren, innen und außen aufbereiten.",
        },
        {
          title: "Übergabe mit Fotoprotokoll",
          text: "Sie geben ein gepflegtes Fahrzeug zurück, der Zustand ist dokumentiert.",
        },
      ],
    },
    faq: {
      title: "Fragen zur Leasing\u00ADrückgabe.",
      items: [
        {
          q: "Wann sollte ich zu Ihnen kommen?",
          a: "Am besten einige Wochen vor dem Rückgabetermin. Dann bleibt Zeit für die Begutachtung und die Arbeiten.",
        },
        {
          q: "Muss ich alle Schäden beheben lassen?",
          a: "Nein. Nach der kostenlosen Begutachtung sagen wir Ihnen, was sich lohnt, und Sie entscheiden, was gemacht wird.",
        },
        {
          q: "Bekomme ich einen Nachweis über den Zustand?",
          a: "Ja. Vor der Übergabe erstellen wir ein Fotoprotokoll.",
        },
        {
          q: "Was kostet die Vorbereitung?",
          a: "Das hängt vom Zustand des Fahrzeugs ab. Nach der kostenlosen Begutachtung nennen wir Ihnen einen Festpreis. Ohne Ihre Zustimmung wird es nicht teurer.",
        },
        faqFlotten,
      ],
    },
    related: ["smart-repair", "politur", "aussen"],
    media: "carSvcLeasing",
  },
  {
    slug: "fahrzeugaufbereitung",
    focus: "aussen",
    name: "Fahrzeugaufbereitung",
    metaTitle: "Fahrzeugaufbereitung in Telgte bei Münster",
    metaDescription:
      "Fahrzeugaufbereitung in Telgte bei Münster: Außen- und Innenaufbereitung, Komplettaufbereitung und Keramikversiegelung mit Produkten von CarPro. Endpreise je Fahrzeugklasse, Festpreis nach kostenloser Begutachtung.",
    h1: "Fahrzeug\u00ADaufbereitung in Telgte.",
    intro:
      "Außen, innen oder mit Keramikversiegelung: Wir bereiten Ihr Fahrzeug von Hand auf, ausschließlich mit Produkten von CarPro. Wählen Sie die Leistung, die zu Ihrem Fahrzeug passt, oder kombinieren Sie Außen und Innen an einem Termin.",
    offers: ["aussen", "innen", "keramik"],
    dur: `${serviceById("aussen").dur.replace(" Tag", "")} bis ${keramik.dur.replace(/^ca\. /, "")}`,
    extras: true,
    reasons: {
      title: "Welche Aufbereitung zu Ihnen passt.",
      items: [
        {
          t: "Außenaufbereitung",
          d: "Wenn Lack, Felgen und Scheiben wieder sauber sein sollen, schonend von Hand gewaschen.",
        },
        {
          t: "Innenaufbereitung",
          d: "Wenn Polster, Kunststoffe und Kofferraum gründlich gereinigt und Gerüche beseitigt werden sollen.",
        },
        {
          t: "Komplettaufbereitung",
          d: "Außen und innen an einem Termin, zum Komplettpreis.",
        },
        {
          t: "Keramikversiegelung",
          d: "Wenn Sie Ihr Fahrzeug länger fahren und Wert auf einfache Pflege und langen Schutz legen.",
        },
      ],
    },
    limit: {
      text: "Kratzer und Hologramme im Lack verschwinden bei einer Wäsche nicht. Dafür gibt es die Lackkorrektur.",
      link: { focus: "politur", label: "Mehr zur Lackkorrektur" },
    },
    steps: {
      title: "So läuft die Aufbereitung ab.",
      items: [
        {
          title: "Begutachtung",
          text: "Wir sehen uns Ihr Fahrzeug an und empfehlen die passende Leistung. Kostenlos.",
        },
        festpreis,
        {
          title: "Aufbereitung",
          text: "In unserer Halle in Telgte, mit Produkten von CarPro, passend für jedes Material.",
        },
        {
          title: "Übergabe",
          text: "Sie bekommen Ihr Fahrzeug mit Fotoprotokoll zurück und sehen genau, was gemacht wurde.",
        },
      ],
    },
    faq: {
      title: "Fragen zur Aufbereitung.",
      items: [
        faqDauer,
        {
          q: "Ist eine Versiegelung enthalten?",
          a: "Bei der Außenaufbereitung nicht. Sie bekommen sie auf Wunsch gegen Aufpreis. Den längsten Schutz bietet die Keramikversiegelung.",
        },
        faqKeramik,
        faqProdukte,
        faqAb,
      ],
    },
    related: ["politur", "smart-repair", "leasing"],
    media: "carSvcAussen",
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

/** Leistungen ohne eigene Seite stehen als Abschnitt auf der Seite Fahrzeugaufbereitung. */
const sectionOf: Partial<Record<FocusArea["id"], CarPageSlug>> = {
  innen: "fahrzeugaufbereitung",
  keramik: "fahrzeugaufbereitung",
};

/**
 * Ziel für einen Schwerpunkt oder eine Leistung: die eigene Seite, Innen und Keramik als Abschnitt
 * der Seite Fahrzeugaufbereitung. Gibt es die Seite (noch) nicht, der Anker auf /leistungen.
 */
export function focusHref(id: FocusArea["id"]): string {
  const slug = carPageSlugByFocus[id];
  if (slug && carServicePage(slug)) return `/leistungen/${slug}`;
  const section = sectionOf[id];
  if (section && carServicePage(section)) return `/leistungen/${section}#svc-${id}`;
  return `/leistungen#svc-${id}`;
}

/** Schwerpunkt mit Name, Kurztext und Preis für Verweise („Weitere Leistungen“). */
export function focusTeaser(id: FocusArea["id"]) {
  const f = focusAreas.find((x) => x.id === id);
  if (!f) throw new Error(`Unbekannter Schwerpunkt: ${id}`);
  const price = f.price ? `ab ${eur(serviceById(f.price).p[0])}` : `Preis ${INSPECT_PRICE}`;
  return { ...f, href: focusHref(id), price };
}
