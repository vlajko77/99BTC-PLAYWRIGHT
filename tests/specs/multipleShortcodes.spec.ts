import { test, expect } from "../../fixtures/test.fixture";
import { renderKeyTakeaways, KeyTakeaways } from "../../utils/shortcode";

test.describe("Multiple shortcodes in WordPress pages", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Multiple shortcodes render correctly in a single page", async ({
    loginPage: _,
    pageEditor,
    page,
  }) => {
    await pageEditor.gotoNewPage();

    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const randomTitle = "Multiple Shortcodes Page " + Date.now();

    const firstBlock: KeyTakeaways = {
      title: "Introduction Highlights",
      items: [
        "Welcome to our comprehensive guide.",
        "This section covers the basics.",
        "Read on for detailed information.",
      ],
    };

    const secondBlock: KeyTakeaways = {
      title: "Advanced Topics",
      items: [
        "Deep dive into advanced concepts.",
        "Expert tips and best practices.",
        "Common pitfalls to avoid.",
      ],
      headingType: "h3",
    };

    const thirdBlock: KeyTakeaways = {
      title: "Summary Points",
      items: ["Key conclusion from this article.", "Next steps for readers."],
      headingType: "h4",
    };

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

    for (const block of [firstBlock, secondBlock, thirdBlock]) {
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
