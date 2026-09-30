import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/routes';

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getPackages() {
  return (await getCollection('packages')).sort(byOrder);
}

export async function getAddons() {
  return (await getCollection('addons')).sort(byOrder);
}

export async function getAviationServices() {
  return (await getCollection('aviationServices')).sort(byOrder);
}

export async function getAirfields() {
  return (await getCollection('airfields')).sort(byOrder);
}

export async function getAviationStats() {
  return (await getCollection('aviationStats')).sort(byOrder);
}

/** Lowest "ab"-price across all packages. Used in hero copy and meta descriptions. */
export async function getMinPrice() {
  const packages = await getPackages();
  return Math.min(...packages.map((p) => p.data.priceFrom));
}

export async function getPriceMap(): Promise<Record<string, number>> {
  const packages = await getPackages();
  return Object.fromEntries(packages.map((p) => [p.id, p.data.priceFrom]));
}

export function formatPrice(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
    maximumFractionDigits: 0,
  }).format(value);
}

/** Replace {key} tokens. */
export function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  draft: boolean;
}

/** FAQ entries for one page, with {price:<package-id>} tokens resolved. */
export async function getFaqs(
  page: CollectionEntry<'faqs'>['data']['page'],
  locale: Locale,
): Promise<FaqItem[]> {
  const [faqs, prices] = await Promise.all([getCollection('faqs'), getPriceMap()]);
  return faqs
    .filter((f) => f.data.page === page)
    .sort(byOrder)
    .map((f) => ({
      id: f.id,
      draft: f.data.draft,
      q: f.data.q[locale],
      a: f.data.a[locale].replace(/\{price:([\w-]+)\}/g, (m, id) =>
        id in prices ? formatPrice(prices[id], locale) : m,
      ),
    }));
}
