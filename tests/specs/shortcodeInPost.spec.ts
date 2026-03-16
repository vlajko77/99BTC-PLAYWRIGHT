import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { WordPressPostEditor } from "../../pages/CreatePost";
import { WP_USERNAME, WP_PASSWORD } from "../../utils/login";
import { renderKeyTakeaways } from "../../utils/shortcode";

test.describe("Shortcode rendering in WordPress posts", () => {
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

  test("Shortcode renders correctly in a post", async ({ page }) => {
    await postEditor.gotoNewPost();

    // Verify we're on the new post page
    await expect(page).toHaveURL(/post-new\.php/);

    const randomTitle = "Shortcode Post " + Date.now();
    const data = {
      title: "Key Takeaways",
      items: [
        "First important point about the topic.",
        "Second important point to remember.",
        "Third key takeaway for readers.",
      ],
    };

    const shortcode = renderKeyTakeaways(data);

    // Fill post details with shortcode content
    await postEditor.fillPostDetails(randomTitle, shortcode);

    // Publish the post
    await postEditor.publishPost();

    // Get permalink and navigate to published post
    const permalink = await postEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await postEditor.openPermalink(permalink!);

    // Verify URL is the published post
    await expect(page).toHaveURL(/shortcode-post|p=/i);

    // Verify shortcode title is visible (rendered output, not raw shortcode)
    await postEditor.expectContentVisible(data.title);

    // Verify all shortcode items are visible
    for (const item of data.items) {
      await postEditor.expectContentVisible(item);
    }

    // Verify raw shortcode tags are NOT visible (properly rendered)
    const rawShortcode = page.locator("text=[key_takeaways");
    await expect(rawShortcode).not.toBeVisible();
  });
});
