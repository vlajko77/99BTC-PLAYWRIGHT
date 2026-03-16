import { test, expect } from "../../fixtures/test.fixture";
import { renderKeyTakeaways } from "../../utils/shortcode";

test.describe("Shortcode rendering in WordPress posts", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Shortcode renders correctly in a post", async ({
    loginPage: _,
    postEditor,
    page,
  }) => {
    await postEditor.gotoNewPost();

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

    await postEditor.fillTitleAndContent(randomTitle, shortcode);
    await postEditor.publish();

    const permalink = await postEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await postEditor.openPermalink(permalink!);

    await expect(page).toHaveURL(/shortcode-post|p=/i);
    await postEditor.expectContentVisible(data.title);

    for (const item of data.items) {
      await postEditor.expectContentVisible(item);
    }

    const rawShortcode = page.locator("text=[key_takeaways");
    await expect(rawShortcode).not.toBeVisible();
  });
});
