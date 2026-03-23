import { Page, expect, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private toLocator(selectorOrLocator: string | Locator): Locator {
    return typeof selectorOrLocator === "string"
      ? this.page.locator(selectorOrLocator)
      : selectorOrLocator;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async click(selectorOrLocator: string | Locator) {
    await this.toLocator(selectorOrLocator).first().click();
  }

  async fill(selectorOrLocator: string | Locator, value: string) {
    await this.toLocator(selectorOrLocator).first().fill(value);
  }

  async check(selectorOrLocator: string | Locator) {
    await this.toLocator(selectorOrLocator).first().check();
  }

  async expectVisible(selectorOrLocator: string | Locator) {
    await expect(this.toLocator(selectorOrLocator)).toBeVisible();
  }

  async getPermalink(): Promise<string | null> {
    const selectors = [
      "#sample-permalink a",
      "#message a",
      'a:has-text("View post")',
      'a:has-text("View page")',
    ];

    for (const selector of selectors) {
      const locator = this.page.locator(selector);
      if ((await locator.count()) > 0) {
        const href = await locator.first().getAttribute("href");
        if (href) return href;
      }
    }
    return null;
  }

  async openPermalink(urlOrLocator: string | Locator) {
    if (typeof urlOrLocator === "string") {
      await this.page.goto(urlOrLocator.trim(), {
        waitUntil: "load",
        timeout: 60000,
      });
    } else {
      await urlOrLocator.first().click();
    }
  }

  async expectContentVisible(contentSnippet: string) {
    await expect(
      this.page.getByText(contentSnippet).filter({ visible: true }).first(),
    ).toBeVisible();
  }

  async fillTitleAndContent(title: string, content: string) {
    await this.page.getByRole("textbox", { name: "Add title" }).fill(title);
    await this.page.locator("#content").fill(content);
  }

  async publishAndNavigate(): Promise<void> {
    await this.publish();
    const permalink = await this.getPermalink();
    expect(permalink).not.toBeNull();
    await this.openPermalink(permalink!);
  }

  async publish() {
    const publishButton = this.page.locator("input#publish");
    if ((await publishButton.count()) === 0) return;

    // Expand the Publish panel if it is collapsed
    if (!(await publishButton.isVisible())) {
      await this.page
        .getByRole("button", { name: /toggle panel: publish/i })
        .click();
      await publishButton.waitFor({ state: "visible", timeout: 5000 });
    }

    // Some post types disable #publish on load — enable it before clicking
    await this.page.evaluate(() => {
      const btn = document.querySelector<HTMLInputElement>("input#publish");
      if (btn) btn.disabled = false;
    });

    await Promise.all([
      this.page.waitForURL(/post\.php\?post=\d+/, { timeout: 15000 }),
      publishButton.click(),
    ]);
  }
}
