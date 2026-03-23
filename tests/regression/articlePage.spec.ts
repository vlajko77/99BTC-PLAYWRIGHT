import { test, expect } from "../../../fixtures/test.fixture";
import { STAGING_URL } from "../../../utils/login";

test.describe("Article Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a known article path
    await page.goto(STAGING_URL);
    await page.waitForLoadState("domcontentloaded");
    const articleLink = page.locator(".nnbtc-news a, .nnbtc-topstories a").first();
    await articleLink.click();
    await page.waitForLoadState("domcontentloaded");
  });

  test("article page has main content area", async ({ page }) => {
    await expect(page.locator("main.site-main")).toBeVisible();
  });

  test("article page has h1 title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("article page has author information", async ({ page }) => {
    const author = page.locator(".nnbtc-article-top__author-top, [class*='author']").first();
    await expect(author).toBeVisible();
  });

  test("article page has readable content", async ({ page }) => {
    const content = page.locator(".entry-content, .post-content, article").first();
    await expect(content).toBeVisible();
    const text = await content.textContent();
    expect(text?.length).toBeGreaterThan(100);
  });

  test("trust section is visible on article page", async ({ page }) => {
    const trust = page.locator(".trust-us");
    await trust.scrollIntoViewIfNeeded();
    await expect(trust).toBeVisible();
  });
});
