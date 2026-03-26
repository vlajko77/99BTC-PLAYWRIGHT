import { Page, expect, Locator } from "@playwright/test";
import { BaseQuizPage } from "./BaseQuizPage";

export class GeneralSettingsPage extends BaseQuizPage {
  protected readonly url = "/wp-admin/admin.php?page=quiz-maker-settings";

  private readonly saveButton: Locator;
  private readonly contentArea: Locator;

  private readonly tabs = [
    "Integrations",
    "Shortcodes",
    "Extra shortcodes",
    "Message variables",
    "Text Customizations",
  ];

  constructor(page: Page) {
    super(page);

    // Scope to wpbody-content to avoid matching admin sidebar links
    this.contentArea = page.locator("#wpbody-content");
    this.saveButton = this.contentArea.locator(
      'input[name="ays-quiz-settings-submit"], input[value="Save changes"], #ays_apply, input[name="ays_apply"]'
    ).first();
  }

  async expectPageLoaded(): Promise<void> {
    await expect(
      this.contentArea.locator("h1, h2").filter({ hasText: /General Settings/i }).first()
    ).toBeVisible();
  }

  async expectAllTabsVisible(): Promise<void> {
    for (const tab of this.tabs) {
      // Tabs are anchor links with href="#tabN" scoped inside content area
      await expect(
        this.contentArea.locator('a[href^="#tab"]').filter({ hasText: tab }).first()
      ).toBeVisible();
    }
  }

  async expectSaveButtonVisible(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  async clickTab(tabName: string): Promise<void> {
    await this.contentArea
      .locator('a[href^="#tab"]')
      .filter({ hasText: tabName })
      .first()
      .click();
  }

  async saveSettings(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectSaveSuccess(): Promise<void> {
    await expect(
      this.page.locator(".notice-success, .updated, #setting-error-settings_updated").first()
    ).toBeVisible();
  }
}
