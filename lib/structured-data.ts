import { aviation, type Locale } from "@/content/aviation";
import { openingHours, site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

/**
 * Strukturierte Daten (schema.org, JSON-LD) für Suchmaschinen. Grundlage sind nur die Stammdaten aus
 * content/: Angaben in `site.unconfirmed` (Platzhalter) erscheinen erst, wenn PaintFix sie bestätigt
 * und sie dort entfernt werden (CLAUDE.md, Regel 11). Gleiches gilt für Preise: keine `priceRange`.
 */
const confirmed = (key: (typeof site.unconfirmed)[number]) =>
  !(site.unconfirmed as readonly string[]).includes(key);

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

const address = {
  "@type": "PostalAddress",
  streetAddress: site.street,
  postalCode: site.postalCode,
  addressLocality: site.city,
  addressCountry: "DE",
};

const phone = site.phoneHref.replace(/^tel:/, "");

/** Fahrzeug: Betrieb für Smart Repair, Lackkorrektur und Aufbereitung (Startseite). */
export function carBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "@id": new URL("/#betrieb", siteUrl).href,
    name: site.name,
    url: new URL("/", siteUrl).href,
    telephone: phone,
    address,
    ...(confirmed("email") && { email: site.email }),
    ...(confirmed("owner") && { founder: { "@type": "Person", name: site.owner } }),
    ...(confirmed("hours") && {
      openingHoursSpecification: openingHours.flatMap((h, day) =>
        h
          ? [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: DAYS[day],
                opens: hh(h[0]),
                closes: hh(h[1]),
              },
            ]
          : [],
      ),
    }),
  };
}

/** Aviation: eigener Bereich unter derselben Anschrift (Aviation-Seite, je Sprache). */
export function aviationBusiness(locale: Locale) {
  const t = aviation[locale];
  const path = locale === "de" ? "/aviation" : "/en/aviation";
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": new URL("/aviation#betrieb", siteUrl).href,
    name: t.footAddr[0],
    url: new URL(path, siteUrl).href,
    description: t.sub,
    telephone: t.opsPhone.replace(/\s/g, ""),
    address,
    parentOrganization: { "@id": new URL("/#betrieb", siteUrl).href },
  };
}
