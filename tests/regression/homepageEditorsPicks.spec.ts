import { test, expect } from "../../fixtures/test.fixture";

test.describe("Homepage Editor's Picks", { tag: "@regression" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto("/");
  });

  test("Editor's Picks section heading is visible", async ({ homePage }) => {
    await homePage.editorPicksSection.scrollIntoViewIfNeeded();
    await expect(homePage.editorPicksHeading).toBeVisible();
  });

  test("all 4 tab buttons are visible", async ({ homePage }) => {
    await homePage.editorPicksSection.scrollIntoViewIfNeeded();
    await expect(homePage.editorPicksTabTopArticles).toBeVisible();
    await expect(homePage.editorPicksTabGuides).toBeVisible();
    await expect(homePage.editorPicksTabComparisons).toBeVisible();
    await expect(homePage.editorPicksTabReviews).toBeVisible();
  });

  test("Top Articles is the default active tab", async ({ homePage }) => {
    await homePage.editorPicksSection.scrollIntoViewIfNeeded();
    await expect(homePage.editorPicksTabTopArticles).toHaveClass(/is-active/);
  });

  test("clicking Guides tab activates it", async ({ homePage }) => {
    await homePage.editorPicksSection.scrollIntoViewIfNeeded();
    await homePage.clickEditorPicksTab("Guides");
    await expect(homePage.editorPicksTabGuides).toHaveClass(/is-active/);
  });

  test("clicking Comparisons tab activates it", async ({ homePage }) => {
    await homePage.editorPicksSection.scrollIntoViewIfNeeded();
    await homePage.clickEditorPicksTab("Comparisons");
    await expect(homePage.editorPicksTabComparisons).toHaveClass(/is-active/);
  });

  test("clicking Reviews tab activates it", async ({ homePage }) => {
    await homePage.editorPicksSection.scrollIntoViewIfNeeded();
    await homePage.clickEditorPicksTab("Reviews");
    await expect(homePage.editorPicksTabReviews).toHaveClass(/is-active/);
  });

  test("active tab displays article cards", async ({ homePage }) => {
    await homePage.editorPicksSection.scrollIntoViewIfNeeded();
    const cards = homePage.editorPicksSection.getByRole("link");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
