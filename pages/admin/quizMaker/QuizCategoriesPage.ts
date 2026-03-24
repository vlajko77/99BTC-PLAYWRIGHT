import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

export class QuizCategoriesPage extends BasePage {
  private readonly listUrl = "/wp-admin/admin.php?page=quiz-maker-quiz-categories";
  private readonly addUrl = "/wp-admin/admin.php?page=quiz-maker-quiz-categories&action=add";

  // List
  private readonly categoriesTable: Locator;

  // Create form (separate page at ?action=add)
  private readonly categoryTitleInput: Locator;
  private readonly saveCategoryButton: Locator;

  constructor(page: Page) {
    super(page);

    this.categoriesTable = page.locator("table.wp-list-table");
    this.categoryTitleInput = page.locator("#ays-title");
    this.saveCategoryButton = page.locator("#ays_apply");
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.listUrl);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async navigateToAdd(): Promise<void> {
    await this.page.goto(this.addUrl);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator("h1").filter({ hasText: /Quiz Categories/i })).toBeVisible();
  }

  async expectTabsVisible(): Promise<void> {
    const subsubsub = this.page.locator("ul.subsubsub");
    await expect(subsubsub.locator('a[href*="fstatus=1"]')).toBeVisible();
    await expect(subsubsub.locator('a[href*="fstatus=0"]')).toBeVisible();
  }

  async fillCategoryTitle(title: string): Promise<void> {
    await this.categoryTitleInput.waitFor({ state: "visible" });
    await this.categoryTitleInput.fill(title);
  }

  async submitCategory(): Promise<void> {
    await this.saveCategoryButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async createCategory(title: string): Promise<void> {
    await this.navigateToAdd();
    await this.fillCategoryTitle(title);
    await this.submitCategory();
  }

  async expectCategoryInList(title: string): Promise<void> {
    await expect(
      this.categoriesTable.locator("tbody").getByText(title, { exact: false })
    ).toBeVisible();
  }

  async expectShortcodeVisible(): Promise<void> {
    // Shortcodes are stored in input[type=text] values inside table cells
    const shortcodeInputs = this.categoriesTable.locator('tbody td input[type="text"]');
    const count = await shortcodeInputs.count();
    expect(count).toBeGreaterThan(0);
    const firstValue = await shortcodeInputs.first().inputValue();
    expect(firstValue).toMatch(/\[ays_quiz_cat id="\d+"/);
  }

  async deleteCategory(title: string): Promise<void> {
    const row = this.categoriesTable.locator("tbody tr").filter({ hasText: title }).first();
    await row.hover();
    await row.getByRole("link", { name: /Delete/i }).first().click();
    await this.page.waitForLoadState("domcontentloaded");
  }
}
