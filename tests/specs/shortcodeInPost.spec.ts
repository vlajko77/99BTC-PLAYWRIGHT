import { test, expect } from "../../fixtures/test.fixture";
import { SHORTCODE_TEST_CASES } from "../../data/shortcodes";

test.describe("Shortcode rendering in WordPress posts", () => {
  for (const testCase of SHORTCODE_TEST_CASES) {
    test(`renders ${testCase.name} shortcode correctly`, async ({
      loginPage: _,
      shortcodePostPage,
      page,
    }) => {
      const title = `${testCase.name} ${Date.now()}`;

      await shortcodePostPage.createPostWithShortcode(title, testCase.shortcode);

      const urlRegex = testCase.urlRegex ?? /\?p=\d+|page_id=\d+/i;
      await expect(page).toHaveURL(urlRegex);

      for (const expected of testCase.expectedTexts) {
        await shortcodePostPage.expectContentVisible(expected);
      }

      for (const forbidden of testCase.forbiddenTexts ?? []) {
        await shortcodePostPage.expectShortcodeNotRendered(forbidden);
      }
    });
  }
});
