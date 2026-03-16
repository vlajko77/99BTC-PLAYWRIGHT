import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { WordPressPostEditor } from "../../pages/CreatePost";
import { WP_USERNAME, WP_PASSWORD } from "../../utils/login";

test.describe("WordPress post creation", () => {
  let loginPage: LoginPage;
  let postEditor: WordPressPostEditor;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    postEditor = new WordPressPostEditor(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Add a new post to 99bitcoins", async ({ page }) => {
    await postEditor.gotoNewPost();

    await expect(page).toHaveURL(/post-new\.php/);

    const randomTitle = "Test Post " + Math.floor(Math.random() * 100000);
    const randomContent =
      "This post is added by Playwright. Random value: " + Math.random();

    await postEditor.fillPostDetails(randomTitle, randomContent);
    await postEditor.selectCategory("News");
    await postEditor.publishPost();

    // Verify permalink exists (publish succeeded)
    const permalink = await postEditor.getPermalink();
    expect(permalink).toBeTruthy();

    await postEditor.openPermalink(permalink!);

    // Verify URL is the published post
    await expect(page).toHaveURL(/test-post|p=/i);

    await postEditor.expectContentVisible(randomTitle);
    await postEditor.expectContentVisible(randomContent);

    // Verify category is displayed
    await expect(
      page.getByRole("link", { name: "News" }).first(),
    ).toBeVisible();
  });
});
