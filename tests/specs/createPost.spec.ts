import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PostPage } from '../pages/CreatePost';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test('Add a new post to 99bitcoins', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const postPage = new PostPage(page);

  await loginPage.goto();
  await loginPage.login(WP_USERNAME, WP_PASSWORD);
  await loginPage.verifyLoginSuccess();

  await postPage.navigateToPosts();
  await postPage.clickAddNewPost();

  const randomTitle = 'Test Post ' + Math.floor(Math.random() * 100000);
  const randomContent = 'This post is added by Playwright. Random value: ' + Math.random();

  await postPage.fillPostDetails(randomTitle, randomContent);
  await postPage.selectCategory('News');
  await postPage.publishPost();

  const permalink = await (postPage as any).getPermalink();

  await postPage.openPermalink(permalink);
  await postPage.expectContentVisible(randomContent);
});
