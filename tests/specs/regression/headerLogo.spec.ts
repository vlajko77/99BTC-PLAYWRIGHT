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
    await page.getByRole('link', { name: '99Bitcoins', exact: true }).click();
    await expect(page.getByRole('heading', { name: /99Bitcoins/i }).first()).toBeVisible();
  });
});
