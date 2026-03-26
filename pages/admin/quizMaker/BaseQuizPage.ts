import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../../BasePage";

export abstract class BaseQuizPage extends BasePage {
  protected abstract readonly url: string;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.table = page.locator("table.wp-list-table");
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  protected async expectHeadingVisible(pattern: RegExp): Promise<void> {
    await expect(this.page.locator("h1").filter({ hasText: pattern })).toBeVisible();
  }

  protected async expectTableColumnsVisible(columns: string[]): Promise<void> {
    await expect(this.table).toBeVisible();
    for (const col of columns) {
      await expect(this.table.locator("thead").getByText(col, { exact: false })).toBeVisible();
    }
  }
}
