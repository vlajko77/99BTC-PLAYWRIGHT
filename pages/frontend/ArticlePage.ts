import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ArticlePage extends BasePage {
  readonly articleMain: Locator;
  readonly articleTitle: Locator;
  readonly articleAuthor: Locator;
  readonly articleContent: Locator;
  readonly tocMobile: Locator;
  readonly sidebarTopStories: Locator;
  readonly trustSection: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);
    this.articleMain = page.locator("main.site-main");
    this.articleTitle = page.getByRole("heading", { level: 1 }).first();
    this.articleAuthor = page.locator(".nnbtc-article-top__author-top, .author, [class*='author']").first();
    this.articleContent = page.locator(".entry-content, .post-content, article").first();
    this.tocMobile = page.locator(".nnbtc-toc--mobile, [class*='toc']").first();
    this.sidebarTopStories = page.locator(".nnbtc-article__sidebar-top-stories, [class*='sidebar']").first();
    this.trustSection = page.locator(".trust-us");
    this.breadcrumb = page.locator(".breadcrumb, [class*='breadcrumb'], nav[aria-label*='breadcrumb']").first();
  }

  async navigateToFirstArticle(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
    const articleLink = this.page.locator(".nnbtc-news a, .nnbtc-topstories a").first();
    await articleLink.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyArticleLoaded(): Promise<void> {
    const { expect } = await import("@playwright/test");
    await expect(this.articleMain).toBeVisible();
    await expect(this.articleTitle).toBeVisible();
  }
}
