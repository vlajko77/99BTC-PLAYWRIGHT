import { test, expect } from "../../fixtures/test.fixture";
import {
  PresalesToplistPage,
  PRESALES_SUBMENU_PAGES,
} from "../../pages/frontend/PresalesToplistPage";

test.describe("Crypto Presales Navigation", () => {
  test("Crypto Presales nav item is visible", async ({ page }) => {
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

test.describe("Presales Toplist — per page", () => {
  for (const submenuPage of PRESALES_SUBMENU_PAGES) {
    test.describe(submenuPage.name, () => {
      let toplistPage: PresalesToplistPage;

      test.beforeEach(async ({ page }) => {
        toplistPage = new PresalesToplistPage(page);
        await toplistPage.navigate(submenuPage.path);
      });

      test("page has an H1 heading", async ({ page }) => {
        await expect(
          page.getByRole("heading", { level: 1 }).first()
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
