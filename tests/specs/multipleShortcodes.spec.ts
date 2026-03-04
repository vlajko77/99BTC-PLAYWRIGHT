import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { WordPressPageEditor } from "../pages/CreatePage";
import { WP_USERNAME, WP_PASSWORD } from "../helpers/login";
import { renderKeyTakeaways, KeyTakeaways } from "../helpers/shortcode";

test.describe("Multiple shortcodes in WordPress pages", () => {
  let loginPage: LoginPage;
  let pageEditor: WordPressPageEditor;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pageEditor = new WordPressPageEditor(page);
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

  test("Multiple shortcodes render correctly in a single page", async ({
    page,
  }) => {
    await pageEditor.gotoNewPage();

    // Verify we're on the new page editor
    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const randomTitle = "Multiple Shortcodes Page " + Date.now();

    // First shortcode block
    const firstBlock: KeyTakeaways = {
      title: "Introduction Highlights",
      items: [
        "Welcome to our comprehensive guide.",
        "This section covers the basics.",
        "Read on for detailed information.",
      ],
    };

    // Second shortcode block
    const secondBlock: KeyTakeaways = {
      title: "Advanced Topics",
      items: [
        "Deep dive into advanced concepts.",
        "Expert tips and best practices.",
        "Common pitfalls to avoid.",
      ],
      headingType: "h3",
    };

    // Third shortcode block
    const thirdBlock: KeyTakeaways = {
      title: "Summary Points",
      items: ["Key conclusion from this article.", "Next steps for readers."],
      headingType: "h4",
    };

    // Combine all shortcodes with some text between them
    const content = `
${renderKeyTakeaways(firstBlock)}

<p>Some regular content between shortcodes to test proper spacing and rendering.</p>

${renderKeyTakeaways(secondBlock)}

<p>Another paragraph of regular text content.</p>

${renderKeyTakeaways(thirdBlock)}
    `.trim();

    // Fill page details with multiple shortcodes
    await pageEditor.fillPageDetails(randomTitle, content);

    // Publish the page
    await pageEditor.publishPage();

    // Get permalink and navigate to published page
    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await pageEditor.openPermalink(permalink!);

    // Verify URL is the published page
    await expect(page).toHaveURL(/multiple-shortcodes|page_id=/i);

    // Verify all three shortcode titles are visible
    await pageEditor.expectContentVisible(firstBlock.title);
    await pageEditor.expectContentVisible(secondBlock.title);
    await pageEditor.expectContentVisible(thirdBlock.title);

    // Verify items from first block
    for (const item of firstBlock.items) {
      await pageEditor.expectContentVisible(item);
    }

    // Verify items from second block
    for (const item of secondBlock.items) {
      await pageEditor.expectContentVisible(item);
    }

    // Verify items from third block
    for (const item of thirdBlock.items) {
      await pageEditor.expectContentVisible(item);
    }

    // Verify regular text content is also visible
    await pageEditor.expectContentVisible(
      "Some regular content between shortcodes",
    );
    await pageEditor.expectContentVisible(
      "Another paragraph of regular text content",
    );

    // Verify raw shortcode tags are NOT visible (properly rendered)
    const rawShortcode = page.locator("text=[key_takeaways");
    await expect(rawShortcode).not.toBeVisible();

    // Verify no visual conflicts - check that elements don't overlap
    // by ensuring all blocks are present in the DOM
    const keyTakeawaysSections = page.locator(
      '.key-takeaways, [class*="key-takeaway"]',
    );
    const sectionCount = await keyTakeawaysSections.count();
    expect(sectionCount).toBeGreaterThanOrEqual(3);
  });
});
