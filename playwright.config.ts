import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks: routes, language, horizontal overflow at the handoff widths, accessibility
 * (axe) and the main UI states. Runs against `next dev` on port 4329, or against BASE_URL if set
 * (e.g. a Vercel preview).
 */
const PORT = 4329;
const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL,
    // Static state of the design (README 9: all motion off with reduced motion).
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 402, height: 874 }, hasTouch: true },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npx next dev --port ${PORT} --hostname 127.0.0.1`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
