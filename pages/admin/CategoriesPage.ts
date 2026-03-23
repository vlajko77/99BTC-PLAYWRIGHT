import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CategoriesPage extends BasePage {
  private readonly nameInput: Locator;
  private readonly slugInput: Locator;
  private readonly addButton: Locator;
  private readonly categoriesList: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator("#tag-name");
    this.slugInput = page.locator("#tag-slug");
    this.addButton = page.locator("#submit");
    this.categoriesList = page.locator("#the-list");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/wp-admin/edit-tags.php?taxonomy=category");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/edit-tags\.php.*taxonomy=category/);
    await expect(
      this.page.getByRole("heading", { name: /categories/i }).first()
    ).toBeVisible();
  }

  async addCategory(name: string, slug?: string): Promise<void> {
    await this.nameInput.fill(name);
    if (slug) await this.slugInput.fill(slug);
    await this.addButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyCategoryInList(name: string): Promise<void> {
    await expect(
      this.categoriesList.getByText(name).first()
    ).toBeVisible();
  }

  async verifyCategoryNotInList(name: string): Promise<void> {
    await expect(
      this.categoriesList.getByText(name)
    ).not.toBeVisible();
  }

  async deleteCategory(name: string): Promise<void> {
    const row = this.categoriesList.locator("tr").filter({ hasText: name });
    await row.getByRole("link", { name: /delete/i }).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getCategoryCount(): Promise<number> {
    return await this.categoriesList.locator("tr").count();
  }

  async verifyDefaultCategoriesExist(): Promise<void> {
    await expect(this.categoriesList.locator("tr")).not.toHaveCount(0);
  }
}
