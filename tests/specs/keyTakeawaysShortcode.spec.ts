import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { KeyTakeawaysPage } from '../pages/KeyTakeawaysPage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test.describe('Key Takeaways Shortcode', () => {
  let loginPage: LoginPage;
  let keyTakeawaysPage: KeyTakeawaysPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    keyTakeawaysPage = new KeyTakeawaysPage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test('should render key_takeaways shortcode with h3 heading type', async () => {
    const data = {
      title: 'Key Takeaways',
      headingType: 'h3' as const,
      items: ['Point 1', 'Point 2', 'Point 3'],
    };

    await keyTakeawaysPage.createPageWithKeyTakeaways('Key Takeaways Test ' + Date.now(), data);
    await keyTakeawaysPage.navigateToPublishedPage();
    await keyTakeawaysPage.verifyKeyTakeaways(data);
  });

  test('should render key_takeaways shortcode without heading type', async () => {
    const data = {
      title: 'Important Points',
      items: ['First point', 'Second point'],
    };

    await keyTakeawaysPage.createPageWithKeyTakeaways('Key Takeaways Default ' + Date.now(), data);
    await keyTakeawaysPage.navigateToPublishedPage();
    await keyTakeawaysPage.verifyKeyTakeaways(data);
  });

  test('should render key_takeaways shortcode with multiple items', async () => {
    const data = {
      title: 'Summary',
      headingType: 'h2' as const,
      items: [
        'Bitcoin is a decentralized digital currency',
        'Blockchain technology ensures transparency',
        'Wallets store your private keys securely',
        'Always do your own research before investing',
        'Security best practices are essential',
      ],
    };

    await keyTakeawaysPage.createPageWithKeyTakeaways('Key Takeaways Multi ' + Date.now(), data);
    await keyTakeawaysPage.navigateToPublishedPage();
    await keyTakeawaysPage.verifyKeyTakeaways(data);
  });
});
