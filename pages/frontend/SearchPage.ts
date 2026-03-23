import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class SearchPage extends BasePage {
  readonly searchHeading: Locator;
  readonly searchResults: Locator;
  readonly searchTabs: Locator;
  readonly resultsGrid: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchHeading = page.getByText(/you searched for/i).first();
    this.searchResults = page.locator(".search-results, .category-posts, .nnbtc-cards").first();
    this.searchTabs = page.locator(".search-posts-tabs, [class*='tabs']").first();
    this.resultsGrid = page.locator(".category-posts.nnbtc-cards, .search-results__grid").first();
    this.noResultsMessage = page.getByText(/no results|nothing found|not found/i).first();
  }

  async navigate(query: string): Promise<void> {
    await this.page.goto(`/?s=${encodeURIComponent(query)}`);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyResultsVisible(): Promise<void> {
    const { expect } = await import("@playwright/test");
    await expect(this.searchHeading).toBeVisible();
  }

  async getResultCount(): Promise<number> {
    return this.page.locator(".category-posts.nnbtc-cards article, .search-results article").count();
  }
}
