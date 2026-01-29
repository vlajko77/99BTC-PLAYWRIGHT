import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WordPressPostEditor } from '../pages/CreatePost';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test('Add a new post to 99bitcoins', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const postEditor = new WordPressPostEditor(page);

  await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  await postEditor.gotoNewPost();

  const randomTitle = 'Test Post ' + Math.floor(Math.random() * 100000);
  const randomContent = 'This post is added by Playwright. Random value: ' + Math.random();

  await postEditor.fillPostDetails(randomTitle, randomContent);
  await postEditor.selectCategory('News');
  await postEditor.publishPost();

  const permalink = await postEditor.getPermalink();
  if (!permalink) throw new Error('Could not find permalink after publishing');

  await postEditor.openPermalink(permalink);
  await postEditor.expectContentVisible(randomContent);
});
