import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/** robots.txt: alles erlaubt, Verweis auf die Sitemap. Vercel-Vorschauen bekommen ohnehin noindex. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
