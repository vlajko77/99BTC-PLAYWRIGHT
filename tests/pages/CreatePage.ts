import { BasePage } from './BasePage';

export class WordPressPageEditor extends BasePage {
  async gotoNewPage() {
    await this.page.goto('/wp-admin/post-new.php?post_type=page');
  }

  async fillPageDetails(title: string, content: string) {
    await this.fillTitleAndContent(title, content);
  }

  async publishPage() {
    await this.publish();
  }
}
