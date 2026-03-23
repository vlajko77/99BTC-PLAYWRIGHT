import { test, expect } from "../../../fixtures/test.fixture";
import { CategoryPage } from "../../../pages/frontend/CategoryPage";

test.describe("Category Page", () => {
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new CategoryPage(page);
    await categoryPage.navigate("bitcoin");
  });

  test("category page loads with main content area", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
  });

  test("category page has a heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("category page shows article cards", async ({ page }) => {
    const cards = page.locator("article, .nnbtc-card, .post-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("article cards have links", async ({ page }) => {
    const firstCard = page.locator("article, .nnbtc-card").first();
    await expect(firstCard).toBeVisible();
    const link = firstCard.getByRole("link").first();
    await expect(link).toBeVisible();
  });

  test("each article card link has valid href", async ({ page }) => {
    const cards = page.locator("article, .nnbtc-card").first();
    const link = cards.getByRole("link").first();
    const href = await link.getAttribute("href");
    expect(href).not.toBeNull();
    expect(href).not.toBe("");
  });
});
