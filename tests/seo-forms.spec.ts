import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("robots.txt points to the sitemap, the sitemap lists the indexable pages", async ({
    request,
  }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBe(true);
    const xml = await res.text();
    for (const path of ["/leistungen", "/anfrage", "/aviation", "/en/aviation"]) {
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

test.describe("forms", () => {
  test("request form shows errors under the fields and focuses the first one", async ({ page }) => {
    await page.goto("/anfrage");
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
