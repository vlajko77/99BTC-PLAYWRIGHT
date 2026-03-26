import { Page, expect, Locator } from "@playwright/test";
import { BaseQuizPage } from "./BaseQuizPage";

export class QuestionsPage extends BaseQuizPage {
  protected readonly url = "/wp-admin/admin.php?page=quiz-maker-questions";
  private readonly addUrl = "/wp-admin/admin.php?page=quiz-maker-questions&action=add";

  // List page
  private readonly questionTypeFilter: Locator;
  private readonly filterButton: Locator;

  // Question editor
  private readonly questionTitleInput: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);

    this.questionTypeFilter = page.locator("#bulk-action-question-type-selector-top");
    this.filterButton = page.locator("#doaction-top");

    this.questionTitleInput = page.locator("#ays_question_title");
    this.saveButton = page.locator("#ays-button-apply");
  }

  async navigateToAdd(): Promise<void> {
    await this.page.goto(this.addUrl);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectPageLoaded(): Promise<void> {
    await this.expectHeadingVisible(/Questions/i);
  }

  async expectColumnsVisible(): Promise<void> {
    await this.expectTableColumnsVisible(["Question", "Category", "Type", "Answers"]);
  }

  async fillQuestionTitle(title: string): Promise<void> {
    await this.questionTitleInput.waitFor({ state: "visible" });
    await this.questionTitleInput.fill(title);
  }

  async selectQuestionType(type: string): Promise<void> {
    // The type is a Select2 combobox — already defaults to "Radio", skip changing it
    // to keep test simple and avoid Select2 interaction complexity
    const currentType = await this.page.locator(".select2-selection__rendered").first().textContent();
    if (currentType?.includes(type)) return;
    await this.page.locator(".select2-selection").first().click();
    await this.page.locator(".select2-results__option").filter({ hasText: type }).first().click();
  }

  async fillAnswer(index: number, text: string): Promise<void> {
    const answerInputs = this.page.locator('input[name="ays-correct-answer-value[]"]');
    await answerInputs.nth(index).fill(text);
  }

  async saveQuestion(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async createRadioQuestion(title: string, answers: string[]): Promise<void> {
    await this.navigateToAdd();
    await this.fillQuestionTitle(title);
    // Type defaults to Radio — no need to change it
    for (let i = 0; i < answers.length; i++) {
      await this.fillAnswer(i, answers[i]);
    }
    await this.saveQuestion();
  }

  async expectQuestionInList(title: string): Promise<void> {
    await expect(
      this.table.locator("tbody").getByText(title, { exact: false })
    ).toBeVisible();
  }

  async filterByType(typeValue: string): Promise<void> {
    await this.questionTypeFilter.selectOption({ value: typeValue });
    await this.filterButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectFilteredByType(typeLabel: string): Promise<void> {
    const typeCells = this.table.locator("tbody td").filter({ hasText: typeLabel });
    await expect(typeCells.first()).toBeVisible();
  }
}
