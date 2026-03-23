import { Page, expect, Locator } from "@playwright/test";
import { WordPressPostEditor } from "./CreatePost";

export class EditPostPage extends WordPressPostEditor {
  private readonly updateButton: Locator;
  private readonly trashLink: Locator;
  private readonly updateNotice: Locator;

  constructor(page: Page) {
    super(page);
    this.updateButton = page.locator("#publish");
    this.trashLink = page.locator("#delete-action a");
    this.updateNotice = page.locator("#message");
  }

  async navigateToPostsList(): Promise<void> {
    await this.page.goto("/wp-admin/edit.php");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async navigateToPagesList(): Promise<void> {
    await this.page.goto("/wp-admin/edit.php?post_type=page");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async openFirstPostForEdit(): Promise<void> {
    const firstEditLink = this.page.locator("#the-list tr").first().getByRole("link", { name: "Edit" });
    await firstEditLink.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async openPostForEdit(title: string): Promise<void> {
    const currentUrl = new URL(this.page.url());
    const postType = currentUrl.searchParams.get("post_type") || "post";
    await this.page.goto(
      `/wp-admin/edit.php?post_type=${postType}&s=${encodeURIComponent(title)}`
    );
    await this.page.waitForLoadState("domcontentloaded");
    const row = this.page.locator("#the-list tr").filter({ hasText: title }).first();
    await row.hover();
    await row.locator("a.row-title").click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async updateTitle(newTitle: string): Promise<void> {
    const titleInput = this.page.locator("input#title, #titlediv #title");
    await titleInput.fill(newTitle);
  }

  async updatePost(): Promise<void> {
    await this.updateButton.click();
    await this.updateNotice.waitFor({ state: "visible", timeout: 10000 });
  }

  async verifyUpdateSuccess(): Promise<void> {
    await expect(this.updateNotice).toBeVisible();
    await expect(this.updateNotice).toContainText(/updated/i);
  }

  async trashCurrentPost(): Promise<void> {
    await this.trashLink.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyPostInList(title: string): Promise<void> {
    const currentUrl = new URL(this.page.url());
    const postType = currentUrl.searchParams.get("post_type") || "post";
    await this.page.goto(
      `/wp-admin/edit.php?post_type=${postType}&s=${encodeURIComponent(title)}`
    );
    await this.page.waitForLoadState("domcontentloaded");
    await expect(
      this.page.locator("#the-list tr").filter({ hasText: title }).first()
    ).toBeVisible();
  }

  async verifyTrashSuccess(): Promise<void> {
    await expect(this.page.locator("#message")).toBeVisible();
    await expect(this.page.locator("#message")).toContainText(/moved to the Trash/i);
  }

  async verifyPostNotInList(title: string): Promise<void> {
    await expect(
      this.page.locator("#the-list").getByText(title)
    ).not.toBeVisible();
  }
}
