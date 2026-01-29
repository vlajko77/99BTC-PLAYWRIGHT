import { test, expect } from '@playwright/test';
import { HeaderSectionPage } from '../../pages/regression/HeaderSectionPage';

test.describe('header search', () => {
  let header: HeaderSectionPage;

  test.beforeEach(async ({ page }) => {
    header = new HeaderSectionPage(page);
    await header.goto('https://staging:staging@staging.99bitcoins.com/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test('search returns results for bitcoin', async ({ page }) => {
    await header.search('bitcoin');
    await expect(page.getByText(/You searched for bitcoin/i)).toBeVisible();
  });
});
