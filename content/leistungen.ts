import {
  allFocusAreas,
  comboPrice,
  extras,
  faq,
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
 * Eigene Seiten je Leistung unter /leistungen/{slug} (Auftrag 04.11.2026, lokale Suche).
 * Vier Seiten entsprechen den Schwerpunkten der Startseite (`focus` in fahrzeug.json), zwei weitere
 * (Innenaufbereitung, Keramikversiegelung, 24.11.2026) stehen in `focusMore` und nicht auf der
 * Startseite.
 * Preise und Dauer kommen aus fahrzeug.json (services, inspect), damit jeder Wert nur einmal
 * existiert.
 *
 * Fakten: Die Leistungsbeschreibungen hat PaintFix am 24.11.2026 geschickt (wörtlich als `desc` in
 * fahrzeug.json). Die Texte dieser Datei (Einleitung, Anlässe, Ablauf, FAQ) sind Entwürfe von
 * Chatifa auf dieser Grundlage, bis PaintFix sie freigibt. Sie enthalten keine Angaben über die
 * Beschreibungen hinaus; neue Fakten (Einzugsgebiet, Garantien, Zertifikate, Lackschichtdicken-
 * messung) kommen erst nach Bestätigung hinzu.
 */

export type CarPageSlug =
  | "smart-repair"
  | "lackkorrektur"
  | "leasingrueckgabe"
  | "fahrzeugaufbereitung"
  | "innenaufbereitung"
  | "keramikversiegelung";

/** Schwerpunkt (focus-ID) → Slug der eigenen Seite. */
export const carPageSlugByFocus: Record<FocusArea["id"], CarPageSlug | undefined> = {
  "smart-repair": "smart-repair",
  politur: "lackkorrektur",
  leasing: "leasingrueckgabe",
  aussen: "fahrzeugaufbereitung",
  innen: "innenaufbereitung",
  keramik: "keramikversiegelung",
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

const aussen = serviceById("aussen");
const innen = serviceById("innen");
const politur = serviceById("politur");
const keramik = serviceById("keramik");

/** „Nach etwa 2 Tagen“ / „Nach etwa einem Tag“ aus der Dauer in fahrzeug.json („ca. 2 Tage“). */
function nachDauer(dur: string): string {
  const d = dur
    .replace(/^ca\.\s*/, "etwa ")
    .replace(/\b1 Tag$/, "einem Tag")
    .replace(/Tage$/, "Tagen");
  return `Nach ${d}`;
}

/** Preise je Fahrzeugklasse als Satz: „ab 119 € für einen Kleinwagen, …“. */
function classPrices(p: ReadonlyArray<number>): string {
  return `ab ${eur(p[0])} für einen Kleinwagen, ab ${eur(p[1])} für Limousine und Kombi, ab ${eur(p[2])} für SUV und Van`;
}

/** Preis einer Zusatzleistung („ab 29 €“) aus fahrzeug.json. */
function extraPrice(name: string): string {
  const x = extras.find((e) => e.name === name);
  if (!x) throw new Error(`Unbekannte Zusatzleistung: ${name}`);
  return x.price;
}

/** Allgemeine FAQ (fahrzeug.json): „ab“-Preise, Dauer, Keramik, Produkte, Flotten. */
const [faqAb, faqDauer, faqKeramik, faqProdukte, faqFlotten] = faq;

/** Begutachtung und Festpreis: die ersten beiden Schritte jeder Leistung. */
const festpreis = {
  title: "Festpreis",
  text: "Sie erhalten einen verbindlichen Festpreis. Wir fangen erst an, wenn Sie zugesagt haben.",
};

export const carServicePages: ReadonlyArray<CarServicePage> = [
  {
    slug: "smart-repair",
    focus: "smart-repair",
    name: "Smart Repair",
    metaTitle: "Smart Repair in Telgte bei Münster",
    metaDescription:
      "Smart Repair in Telgte bei Münster: Kratzer, Steinschläge und Parkschäden ausbessern, ohne das ganze Bauteil zu lackieren. Festpreis nach Begutachtung.",
    h1: "Smart Repair in Telgte.",
    intro:
      "Ein Kratzer in der Tür, ein Parkschaden an der Stoßstange, ein Steinschlag auf der Haube: Kleine Schäden reparieren wir dort, wo sie sind, statt ganze Bauteile neu zu lackieren. Das spart Zeit und Kosten, und Ihr Fahrzeug behält so viel Originallack wie möglich.",
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
          t: "Parkschäden",
          d: "Schrammen und kleine Beschädigungen vom Parkplatz, etwa an Stoßstange oder Tür.",
        },
        {
          t: "Steinschläge",
          d: "Abplatzer an Haube und Front, bevor darunter Rost ansetzt.",
        },
        {
          t: "Kleinere Lackschäden",
          d: "Macken und Abplatzer, bei denen eine Lackierung des ganzen Bauteils übertrieben wäre.",
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
          text: "Nur die beschädigte Stelle: fachgerecht schleifen, spachteln, grundieren, lackieren und anschließend polieren.",
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
          q: "Wie wird repariert?",
          a: "Die betroffene Stelle wird fachgerecht geschliffen, gespachtelt, grundiert, lackiert und anschließend poliert. Der Rest des Bauteils bleibt im Originallack.",
        },
        {
          q: "Wann reicht Smart Repair nicht?",
          a: "Wenn große Flächen oder ganze Bauteile beschädigt sind, ist eine Lackierung des Bauteils die sauberere Lösung. Ob sich Ihr Schaden punktuell reparieren lässt, sagen wir Ihnen bei der Begutachtung.",
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
    metaTitle: "Lackkorrektur und Politur in Telgte bei Münster",
    metaDescription: `Auto polieren lassen in Telgte bei Münster: Lackkorrektur gegen Waschkratzer, Hologramme und matten Lack. Ein- bis dreistufig, ab ${eur(politur.p[0])}, ${politur.dur.replace(/^ca\./, "etwa")}.`,
    h1: "Lack\u00ADkorrektur in Telgte.",
    intro:
      "Waschanlagen, falsche Tücher und Jahre auf der Straße hinterlassen feine Kratzer, die in der Sonne als Kreise und Schlieren sichtbar werden. Bei der Lackkorrektur polieren wir den Lack je nach Zustand ein-, zwei- oder dreistufig. So werden Kratzer, Hologramme und Waschspuren deutlich reduziert, und der Lack bekommt Tiefenglanz und Farbtiefe zurück.",
    offers: ["politur"],
    offerTitle: "Umfang und Preis",
    reasons: {
      title: "Wann sich eine Lackkorrektur lohnt.",
      items: [
        {
          t: "Waschkratzer und Hologramme",
          d: "Feine Kreise (Swirls) und Schlieren, die in der Sonne sichtbar werden, meist von der Waschanlage.",
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
          text: "Wir sehen uns den Lack unter Licht an und sagen Ihnen, wie viele Stufen er braucht und was die Politur erreichen kann. Kostenlos.",
        },
        festpreis,
        {
          title: "Reinigung und Politur",
          text: "Gründliche Reinigung, dann die ein-, zwei- oder dreistufige Politur, je nach Zustand des Lacks.",
        },
        {
          title: "Übergabe",
          text: `${nachDauer(politur.dur)} holen Sie Ihr Fahrzeug mit Fotoprotokoll ab. Eine Versiegelung bekommen Sie auf Wunsch gegen Aufpreis.`,
        },
      ],
    },
    faq: {
      title: "Fragen zur Lackkorrektur.",
      items: [
        {
          q: "Lässt sich mein Kratzer auspolieren?",
          a: "Eine Faustregel: Fahren Sie mit dem Fingernagel quer über den Kratzer. Bleibt er nicht hängen, sitzt der Kratzer meist nur im Klarlack und lässt sich oft auspolieren. Bleibt er hängen, reicht er tiefer, dann hilft Smart Repair. Sicher sagen wir es Ihnen bei der Begutachtung.",
        },
        {
          q: "Schadet eine Politur dem Lack?",
          a: "Beim Polieren wird eine sehr dünne Schicht Klarlack abgetragen. Deshalb wählen wir die Stufe nach dem Zustand des Lacks und polieren nur so viel wie nötig.",
        },
        {
          q: "Was ist der Unterschied zwischen ein- und mehrstufiger Korrektur?",
          a: "Die einstufige Politur ist im Grundpreis enthalten und reduziert die meisten Waschspuren und Hologramme. Bei tieferen Kratzern polieren wir zwei- oder dreistufig. Das bieten wir auf Anfrage an.",
        },
        {
          q: "Brauche ich danach eine Versiegelung?",
          a: "Nicht zwingend, aber sie schützt das Ergebnis länger vor neuen Kratzern und Umwelteinflüssen. Die Versiegelung ist nicht im Preis enthalten und kostet extra. Den längsten Schutz bietet die Keramikversiegelung, zu der eine Lackkorrektur nach Bedarf gehört.",
        },
        {
          q: "Wie lange hält das Ergebnis?",
          a: "Was die Politur reduziert hat, kommt nicht von selbst zurück. Wie lange der Lack so bleibt, hängt von der Pflege ab: Jede Fahrt durch die Waschanlage kann neue Kratzer verursachen. Eine Handwäsche und eine Versiegelung halten das Ergebnis am längsten.",
        },
        faqAb,
      ],
    },
    related: ["keramik", "smart-repair", "leasing"],
    media: "carSvcPolitur",
  },
  {
    slug: "leasingrueckgabe",
    focus: "leasing",
    name: "Leasingrückgabe",
    metaTitle: "Leasingrückgabe vorbereiten in Telgte bei Münster",
    metaDescription:
      "Leasingrückgabe vorbereiten in Telgte bei Münster: Wir prüfen Ihr Auto vor dem Termin und beheben, was sich lohnt. Fotoprotokoll, Festpreis nach Begutachtung.",
    h1: "Gut vorbereitet zur Leasing\u00ADrückgabe.",
    intro:
      "Bei der Rückgabe prüft ein Gutachter Ihr Fahrzeug nach dem Schadenkatalog des Leasinggebers. Was über normale Gebrauchsspuren hinausgeht, wird nachberechnet. Wir sehen uns Ihr Fahrzeug vorher an, beheben die Schäden, bei denen sich die Reparatur rechnet, und bereiten es innen und außen auf. Was gemacht wird, entscheiden Sie nach der kostenlosen Begutachtung.",
    offers: ["leasing"],
    offerTitle: "Umfang und Preis",
    reasons: {
      title: "Wann sich die Vorbereitung lohnt.",
      items: [
        {
          t: "Kratzer, Steinschläge, Lackschäden",
          d: "Kleine Schäden, die bei der Rückgabe sonst nachberechnet würden.",
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
          text: "Wir prüfen Ihr Fahrzeug vor dem Rückgabetermin auf Kratzer, Dellen, Lackschäden und Gebrauchsspuren. Kostenlos.",
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
          q: "Welche Schäden werden bei der Rückgabe berechnet?",
          a: "Das regelt der Schadenkatalog Ihres Leasinggebers. Normale Gebrauchsspuren sind in der Regel akzeptiert. Berechnet wird, was darüber hinausgeht, etwa Kratzer bis in die Grundierung, Steinschläge mit Abplatzern oder Flecken im Polster. Bringen Sie den Katalog zur Begutachtung mit, dann gehen wir ihn gemeinsam durch.",
        },
        {
          q: "Wann sollte ich zu Ihnen kommen?",
          a: "Am besten einige Wochen vor dem Rückgabetermin. Dann bleibt Zeit für die Begutachtung und die Arbeiten.",
        },
        {
          q: "Muss ich alle Schäden beheben lassen?",
          a: "Nein. Nach der kostenlosen Begutachtung sagen wir Ihnen, bei welchen Schäden die Reparatur günstiger ist als die Nachzahlung. Was gemacht wird, entscheiden Sie.",
        },
        {
          q: "Bekomme ich einen Nachweis über den Zustand?",
          a: "Ja. Vor der Übergabe erstellen wir ein Fotoprotokoll.",
        },
        {
          q: "Was kostet die Vorbereitung?",
          a: "Das hängt davon ab, welche Schäden behoben werden sollen. Nach der kostenlosen Begutachtung bekommen Sie einen Festpreis für genau diese Arbeiten.",
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
    metaTitle: "Autoaufbereitung innen und außen in Telgte bei Münster",
    metaDescription: `Autoaufbereitung in Telgte bei Münster: lackschonende Handwäsche, Felgen, Innenraum, außen und innen an einem Termin. Ab ${eur(aussen.p[0])}, Festpreis nach Begutachtung.`,
    h1: "Fahrzeug\u00ADaufbereitung in Telgte.",
    intro:
      "Autoaufbereitung von Hand: außen mit Vorwäsche und lackschonender Handwäsche, innen mit Tiefenreinigung von Polstern, Teppichen und Leder. Wenn Sie den Lack länger schützen wollen, kommt eine Keramikversiegelung dazu. Wir arbeiten ausschließlich mit Produkten von CarPro. Außen und innen lassen sich an einem Termin kombinieren, zum Komplettpreis.",
    offers: ["aussen", "innen"],
    dur: `${aussen.dur} je Leistung`,
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
          d: "Wenn der Innenraum gründlich gereinigt werden soll: Polster, Teppiche, Leder, Kunststoffe und Flecken.",
        },
        {
          t: "Komplettaufbereitung",
          d: "Außen und innen an einem Termin, zum Komplettpreis.",
        },
        {
          t: "Vor dem Verkauf",
          d: "Käufer schauen zuerst auf Lack und Innenraum. Beides sollte bei der Besichtigung sauber sein.",
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
        {
          q: "Was kostet eine Autoaufbereitung?",
          a: `Außen ab ${eur(aussen.p[0])}, innen ab ${eur(innen.p[0])}, beides an einem Termin ab ${eur(comboPrice[0])}, jeweils für einen Kleinwagen in normalem Zustand. Den Festpreis für Ihr Fahrzeug nennen wir nach der kostenlosen Begutachtung.`,
        },
        faqDauer,
        {
          q: "Ist eine Versiegelung enthalten?",
          a: "Bei der Außenaufbereitung nicht. Sie bekommen sie auf Wunsch gegen Aufpreis. Den längsten Schutz bietet die Keramikversiegelung.",
        },
        faqProdukte,
        faqFlotten,
      ],
    },
    related: ["keramik", "politur", "leasing"],
    media: "carSvcAussen",
  },
  {
    slug: "innenaufbereitung",
    focus: "innen",
    name: "Innenaufbereitung",
    metaTitle: "Auto-Innenreinigung in Telgte bei Münster",
    metaDescription: `Auto-Innenreinigung in Telgte bei Münster: Polster und Teppiche tiefengereinigt, Leder gereinigt und gepflegt, Flecken entfernt. Ab ${eur(innen.p[0])}, ${innen.dur.replace(/^ca\./, "etwa")}.`,
    h1: "Innen\u00ADaufbereitung in Telgte.",
    intro:
      "Krümel in den Ritzen, Flecken im Sitz, ein Lenkrad, das sich speckig anfühlt: Bei der Innenaufbereitung reinigen wir den ganzen Innenraum gründlich, von Polstern und Teppichen bis zu Armaturen, Türverkleidungen und Scheiben. Leder wird gereinigt und gepflegt, Flecken behandeln wir gezielt.",
    offers: ["innen"],
    offerTitle: "Umfang und Preis",
    extras: true,
    reasons: {
      title: "Wann sich eine Innen\u00ADaufbereitung lohnt.",
      items: [
        {
          t: "Flecken in Sitz und Teppich",
          d: "Kaffee, Saft oder Matsch aus dem Winter: Polster und Teppiche werden in der Tiefe gereinigt, nicht nur abgesaugt.",
        },
        {
          t: "Kinder und Hund an Bord",
          d: "In Ritzen und Polstern sammelt sich einiges an. Tierhaare entfernen wir auf Wunsch als Zusatzleistung.",
        },
        {
          t: "Ledersitze",
          d: "Leder wird gereinigt und anschließend gepflegt, damit es geschmeidig bleibt.",
        },
        {
          t: "Vor Verkauf oder Leasingrückgabe",
          d: "Flecken im Polster fallen Käufern sofort auf und werden bei der Rückgabe berechnet.",
        },
      ],
    },
    limit: {
      text: "Die Innenaufbereitung umfasst nur den Innenraum. Außen und innen zusammen bekommen Sie an einem Termin zum Komplettpreis.",
      link: { focus: "aussen", label: "Mehr zur Fahrzeugaufbereitung" },
    },
    steps: {
      title: "So läuft die Innen\u00ADaufbereitung ab.",
      items: [
        {
          title: "Begutachtung",
          text: "Wir sehen uns Polster, Leder und Flecken an und sagen Ihnen, was die Reinigung erreichen kann. Kostenlos.",
        },
        festpreis,
        {
          title: "Reinigung",
          text: "Aussaugen, Polster und Teppiche tiefenreinigen, Leder reinigen und pflegen, Armaturen, Kunststoffe, Türverkleidungen und Scheiben reinigen.",
        },
        {
          title: "Übergabe",
          text: `${nachDauer(innen.dur)} holen Sie Ihr Fahrzeug mit Fotoprotokoll ab und sehen genau, was gemacht wurde.`,
        },
      ],
    },
    faq: {
      title: "Fragen zur Innen\u00ADaufbereitung.",
      items: [
        {
          q: "Was kostet eine Innenreinigung?",
          a: `Die Innenaufbereitung kostet ${classPrices(innen.p)}, jeweils in normalem Zustand. Den Festpreis für Ihr Fahrzeug nennen wir nach der kostenlosen Begutachtung.`,
        },
        {
          q: "Gehen alle Flecken raus?",
          a: "Viele, aber nicht alle. Ältere Flecken, die das Material schon verfärbt haben, lassen sich oft nur aufhellen. Was möglich ist, sagen wir Ihnen bei der Begutachtung, bevor wir anfangen.",
        },
        {
          q: "Wie lange dauert die Innenaufbereitung?",
          a: "Rechnen Sie mit etwa einem Tag. Die genaue Dauer nennen wir Ihnen zusammen mit dem Festpreis.",
        },
        {
          q: "Was ist mit Tierhaaren und Gerüchen?",
          a: `Tierhaare entfernen wir als Zusatzleistung ${extraPrice("Tierhaarentfernung")}, gegen Gerüche gibt es eine Ozonbehandlung ${extraPrice("Ozonbehandlung gegen Gerüche")}. Beides kommt auf Wunsch dazu.`,
        },
        faqProdukte,
      ],
    },
    related: ["aussen", "keramik", "leasing"],
    media: "carSvcInnen",
  },
  {
    slug: "keramikversiegelung",
    focus: "keramik",
    name: "Keramikversiegelung",
    metaTitle: "Keramikversiegelung in Telgte bei Münster",
    metaDescription: `Keramikversiegelung in Telgte bei Münster: Lack vorbereiten, nach Bedarf korrigieren, keramisch versiegeln. Bis zu drei Jahre Standzeit, ab ${eur(keramik.p[0])}.`,
    h1: "Keramik\u00ADversiegelung in Telgte.",
    intro:
      "Eine Keramikversiegelung ist eine Schutzschicht auf dem Lack, die je nach Produkt bis zu drei Jahre hält. Wasser perlt ab, der Lack verschmutzt langsamer und bekommt einen tiefen Glanz. Vorher bereiten wir die Oberfläche gründlich vor und korrigieren den Lack, wo es nötig ist. Denn was unter der Versiegelung liegt, bleibt sichtbar.",
    offers: ["keramik"],
    offerTitle: "Umfang und Preis",
    reasons: {
      title: "Wann sich eine Keramik\u00ADversiegelung lohnt.",
      items: [
        {
          t: "Sie fahren das Auto länger",
          d: "Bei bis zu drei Jahren Standzeit rechnet sich der Schutz vor allem, wenn das Fahrzeug so lange bei Ihnen bleibt.",
        },
        {
          t: "Neuer oder frisch polierter Lack",
          d: "Der Lack ist in gutem Zustand, und so soll er bleiben.",
        },
        {
          t: "Weniger Aufwand beim Waschen",
          d: "Wasser perlt ab, Schmutz lässt sich leichter abwaschen, die Wäsche geht schneller.",
        },
        {
          t: "Nach einer Lackkorrektur",
          d: "Die Versiegelung schützt das Ergebnis der Politur länger.",
        },
      ],
    },
    limit: {
      text: "Eine Keramikversiegelung ist kein Panzer: Steinschläge und tiefe Kratzer verhindert sie nicht. Solche Schäden beheben wir punktuell mit Smart Repair.",
      link: { focus: "smart-repair", label: "Mehr zu Smart Repair" },
    },
    steps: {
      title: "So läuft die Versiegelung ab.",
      items: [
        {
          title: "Begutachtung",
          text: "Wir sehen uns den Lack unter Licht an und sagen Ihnen, ob er vorher korrigiert werden muss und welche Standzeit zu Ihnen passt. Kostenlos.",
        },
        festpreis,
        {
          title: "Vorbereitung",
          text: "Gründliche Reinigung und Entfettung des Lacks, danach die Lackkorrektur, so weit sie nötig ist.",
        },
        {
          title: "Versiegelung und Übergabe",
          text: `Die keramische Beschichtung wird aufgetragen und härtet aus. ${nachDauer(keramik.dur)} holen Sie Ihr Fahrzeug mit Fotoprotokoll ab.`,
        },
      ],
    },
    faq: {
      title: "Fragen zur Keramik\u00ADversiegelung.",
      items: [
        {
          q: "Wie lange hält eine Keramikversiegelung?",
          a: "Je nach Produkt bis zu einem, zwei oder drei Jahre. Welche Standzeit zu Ihnen passt, besprechen wir vor Beginn. Wie lange der Schutz tatsächlich hält, hängt auch von der Pflege ab.",
        },
        faqKeramik,
        {
          q: "Was kostet eine Keramikversiegelung?",
          a: `Die Keramikversiegelung kostet ${classPrices(keramik.p)}. Wie viel Lackkorrektur Ihr Lack vorher braucht, sehen wir bei der Begutachtung. Danach nennen wir Ihnen den Festpreis.`,
        },
        {
          q: "Muss der Lack vorher poliert werden?",
          a: "Wenn er Kratzer oder Hologramme hat, ja. Die Versiegelung konserviert den Zustand des Lacks, Kratzer darunter bleiben sichtbar. Deshalb gehört eine Lackkorrektur nach Bedarf dazu.",
        },
        {
          q: "Was ist der Unterschied zu Wachs oder Sprühversiegelung?",
          a: "Wachs und Sprühversiegelungen sind schnell aufgetragen, halten aber deutlich kürzer. Eine Keramikversiegelung hält je nach Produkt bis zu drei Jahre.",
        },
        {
          q: "Wie pflege ich den Lack danach?",
          a: "Am besten mit der Hand und einem pH-neutralen Shampoo. Bürstenwaschanlagen setzen der Beschichtung zu und verkürzen die Standzeit.",
        },
      ],
    },
    related: ["politur", "aussen", "innen"],
    media: "carSvcKeramik",
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

/** Ziel für eine Leistung: ihre eigene Seite, sonst der Anker auf /leistungen. */
export function focusHref(id: FocusArea["id"]): string {
  const slug = carPageSlugByFocus[id];
  if (slug && carServicePage(slug)) return `/leistungen/${slug}`;
  return `/leistungen#svc-${id}`;
}

/** Leistung mit Name, Kurztext und Preis für Verweise („Weitere Leistungen“). */
export function focusTeaser(id: FocusArea["id"]) {
  const f = allFocusAreas.find((x) => x.id === id);
  if (!f) throw new Error(`Unbekannte Leistung: ${id}`);
  const price = f.price ? `ab ${eur(serviceById(f.price).p[0])}` : `Preis ${INSPECT_PRICE}`;
  return { ...f, href: focusHref(id), price };
}
