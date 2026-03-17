import { BasePage } from "./BasePage";

export class WordPressPostEditor extends BasePage {
  async gotoNewPost() {
    await this.page.goto("/wp-admin/post-new.php");
  }

  async selectCategory(categoryName: string) {
    await this.page
      .getByRole("checkbox", { name: categoryName, exact: true })
      .check();
  }

  async createPostWithShortcode(title: string, content: string): Promise<void> {
    await this.gotoNewPost();
    await this.fillTitleAndContent(title, content);
    await this.selectCategory("News");
    await this.publishAndNavigate();
  }
}
