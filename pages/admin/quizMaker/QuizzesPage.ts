import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

export class QuizzesPage extends BasePage {
  private readonly url = "/wp-admin/admin.php?page=quiz-maker";

  // List page
  private readonly addNewButton: Locator;
  private readonly quizzesTable: Locator;
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
    this.quizzesTable = page.locator("table.wp-list-table");
    this.searchInput = page.locator("#quiz-maker-search-input");
    this.searchButton = page.locator("#search-submit");
    this.categoryFilter = page.locator("#bulk-action-category-selector-top");
    this.filterButton = page.locator("#doaction");

    this.quizTitleInput = page.locator("#ays-quiz-title");
    this.saveButton = page.locator("#ays_apply");
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator("h1").filter({ hasText: /Quizzes/i })).toBeVisible();
  }

  async expectColumnsVisible(): Promise<void> {
    await expect(this.quizzesTable).toBeVisible();
    for (const col of ["Title", "Category", "Shortcode", "Count", "Created"]) {
      await expect(this.quizzesTable.locator("thead").getByText(col, { exact: false })).toBeVisible();
    }
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
    const row = this.quizzesTable.locator("tbody tr")
      .filter({ hasText: currentTitle })
      .first();
    await row.hover();
    await row.getByRole("link", { name: "Edit" }).first().click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.fillQuizTitle(newTitle);
    await this.saveQuiz();
  }

  async trashQuiz(title: string): Promise<void> {
    const row = this.quizzesTable.locator("tbody tr")
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
    await expect(this.quizzesTable.locator("tbody").getByText(title, { exact: false })).toBeVisible();
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
    const shortcodeCell = this.quizzesTable.locator("tbody tr td")
      .filter({ hasText: /\[ays_quiz/ })
      .first();
    return await shortcodeCell.textContent();
  }
}
