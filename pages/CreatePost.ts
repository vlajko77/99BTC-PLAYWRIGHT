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

}
