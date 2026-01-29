import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PagePage } from '../pages/CreatePage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test('Add a new page and verify it is visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pagePage = new PagePage(page);

  await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  await pagePage.gotoNewPage();

  const randomTitle = 'Test Page ' + Math.floor(Math.random() * 100000);
  const randomContent = 'Playwright page content. Random: ' + Math.random();

  await pagePage.fillPageDetails(randomTitle, randomContent);
  await pagePage.publishPage();

  const permalink = await pagePage.getPermalink();
  if (!permalink) throw new Error('Could not find permalink after publishing');

  await pagePage.openPermalink(permalink);
  await pagePage.expectContentVisible(randomContent);
});
