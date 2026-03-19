import { test, expect } from "../../fixtures/test.fixture";
import { renderKeyTakeaways } from "../../utils/shortcode";
import { multipleShortcodeBlocks } from "../../data/keyTakeaways";

test.describe("Multiple shortcodes in WordPress pages", () => {
  test("Multiple shortcodes render correctly in a single page", async ({
    loginPage: _,
    pageEditor,
    page,
  }) => {
    await pageEditor.gotoNewPage();

    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const [firstBlock, secondBlock, thirdBlock] = multipleShortcodeBlocks;
    const randomTitle = "Multiple Shortcodes Page " + Date.now();

    const content = `
${renderKeyTakeaways(firstBlock)}

<p>Some regular content between shortcodes to test proper spacing and rendering.</p>

${renderKeyTakeaways(secondBlock)}

<p>Another paragraph of regular text content.</p>

${renderKeyTakeaways(thirdBlock)}
    `.trim();

    await pageEditor.fillTitleAndContent(randomTitle, content);
    await pageEditor.publish();

    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await pageEditor.openPermalink(permalink!);

    await expect(page).toHaveURL(/multiple-shortcodes|page_id=/i);

    await pageEditor.expectContentVisible(firstBlock.title);
    await pageEditor.expectContentVisible(secondBlock.title);
    await pageEditor.expectContentVisible(thirdBlock.title);

    for (const block of multipleShortcodeBlocks) {
      for (const item of block.items) {
        await pageEditor.expectContentVisible(item);
      }
    }

    await pageEditor.expectContentVisible(
      "Some regular content between shortcodes",
    );
    await pageEditor.expectContentVisible(
      "Another paragraph of regular text content",
    );

    const rawShortcode = page.locator("text=[key_takeaways");
    await expect(rawShortcode).not.toBeVisible();

    const keyTakeawaysSections = page.locator(
      '.key-takeaways, [class*="key-takeaway"]',
    );
    const sectionCount = await keyTakeawaysSections.count();
    expect(sectionCount).toBeGreaterThanOrEqual(3);
  });
});
