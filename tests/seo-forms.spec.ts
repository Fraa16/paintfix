import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("robots.txt points to the sitemap, the sitemap lists the indexable pages", async ({
    request,
  }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBe(true);
    const xml = await res.text();
    for (const path of [
      "/leistungen",
      "/leistungen/lackkorrektur",
      "/anfrage",
      "/aviation",
      "/en/aviation",
      "/aviation/aussenpflege",
      "/en/aviation/exterior-care",
    ]) {
      expect(xml).toContain(`${path}</loc>`);
    }
    expect(xml).not.toContain("/impressum");
  });

  const pages = [
    { path: "/", accent: "#c8322a", type: "AutoBodyShop" },
    { path: "/aviation", accent: "#c8ae82", type: "LocalBusiness" },
    { path: "/en/aviation", accent: "#c8ae82", type: "LocalBusiness" },
  ];
  for (const { path, accent, type } of pages) {
    test(`${path} has its icon, share image and structured data`, async ({ page, request }) => {
      await page.goto(path);
      const icon = page.locator('head link[rel="icon"][type="image/svg+xml"]');
      await expect(icon).toHaveCount(1);
      const svg = await (await request.get((await icon.getAttribute("href"))!)).text();
      expect(svg).toContain(accent);
      await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveCount(1);

      const og = await page.locator('head meta[property="og:image"]').getAttribute("content");
      const image = await request.get(new URL(og!).pathname + new URL(og!).search);
      expect(image.headers()["content-type"]).toContain("image/jpeg");

      const ld = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
      );
      expect(ld["@type"]).toBe(type);
      expect(ld.address.streetAddress).toBe("Orkotten 43");
    });
  }
});

test.describe("service pages", () => {
  test("every page in the sitemap responds (content and page folders match)", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(paths.length).toBeGreaterThan(5);
    for (const path of paths) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });

  const servicePages = [
    {
      path: "/leistungen/lackkorrektur",
      provider: "AutoBodyShop",
      crumbs: 3,
      request: "/anfrage?leistungen=politur",
    },
    {
      path: "/aviation/aussenpflege",
      provider: "LocalBusiness",
      crumbs: 2,
      alt: "/en/aviation/exterior-care",
    },
    {
      path: "/en/aviation/exterior-care",
      provider: "LocalBusiness",
      crumbs: 2,
      alt: "/aviation/aussenpflege",
    },
  ];
  for (const p of servicePages) {
    test(`${p.path} has canonical, share image and Service data`, async ({ page, request }) => {
      await page.goto(p.path);
      const canonical = await page.locator('head link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical!).pathname).toBe(p.path);
      if (p.alt) {
        const alt = page.locator(`head link[rel="alternate"][hreflang]`);
        await expect(alt).toHaveCount(3);
        const hrefs = await alt.evaluateAll((els) =>
          els.map((e) => new URL(e.getAttribute("href")!).pathname),
        );
        expect(hrefs).toContain(p.alt);
      }
      const og = await page.locator('head meta[property="og:image"]').getAttribute("content");
      // Eigenes Share-Bild je Seite (scripts/brand-assets.py), nicht das des Bereichs.
      expect(new URL(og!).pathname).toContain(`${p.path}/opengraph-image`);
      const image = await request.get(new URL(og!).pathname + new URL(og!).search);
      expect(image.headers()["content-type"]).toContain("image/jpeg");
      await expect(page.locator('head meta[property="og:image:alt"]')).toHaveCount(1);

      const ld = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
      );
      const service = ld["@graph"].find((n: { "@type": string }) => n["@type"] === "Service");
      const crumbs = ld["@graph"].find((n: { "@type": string }) => n["@type"] === "BreadcrumbList");
      expect(service.provider["@type"]).toBe(p.provider);
      expect(service.offers).toBeUndefined();
      expect(crumbs.itemListElement).toHaveLength(p.crumbs);
      if (p.request) {
        await expect(page.locator(`main a[href="${p.request}"]`).first()).toBeVisible();
      }
    });
  }

  test("the home page focus areas link to their service pages", async ({ page }) => {
    await page.goto("/");
    const list = page.locator("#leistungen");
    for (const [name, path] of [
      ["Smart Repair", "/leistungen/smart-repair"],
      ["Lackkorrektur", "/leistungen/lackkorrektur"],
      ["Leasingrückgabe", "/leistungen/leasingrueckgabe"],
      ["Fahrzeugaufbereitung", "/leistungen/fahrzeugaufbereitung"],
    ]) {
      await expect(
        list.getByRole("link", { name: new RegExp(`^\\d+\\s*${name}`) }),
      ).toHaveAttribute("href", path);
    }
    await list.getByRole("link", { name: /Lackkorrektur/ }).click();
    await expect(page).toHaveURL(/\/leistungen\/lackkorrektur$/);
    // Next hält die Startseite versteckt im DOM, deshalb die sichtbare H1.
    await expect(page.getByRole("heading", { level: 1, name: /Lackkorrektur/ })).toBeVisible();
  });

  test("the aviation page links each service area to its page", async ({ page }) => {
    await page.goto("/aviation");
    const footer = page.locator("footer");
    for (const path of [
      "/aviation/aussenpflege",
      "/aviation/kabinenpflege",
      "/aviation/oberflaechenschutz",
    ]) {
      await expect(footer.locator(`a[href="${path}"]`)).toHaveCount(1);
    }
    // Tab-Version (reduzierte Bewegung): Link des gewählten Bereichs unter der Liste.
    const services = page.locator("#av-services");
    await services.getByRole("tab", { name: /Kabine/ }).click();
    await services.getByRole("link", { name: "Mehr zur Kabinenpflege" }).click();
    await expect(page).toHaveURL(/\/aviation\/kabinenpflege$/);
  });

  test("the language switch keeps the aviation service page", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "header language links are the same");
    await page.goto("/aviation/aussenpflege");
    await page.locator('header a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/en\/aviation\/exterior-care$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("the aviation service page preselects its area in the quote form", async ({ page }) => {
    await page.goto("/en/aviation/exterior-care");
    const form = page.locator("#av-contact form");
    await expect(form.getByRole("button", { name: "Exterior" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(form.getByRole("button", { name: "Cabin" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

test.describe("forms", () => {
  test("request form shows errors under the fields and focuses the first one", async ({ page }) => {
    await page.goto("/anfrage");
    // Erst nach der Hydration absenden, sonst prüft der Browser statt des Formulars.
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    const name = page.getByRole("textbox", { name: "Name" });
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Bitte geben Sie Ihren Namen an.")).toBeVisible();
    await expect(
      page.getByText("Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an."),
    ).toBeVisible();
    await expect(
      page.getByText("Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu."),
    ).toBeVisible();

    await name.fill("Erika Mustermann");
    await expect(page.getByText("Bitte geben Sie Ihren Namen an.")).toHaveCount(0);
  });

  test("a valid request is sent, or fails with the phone hint (mail not configured)", async ({
    page,
  }) => {
    await page.goto("/anfrage");
    // Erst nach der Hydration tippen, sonst setzt React die Felder zurück.
    await page.waitForLoadState("networkidle");
    await page.getByRole("textbox", { name: "Name" }).fill("Erika Mustermann");
    await page.getByRole("textbox", { name: "Telefon" }).fill("0151 2345678");
    await page.getByText("Ich bin einverstanden").click();
    // Mindest-Ausfüllzeit (lib/forms/actions.ts)
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    await expect(
      page
        .getByRole("heading", { name: /^Danke, Erika\.$/ })
        .or(page.getByText("Die Anfrage konnte gerade nicht gesendet werden.", { exact: false })),
    ).toBeVisible();
  });

  test("aviation quote form validates required fields and the ICAO code", async ({ page }) => {
    await page.goto("/en/aviation#av-contact");
    const form = page.locator("#av-contact form");
    await form.getByRole("button", { name: "Send request" }).click();
    await expect(form.getByRole("textbox", { name: "Company" })).toBeFocused();
    await expect(form.getByText("Please fill in this field.").first()).toBeVisible();

    await form.getByRole("textbox", { name: "Airport (ICAO)" }).fill("ED");
    await form.getByRole("button", { name: "Send request" }).click();
    await expect(
      form.getByText("Please enter the four-letter ICAO code, e.g. EDDG."),
    ).toBeVisible();
  });

  test("documents form rejects an invalid email address", async ({ page }) => {
    await page.goto("/aviation");
    const email = page.getByRole("textbox", { name: "Geschäftliche E-Mail" });
    await email.fill("kein-mail");
    await page.getByRole("button", { name: "Unterlagen anfordern" }).click();
    await expect(email).toBeFocused();
    await expect(page.getByText("Bitte eine gültige E-Mail-Adresse eingeben.")).toBeVisible();
  });
});
