import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from '../src/i18n/routes';

const pages = Object.entries(routes).flatMap(([key, byLocale]) =>
  (['de', 'en'] as const).map((locale) => ({
    key,
    locale,
    path: byLocale[locale],
    other: byLocale[locale === 'de' ? 'en' : 'de'],
  })),
);

test.describe('routes', () => {
  for (const p of pages) {
    test(`${p.path} renders with SEO basics`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

      const res = await page.goto(p.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute(
        'lang',
        p.locale === 'de' ? 'de-DE' : 'en-GB',
      );
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);

      // canonical + reciprocal hreflang
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(new URL(canonical!).pathname).toBe(p.path);
      const hreflangs = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((els) =>
          els.map((e) => [e.getAttribute('hreflang'), new URL(e.getAttribute('href')!).pathname]),
        );
      expect(hreflangs).toEqual(
        expect.arrayContaining([
          ['de-DE', routes[p.key as keyof typeof routes].de],
          ['en-GB', routes[p.key as keyof typeof routes].en],
          ['x-default', routes[p.key as keyof typeof routes].de],
        ]),
      );

      // language switch points to the counterpart
      await expect(page.locator('header .lang-switch')).toHaveAttribute('href', p.other);

      // JSON-LD parses (legal pages carry none)
      for (const raw of await page
        .locator('script[type="application/ld+json"]')
        .allTextContents()) {
        const data = JSON.parse(raw);
        expect(data['@context']).toBe('https://schema.org');
        expect(Array.isArray(data['@graph'])).toBe(true);
      }

      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

test.describe('accessibility (axe)', () => {
  for (const p of pages.filter((x) => ['home', 'car', 'aviation', 'contact'].includes(x.key))) {
    test(`${p.path} has no serious or critical violations`, async ({ page }) => {
      await page.goto(p.path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(
        serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      ).toEqual([]);
    });
  }
});

test.describe('no horizontal overflow', () => {
  for (const p of pages.filter((x) => x.locale === 'de')) {
    test(`${p.path}`, async ({ page }) => {
      await page.goto(p.path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe('forms', () => {
  test('car form validates and submits', async ({ page }) => {
    await page.goto('/kontakt');
    const form = page.locator('form.track-auto');
    await form.getByRole('button', { name: /Anfrage senden/ }).click();
    await expect(form.locator('[data-status]')).toContainText('Bitte prüfen');
    await expect(form.locator('[aria-invalid="true"]').first()).toBeVisible();

    await form.getByLabel('Name', { exact: true }).fill('Max Mustermann');
    await form.getByLabel('E-Mail').fill('max@example.com');
    await form.getByLabel(/Fahrzeug \(Marke/).fill('VW Golf');
    await form.locator('input[name="privacy"]').check();
    await page.waitForTimeout(3100); // minimum fill time (spam guard)
    await form.getByRole('button', { name: /Anfrage senden/ }).click();
    await expect(form.locator('[data-success]')).toBeVisible();
  });

  test('contact page deep-links to the aviation track', async ({ page }) => {
    await page.goto('/kontakt?track=aviation');
    await expect(page.locator('[data-panel="aviation"]')).toBeVisible();
    await expect(page.locator('[data-panel="auto"]')).toBeHidden();
    await expect(page.getByRole('radio', { name: 'Flugzeug' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  test('package link pre-selects the package on the car page', async ({ page }) => {
    await page.goto('/fahrzeugaufbereitung');
    await page.locator('a[data-package="ceramic"]').click();
    await expect(page.locator('.booking [data-package-select]')).toHaveValue('ceramic');
  });
});

test.describe('contact API', () => {
  test('rejects invalid payloads', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: { Accept: 'application/json', Origin: 'http://127.0.0.1:4329' },
      multipart: {
        track: 'auto',
        locale: 'de',
        name: 'x',
        email: 'nope',
        ts: String(Date.now() - 10_000),
      },
    });
    expect(res.status()).toBe(422);
    expect(await res.json()).toMatchObject({ ok: false });
  });

  test('silently accepts honeypot hits without sending', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: { Accept: 'application/json', Origin: 'http://127.0.0.1:4329' },
      multipart: { track: 'auto', locale: 'de', website: 'spam', ts: String(Date.now()) },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test('accepts a valid aviation request', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: { Accept: 'application/json', Origin: 'http://127.0.0.1:4329' },
      multipart: {
        track: 'aviation',
        locale: 'en',
        company: 'Example Aviation GmbH',
        name: 'Jane Doe',
        email: 'jane@example.com',
        aircraftType: 'Citation CJ3',
        location: 'EDDG',
        privacy: 'yes',
        ts: String(Date.now() - 10_000),
      },
    });
    expect(res.status()).toBe(200);
  });
});
