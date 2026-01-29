import { test, expect } from '@playwright/test';
import { HeaderSectionPage } from '../../pages/regression/HeaderSectionPage';
import { STAGING_URL } from '../../helpers/login';

test.describe('header section', () => {
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

  test('verify header section elements', async ({ page }) => {
    await header.verifyHeaderElements();
    await header.openBitcoinCasinosMenu();
    await header.clickBitcoinHistoricalPrice();
    await expect(page.getByRole('heading', { name: 'Bitcoin Historical Price &' })).toBeVisible();
  });

  test('verify header section search functionality', async ({ page }) => {
    await header.search('dogecoin');
    const searchResult = page.getByText('You searched for dogecoin');
    await expect(searchResult).toBeVisible();
  });
});
