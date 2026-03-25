import { test, expect } from "../../../fixtures/test.fixture";

test.describe("Quiz Maker — Results", { tag: "@admin" }, () => {
  test.beforeEach(async ({ loginPage: _, resultsPage }) => {
    await resultsPage.navigate();
  });

  test.describe("Results page", () => {
    test("page loads with heading", async ({ resultsPage }) => {
      await resultsPage.expectPageLoaded();
    });

    test("displays all 4 tabs: Quizzes, Global Statistics, Global Leaderboard, All Results", async ({
      resultsPage,
    }) => {
      await resultsPage.expectAllTabsVisible();
    });

    test("results table is visible on Quizzes tab", async ({ resultsPage }) => {
      await resultsPage.clickQuizzesTab();
      await resultsPage.expectResultsListVisible();
    });

    test("Global Statistics tab is accessible", async ({ resultsPage, page }) => {
      await resultsPage.clickGlobalStatisticsTab();
      // Global Statistics navigates to a separate page with stats content (no wp-list-table)
      await expect(page).toHaveURL(/quiz-maker-results|quiz-maker-results-global-statistics/);
      await expect(page.locator("#wpbody-content h1, #wpbody-content h2, #wpbody-content h3").first()).toBeVisible();
    });

    test("Global Leaderboard tab is accessible", async ({ resultsPage, page }) => {
      await resultsPage.clickGlobalLeaderboardTab();
      await expect(page).toHaveURL(/quiz-maker-results-global-leaderboard/);
      await expect(page.locator("#wpbody-content").first()).toBeVisible();
    });

    test("All Results tab is accessible", async ({ resultsPage, page }) => {
      await resultsPage.clickAllResultsTab();
      await expect(page).toHaveURL(/quiz-maker-all-results/);
      await expect(page.locator("table.wp-list-table")).toBeVisible();
    });
  });

  test.describe("Sidebar badge", () => {
    test("Results count badge is displayed in the Quiz Maker sidebar menu", async ({
      page,
    }) => {
      const badgeText = await page
        .locator("#adminmenu a")
        .filter({ hasText: /Results/ })
        .first()
        .textContent();
      expect(badgeText).toMatch(/\d+/);
    });
  });
});
