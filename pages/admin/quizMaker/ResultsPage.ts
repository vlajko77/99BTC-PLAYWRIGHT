import { Page, expect } from "@playwright/test";
import { BaseQuizPage } from "./BaseQuizPage";

export class ResultsPage extends BaseQuizPage {
  protected readonly url = "/wp-admin/admin.php?page=quiz-maker-results";

  constructor(page: Page) {
    super(page);
  }

  async expectPageLoaded(): Promise<void> {
    await this.expectHeadingVisible(/Results/i);
  }

  async expectAllTabsVisible(): Promise<void> {
    const contentArea = this.page.locator("#wpbody-content");
    for (const tabText of ["Quizzes", "Global Statistics", "Global Leaderboard", "All Results"]) {
      await expect(
        contentArea.getByRole("link", { name: tabText, exact: true })
      ).toBeVisible();
    }
  }

  async expectResultsListVisible(): Promise<void> {
    await expect(this.table).toBeVisible();
  }

  async clickQuizzesTab(): Promise<void> {
    await this.page.locator("#wpbody-content").getByRole("link", { name: "Quizzes", exact: true }).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickGlobalStatisticsTab(): Promise<void> {
    await this.page.locator("#wpbody-content").getByRole("link", { name: "Global Statistics", exact: true }).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickGlobalLeaderboardTab(): Promise<void> {
    await this.page.locator("#wpbody-content").getByRole("link", { name: "Global Leaderboard", exact: true }).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickAllResultsTab(): Promise<void> {
    await this.page.locator("#wpbody-content").getByRole("link", { name: "All Results", exact: true }).click();
    await this.page.waitForLoadState("domcontentloaded");
  }
}
