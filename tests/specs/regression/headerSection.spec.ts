import { test, expect } from '@playwright/test';
import { HeaderSectionPage } from '../../pages/regression/HeaderSectionPage';

test.describe('header section', () => {
  let header: HeaderSectionPage;

  // beforeAll: runs once before all tests in this describe block
  test.beforeAll(async () => {
    console.log('📋 Starting header section test suite');
  });

  // beforeEach: runs before each test
  test.beforeEach(async ({ page }) => {
    header = new HeaderSectionPage(page);
    await header.goto('https://staging:staging@staging.99bitcoins.com/');
    console.log(await page.viewportSize());
  });

  // afterEach: runs after each test
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Test "${testInfo.title}" finished with status: ${testInfo.status}`);
    
    // Take screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  // afterAll: runs once after all tests in this describe block
  test.afterAll(async () => {
    console.log('✅ Header section test suite complete');
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
