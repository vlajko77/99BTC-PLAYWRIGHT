import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";
import path from "path";

export class MediaLibraryPage extends BasePage {
  private readonly addNewButton: Locator;
  private readonly fileInput: Locator;
  private readonly mediaItems: Locator;
  private readonly bulkSelectButton: Locator;
  private readonly bulkActionSelect: Locator;
  private readonly applyBulkAction: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewButton = page.getByRole("link", { name: /add new/i }).first();
    this.fileInput = page.locator("input[type='file']");
    this.mediaItems = page.locator(".attachments .attachment, .wp-list-table tbody tr");
    this.bulkSelectButton = page.getByRole("link", { name: /bulk select/i });
    this.bulkActionSelect = page.locator("#bulk-action-selector-top");
    this.applyBulkAction = page.locator("#doaction");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/wp-admin/upload.php");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/upload\.php/);
    await expect(
      this.page.getByRole("heading", { name: /media library/i })
    ).toBeVisible();
  }

  async getMediaCount(): Promise<number> {
    return await this.mediaItems.count();
  }

  async verifyMediaItemsExist(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    const count = await this.getMediaCount();
    expect(count).toBeGreaterThan(0);
  }

  async navigateToAddNew(): Promise<void> {
    await this.page.goto("/wp-admin/media-new.php");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyAddNewPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/media-new\.php/);
    await expect(
      this.page.getByRole("heading", { name: /upload new media/i })
    ).toBeVisible();
  }

  async verifyFileInputPresent(): Promise<void> {
    await expect(this.page.locator("input[type='file'], #plupload-upload-ui, .drag-drop").first()).toBeVisible();
  }
}
