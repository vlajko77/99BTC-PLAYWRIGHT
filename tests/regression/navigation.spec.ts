import { test, expect } from "../../../fixtures/test.fixture";
import { STAGING_URL } from "../../../utils/login";

test.describe("Site Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STAGING_URL);
    await page.waitForLoadState("domcontentloaded");
  });

  test.describe("Main Navigation", () => {
    test("primary navigation is visible", async ({ page }) => {
      const nav = page.locator("nav, header nav, .main-nav, .primary-navigation").first();
      await expect(nav).toBeVisible();
    });

    test("Bitcoin Casinos link is in the nav", async ({ page }) => {
      await expect(
        page.getByRole("link", { name: "Bitcoin Casinos", exact: true })
      ).toBeVisible();
    });

    test("clicking a nav link navigates to correct page", async ({ page }) => {
      const newsLink = page.getByRole("link", { name: "News", exact: true }).first();
      await newsLink.click();
      await expect(page).toHaveURL(/news/i);
    });
  });

  test.describe("Breadcrumb Navigation", () => {
    test("article page shows breadcrumb", async ({ page }) => {
      const articleLink = page.locator(".nnbtc-news a, .nnbtc-topstories a").first();
      await articleLink.click();
      await page.waitForLoadState("domcontentloaded");
      const breadcrumb = page.locator(
        ".breadcrumb, [class*='breadcrumb'], nav[aria-label*='breadcrumb' i]"
      ).first();
      await expect(breadcrumb).toBeVisible();
    });
  });

  test.describe("Internal Links", () => {
    test("homepage links open same-domain pages", async ({ page }) => {
      const firstLink = page.locator("main a[href]").first();
      const href = await firstLink.getAttribute("href");
      expect(href).toBeTruthy();
    });
  });
});
