import { test, expect } from "../../../fixtures/test.fixture";

test.describe("Quiz Maker — Quizzes", { tag: "@admin" }, () => {
  test.beforeEach(async ({ loginPage: _, quizzesPage }) => {
    await quizzesPage.navigate();
  });

  test.describe("Quizzes list", () => {
    test("page loads with heading", async ({ quizzesPage }) => {
      await quizzesPage.expectPageLoaded();
    });

    test("table displays all required columns", async ({ quizzesPage }) => {
      await quizzesPage.expectColumnsVisible();
    });
  });

  test.describe("Create quiz", () => {
    const title = `Test Quiz ${Date.now()}`;

    test.afterEach(async ({ quizzesPage }) => {
      await quizzesPage.navigate();
      await quizzesPage.trashQuiz(title).catch(() => {});
    });

    test("creates a new quiz and it appears in the list", async ({ quizzesPage }) => {
      await quizzesPage.createQuiz(title);

      await quizzesPage.navigate();
      await quizzesPage.expectQuizInList(title);
    });
  });

  test.describe("Edit quiz", () => {
    const originalTitle = `Edit Quiz ${Date.now()}`;
    const updatedTitle = `Updated Quiz ${Date.now()}`;

    test.beforeEach(async ({ quizzesPage }) => {
      await quizzesPage.createQuiz(originalTitle);
      await quizzesPage.navigate();
    });

    test.afterEach(async ({ quizzesPage }) => {
      await quizzesPage.navigate();
      await quizzesPage.trashQuiz(updatedTitle).catch(() => {});
      await quizzesPage.trashQuiz(originalTitle).catch(() => {});
    });

    test("edits a quiz title and updated title appears in list", async ({ quizzesPage }) => {
      await quizzesPage.editQuiz(originalTitle, updatedTitle);

      await quizzesPage.navigate();
      await quizzesPage.expectQuizInList(updatedTitle);
      await quizzesPage.expectQuizNotInList(originalTitle);
    });
  });

  test.describe("Delete quiz", () => {
    const title = `Trash Quiz ${Date.now()}`;

    test.beforeEach(async ({ quizzesPage }) => {
      await quizzesPage.createQuiz(title);
      await quizzesPage.navigate();
    });

    test("moves a quiz to trash", async ({ quizzesPage, page }) => {
      await quizzesPage.trashQuiz(title);

      // After trash, quiz disappears from the published list
      await quizzesPage.expectQuizNotInList(title);
      // Trash count link becomes visible
      await expect(page.locator("ul.subsubsub a").filter({ hasText: /Trash/i }).first()).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("searches for a quiz by title and shows correct result", async ({ quizzesPage, page }) => {
      // Use an existing quiz known to be in the list
      const existingTitle = "Crypto Course";

      await quizzesPage.searchFor(existingTitle);

      await expect(
        page.locator("table.wp-list-table tbody").getByText(existingTitle, { exact: false }).first()
      ).toBeVisible();
    });
  });

  test.describe("Filter by category", () => {
    test("filters quizzes by an existing category", async ({ quizzesPage, page }) => {
      await quizzesPage.filterByCategory("Crypto Course- Final Test");

      await expect(page.locator("table.wp-list-table tbody tr").first()).toBeVisible();
    });
  });
});
