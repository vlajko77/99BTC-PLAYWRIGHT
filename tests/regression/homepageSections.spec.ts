import { test, expect } from "../../fixtures/test.fixture";
import { STAGING_URL } from "../../utils/login";

test.describe("Homepage Sections", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto(STAGING_URL);
  });

  test.describe("Featured Articles", () => {
    test("shows 3 article cards", async ({ homePage }) => {
      await expect(homePage.featuredArticles).toHaveCount(3);
    });

    test("each card has an image and title", async ({ homePage }) => {
      const articles = homePage.featuredArticles;
      const count = await articles.count();

      for (let i = 0; i < count; i++) {
        const card = articles.nth(i);
        await expect(card.getByRole("img").first()).toBeVisible();
        await expect(card.locator("p")).toBeVisible();
      }
    });
  });

  test.describe("Top Stories", () => {
    test('"Top Stories" label is visible', async ({ homePage }) => {
      await expect(homePage.topStoriesLabel).toBeVisible();
    });

    test("shows 5 story items", async ({ homePage }) => {
      await expect(homePage.topStoriesItems).toHaveCount(5);
    });

    test("each story has an image and title", async ({ homePage }) => {
      const items = homePage.topStoriesItems;
      const count = await items.count();

      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        await expect(item.getByRole("img").first()).toBeVisible();
        await expect(item.locator("p")).toBeVisible();
      }
    });
  });

  test.describe("Crash Course", () => {
    test("section heading is visible", async ({ homePage }) => {
      await expect(homePage.crashCourseHeading).toBeVisible();
    });

    test("name field, email field and submit button are visible", async ({
      homePage,
    }) => {
      await expect(homePage.crashCourseName).toBeVisible();
      await expect(homePage.crashCourseEmail).toBeVisible();
      await expect(homePage.crashCourseSubmit).toBeVisible();
    });
  });

  test.describe("Bitcoin Guides", () => {
    test('"Bitcoins Guides" heading is visible', async ({ homePage }) => {
      await expect(homePage.guidesHeading).toBeVisible();
    });

    test("shows 4 guide cards", async ({ homePage }) => {
      await expect(homePage.guideCards).toHaveCount(4);
    });

    test("each guide card has an image, category, title and date", async ({
      homePage,
    }) => {
      const cards = homePage.guideCards;
      const count = await cards.count();

      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card.getByRole("img").first()).toBeVisible();
        await expect(card.locator("p").first()).toBeVisible();
      }
    });
  });

  test.describe("News", () => {
    test("Bitcoin News Today heading and articles are visible", async ({
      homePage,
    }) => {
      await expect(homePage.bitcoinNewsHeading).toBeVisible();
      await expect(
        homePage.bitcoinNewsColumn.getByRole("link").first(),
      ).toBeVisible();
    });

    test("Altcoin News Today heading and articles are visible", async ({
      homePage,
    }) => {
      await expect(homePage.altcoinNewsHeading).toBeVisible();
      await expect(
        homePage.altcoinNewsColumn.getByRole("link").first(),
      ).toBeVisible();
    });

    test("Presales heading and articles are visible", async ({ homePage }) => {
      await expect(homePage.presalesHeading).toBeVisible();
      await expect(
        homePage.presalesColumn.getByRole("link").first(),
      ).toBeVisible();
    });

    test('"View All News" navigates to /news/', async ({ homePage, page }) => {
      await homePage.viewAllNewsLink.click();
      await expect(page).toHaveURL(/\/news\//);
    });
  });

  test.describe("Editor's Picks", () => {
    test("section heading is visible", async ({ homePage }) => {
      await expect(homePage.editorPicksHeading).toBeVisible();
    });

    test("all 4 tabs are visible", async ({ homePage }) => {
      await expect(homePage.editorPicksTabTopArticles).toBeVisible();
      await expect(homePage.editorPicksTabGuides).toBeVisible();
      await expect(homePage.editorPicksTabComparisons).toBeVisible();
      await expect(homePage.editorPicksTabReviews).toBeVisible();
    });

    test('"Top Articles" is the default active tab', async ({ homePage }) => {
      await expect(homePage.editorPicksTabTopArticles).toHaveClass(/is-active/);
    });

    test("clicking Guides tab makes it active", async ({ homePage }) => {
      await homePage.clickEditorPicksTab("Guides");
      await expect(homePage.editorPicksTabGuides).toHaveClass(/is-active/);
    });

    test("clicking Comparisons tab makes it active", async ({ homePage }) => {
      await homePage.clickEditorPicksTab("Comparisons");
      await expect(homePage.editorPicksTabComparisons).toHaveClass(/is-active/);
    });

    test("clicking Reviews tab makes it active", async ({ homePage }) => {
      await homePage.clickEditorPicksTab("Reviews");
      await expect(homePage.editorPicksTabReviews).toHaveClass(/is-active/);
    });
  });

  test.describe("Trust Section", () => {
    test("heading is visible", async ({ homePage }) => {
      await expect(homePage.trustHeading).toBeVisible();
    });

    test("stats are visible", async ({ homePage }) => {
      await expect(
        homePage.trustSection.getByText("10+ Years", { exact: true }),
      ).toBeVisible();
      await expect(
        homePage.trustSection.getByText("90hr+", { exact: true }),
      ).toBeVisible();
      await expect(
        homePage.trustSection.getByText("100k+", { exact: true }),
      ).toBeVisible();
      await expect(
        homePage.trustSection.getByText("50+", { exact: true }),
      ).toBeVisible();
      await expect(
        homePage.trustSection.getByText("2000+", { exact: true }),
      ).toBeVisible();
    });

    test('"Featured in:" text is visible', async ({ homePage }) => {
      await expect(
        homePage.page.getByText("Featured in:", { exact: true }),
      ).toBeVisible();
    });
  });
});
