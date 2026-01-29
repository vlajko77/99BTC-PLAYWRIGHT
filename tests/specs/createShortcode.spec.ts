import { test, expect, devices } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ShortcodePage } from '../pages/CreateShortcodePage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';
import { renderKeyTakeaways } from '../helpers/shortcode';

// Run this spec using a mobile device emulation (iPhone 12)
test.use({ ...devices['iPhone 12'] });

test('Add a new page with key_takeaways shortcode and verify it is visible', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const shortcodePage = new ShortcodePage(page);

  await loginPage.goto();
  await loginPage.login(WP_USERNAME, WP_PASSWORD);
  await loginPage.verifyLoginSuccess();

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

  // Fill in details and publish
  await shortcodePage.fillShortcodeDetails(randomTitle, shortcode);
  await shortcodePage.publishPage();

  const permalink = await shortcodePage.getPermalink();
  if (!permalink) throw new Error('Could not find permalink after publishing');

  await shortcodePage.openPermalink(permalink);
  // Verify at least one of the key takeaways text appears on the published page
  await shortcodePage.expectContentVisible('Lorem ipsum odor amet, consectetuer adipiscing elit.');

  // Assert the combined title + takeaway text is visible as requested
  await expect(page.getByText('Title Lorem ipsum odor amet,')).toBeVisible();
});
