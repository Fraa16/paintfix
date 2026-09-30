import { site } from '@/content/site';
import { path, routes, type Locale } from '@/i18n/routes';
import type { FaqItem } from './content';

/** Absolute URL helper (uses Astro `site`). */
export const abs = (base: URL | string, p: string) => new URL(p, base).toString();

export function businessGraph(base: URL, locale: Locale) {
  const id = (frag: string) => abs(base, `/#${frag}`);
  const address = {
    '@type': 'PostalAddress',
    streetAddress: site.street,
    postalCode: site.postalCode,
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  };
  return [
    {
      '@type': 'WebSite',
      '@id': id('website'),
      url: abs(base, '/'),
      name: site.brand,
      inLanguage: ['de-DE', 'en-GB'],
      publisher: { '@id': id('business') },
    },
    {
      '@type': 'AutomotiveBusiness',
      '@id': id('business'),
      name: site.brand,
      description:
        locale === 'de'
          ? 'Fahrzeugaufbereitung in Telgte bei Münster: Innen-, Außen- und Komplettaufbereitung, Lackkorrektur und Keramikversiegelung mit CarPro.'
          : 'Car detailing in Telgte near Münster, Germany: interior, exterior and full detailing, paint correction and ceramic coating with CarPro.',
      url: abs(base, path('car', locale)),
      logo: abs(base, '/brand/paintfix-wordmark-graphite.svg'),
      image: abs(base, '/og/paintfix.png'),
      telephone: site.phone,
      email: site.email,
      address,
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      areaServed: site.serviceArea.map((name) => ({ '@type': 'City', name })),
      openingHoursSpecification: site.openingHoursSpec.map((o) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: o.days,
        opens: o.opens,
        closes: o.closes,
      })),
      priceRange: '€€',
      founder: { '@id': id('owner') },
      department: { '@id': id('aviation') },
      knowsAbout: [
        'Fahrzeugaufbereitung',
        'Keramikversiegelung',
        'CarPro CQuartz',
        'Aircraft detailing',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': id('aviation'),
      name: site.aviationBrand,
      description:
        locale === 'de'
          ? 'Flugzeugaufbereitung für Business und General Aviation in NRW: Exterior-Wäsche, Brightwork-Politur mit NUVITE NuShine II und Kabinenaufbereitung mit Aero-Sense.'
          : 'Aircraft detailing for business and general aviation in North Rhine-Westphalia: exterior wash, brightwork polishing with NUVITE NuShine II and cabin detailing with Aero-Sense.',
      url: abs(base, path('aviation', locale)),
      logo: abs(base, '/brand/paintfix-aviation-seal-gold.svg'),
      image: abs(base, '/og/aviation.png'),
      email: site.aviationEmail,
      telephone: site.phone,
      address,
      areaServed: { '@type': 'State', name: 'Nordrhein-Westfalen' },
      parentOrganization: { '@id': id('business') },
    },
    {
      '@type': 'Person',
      '@id': id('owner'),
      name: site.owner,
      jobTitle: locale === 'de' ? 'Inhaber' : 'Owner',
      worksFor: { '@id': id('business') },
    },
  ];
}

export function packageServices(
  base: URL,
  locale: Locale,
  packages: { id: string; name: string; description: string; priceFrom: number }[],
) {
  return packages.map((p) => ({
    '@type': 'Service',
    '@id': abs(base, `${path('car', locale)}#service-${p.id}`),
    name: p.name,
    description: p.description,
    serviceType: locale === 'de' ? 'Fahrzeugaufbereitung' : 'Car detailing',
    provider: { '@id': abs(base, '/#business') },
    areaServed: site.serviceArea.map((name) => ({ '@type': 'City', name })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: p.priceFrom,
        priceCurrency: 'EUR',
      },
    },
  }));
}

export function aviationServices(
  base: URL,
  locale: Locale,
  services: { id: string; name: string; description: string }[],
) {
  return services.map((s) => ({
    '@type': 'Service',
    '@id': abs(base, `${path('aviation', locale)}#service-${s.id}`),
    name: s.name,
    description: s.description,
    serviceType: locale === 'de' ? 'Flugzeugaufbereitung' : 'Aircraft detailing',
    provider: { '@id': abs(base, '/#aviation') },
    areaServed: { '@type': 'State', name: 'Nordrhein-Westfalen' },
  }));
}

export function faqPage(base: URL, pagePath: string, items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    '@id': abs(base, `${pagePath}#faq`),
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumb(base: URL, trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(base, t.path),
    })),
  };
}

export { routes };
