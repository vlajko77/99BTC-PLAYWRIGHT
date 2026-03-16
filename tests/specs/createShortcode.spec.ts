import { test, expect } from "../../fixtures/test.fixture";
import { renderKeyTakeaways } from "../../utils/shortcode";
import { devices } from "@playwright/test";

// Run tests using mobile device emulation (iPhone 12)
test.use({ ...devices["iPhone 12"] });

test.describe("WordPress shortcode page creation", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Add a new page with key_takeaways shortcode and verify it is visible", async ({
    loginPage: _,
    pageEditor,
    page,
  }) => {
    await pageEditor.gotoNewPage();

    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(500);

    const randomTitle = "Shortcode Page " + Date.now();
    const data = {
      title: "Key Takeaways",
      items: [
        "First important point about the topic.",
        "Second important point to remember.",
        "Third key takeaway for readers.",
      ],
    };

    const shortcode = renderKeyTakeaways(data);

    await pageEditor.fillTitleAndContent(randomTitle, shortcode);
    await pageEditor.publish();

    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await pageEditor.openPermalink(permalink!);

    await expect(page).toHaveURL(/shortcode-page|page_id=/i);

    await pageEditor.expectContentVisible(data.title);

    for (const item of data.items) {
      await pageEditor.expectContentVisible(item);
    }
  });
});
