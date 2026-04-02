import { Page, expect, Locator } from "@playwright/test";
import { BaseQuizPage } from "./BaseQuizPage";

export class QuizzesPage extends BaseQuizPage {
  protected readonly url = "/wp-admin/admin.php?page=quiz-maker";

  // List page
  private readonly addNewButton: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly categoryFilter: Locator;
  private readonly filterButton: Locator;

  // Quiz editor
  private readonly quizTitleInput: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);

    this.addNewButton = page.locator("a.page-title-action").filter({ hasText: /Add New/i }).first();
    this.searchInput = page.locator("#quiz-maker-search-input");
    this.searchButton = page.locator("#search-submit");
    this.categoryFilter = page.locator("#bulk-action-category-selector-top");
    this.filterButton = page.locator("#doaction");

    this.quizTitleInput = page.locator("#ays-quiz-title");
    this.saveButton = page.locator("#ays_apply");
  }

  async expectPageLoaded(): Promise<void> {
    await this.expectHeadingVisible(/Quizzes/i);
  }

  async expectColumnsVisible(): Promise<void> {
    await this.expectTableColumnsVisible(["Title", "Category", "Shortcode", "Count", "Created"]);
  }

  async expectQuizInList(title: string): Promise<void> {
    await expect(this.page.getByRole("link", { name: title })).toBeVisible();
  }

  async expectQuizNotInList(title: string): Promise<void> {
    await expect(this.page.getByRole("link", { name: title })).not.toBeVisible();
  }

  async clickAddNew(): Promise<void> {
    await this.addNewButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async fillQuizTitle(title: string): Promise<void> {
    await this.quizTitleInput.waitFor({ state: "visible" });
    await this.quizTitleInput.fill(title);
  }

  async saveQuiz(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async createQuiz(title: string): Promise<void> {
    await this.clickAddNew();
    await this.fillQuizTitle(title);
    await this.saveQuiz();
  }

  async editQuiz(currentTitle: string, newTitle: string): Promise<void> {
    const row = this.table.locator("tbody tr")
      .filter({ hasText: currentTitle })
      .first();
    await row.hover();
    await row.getByRole("link", { name: "Edit" }).first().click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.fillQuizTitle(newTitle);
    await this.saveQuiz();
  }

  async trashQuiz(title: string): Promise<void> {
    const row = this.table.locator("tbody tr")
      .filter({ hasText: title })
      .first();
    if ((await row.count()) === 0) return;
    await row.hover();
    const trashLink = row.locator("a").filter({ hasText: /Move to trash/i }).first();
    await trashLink.click({ force: true, timeout: 10000 });
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectQuizInTrash(title: string): Promise<void> {
    // Navigate to trash view
    await this.page.locator("ul.subsubsub a").filter({ hasText: /Trash/i }).click();
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.table.locator("tbody").getByText(title, { exact: false })).toBeVisible();
  }

  async searchFor(title: string): Promise<void> {
    await this.searchInput.fill(title);
    await this.searchButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async filterByCategory(categoryLabel: string): Promise<void> {
    await this.categoryFilter.selectOption({ label: categoryLabel });
    await this.filterButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getFirstQuizShortcode(): Promise<string | null> {
    // The shortcode is rendered inside an <input> in the Shortcode column, not as plain text
    const shortcodeInput = this.table
      .locator('tbody tr td input[value*="ays_quiz"]')
      .first();
    if ((await shortcodeInput.count()) === 0) return null;
    return await shortcodeInput.inputValue({ timeout: 10_000 });
  }
}
