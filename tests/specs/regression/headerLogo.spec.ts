import { test, expect } from '@playwright/test';
import { HeaderSectionPage } from '../../pages/regression/HeaderSectionPage';
import { STAGING_URL } from '../../helpers/login';

test.describe('header logo', () => {
  let header: HeaderSectionPage;

  test.beforeEach(async ({ page }) => {
    header = new HeaderSectionPage(page);
    await header.goto(STAGING_URL);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test('clicking logo navigates to home and shows site title', async ({ page }) => {
    const logo = page.getByRole('link', { name: '99Bitcoins', exact: true });
    await expect(logo).toBeVisible();
    // Logo has correct href (homepage)
    await expect(logo).toHaveAttribute('href', /^(\/|https?:\/\/[^/]+\/?$)/);
    await logo.click();
    // URL is homepage
    await expect(page).toHaveURL(/99bitcoins\.(com|local)\/?$/);
    await expect(page).toHaveTitle(/99Bitcoins/i);
    await expect(page.getByRole('heading', { name: /99Bitcoins/i }).first()).toBeVisible();
  });
});
