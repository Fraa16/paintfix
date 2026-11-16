import type { MetadataRoute } from "next";
import { aviationPageMeta, aviationPagePath } from "@/content/aviation-meta";
import { aviationPageCopy } from "@/content/aviation-pages";
import { carServicePages } from "@/content/leistungen";
import { siteUrl } from "@/lib/site-url";

const url = (path: string) => new URL(path, siteUrl).href;

/**
 * sitemap.xml: alle indexierbaren Seiten. Impressum, Datenschutz und AGB fehlen bewusst, solange sie
 * Platzhalter sind (noindex); mit den echten Texten kommen sie hinzu. Die Seiten je Leistung kommen
 * aus content/leistungen.ts und content/aviation-pages.ts (nur die mit Texten).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const aviation = { languages: { de: url("/aviation"), en: url("/en/aviation") } };
  const avPages = aviationPageMeta
    .filter((p) => aviationPageCopy(p.id, "de") && aviationPageCopy(p.id, "en"))
    .flatMap((p) => {
      const alternates = {
        languages: { de: url(aviationPagePath(p.id, "de")), en: url(aviationPagePath(p.id, "en")) },
      };
      return (["de", "en"] as const).map((l) => ({
        url: url(aviationPagePath(p.id, l)),
        priority: 0.7,
        alternates,
      }));
    });
  return [
    { url: url("/"), priority: 1 },
    { url: url("/leistungen"), priority: 0.9 },
    ...carServicePages.map((p) => ({ url: url(`/leistungen/${p.slug}`), priority: 0.8 })),
    { url: url("/anfrage"), priority: 0.7 },
    { url: url("/aviation"), priority: 0.8, alternates: aviation },
    { url: url("/en/aviation"), priority: 0.8, alternates: aviation },
    ...avPages,
  ];
}
