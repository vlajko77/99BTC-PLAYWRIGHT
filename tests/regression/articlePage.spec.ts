import { test, expect } from "../../fixtures/test.fixture";

test.describe("Article Page", { tag: "@regression" }, () => {
  test.beforeEach(async ({ articlePage }) => {
    await articlePage.navigateToFirstArticle();
  });

  test("article page has main content area", { tag: "@smoke" }, async ({ articlePage }) => {
    await expect(articlePage.articleMain).toBeVisible();
  });

  test("article page has h1 title", async ({ articlePage }) => {
    await expect(articlePage.articleTitle).toBeVisible();
  });

  test("article page has author information", async ({ articlePage }) => {
    await expect(articlePage.articleAuthor).toBeVisible();
  });

  test("article page has readable content", async ({ articlePage }) => {
    await expect(articlePage.articleContent).toBeVisible();
    const text = await articlePage.articleContent.textContent();
    expect(text?.length).toBeGreaterThan(100);
  });

  test("trust section is visible on article page", async ({ articlePage }) => {
    await articlePage.trustSection.scrollIntoViewIfNeeded();
    await expect(articlePage.trustSection).toBeVisible();
  });
});
