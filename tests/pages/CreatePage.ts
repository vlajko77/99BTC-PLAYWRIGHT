import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PagePage extends BasePage {
  async gotoNewPage() {
    await this.page.goto('/wp-admin/post-new.php?post_type=page');
  }

  async fillPageDetails(title: string, content: string) {
    await this.page.getByRole('textbox', { name: 'Add title' }).fill(title);
    await this.page.locator('#content').fill(content);
  }

  async publishPage() {
    await this.publish();
  }
}
