import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

const url = (path: string) => new URL(path, siteUrl).href;

/**
 * sitemap.xml: alle indexierbaren Seiten. Impressum, Datenschutz und AGB fehlen bewusst, solange sie
 * Platzhalter sind (noindex); mit den echten Texten kommen sie hinzu.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const aviation = { languages: { de: url("/aviation"), en: url("/en/aviation") } };
  return [
    { url: url("/"), priority: 1 },
    { url: url("/leistungen"), priority: 0.9 },
    { url: url("/anfrage"), priority: 0.7 },
    { url: url("/aviation"), priority: 0.8, alternates: aviation },
    { url: url("/en/aviation"), priority: 0.8, alternates: aviation },
  ];
}
