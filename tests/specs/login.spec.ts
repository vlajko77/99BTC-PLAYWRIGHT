import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test('Login to 99Bitcoins', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
});
