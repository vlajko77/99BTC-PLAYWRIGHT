import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test.describe('WordPress login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test('Login to 99Bitcoins', async () => {
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });
});
