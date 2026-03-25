import { test, expect } from "../../fixtures/test.fixture";
import { CategoryPage } from "../../pages/frontend/CategoryPage";

test.describe("Category Page", { tag: "@regression" }, () => {
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new CategoryPage(page);
    await categoryPage.navigate("bitcoin");
  });

  test("category page loads with main content area", { tag: "@smoke" }, async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
  });

  test("category page has a heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("category page shows article cards", async ({ page }) => {
    const cards = page.locator(".nnbtc-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("article cards have links", async ({ page }) => {
    // .nnbtc-card elements are <a> tags — the card itself is the link
    const firstCard = page.locator(".nnbtc-card").first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute("href");
    expect(href).not.toBeNull();
    expect(href).not.toBe("");
  });

  test("each article card link has valid href", async ({ page }) => {
    const firstCard = page.locator(".nnbtc-card").first();
    const href = await firstCard.getAttribute("href");
    expect(href).not.toBeNull();
    expect(href).not.toBe("");
  });
});
