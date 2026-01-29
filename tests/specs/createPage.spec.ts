import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WordPressPageEditor } from '../pages/CreatePage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test('Add a new page and verify it is visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pageEditor = new WordPressPageEditor(page);

  await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  await pageEditor.gotoNewPage();

  const randomTitle = 'Test Page ' + Math.floor(Math.random() * 100000);
  const randomContent = 'Playwright page content. Random: ' + Math.random();

  await pageEditor.fillPageDetails(randomTitle, randomContent);
  await pageEditor.publishPage();

  const permalink = await pageEditor.getPermalink();
  if (!permalink) throw new Error('Could not find permalink after publishing');

  await pageEditor.openPermalink(permalink);
  await pageEditor.expectContentVisible(randomContent);
});
