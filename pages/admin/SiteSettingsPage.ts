import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class SiteSettingsPage extends BasePage {
  private readonly siteTitleInput: Locator;
  private readonly taglineInput: Locator;
  private readonly saveButton: Locator;
  private readonly settingsUpdatedNotice: Locator;

  constructor(page: Page) {
    super(page);
    this.siteTitleInput = page.locator("#blogname");
    this.taglineInput = page.locator("#blogdescription");
    this.saveButton = page.locator("input[name='submit']");
    this.settingsUpdatedNotice = page.locator("#setting-error-settings_updated");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/wp-admin/options-general.php");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async navigateToPermalinks(): Promise<void> {
    await this.page.goto("/wp-admin/options-permalink.php");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/options-general\.php/);
    await expect(
      this.page.getByRole("heading", { name: /general settings/i })
    ).toBeVisible();
  }

  async verifyPermalinksLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/options-permalink\.php/);
    await expect(
      this.page.getByRole("heading", { name: /permalink settings/i })
    ).toBeVisible();
  }

  async getSiteTitle(): Promise<string> {
    return await this.siteTitleInput.inputValue();
  }

  async getTagline(): Promise<string> {
    return await this.taglineInput.inputValue();
  }

  async verifySiteTitleNotEmpty(): Promise<void> {
    const title = await this.getSiteTitle();
    expect(title.length).toBeGreaterThan(0);
  }

  async verifyTaglineNotEmpty(): Promise<void> {
    const tagline = await this.getTagline();
    expect(tagline.length).toBeGreaterThan(0);
  }

  async verifyPermalinkStructureSet(): Promise<void> {
    const checked = this.page.locator("input[type='radio']:checked");
    await expect(checked).not.toHaveCount(0);
  }

  async verifySiteUrl(): Promise<void> {
    const siteUrl = this.page.locator("#siteurl");
    if ((await siteUrl.count()) > 0) {
      const value = await siteUrl.inputValue();
      expect(value).toMatch(/https?:\/\//);
    } else {
      // URL is locked in wp-config.php — verify via current page URL
      expect(this.page.url()).toMatch(/https?:\/\//);
    }
  }
}
