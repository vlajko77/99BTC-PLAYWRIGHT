import { BasePage } from './BasePage';

export class WordPressPostEditor extends BasePage {
  async gotoNewPost() {
    await this.page.goto('/wp-admin/post-new.php');
  }

  async fillPostDetails(title: string, content: string) {
    await this.fillTitleAndContent(title, content);
  }

  async selectCategory(categoryName: string) {
    await this.page.getByRole('checkbox', { name: categoryName, exact: true }).check();
  }

  async publishPost() {
    await this.publish();
  }
}
