/** Basis-URL für Metadaten (canonical, Open Graph). In Vercel als SITE_URL setzen. */
export const siteUrl = new URL(process.env.SITE_URL ?? "https://www.paintfix.de");
