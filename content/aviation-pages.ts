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
  metaTitle: string;
  metaDescription: string;
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
