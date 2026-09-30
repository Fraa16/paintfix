export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export type RouteKey = 'home' | 'car' | 'aviation' | 'contact' | 'imprint' | 'privacy';

/** Localised slugs. The language switch maps every page to its counterpart through this table. */
export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { de: '/', en: '/en' },
  car: { de: '/fahrzeugaufbereitung', en: '/en/car-detailing' },
  aviation: { de: '/flugzeugaufbereitung', en: '/en/aircraft-detailing' },
  contact: { de: '/kontakt', en: '/en/contact' },
  imprint: { de: '/impressum', en: '/en/legal-notice' },
  privacy: { de: '/datenschutz', en: '/en/privacy' },
};

export function path(key: RouteKey, locale: Locale, hash?: string): string {
  const base = routes[key][locale];
  return hash ? `${base}#${hash}` : base;
}

export const htmlLang: Record<Locale, string> = { de: 'de-DE', en: 'en-GB' };

/** In-page anchors that other pages link to. */
export const anchors = {
  de: { book: 'termin', packages: 'pakete', request: 'anfrage', services: 'leistungen' },
  en: { book: 'book', packages: 'packages', request: 'request', services: 'services' },
} as const satisfies Record<Locale, Record<string, string>>;
