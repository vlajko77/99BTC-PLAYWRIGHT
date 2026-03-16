import { WordPressPageEditor } from "./CreatePage";
import { renderKeyTakeaways, KeyTakeaways } from "../utils/shortcode";

export class KeyTakeawaysPage extends WordPressPageEditor {
  async createPageWithKeyTakeaways(pageTitle: string, data: KeyTakeaways) {
    await this.gotoNewPage();
    const shortcode = renderKeyTakeaways(data);
    await this.fillTitleAndContent(pageTitle, shortcode);
    await this.publish();
  }

  async navigateToPublishedPage() {
    const permalink = await this.getPermalink();
    if (!permalink) {
      throw new Error("Could not find permalink after publishing");
    }
    await this.openPermalink(permalink);
    return permalink;
  }

  async verifyKeyTakeaways(data: KeyTakeaways) {
    await this.expectContentVisible(data.title);
    for (const item of data.items) {
      await this.expectContentVisible(item);
    }
  }
}
