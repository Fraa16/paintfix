import { aviation, type Locale } from "@/content/aviation";
import { aviationPagePath, aviationPath, type AvPageMeta } from "@/content/aviation-meta";
import type { AvServicePageCopy } from "@/content/aviation-pages";
import type { CarServicePage } from "@/content/leistungen";
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

/** Eintrag ohne eigenes @context, zum Einbetten in einen anderen (provider, @graph). */
function embedded(data: object): object {
  return Object.fromEntries(Object.entries(data).filter(([key]) => key !== "@context"));
}

/** Brotkrumen als BreadcrumbList; Pfade relativ zur Website. */
function breadcrumbs(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, siteUrl).href,
    })),
  };
}

/**
 * Seite je Leistung (/leistungen/{slug}): Service mit dem Betrieb als Anbieter und Brotkrumen.
 * Ohne offers und areaServed, solange Preise und Einzugsgebiet Platzhalter sind (Regel 11).
 */
export function carServiceLd(page: CarServicePage) {
  const path = `/leistungen/${page.slug}`;
  const url = new URL(path, siteUrl).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#leistung`,
        name: page.name,
        serviceType: page.name,
        description: page.metaDescription,
        url,
        provider: embedded(carBusiness()),
      },
      breadcrumbs([
        { name: "Start", path: "/" },
        { name: "Leistungen", path: "/leistungen" },
        { name: page.name, path },
      ]),
    ],
  };
}

/** Seite je Aviation-Bereich: Service mit PaintFix Aviation als Anbieter und Brotkrumen. */
export function aviationServiceLd(locale: Locale, meta: AvPageMeta, copy: AvServicePageCopy) {
  const path = aviationPagePath(meta.id, locale);
  const url = new URL(path, siteUrl).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#leistung`,
        name: copy.name,
        serviceType: copy.name,
        description: copy.metaDescription,
        url,
        inLanguage: locale,
        provider: embedded(aviationBusiness(locale)),
      },
      breadcrumbs([
        { name: "PaintFix Aviation", path: aviationPath[locale] },
        { name: copy.name, path },
      ]),
    ],
  };
}
