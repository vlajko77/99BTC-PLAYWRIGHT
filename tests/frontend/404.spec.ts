import { test, expect } from "../../fixtures/test.fixture";

test.describe("404 Error Page", () => {
  test("navigating to a non-existent URL returns 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-definitely-does-not-exist-xyz-123");
    expect(response?.status()).toBe(404);
  });

  test("404 page shows appropriate error message", async ({ page }) => {
    await page.goto("/this-page-definitely-does-not-exist-xyz-123");
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).toMatch(/not found|404|page.*exist|oops/);
  });

  test("404 page still has site header", async ({ page }) => {
    await page.goto("/this-page-definitely-does-not-exist-xyz-123");
    const header = page.locator("header, #masthead, .site-header").first();
    await expect(header).toBeVisible();
  });

  test("404 page still has navigation", async ({ page }) => {
    await page.goto("/this-page-definitely-does-not-exist-xyz-123");
    const nav = page.locator("nav, .main-navigation").first();
    await expect(nav).toBeVisible();
  });
});
