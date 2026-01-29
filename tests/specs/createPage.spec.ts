import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WordPressPageEditor } from '../pages/CreatePage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test.describe('WordPress page creation', () => {
  let loginPage: LoginPage;
  let pageEditor: WordPressPageEditor;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pageEditor = new WordPressPageEditor(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test('Add a new page and verify it is visible', async () => {
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
});
