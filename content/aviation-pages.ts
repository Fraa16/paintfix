import { aviation } from "./aviation";
import type { AvPageId, Locale } from "./aviation-meta";
import type { FaqEntry } from "./fahrzeug";
import type { MediaId, MediaSource } from "./media";

/**
 * Texte der Seiten je Aviation-Bereich (/aviation/{slug}, /en/aviation/{slug}), nur für
 * Server-Komponenten (beide Sprachen). Slugs und Reihenfolge in aviation-meta.ts.
 *
 * PLATZHALTER: Entwürfe von Chatifa aus den bestehenden Aviation-Texten (svc, std, est, aud), bis
 * PaintFix die Beschreibungen schickt und freigibt (Deutsch; Englisch übersetzt Chatifa). Keine
 * neuen Fakten: Heimatbasis und Flughäfen kommen aus `bases` in aviation.json (dort Platzhalter).
 */

export interface AvServicePageCopy {
  /** Kurzname in Brotkrumen, Links und strukturierten Daten. */
  name: string;
  /** Link von der Aviation-Seite (Tabs, Horizontal-Scroll), z. B. „Mehr zur Außenpflege“. */
  moreLabel: string;
  metaTitle: string;
  metaDescription: string;
  /** Lange Wörter in h1, servicesTitle und faqTitle mit weichem Trennstrich (\u00AD), damit sie
   * bei 360px umbrechen (Regel 8). */
  h1: string;
  intro: string;
  servicesTitle: string;
  faqTitle: string;
  faq: ReadonlyArray<FaqEntry>;
  media: MediaId;
}

/** Feste Beschriftungen der Seiten je Bereich. */
export const avPageUi: Record<
  Locale,
  {
    home: string;
    overline: string;
    services: string;
    toServices: string;
    report: string;
    faqLabel: string;
    relatedLabel: string;
    relatedTitle: string;
    more: string;
    /** Bildunterschrift je Bildquelle (media.ts); eigene Fotos ohne. */
    caption: Partial<Record<MediaSource, string>>;
  }
> = {
  de: {
    home: "PaintFix Aviation",
    overline: "Leistungsbereich",
    services: "Leistungen",
    toServices: "Leistungen ansehen",
    report: "Musterbericht ansehen",
    faqLabel: "Häufige Fragen",
    relatedLabel: "Weitere Bereiche",
    relatedTitle: "Aus einer Hand.",
    more: "Mehr erfahren",
    caption: { ai: "Symbolbild, KI-generiert.", stock: "Symbolbild." },
  },
  en: {
    home: "PaintFix Aviation",
    overline: "Service area",
    services: "Services",
    toServices: "View services",
    report: "View sample report",
    faqLabel: "Frequently asked",
    relatedLabel: "Other areas",
    relatedTitle: "From a single source.",
    more: "Learn more",
    caption: { ai: "Illustrative image, AI-generated.", stock: "Illustrative image." },
  },
};

const de = aviation.de;
const en = aviation.en;
const homeDe = de.bases[0].n;
const homeEn = en.bases[0].n;

export const aviationPages: Partial<Record<AvPageId, Record<Locale, AvServicePageCopy>>> = {
  exterior: {
    de: {
      name: "Außenpflege",
      moreLabel: "Mehr zur Außenpflege",
      metaTitle: "Flugzeug-Außenpflege für Business Jets | PaintFix Aviation",
      metaDescription: `Trockenwäsche, Nasswäsche, Brightwork-Politur und Lackkorrektur für Business Jets. Stationiert am Flughafen ${homeDe}, mit Fotodokumentation und Fertigmeldung an Ihre Ops.`,
      h1: "Außenpflege für Business Jets.",
      intro:
        "Vom wasserlosen Waschen auf dem Vorfeld bis zur polierten Eintrittskante: Wir pflegen die Außenflächen Ihres Flugzeugs in Ihrem Zeitfenster, nach den Pflegevorgaben des Herstellers und mit Fotodokumentation.",
      servicesTitle: "Was zur Außenpflege gehört.",
      faqTitle: "Fragen zur Außenpflege.",
      faq: [
        {
          q: "Brauchen Sie einen Wasseranschluss?",
          a: "Für die Trockenwäsche nicht: Sie ist wasserlos und findet direkt auf dem Vorfeld statt. Für eine Nasswäsche arbeiten wir im Hangar oder auf dem Waschplatz.",
        },
        {
          q: "Passt die Außenpflege in unseren Turnaround?",
          a: `${de.std[0].d} ${de.est.parallel} Richtwerte für Ihr Muster sehen Sie im Angebotsformular.`,
        },
        { q: "Welche Produkte setzen Sie ein?", a: de.std[1].d },
        {
          q: "Wie erfahren wir, was gemacht wurde?",
          a: `${de.std[3].d} Die Fertigmeldung geht direkt an Ihre Ops.`,
        },
        {
          q: "Was kostet die Außenpflege?",
          a: `${de.svcNote} Den Preis nennen wir Ihnen im schriftlichen Angebot.`,
        },
      ],
      media: "avExterior",
    },
    en: {
      name: "Exterior care",
      moreLabel: "More on exterior care",
      metaTitle: "Aircraft exterior care for business jets | PaintFix Aviation",
      metaDescription: `Dry wash, wet wash, brightwork polishing and paint correction for business jets. Based at ${homeEn} airport, with photo documentation and a release notice to your ops.`,
      h1: "Exterior care for business jets.",
      intro:
        "From a waterless wash on the ramp to polished leading edges: we look after your aircraft's exterior within your time window, to the manufacturer's care guidance and with photo documentation.",
      servicesTitle: "What exterior care covers.",
      faqTitle: "Questions about exterior care.",
      faq: [
        {
          q: "Do you need a water supply?",
          a: "Not for a dry wash: it is waterless and done on the ramp. For a wet wash we work in the hangar or wash bay.",
        },
        {
          q: "Does exterior care fit into our turnaround?",
          a: `${en.std[0].d} ${en.est.parallel} The quote form shows indicative times for your type.`,
        },
        { q: "Which products do you use?", a: en.std[1].d },
        {
          q: "How do we know what was done?",
          a: `${en.std[3].d} The release notice goes straight to your ops.`,
        },
        {
          q: "What does exterior care cost?",
          a: `${en.svcNote} The price is set out in our written quote.`,
        },
      ],
      media: "avExterior",
    },
  },
  cabin: {
    de: {
      name: "Kabinenpflege",
      moreLabel: "Mehr zur Kabinenpflege",
      metaTitle: "Kabinenreinigung und Lederpflege für Business Jets | PaintFix Aviation",
      metaDescription: `Kabinen-Grundreinigung, Lederpflege, Teppich-Tiefenreinigung, Galley und Waschraum für Business Jets. Stationiert am Flughafen ${homeDe}, diskret und nach unterschriebener Checkliste.`,
      h1: "Kabinen\u00ADpflege für Business Jets.",
      intro:
        "Sitze, Teppiche, Galley und Waschraum: Wir reinigen und pflegen die Kabine Ihres Flugzeugs nach unterschriebener Checkliste und nach den Vorgaben der Materialhersteller. Diskret und innerhalb Ihres Turnarounds.",
      servicesTitle: "Was zur Kabinenpflege gehört.",
      faqTitle: "Fragen zur Kabinenpflege.",
      faq: [
        { q: "Ist der Teppich bis zum nächsten Flug trocken?", a: de.svc[1][2].d },
        { q: "Wie behandeln Sie Leder?", a: de.svc[1][1].d },
        { q: "Womit reinigen Sie Galley und Waschraum?", a: de.svc[1][3].d },
        { q: "Wie diskret arbeiten Sie?", a: de.aud[2].d },
        {
          q: "Können Außen und Kabine gleichzeitig laufen?",
          a: `Ja. ${de.est.parallel} Richtwerte für Ihr Muster sehen Sie im Angebotsformular.`,
        },
        {
          q: "Was kostet die Kabinenpflege?",
          a: `${de.svcNote} Den Preis nennen wir Ihnen im schriftlichen Angebot.`,
        },
      ],
      media: "avCabin",
    },
    en: {
      name: "Cabin care",
      moreLabel: "More on cabin care",
      metaTitle: "Cabin cleaning and leather care for business jets | PaintFix Aviation",
      metaDescription: `Deep cabin cleaning, leather care, carpet extraction, galley and lavatory for business jets. Based at ${homeEn} airport, discreet and to a signed checklist.`,
      h1: "Cabin care for business jets.",
      intro:
        "Seats, carpets, galley and lavatory: we clean and care for your aircraft's cabin to a signed checklist and to the material manufacturers' guidance. Discreetly, within your turnaround.",
      servicesTitle: "What cabin care covers.",
      faqTitle: "Questions about cabin care.",
      faq: [
        { q: "Will the carpet be dry before the next flight?", a: en.svc[1][2].d },
        { q: "How do you treat leather?", a: en.svc[1][1].d },
        { q: "What do you use in the galley and lavatory?", a: en.svc[1][3].d },
        { q: "How discreet are you?", a: en.aud[2].d },
        {
          q: "Can exterior and cabin work run at the same time?",
          a: `Yes. ${en.est.parallel} The quote form shows indicative times for your type.`,
        },
        {
          q: "What does cabin care cost?",
          a: `${en.svcNote} The price is set out in our written quote.`,
        },
      ],
      media: "avCabin",
    },
  },
  protection: {
    de: {
      name: "Oberflächenschutz",
      moreLabel: "Mehr zum Oberflächenschutz",
      metaTitle: "Keramikversiegelung und Oberflächenschutz für Flugzeuge | PaintFix Aviation",
      metaDescription: `Keramikversiegelung für den Lack, Oberflächenschutz für Leder, Stoffe und Furniere und feste Pflegeintervalle je Kennzeichen. Für Business Jets, stationiert am Flughafen ${homeDe}.`,
      h1: "Oberflächen\u00ADschutz für Business Jets.",
      intro:
        "Keramikversiegelung für den Lack, Schutzbehandlung für Leder, Stoffe und Furniere und feste Pflegeintervalle je Kennzeichen: So bleibt Ihr Flugzeug zwischen den Einsätzen länger gepflegt, und die Reinigung wird leichter.",
      servicesTitle: "Was zum Oberflächen\u00ADschutz gehört.",
      faqTitle: "Fragen zum Oberflächen\u00ADschutz.",
      faq: [
        { q: "Was bringt eine Keramikversiegelung am Flugzeug?", a: de.svc[2][0].d },
        { q: "Brauchen Sie dafür einen Hangar?", a: de.est.hangar },
        { q: "Was gehört zum Schutz der Kabine?", a: de.svc[2][1].d },
        { q: "Wie funktionieren die Pflegeintervalle?", a: de.svc[2][2].d },
        {
          q: "Was kostet der Oberflächenschutz?",
          a: `${de.svcNote} Den Preis nennen wir Ihnen im schriftlichen Angebot.`,
        },
      ],
      media: "avProtection",
    },
    en: {
      name: "Surface protection",
      moreLabel: "More on surface protection",
      metaTitle: "Ceramic coating and surface protection for aircraft | PaintFix Aviation",
      metaDescription: `Ceramic coating for the paint, protection for leather, fabrics and veneers, and fixed care intervals per registration. For business jets, based at ${homeEn} airport.`,
      h1: "Surface protection for business jets.",
      intro:
        "Ceramic coating for the paint, protective treatment for leather, fabrics and veneers, and fixed care intervals per registration: your aircraft stays cared for longer between missions, and cleaning gets easier.",
      servicesTitle: "What surface protection covers.",
      faqTitle: "Questions about surface protection.",
      faq: [
        { q: "What does a ceramic coating do for an aircraft?", a: en.svc[2][0].d },
        { q: "Do you need a hangar for it?", a: en.est.hangar },
        { q: "What does cabin protection include?", a: en.svc[2][1].d },
        { q: "How do the care intervals work?", a: en.svc[2][2].d },
        {
          q: "What does surface protection cost?",
          a: `${en.svcNote} The price is set out in our written quote.`,
        },
      ],
      media: "avProtection",
    },
  },
};

export function aviationPageCopy(id: AvPageId, locale: Locale): AvServicePageCopy | undefined {
  return aviationPages[id]?.[locale];
}

/** Texte für den Ordner einer Seite (app/…/aviation/{slug}); fehlen sie, bricht der Build ab. */
export function requireAviationPageCopy(id: AvPageId, locale: Locale): AvServicePageCopy {
  const copy = aviationPageCopy(id, locale);
  if (!copy) throw new Error(`Keine Texte für ${id} (${locale}) in content/aviation-pages.ts`);
  return copy;
}
