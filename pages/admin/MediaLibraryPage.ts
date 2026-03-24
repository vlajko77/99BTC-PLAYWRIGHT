import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class MediaLibraryPage extends BasePage {
  private readonly mediaItems: Locator;

  constructor(page: Page) {
    super(page);
    this.mediaItems = page.locator(".attachments .attachment, .wp-list-table tbody tr");
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

  async uploadFile(filePath: string): Promise<void> {
    // Plupload exposes a visible HTML5 file input inside the drag-drop zone
    await this.page.locator(".drag-drop input[type='file']").setInputFiles(filePath);
    // Wait for the upload to finish — plupload adds .filename.new once the server confirms
    await this.page
      .locator(".media-item .filename.new")
      .waitFor({ state: "visible", timeout: 15000 });
  }

  async verifyUploadSuccess(filename: string): Promise<void> {
    await expect(
      this.page.locator(".media-item .filename.new", { hasText: filename })
    ).toBeVisible();
  }
}
