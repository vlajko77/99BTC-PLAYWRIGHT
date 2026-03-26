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
    const title = `Test Quiz ${crypto.randomUUID()}`;

    test.afterEach(async ({ quizzesPage }) => {
      await quizzesPage.navigate();
      await quizzesPage.trashQuiz(title).catch((e) => console.warn("Cleanup failed:", e));
    });

    test("creates a new quiz and it appears in the list", async ({ quizzesPage }) => {
      await quizzesPage.createQuiz(title);

      await quizzesPage.navigate();
      await quizzesPage.expectQuizInList(title);
    });
  });

  test.describe("Edit quiz", () => {
    const originalTitle = `Edit Quiz ${crypto.randomUUID()}`;
    const updatedTitle = `Updated Quiz ${crypto.randomUUID()}`;

    test.beforeEach(async ({ quizzesPage }) => {
      await quizzesPage.createQuiz(originalTitle);
      await quizzesPage.navigate();
    });

    test.afterEach(async ({ quizzesPage }) => {
      await quizzesPage.navigate();
      await quizzesPage.trashQuiz(updatedTitle).catch((e) => console.warn("Cleanup failed:", e));
      await quizzesPage.trashQuiz(originalTitle).catch((e) => console.warn("Cleanup failed:", e));
    });

    test("edits a quiz title and updated title appears in list", async ({ quizzesPage }) => {
      await quizzesPage.editQuiz(originalTitle, updatedTitle);

      await quizzesPage.navigate();
      await quizzesPage.expectQuizInList(updatedTitle);
      await quizzesPage.expectQuizNotInList(originalTitle);
    });
  });

  test.describe("Delete quiz", () => {
    const title = `Trash Quiz ${crypto.randomUUID()}`;

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
    const searchTitle = `Search Quiz ${crypto.randomUUID()}`;

    test.beforeEach(async ({ quizzesPage }) => {
      await quizzesPage.createQuiz(searchTitle);
      await quizzesPage.navigate();
    });

    test.afterEach(async ({ quizzesPage }) => {
      await quizzesPage.navigate();
      await quizzesPage.trashQuiz(searchTitle).catch((e) => console.warn("Cleanup failed:", e));
    });

    test("searches for a quiz by title and shows correct result", async ({ quizzesPage, page }) => {
      await quizzesPage.searchFor(searchTitle);

      await expect(
        page.locator("table.wp-list-table tbody").getByText(searchTitle, { exact: false }).first()
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
