import { test, expect } from '@playwright/test';
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

  test('Add a new page and verify it is visible', async ({ page }) => {
    await pageEditor.gotoNewPage();

    // Verify we're on the page editor
    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const randomTitle = 'Test Page ' + Math.floor(Math.random() * 100000);
    const randomContent = 'Playwright page content. Random: ' + Math.random();

    await pageEditor.fillPageDetails(randomTitle, randomContent);
    await pageEditor.publishPage();

    // Verify permalink exists (publish succeeded)
    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();

    await pageEditor.openPermalink(permalink!);

    // Verify URL is the published page (slug or page_id)
    await expect(page).toHaveURL(/test-page|page_id=/i);

    // Verify title visible on page
    await pageEditor.expectContentVisible(randomTitle);

    // Verify content visible on page
    await pageEditor.expectContentVisible(randomContent);
  });
});
