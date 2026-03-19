import { test, expect } from "../../../fixtures/test.fixture";
import {
  SHORTCODE_TEST_CASES,
  CTA_BUTTON_SHORTCODE,
  STEP_BY_STEP_GUIDE_SHORTCODE,
  COUNTDOWN_SHORTCODE,
  GREEN_CHECKMARKS_SHORTCODE,
  PROS_AND_CONS_SHORTCODE,
  VERDICT_SHORTCODE,
  STAR_RATING_SHORTCODE,
  HIGHLIGHTED_PARAGRAPH_SHORTCODE,
  KEY_TAKEAWAYS_SHORTCODE,
  COMBINED_SHORTCODES_CONTENT,
} from "../../../data/shortcodes";

// ─── Shortcode rendering in posts ─────────────────────────────────────────────

test.describe("Shortcode rendering in WordPress posts", () => {
  for (const testCase of SHORTCODE_TEST_CASES) {
    test(`renders ${testCase.name} shortcode correctly`, async ({
      loginPage: _,
      shortcodePage,
      page,
    }) => {
      const title = `${testCase.name} ${Date.now()}`;

      await shortcodePage.createPostWithShortcode(title, testCase.shortcode);

      const urlRegex = testCase.urlRegex ?? /\?p=\d+/i;
      await expect(page).toHaveURL(urlRegex);

      for (const expected of testCase.expectedTexts) {
        await shortcodePage.expectContentVisible(expected);
      }

      for (const forbidden of testCase.forbiddenTexts ?? []) {
        await shortcodePage.expectShortcodeNotRendered(forbidden);
      }
    });
  }
});

// ─── Aesthetic shortcodes in posts ────────────────────────────────────────────

test.describe("Aesthetic Shortcodes in posts", () => {
  test("CTA Button shortcode renders correctly", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("CTA Button Test " + crypto.randomUUID(), CTA_BUTTON_SHORTCODE);

    await expect(page.getByRole("link", { name: "Visit Margex" })).toBeVisible();
  });

  test("Step by step guide shortcode renders with multiple items", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    await shortcodePage.createPostWithShortcode("Step by Step Guide Test " + crypto.randomUUID(), STEP_BY_STEP_GUIDE_SHORTCODE);

    await expect(page.getByText("Visit the Website")).toBeVisible();
    await expect(page.getByText("Register Your Account")).toBeVisible();
    await expect(page.getByText("Verify Your Email")).toBeVisible();
  });

  test("Countdown shortcode renders expired message when date has passed", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    await shortcodePage.createPostWithShortcode("Countdown Test " + crypto.randomUUID(), COUNTDOWN_SHORTCODE);

    await expect(page.getByText("The offer is expired.")).toBeVisible();
  });

  test("Checklist with green checkmarks shortcode", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("Checklist Test " + crypto.randomUUID(), GREEN_CHECKMARKS_SHORTCODE);

    await expect(page.getByText("User-Friendly Interface")).toBeVisible();
    await expect(page.getByText("Trading Fees")).toBeVisible();
    await expect(page.getByText("Customer Support")).toBeVisible();
  });

  test("Pros and Cons shortcode renders sections", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("Pros & Cons Test " + crypto.randomUUID(), PROS_AND_CONS_SHORTCODE);

    await expect(page.getByText("Innovative social trading features")).toBeVisible();
    await expect(page.getByText("Limited payment options")).toBeVisible();
  });

  test("Verdict shortcode with rating and items", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("Verdict Test " + crypto.randomUUID(), VERDICT_SHORTCODE);

    await expect(page.getByText("Our Verdict")).toBeVisible();
    await expect(page.getByText("Visit CoinCasino")).toBeVisible();
    await expect(page.getByText("Accepted Cryptocurrencies")).toBeVisible();
  });

  test("Star rating shortcode renders with label", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("Star Rating Test " + crypto.randomUUID(), STAR_RATING_SHORTCODE);

    await expect(page.getByText("Review", { exact: true }).first()).toBeVisible();
  });

  test("Highlighted paragraph shortcode renders", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("Highlighted Section Test " + crypto.randomUUID(), HIGHLIGHTED_PARAGRAPH_SHORTCODE);

    await expect(page.getByText("Key Point")).toBeVisible();
    await expect(page.getByText("This is important information that should stand out to readers.")).toBeVisible();
  });

  test("Key Takeaways shortcode with multiple items", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("Key Takeaways Test " + crypto.randomUUID(), KEY_TAKEAWAYS_SHORTCODE);

    await expect(page.getByRole("heading", { name: "Key Takeaways", exact: true })).toBeVisible();
    await expect(page.getByText("User-friendly interfaces designed for both beginners and experienced traders")).toBeVisible();
    await expect(page.getByText("Wide range of cryptocurrencies available for trading")).toBeVisible();
  });

  test("Multiple shortcodes combined in one post", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPostWithShortcode("Combined Shortcodes Test " + crypto.randomUUID(), COMBINED_SHORTCODES_CONTENT);

    await expect(page.getByText("Important Overview")).toBeVisible();
    await expect(page.getByText("Benefit 1")).toBeVisible();
    await expect(page.getByText("Overall")).toBeVisible();
    await expect(page.getByText("Final Verdict")).toBeVisible();
  });
});
