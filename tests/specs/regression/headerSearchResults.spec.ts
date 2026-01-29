import { test, expect } from '@playwright/test';
import { HeaderSectionPage } from '../../pages/regression/HeaderSectionPage';
import { STAGING_URL } from '../../helpers/login';

test.describe('header search', () => {
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

  test('search returns results for bitcoin', async ({ page }) => {
    // Search icon is visible
    await expect(header.searchIcon).toBeVisible();

    // Perform search
    await header.search('bitcoin');

    // URL contains search query
    await expect(page).toHaveURL(/[?&]s=bitcoin/i);

    // Search results message is visible
    await expect(page.getByText(/You searched for bitcoin/i)).toBeVisible();

    // Results section is displayed (page has content beyond search message)
    await expect(page.locator('main, #content, .content')).toBeVisible();
  });

  test('search with no results shows appropriate message', async ({ page }) => {
    await header.search('xyznonexistent123');

    await expect(page).toHaveURL(/[?&]s=xyznonexistent123/i);
    await expect(page.getByText(/no results|nothing found|not found/i)).toBeVisible();
  });
});
