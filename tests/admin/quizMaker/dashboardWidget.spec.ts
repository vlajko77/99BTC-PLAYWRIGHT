import { test, expect } from "../../../fixtures/test.fixture";

test.describe("Quiz Maker — Dashboard Widget", () => {
  test.beforeEach(async ({ loginPage: _, dashboardPage }) => {
    await dashboardPage.navigateToDashboard();
  });

  test("Quiz Maker widget is visible on the dashboard", async ({ dashboardPage }) => {
    await dashboardPage.verifyQuizMakerWidget();
  });

  test("Quiz Maker widget displays quiz statistics", async ({ page }) => {
    const widget = page.locator("#quiz-maker");
    await expect(widget).toBeVisible();

    const widgetText = await widget.textContent();
    // Widget should contain numeric stats about quizzes/questions/results
    expect(widgetText).toMatch(/\d+/);
    expect(widgetText).toMatch(/Quiz|Question|Result/i);
  });

  test("Quiz Maker menu item is visible in the admin sidebar", async ({ page }) => {
    const quizMakerMenu = page
      .locator("#adminmenu .wp-menu-name")
      .filter({ hasText: /Quiz Maker/i })
      .first();
    await expect(quizMakerMenu).toBeVisible();
  });
});
