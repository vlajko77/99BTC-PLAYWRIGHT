import { PagePage } from './CreatePage';

export class ShortcodePage extends PagePage {
  // Method to fill title and shortcode content
  async fillShortcodeDetails(title: string, shortcode: string) {
    await this.fillPageDetails(title, shortcode);
  }
}
