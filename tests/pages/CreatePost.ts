import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PostPage extends BasePage {

  async navigateToPosts() {
    await this.page.getByRole('link', { name: 'Posts', exact: true }).click();
  }

  async clickAddNewPost() {
    await this.page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Add Post' }).click();
  }

  async fillPostDetails(title: string, content: string) {
    await this.page.getByRole('textbox', { name: 'Add title' }).fill(title);
    await this.page.locator('#content').fill(content);
  }

  async selectCategory(categoryName: string) {
    await this.page.getByRole('checkbox', { name: categoryName, exact: true }).check();
  }

  async publishPost() {
    await this.publish();
   }
}

