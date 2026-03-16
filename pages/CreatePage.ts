import { BasePage } from "./BasePage";

export class WordPressPageEditor extends BasePage {
  async gotoNewPage() {
    await this.page.goto("/wp-admin/post-new.php?post_type=page");
  }
}
