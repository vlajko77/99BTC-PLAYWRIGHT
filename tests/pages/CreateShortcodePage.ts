import { WordPressPageEditor } from "./CreatePage";

export class ShortcodePage extends WordPressPageEditor {
  // Method to fill title and shortcode content
  async fillShortcodeDetails(title: string, shortcode: string) {
    await this.fillPageDetails(title, shortcode);
  }
}
