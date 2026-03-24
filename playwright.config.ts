import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import { config } from "dotenv";

config();

// Use saved storageState if present (useful for staging sites protected by Cloudflare JS challenges)
const storageStatePath = fs.existsSync("auth/storageState.json")
  ? "auth/storageState.json"
  : undefined;

export default defineConfig({
  testDir: "./tests",
  /* Skip visual regression on CI — snapshots are platform-specific (darwin).
     To enable on CI: run npm run test:visual:update on Linux, commit the *-linux.png files. */
  testIgnore: process.env.CI ? ["**/visualRegression.spec.ts"] : [],
  /* Per-test timeout: 60s on CI, 120s locally */
  timeout: process.env.CI ? 60000 : 120000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use multiple workers locally; keep CI sequential to avoid resource contention. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "https://99bitcoins.local",
    ignoreHTTPSErrors: true,
    // If a saved storage state exists, use it to run tests as an authenticated user
    storageState: process.env.PLAYWRIGHT_STORAGE_STATE || storageStatePath,
    // HTTP Basic Auth for staging environments (ignored when env vars are not set)
    ...(process.env.STAGING_HTTP_USER && process.env.STAGING_HTTP_PASS
      ? { httpCredentials: { username: process.env.STAGING_HTTP_USER, password: process.env.STAGING_HTTP_PASS } }
      : {}),

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      // Launch Chromium maximized and let the browser window determine the viewport
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ["--start-maximized"],
        },
        headless: true,
      },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
