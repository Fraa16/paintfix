// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { routes } from './src/i18n/routes.ts';

// Production domain. Set SITE_URL in Vercel once the IONOS domain is connected.
const site = process.env.SITE_URL ?? 'https://www.paintfix.de';

export default defineConfig({
  site,
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  // Static by default; only /api/contact renders on demand.
  adapter: vercel({
    // Cookieless Vercel Web Analytics. Off until the client approves the privacy text (§ 25 TDDDG).
    webAnalytics: { enabled: process.env.ENABLE_ANALYTICS === '1' },
    maxDuration: 10,
  }),
  integrations: [
    sitemap({
      // Legal pages are noindex; the API is not a page.
      filter: (page) =>
        !/\/(api|404|impressum|datenschutz|en\/legal-notice|en\/privacy)(\/|$)/.test(page),
      // Localised slugs can't be paired automatically, so hreflang alternates come from the route map.
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const pair = Object.values(routes).find((r) => r.de === path || r.en === path);
        if (pair) {
          item.links = [
            { url: new URL(pair.de, site).href, lang: 'de-DE' },
            { url: new URL(pair.en, site).href, lang: 'en-GB' },
          ];
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
