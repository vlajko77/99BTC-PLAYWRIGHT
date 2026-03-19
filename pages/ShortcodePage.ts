import { Page, expect } from "@playwright/test";
import { WordPressPostEditor } from "./CreatePost";
import { renderKeyTakeaways, KeyTakeaways } from "../utils/shortcode";

export class ShortcodePage extends WordPressPostEditor {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewPage() {
    await this.page.goto("/wp-admin/post-new.php?post_type=page");
  }

  async createPageWithShortcode(title: string, content: string): Promise<void> {
    await this.gotoNewPage();
    await this.fillTitleAndContent(title, content);
    await this.publishAndNavigate();
  }

  async createPageWithKeyTakeaways(pageTitle: string, data: KeyTakeaways): Promise<void> {
    await this.gotoNewPage();
    await this.fillTitleAndContent(pageTitle, renderKeyTakeaways(data));
    await this.publish();
  }

  async navigateToPublishedPage(): Promise<string> {
    const permalink = await this.getPermalink();
    if (!permalink) throw new Error("Could not find permalink after publishing");
    await this.openPermalink(permalink);
    return permalink;
  }

  async verifyKeyTakeaways(data: KeyTakeaways): Promise<void> {
    await this.expectContentVisible(data.title);
    for (const item of data.items) {
      await this.expectContentVisible(item);
    }
  }

  async expectShortcodeNotRendered(rawTag: string): Promise<void> {
    await expect(this.page.locator(`text=${rawTag}`)).not.toBeVisible();
  }
}
