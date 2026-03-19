import { test, expect } from "../../fixtures/test.fixture";
import { WordPressPageEditor } from "../../pages/CreatePage";
import {
  MALFORMED_SHORTCODE_CONTENT,
  MISSING_PARAMS_CONTENT,
} from "../../data/shortcodeErrors";

test.describe("Shortcode error handling in WordPress", () => {
  async function createPageAndNavigate(
    pageEditor: WordPressPageEditor,
    title: string,
    content: string,
  ) {
    await pageEditor.gotoNewPage();
    await pageEditor.fillTitleAndContent(title, content);
    await pageEditor.publish();
    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await pageEditor.openPermalink(permalink!);
  }

  test("Page with malformed shortcode handles errors gracefully", async ({
    loginPage: _,
    pageEditor,
    page,
  }) => {
    const randomTitle = "Malformed Shortcode Page " + Date.now();

    await createPageAndNavigate(pageEditor, randomTitle, MALFORMED_SHORTCODE_CONTENT);

    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    expect(title).not.toMatch(/500|503|502|Internal Server Error/i);

    await pageEditor.expectContentVisible(randomTitle);
    await pageEditor.expectContentVisible("Valid content at the start");
    await pageEditor.expectContentVisible("Valid content at the end");

    const bodyText = (await page.locator("body").textContent()) || "";
    expect(bodyText).not.toMatch(/Fatal error:/i);
    expect(bodyText).not.toMatch(/Parse error:/i);
  });

  test("Page with missing shortcode parameters degrades gracefully", async ({
    loginPage: _,
    pageEditor,
    page,
  }) => {
    const randomTitle = "Missing Params Page " + Date.now();

    await createPageAndNavigate(pageEditor, randomTitle, MISSING_PARAMS_CONTENT);

    await expect(page).not.toHaveURL(/error|500/i);

    await pageEditor.expectContentVisible(
      "Introduction paragraph with valid content",
    );
    await pageEditor.expectContentVisible(
      "Conclusion paragraph with valid content",
    );

    const errorIndicators = page
      .locator("text=/error|exception|warning/i")
      .first();
    const hasVisibleError = await errorIndicators
      .isVisible()
      .catch(() => false);

    if (hasVisibleError) {
      const errorText = await errorIndicators.textContent();
      expect(errorText?.toLowerCase()).not.toContain("php");
      expect(errorText?.toLowerCase()).not.toContain("fatal");
      expect(errorText?.toLowerCase()).not.toContain("parse");
    }
  });
});
