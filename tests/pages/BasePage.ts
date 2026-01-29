import { Page, expect, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async click(selectorOrLocator: string | Locator) {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.first().click();
  }

  async fill(selectorOrLocator: string | Locator, value: string) {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.first().fill(value);
  }

  async check(selectorOrLocator: string | Locator) {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.first().check();
  }

  async expectVisible(selectorOrLocator: string | Locator) {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await expect(locator).toBeVisible();
  }

  async getPermalink(): Promise<string | null> {
    const sample = this.page.locator('#sample-permalink a');
    if (await sample.count() > 0) {
      const href = await sample.first().getAttribute('href');
      if (href) return href;
      const text = await sample.first().innerText().catch(() => '');
      if (text) return text;
    }

    const messageLink = this.page.locator('#message a');
    if (await messageLink.count() > 0) {
      const href = await messageLink.first().getAttribute('href');
      if (href) return href;
    }

    const viewLink = this.page.locator('a:has-text("View post")');
    if (await viewLink.count() > 0) {
      const href = await viewLink.first().getAttribute('href');
      if (href) return href;
    }

    const viewPageLink = this.page.locator('a:has-text("View page")');
    if (await viewPageLink.count() > 0) {
      const href = await viewPageLink.first().getAttribute('href');
      if (href) return href;
    }
    return null;
  }

  async openPermalink(selectorOrUrl: string | Locator) {
    const isString = typeof selectorOrUrl === 'string';
    if (isString) {
      await this.page.goto((selectorOrUrl as string).trim(), { waitUntil: 'load', timeout: 60000 });
    } else {
      await (selectorOrUrl as Locator).first().click();
    }
  }

  async verifyFrontendContent(contentSnippet: string) {
    const matches = this.page.getByText(contentSnippet);
    const count = await matches.count();
    if (count > 0) {
      await expect(matches.first()).toBeVisible();
      return;
    }

    await expect(matches).toBeVisible();
  }

  async expectContentVisible(contentSnippet: string) {
    return this.verifyFrontendContent(contentSnippet);
  }

  async publish() {
    const publishButton = this.page.locator('#publish, input#publish, button:has-text("Publish")');
    if (await publishButton.count() === 0) {
      return;
    }

    await Promise.all([
      publishButton.first().click(),
      this.page.waitForLoadState('networkidle').catch(() => {}),
    ]);

    const sample = this.page.locator('#sample-permalink');
    const message = this.page.locator('#message');

    try {
      await sample.waitFor({ state: 'visible', timeout: 5000 });
      return;
    } catch {}

    try {
      await message.waitFor({ state: 'visible', timeout: 5000 });
      return;
    } catch {}

    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}