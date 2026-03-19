import { test, expect } from "../../fixtures/test.fixture";
import { renderKeyTakeaways } from "../../utils/shortcode";
import { keyTakeawaysBasic } from "../../data/keyTakeaways";
import { devices } from "@playwright/test";

// Run tests using mobile device emulation (iPhone 12)
test.use({ ...devices["iPhone 12"] });

test.describe("WordPress shortcode page creation", () => {
  test("Add a new page with key_takeaways shortcode and verify it is visible", async ({
    loginPage: _,
    pageEditor,
    page,
  }) => {
    await pageEditor.gotoNewPage();

    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(500);

    const shortcode = renderKeyTakeaways(keyTakeawaysBasic);

    await pageEditor.fillTitleAndContent("Shortcode Page " + Date.now(), shortcode);
    await pageEditor.publish();

    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await pageEditor.openPermalink(permalink!);

    await expect(page).toHaveURL(/shortcode-page|page_id=/i);

    await pageEditor.expectContentVisible(keyTakeawaysBasic.title);

    for (const item of keyTakeawaysBasic.items) {
      await pageEditor.expectContentVisible(item);
    }
  });
});
