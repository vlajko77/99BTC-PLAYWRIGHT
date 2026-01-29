import { test, expect, devices } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ShortcodePage } from '../pages/CreateShortcodePage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';
import { renderKeyTakeaways } from '../helpers/shortcode';

// Run tests using mobile device emulation (iPhone 12)
test.use({ ...devices['iPhone 12'] });

test.describe('WordPress shortcode page creation', () => {
  let loginPage: LoginPage;
  let shortcodePage: ShortcodePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    shortcodePage = new ShortcodePage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test('Add a new page with key_takeaways shortcode and verify it is visible', async ({ page }) => {
    await shortcodePage.gotoNewPage();

    const randomTitle = 'Shortcode Page ' + Date.now();
    const data = {
      title: 'Title',
      items: [
        'Lorem ipsum odor amet, consectetuer adipiscing elit.',
        'Lorem ipsum odor amet, consectetuer adipiscing elit.',
        'Lorem ipsum odor amet, consectetuer adipiscing elit.',
      ],
    };

    const shortcode = renderKeyTakeaways(data);

    await shortcodePage.fillShortcodeDetails(randomTitle, shortcode);
    await shortcodePage.publishPage();

    const permalink = await shortcodePage.getPermalink();
    if (!permalink) throw new Error('Could not find permalink after publishing');

    await shortcodePage.openPermalink(permalink);
    await shortcodePage.expectContentVisible('Lorem ipsum odor amet, consectetuer adipiscing elit.');
    await expect(page.getByText('Title Lorem ipsum odor amet,')).toBeVisible();
  });
});
