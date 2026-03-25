import { test, expect } from "../../fixtures/test.fixture";
import type { Locator, Page, PageScreenshotOptions } from "@playwright/test";

type ScreenshotExtra = Omit<PageScreenshotOptions, "path"> & {
  mask?: Locator[];
  threshold?: number;
  maxDiffPixelRatio?: number;
  timeout?: number;
};

// ─── Shared helpers ────────────────────────────────────────────────────────────

/** Locators for elements that change on every load (prices, dates, ads). */
function dynamicMasks(page: Page): Locator[] {
  return [
    page.locator("[class*='price']"),        // live crypto prices
    page.locator("[class*='percent']"),      // % change figures
    page.locator("[class*='date']"),         // publication dates
    page.locator("[class*='ad-']"),          // ad containers
    page.locator("[id*='ad']"),              // ad wrappers by id
    page.locator("iframe"),                  // ad iframes
  ];
}

/** Standard screenshot options applied to every assertion. */
const screenshotOptions = {
  animations: "disabled" as const,
  threshold: 0.2,        // per-pixel colour tolerance (0–1)
  maxDiffPixelRatio: 0.05, // up to 5 % of pixels may differ
  timeout: 30000,        // allow up to 30 s to reach a stable screenshot
};

async function waitAndScreenshot(
  page: Page,
  name: string,
  extra: ScreenshotExtra = {}
) {
  // Cap networkidle at 45s — pages with live ads/prices may never fully settle
  await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => {});
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    mask: dynamicMasks(page),
    ...screenshotOptions,
    ...extra,
  });
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

test.describe("Visual Regression", { tag: ["@regression", "@visual"] }, () => {
  test.describe("Homepage", () => {
    test("full page matches snapshot", async ({ page }) => {
      await page.goto("/");
      await waitAndScreenshot(page, "homepage-full.png");
    });

    test("header matches snapshot", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const header = page.locator("header, .btc-header").first();
      await expect(header).toHaveScreenshot("homepage-header.png", {
        animations: "disabled",
        mask: dynamicMasks(page),
        threshold: 0.2,
        maxDiffPixelRatio: 0.05,
        timeout: 30000,
      });
    });

    test("footer matches snapshot", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const footer = page.locator("footer, .site-footer").first();
      await expect(footer).toHaveScreenshot("homepage-footer.png", {
        animations: "disabled",
        mask: [
          ...dynamicMasks(page),
          page.locator("[class*='ticker']"),
          page.locator("[class*='crypto']"),
        ],
        threshold: 0.2,
        maxDiffPixelRatio: 0.10, // footer contains live crypto content
        timeout: 30000,
      });
    });
  });

  test.describe("Category page — Bitcoin", () => {
    test.slow(); // can be slow under concurrent screenshot load
    test("full page matches snapshot", async ({ page }) => {
      await page.goto("/category/bitcoin/");
      await waitAndScreenshot(page, "category-bitcoin-full.png");
    });
  });

  /** Extra masks for presales pages — live counters and raised amounts change constantly. */
  function presalesMasks(page: Page): Locator[] {
    return [
      ...dynamicMasks(page),
      page.locator(".cbm-presale-toplist__date-body"),
      page.locator(".cbm-presale-toplist__meta-body"),
      page.locator("[class*='countdown']"),
      page.locator("[class*='raised']"),
    ];
  }

  test.describe("Crypto Presales toplist", () => {
    test.slow();
    test("full page matches snapshot", async ({ page }) => {
      await page.goto("/cryptocurrency/crypto-presales/");
      // Wait for toplist to render before capturing
      await page.locator(".cbm-presale-toplist__offer").first().waitFor({
        state: "visible",
        timeout: 15000,
      });
      await waitAndScreenshot(page, "presales-toplist-full.png", {
        mask: presalesMasks(page),
      });
    });

    test("toplist widget matches snapshot", async ({ page }) => {
      await page.goto("/cryptocurrency/crypto-presales/");
      await page.locator(".cbm-presale-toplist__offer").first().waitFor({
        state: "visible",
        timeout: 15000,
      });
      await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => {});
      const toplist = page.locator(".cbm-presale-toplist__wrapper").first();
      await expect(toplist).toHaveScreenshot("presales-toplist-widget.png", {
        animations: "disabled",
        mask: presalesMasks(page),
        threshold: 0.2,
        maxDiffPixelRatio: 0.05,
        timeout: 30000,
      });
    });
  });

  test.describe("Best Crypto to Buy", () => {
    test.slow();
    test("full page matches snapshot", async ({ page }) => {
      await page.goto("/cryptocurrency/best-crypto-to-buy/");
      await page.locator(".cbm-presale-toplist__offer").first().waitFor({
        state: "visible",
        timeout: 15000,
      });
      await waitAndScreenshot(page, "best-crypto-to-buy-full.png", {
        mask: presalesMasks(page),
      });
    });
  });

  test.describe("Article page", () => {
    test("full page matches snapshot", async ({ page }) => {
      // Navigate via the homepage news section for a real article
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      const articleLink = page
        .locator(".nnbtc-news a, .nnbtc-topstories a")
        .first();
      await articleLink.click();
      await waitAndScreenshot(page, "article-page-full.png");
    });
  });

  test.describe("Search results", () => {
    test("full page matches snapshot", async ({ page }) => {
      await page.goto("/?s=bitcoin");
      await page.waitForLoadState("networkidle");
      await waitAndScreenshot(page, "search-results-bitcoin-full.png");
    });
  });

  test.describe("404 page", () => {
    test("full page matches snapshot", async ({ page }) => {
      await page.goto("/this-page-does-not-exist-404-test/");
      await waitAndScreenshot(page, "404-full.png");
    });
  });

  test.describe("Mobile viewport", () => {
    test.use({ viewport: { width: 375, height: 812 } });
    test.slow(); // mobile pages can be slower to load

    test("homepage matches snapshot on mobile", async ({ page }) => {
      await page.goto("/");
      await waitAndScreenshot(page, "homepage-mobile-full.png");
    });

    test("header matches snapshot on mobile", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const header = page.locator("header, .btc-header").first();
      await expect(header).toHaveScreenshot("homepage-mobile-header.png", {
        animations: "disabled",
        mask: dynamicMasks(page),
        threshold: 0.2,
        maxDiffPixelRatio: 0.05,
        timeout: 30000,
      });
    });
  });
});
