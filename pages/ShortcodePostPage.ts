import { Page, expect } from "@playwright/test";
import { WordPressPostEditor } from "./CreatePost";

export class ShortcodePostPage extends WordPressPostEditor {
  constructor(page: Page) {
    super(page);
  }

  async expectShortcodeNotRendered(rawTag: string) {
    await expect(this.page.locator(`text=${rawTag}`)).not.toBeVisible();
  }
}
