import type { Locale } from "@/content/aviation";

/**
 * Zugänglichkeitstexte der Aviation-Hülle (aria-label, Sprunglink), die weder in aviation.json noch in der
 * Referenz stehen. Sichtbare Texte kommen ausschließlich aus content/aviation.ts.
 */
export const avUi: Record<
  Locale,
  {
    toTop: string;
    nav: string;
    lang: string;
    langNames: Record<Locale, string>;
    quickContact: string;
    serviceTabs: string;
    skip: string;
  }
> = {
  de: {
    toTop: "PaintFix Aviation, zum Seitenanfang",
    nav: "Abschnitte",
    lang: "Sprache",
    langNames: { de: "Deutsch", en: "English" },
    quickContact: "Schnellkontakt",
    serviceTabs: "Leistungsbereiche",
    skip: "Zum Inhalt springen",
  },
  en: {
    toTop: "PaintFix Aviation, back to top",
    nav: "Sections",
    lang: "Language",
    langNames: { de: "Deutsch", en: "English" },
    quickContact: "Quick contact",
    serviceTabs: "Service areas",
    skip: "Skip to content",
  },
};

/** „+49 2504 000 00 00“ → „tel:+4925040000000“ (Referenz telAv). */
export function telHref(phone: string): string {
  return "tel:" + phone.replace(/[^+\d]/g, "");
}
