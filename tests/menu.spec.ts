import { test, expect } from "@playwright/test";

const desktop = () => test.info().project.name === "desktop";

const carServices: Array<[string, string]> = [
  ["Smart Repair", "/leistungen/smart-repair"],
  ["Lackkorrektur", "/leistungen/lackkorrektur"],
  ["Leasingrückgabe", "/leistungen/leasingrueckgabe"],
  ["Fahrzeugaufbereitung", "/leistungen/fahrzeugaufbereitung"],
  ["Innenaufbereitung", "/leistungen/innenaufbereitung"],
  ["Keramikversiegelung", "/leistungen/keramikversiegelung"],
];

test.describe("car menu", () => {
  test("mega menu lists every service and closes with Escape", async ({ page }) => {
    test.skip(!desktop(), "mega menu from 980px");
    await page.goto("/leistungen");
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Leistungen & Preise" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator("#car-mega");
    await expect(panel).toBeVisible();
    for (const [name, href] of carServices) {
      await expect(panel.getByRole("link", { name: new RegExp(`^${name}`) })).toHaveAttribute(
        "href",
        href,
      );
    }
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("a mega menu link navigates and closes the menu", async ({ page }) => {
    test.skip(!desktop(), "mega menu from 980px");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Leistungen & Preise" }).click();
    await page
      .locator("#car-mega")
      .getByRole("link", { name: /^Keramikversiegelung/ })
      .click();
    await expect(page).toHaveURL(/\/leistungen\/keramikversiegelung$/);
    await expect(page.locator("#car-mega")).toBeHidden();
  });

  test("mobile menu lists every service", async ({ page }) => {
    test.skip(desktop(), "menu button below 980px");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Menü" }).click();
    const menu = page.locator("#car-menu");
    await expect(menu).toBeVisible();
    for (const [name, href] of carServices) {
      await expect(menu.getByRole("link", { name: new RegExp(`^${name}`) })).toHaveAttribute(
        "href",
        href,
      );
    }
    await menu.getByRole("link", { name: /^Innenaufbereitung/ }).click();
    await expect(page).toHaveURL(/\/leistungen\/innenaufbereitung$/);
    await expect(menu).toBeHidden();
  });
});

test.describe("aviation menu", () => {
  test("mega menu shows the three areas and closes with Escape", async ({ page }) => {
    test.skip(!desktop(), "mega menu from 1240px");
    await page.goto("/aviation");
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Leistungen" });
    await trigger.click();
    const panel = page.locator("#av-mega");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: "Außenpflege" })).toHaveAttribute(
      "href",
      "/aviation/aussenpflege",
    );
    await expect(panel.getByRole("link", { name: "Kabinenpflege" })).toHaveAttribute(
      "href",
      "/aviation/kabinenpflege",
    );
    await expect(panel.getByRole("link", { name: "Oberflächenschutz" })).toHaveAttribute(
      "href",
      "/aviation/oberflaechenschutz",
    );
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("mobile menu has the areas, sections and the language switch", async ({ page }) => {
    test.skip(desktop(), "menu button below 1240px");
    await page.goto("/en/aviation");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.locator("#av-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /Exterior care/ })).toHaveAttribute(
      "href",
      "/en/aviation/exterior-care",
    );
    await expect(menu.getByRole("link", { name: "Deutsch" })).toHaveAttribute("href", "/aviation");
    // Die mobile Aktionsleiste blendet bei offenem Menü aus.
    await expect(page.getByRole("navigation", { name: "Quick contact" })).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});
