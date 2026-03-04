import { WordPressPageEditor } from "./CreatePage";
import { renderKeyTakeaways, KeyTakeaways } from "../helpers/shortcode";

export class KeyTakeawaysPage extends WordPressPageEditor {
  async createPageWithKeyTakeaways(pageTitle: string, data: KeyTakeaways) {
    await this.gotoNewPage();
    const shortcode = renderKeyTakeaways(data);
    await this.fillPageDetails(pageTitle, shortcode);
    await this.publishPage();
  }

  async navigateToPublishedPage() {
    const permalink = await this.getPermalink();
    if (!permalink) {
      throw new Error("Could not find permalink after publishing");
    }
    await this.openPermalink(permalink);
    return permalink;
  }

  async verifyKeyTakeawaysTitle(title: string) {
    await this.expectContentVisible(title);
  }

  async verifyKeyTakeawayItems(items: string[]) {
    for (const item of items) {
      await this.expectContentVisible(item);
    }
  }

  async verifyKeyTakeaways(data: KeyTakeaways) {
    await this.verifyKeyTakeawaysTitle(data.title);
    await this.verifyKeyTakeawayItems(data.items);
  }
}
