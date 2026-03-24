import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

export class ResultsPage extends BasePage {
  private readonly url = "/wp-admin/admin.php?page=quiz-maker-results";

  private readonly resultsTable: Locator;

  constructor(page: Page) {
    super(page);

    this.resultsTable = page.locator("table.wp-list-table");
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator("h1").filter({ hasText: /Results/i })).toBeVisible();
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
    await expect(this.resultsTable).toBeVisible();
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
