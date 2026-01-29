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

  test('verify header section elements are visible', async () => {
    await header.verifyHeaderElements();
  });

  test('verify navigation menu opens submenu on hover', async () => {
    await header.openBitcoinCasinosMenu();

    // Submenu is visible
    await expect(header.bitcoinSubMenuLink).toBeVisible();
  });

  test('verify submenu navigation works correctly', async ({ page }) => {
    await header.openBitcoinCasinosMenu();
    await header.clickBitcoinHistoricalPrice();
    await expect(page).toHaveURL(/historical-price/i);
    await expect(page.getByRole('heading', { name: 'Bitcoin Historical Price &' })).toBeVisible();
  });
});
