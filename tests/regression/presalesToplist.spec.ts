import { test, expect } from "../../fixtures/test.fixture";
import type { Page, BrowserContext } from "@playwright/test";
import {
  PresalesToplistPage,
  PRESALES_SUBMENU_PAGES,
} from "../../pages/frontend/PresalesToplistPage";
import { BASE_URL, stagingHttpCredentials } from "../../utils/config";

test.describe("Crypto Presales Navigation", { tag: "@regression" }, () => {
  test("Crypto Presales nav item is visible", { tag: "@smoke" }, async ({ page }) => {
    const toplistPage = new PresalesToplistPage(page);
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(toplistPage.navPresalesLink).toBeVisible();
  });

  test("hovering Crypto Presales reveals all submenu links", async ({
    page,
  }) => {
    const toplistPage = new PresalesToplistPage(page);
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await toplistPage.hoverNavPresales();

    for (const submenuPage of PRESALES_SUBMENU_PAGES.slice(1)) {
      await expect(toplistPage.submenuLink(submenuPage.navText)).toBeVisible();
    }
  });

  for (const submenuPage of PRESALES_SUBMENU_PAGES) {
    test(`clicking "${submenuPage.name}" navigates to correct page`, async ({
      page,
    }) => {
      const toplistPage = new PresalesToplistPage(page);
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      if (submenuPage.navText === "Crypto Presales") {
        await toplistPage.navPresalesLink.click();
      } else {
        await toplistPage.hoverNavPresales();
        await toplistPage.submenuLink(submenuPage.navText).click();
      }

      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(
        new RegExp(submenuPage.path.replace(/\//g, "\\/"))
      );
    });
  }
});

test.describe("Presales Toplist — per page", { tag: "@regression" }, () => {
  // Serial mode prevents 6 simultaneous beforeAll navigations from hitting the CBM
  // widget API concurrently — rate-limiting causes timeouts when pages load in parallel
  test.describe.configure({ mode: "serial" });
  for (const submenuPage of PRESALES_SUBMENU_PAGES) {
    test.describe(submenuPage.name, () => {
      let toplistPage: PresalesToplistPage;
      let sharedPage: Page;
      let sharedContext: BrowserContext;

      // Navigate once per describe block — avoids hitting the CBM widget API
      // multiple times for the same page (rate-limiting causes flaky timeouts)
      test.beforeAll(async ({ browser }) => {
        sharedContext = await browser.newContext({
          ignoreHTTPSErrors: true,
          baseURL: BASE_URL,
          ...stagingHttpCredentials,
        });
        sharedPage = await sharedContext.newPage();
        toplistPage = new PresalesToplistPage(sharedPage);
        await toplistPage.navigate(submenuPage.path);
      });

      test.afterAll(async () => {
        await sharedContext?.close();
      });

      test("page has an H1 heading", async () => {
        await expect(
          sharedPage.getByRole("heading", { level: 1 }).first()
        ).toBeVisible();
      });

      test("toplist wrapper is visible", async () => {
        await toplistPage.verifyToplistVisible();
      });

      test("toplist renders at least 1 offer", async () => {
        const count = await toplistPage.getOfferCount();
        expect(count).toBeGreaterThan(0);
      });

      test("each offer has title, logo, and CTA button", async () => {
        const count = await toplistPage.getOfferCount();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          const offer = toplistPage.offers.nth(i);
          await toplistPage.verifyOfferHasRequiredElements(offer);
        }
      });

      test("first offer CTA button links to a valid URL", async () => {
        const firstOffer = toplistPage.offers.first();
        const ctaButton = toplistPage.offerCtaButton(firstOffer);
        await expect(ctaButton).toBeVisible();
        const href = await ctaButton.getAttribute("href");
        expect(href).not.toBeNull();
        expect(href).not.toBe("");
      });

      test("first offer title is non-empty", async () => {
        const firstOffer = toplistPage.offers.first();
        const title = toplistPage.offerTitle(firstOffer);
        const text = await title.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      });
    });
  }
});
