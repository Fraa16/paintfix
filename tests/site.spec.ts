import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  { path: "/", lang: "de", brand: "car" },
  { path: "/leistungen", lang: "de", brand: "car" },
  { path: "/anfrage", lang: "de", brand: "car" },
  { path: "/aviation", lang: "de", brand: "av" },
  { path: "/en/aviation", lang: "en", brand: "av" },
  { path: "/impressum", lang: "de", brand: "car" },
  { path: "/datenschutz", lang: "de", brand: "car" },
  { path: "/agb", lang: "de", brand: "car" },
] as const;

const widths = [360, 402, 980, 1440, 1920];

/** Collects page errors, console errors and requests to other hosts while a test runs. */
function watch(page: Page) {
  const errors: string[] = [];
  const foreign: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("request", (r) => {
    const url = new URL(r.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname) && url.protocol.startsWith("http")) {
      foreign.push(r.url());
    }
  });
  return { errors, foreign };
}

test.describe("routes", () => {
  for (const r of routes) {
    test(`${r.path} renders`, async ({ page }) => {
      const { errors, foreign } = watch(page);
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", r.lang);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(5);
      await expect(page.locator(`[data-brand="${r.brand}"]`).first()).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(errors, errors.join("\n")).toEqual([]);
      // CLAUDE.md rule 10: no third-party requests (fonts are self-hosted).
      expect(foreign, foreign.join("\n")).toEqual([]);
    });
  }

  test("unknown paths return 404", async ({ page }) => {
    const res = await page.goto("/gibt-es-nicht");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveCount(1);
  });
});

test.describe("no horizontal scrolling from 360 to 1920 px", () => {
  for (const r of routes) {
    test(r.path, async ({ page }) => {
      test.skip(test.info().project.name !== "desktop", "viewport is set per width below");
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(r.path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${r.path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("accessibility (axe)", () => {
  for (const r of routes) {
    test(`${r.path} has no serious or critical violations`, async ({ page }) => {
      await page.goto(r.path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
    });
  }
});

test.describe("brand separation (CLAUDE.md rule 5)", () => {
  for (const path of ["/aviation", "/en/aviation"]) {
    test(`${path} never uses the car signal red`, async ({ page }) => {
      await page.goto(path);
      const red = await page.evaluate(() => {
        const hits: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>("body *")) {
          // Die Markenwechsel-Blende zeigt beim Wechsel zur Fahrzeugseite deren Logo (README 9.4).
          if (el.closest("[data-pf-curtain]")) continue;
          const s = getComputedStyle(el);
          for (const prop of [
            "color",
            "backgroundColor",
            "borderTopColor",
            "borderBottomColor",
          ] as const) {
            if (s[prop] === "rgb(200, 50, 42)")
              hits.push(`${el.tagName.toLowerCase()}.${el.className} ${prop}`);
          }
        }
        return hits;
      });
      expect(red).toEqual([]);
    });
  }
});
