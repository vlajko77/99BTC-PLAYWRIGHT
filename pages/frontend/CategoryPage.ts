import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CategoryPage extends BasePage {
  readonly pageMain: Locator;
  readonly pageHeading: Locator;
  readonly postsGrid: Locator;
  readonly postCards: Locator;
  readonly filterTabs: Locator;
  readonly paginationNext: Locator;

  constructor(page: Page) {
    super(page);
    this.pageMain = page.locator("main.site-main");
    this.pageHeading = page.getByRole("heading", { level: 1 }).first();
    this.postsGrid = page.locator(".category-posts.nnbtc-cards, .nnbtc-cards").first();
    this.postCards = this.postsGrid.getByRole("article");
    this.filterTabs = page.locator(".search-posts-tabs, [class*='filter-tabs']").first();
    this.paginationNext = page.getByRole("link", { name: /next|older/i }).first();
  }

  async navigate(slug: string): Promise<void> {
    await this.page.goto(`/category/${slug}/`);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyLoaded(): Promise<void> {
    const { expect } = await import("@playwright/test");
    await expect(this.pageMain).toBeVisible();
  }

  async getPostCardCount(): Promise<number> {
    return this.postCards.count();
  }
}
