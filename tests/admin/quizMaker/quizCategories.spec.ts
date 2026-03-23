import { test } from "../../../../fixtures/test.fixture";

test.describe("Quiz Maker — Quiz Categories", () => {
  test.beforeEach(async ({ loginPage: _, quizCategoriesPage }) => {
    await quizCategoriesPage.navigate();
  });

  test.describe("Categories list", () => {
    test("page loads with heading", async ({ quizCategoriesPage }) => {
      await quizCategoriesPage.expectPageLoaded();
    });

    test("displays Published and Unpublished filter tabs", async ({ quizCategoriesPage }) => {
      await quizCategoriesPage.expectTabsVisible();
    });

    test("existing categories show shortcodes in [ays_quiz_cat id=] format", async ({
      quizCategoriesPage,
    }) => {
      await quizCategoriesPage.expectShortcodeVisible();
    });
  });

  test.describe("Create category", () => {
    const categoryTitle = `Test Category ${Date.now()}`;

    test.afterEach(async ({ quizCategoriesPage }) => {
      await quizCategoriesPage.navigate();
      await quizCategoriesPage.deleteCategory(categoryTitle).catch(() => {});
    });

    test("creates a new category and it appears in the list", async ({
      quizCategoriesPage,
    }) => {
      await quizCategoriesPage.createCategory(categoryTitle);

      await quizCategoriesPage.navigate();
      await quizCategoriesPage.expectCategoryInList(categoryTitle);
    });
  });
});
