import { test, expect } from "../../fixtures/test.fixture";
import { renderKeyTakeaways } from "../../utils/shortcode";
import { devices } from "@playwright/test";
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
  MALFORMED_SHORTCODE_CONTENT,
  MISSING_PARAMS_CONTENT,
  multipleShortcodeBlocks,
  keyTakeawaysH3,
  keyTakeawaysDefault,
  keyTakeawaysH2,
  keyTakeawaysBasic,
} from "../../data/shortcodes";

// ─── Shortcode rendering in pages ─────────────────────────────────────────────

test.describe("Shortcode rendering in WordPress pages", { tag: "@frontend" }, () => {
  for (const testCase of SHORTCODE_TEST_CASES) {
    test(`renders ${testCase.name} shortcode correctly`, async ({
      loginPage: _,
      shortcodePage,
      page,
    }) => {
      const title = `${testCase.name} ${Date.now()}`;

      await shortcodePage.createPageWithShortcode(title, testCase.shortcode);

      const urlRegex = testCase.urlRegex ?? /page_id=\d+/i;
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

// ─── Aesthetic shortcodes in pages ────────────────────────────────────────────

test.describe("Aesthetic Shortcodes in pages", { tag: "@frontend" }, () => {
  test("CTA Button shortcode renders correctly", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("CTA Button Test " + crypto.randomUUID(), CTA_BUTTON_SHORTCODE);

    await expect(page.getByRole("link", { name: "Visit Margex" })).toBeVisible();
  });

  test("Step by step guide shortcode renders with multiple items", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    await shortcodePage.createPageWithShortcode("Step by Step Guide Test " + crypto.randomUUID(), STEP_BY_STEP_GUIDE_SHORTCODE);

    await expect(page.getByText("Visit the Website")).toBeVisible();
    await expect(page.getByText("Register Your Account")).toBeVisible();
    await expect(page.getByText("Verify Your Email")).toBeVisible();
  });

  test("Countdown shortcode renders expired message when date has passed", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    await shortcodePage.createPageWithShortcode("Countdown Test " + crypto.randomUUID(), COUNTDOWN_SHORTCODE);

    await expect(page.getByText("The offer is expired.")).toBeVisible();
  });

  test("Checklist with green checkmarks shortcode", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("Checklist Test " + crypto.randomUUID(), GREEN_CHECKMARKS_SHORTCODE);

    await expect(page.getByText("User-Friendly Interface")).toBeVisible();
    await expect(page.getByText("Trading Fees")).toBeVisible();
    await expect(page.getByText("Customer Support")).toBeVisible();
  });

  test("Pros and Cons shortcode renders sections", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("Pros & Cons Test " + crypto.randomUUID(), PROS_AND_CONS_SHORTCODE);

    await expect(page.getByText("Innovative social trading features")).toBeVisible();
    await expect(page.getByText("Limited payment options")).toBeVisible();
  });

  test("Verdict shortcode with rating and items", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("Verdict Test " + crypto.randomUUID(), VERDICT_SHORTCODE);

    await expect(page.getByText("Our Verdict")).toBeVisible();
    await expect(page.getByText("Visit CoinCasino")).toBeVisible();
    await expect(page.getByText("Accepted Cryptocurrencies")).toBeVisible();
  });

  test("Star rating shortcode renders with label", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("Star Rating Test " + crypto.randomUUID(), STAR_RATING_SHORTCODE);

    await expect(page.getByText("Review", { exact: true }).first()).toBeVisible();
  });

  test("Highlighted paragraph shortcode renders", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("Highlighted Section Test " + crypto.randomUUID(), HIGHLIGHTED_PARAGRAPH_SHORTCODE);

    await expect(page.getByText("Key Point")).toBeVisible();
    await expect(page.getByText("This is important information that should stand out to readers.")).toBeVisible();
  });

  test("Key Takeaways shortcode with multiple items", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("Key Takeaways Test " + crypto.randomUUID(), KEY_TAKEAWAYS_SHORTCODE);

    await expect(page.getByRole("heading", { name: "Key Takeaways", exact: true })).toBeVisible();
    await expect(page.getByText("User-friendly interfaces designed for both beginners and experienced traders")).toBeVisible();
    await expect(page.getByText("Wide range of cryptocurrencies available for trading")).toBeVisible();
  });

  test("Multiple shortcodes combined in one page", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithShortcode("Combined Shortcodes Test " + crypto.randomUUID(), COMBINED_SHORTCODES_CONTENT);

    await expect(page.getByText("Important Overview")).toBeVisible();
    await expect(page.getByText("Benefit 1")).toBeVisible();
    await expect(page.getByText("Overall")).toBeVisible();
    await expect(page.getByText("Final Verdict")).toBeVisible();
  });
});

// ─── Key Takeaways shortcode ──────────────────────────────────────────────────

test.describe("Key Takeaways Shortcode", { tag: "@frontend" }, () => {
  test("renders with h3 heading type", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithKeyTakeaways("Key Takeaways Test " + Date.now(), keyTakeawaysH3);
    await shortcodePage.navigateToPublishedPage();

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);
    await shortcodePage.verifyKeyTakeaways(keyTakeawaysH3);
    await expect(page.locator("h3", { hasText: keyTakeawaysH3.title })).toBeVisible();
  });

  test("renders without heading type", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithKeyTakeaways("Key Takeaways Default " + Date.now(), keyTakeawaysDefault);
    await shortcodePage.navigateToPublishedPage();

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);
    await shortcodePage.verifyKeyTakeaways(keyTakeawaysDefault);
  });

  test("renders with multiple items and h2 heading", async ({ loginPage: _, shortcodePage, page }) => {
    await shortcodePage.createPageWithKeyTakeaways("Key Takeaways Multi " + Date.now(), keyTakeawaysH2);
    await shortcodePage.navigateToPublishedPage();

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);
    await shortcodePage.verifyKeyTakeaways(keyTakeawaysH2);
    await expect(page.locator("h2", { hasText: keyTakeawaysH2.title })).toBeVisible();
    expect(keyTakeawaysH2.items.length).toBe(5);
  });
});

// ─── Multiple shortcodes on one page ─────────────────────────────────────────

test.describe("Multiple shortcodes in WordPress pages", { tag: "@frontend" }, () => {
  test("Multiple shortcodes render correctly in a single page", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    const [firstBlock, secondBlock, thirdBlock] = multipleShortcodeBlocks;

    const content = `
${renderKeyTakeaways(firstBlock)}

<p>Some regular content between shortcodes to test proper spacing and rendering.</p>

${renderKeyTakeaways(secondBlock)}

<p>Another paragraph of regular text content.</p>

${renderKeyTakeaways(thirdBlock)}
    `.trim();

    await shortcodePage.createPageWithShortcode("Multiple Shortcodes Page " + Date.now(), content);

    await expect(page).toHaveURL(/multiple-shortcodes|page_id=/i);

    for (const block of multipleShortcodeBlocks) {
      await shortcodePage.expectContentVisible(block.title);
      for (const item of block.items) {
        await shortcodePage.expectContentVisible(item);
      }
    }

    await shortcodePage.expectContentVisible("Some regular content between shortcodes");
    await shortcodePage.expectContentVisible("Another paragraph of regular text content");

    await expect(page.locator("text=[key_takeaways")).not.toBeVisible();

    const sectionCount = await page.locator('.key-takeaways, [class*="key-takeaway"]').count();
    expect(sectionCount).toBeGreaterThanOrEqual(3);
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────

test.describe("Shortcode error handling in WordPress pages", { tag: "@frontend" }, () => {
  test("Page with malformed shortcode handles errors gracefully", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    const randomTitle = "Malformed Shortcode Page " + Date.now();

    await shortcodePage.createPageWithShortcode(randomTitle, MALFORMED_SHORTCODE_CONTENT);
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    expect(title).not.toMatch(/500|503|502|Internal Server Error/i);

    await shortcodePage.expectContentVisible(randomTitle);
    await shortcodePage.expectContentVisible("Valid content at the start");
    await shortcodePage.expectContentVisible("Valid content at the end");

    const bodyText = (await page.locator("body").textContent()) || "";
    expect(bodyText).not.toMatch(/Fatal error:/i);
    expect(bodyText).not.toMatch(/Parse error:/i);
  });

  test("Page with missing shortcode parameters degrades gracefully", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    await shortcodePage.createPageWithShortcode("Missing Params Page " + Date.now(), MISSING_PARAMS_CONTENT);

    await expect(page).not.toHaveURL(/error|500/i);

    await shortcodePage.expectContentVisible("Introduction paragraph with valid content");
    await shortcodePage.expectContentVisible("Conclusion paragraph with valid content");

    const errorIndicators = page.locator("text=/error|exception|warning/i").first();
    const hasVisibleError = await errorIndicators.isVisible().catch(() => false);

    if (hasVisibleError) {
      const errorText = await errorIndicators.textContent();
      expect(errorText?.toLowerCase()).not.toContain("php");
      expect(errorText?.toLowerCase()).not.toContain("fatal");
      expect(errorText?.toLowerCase()).not.toContain("parse");
    }
  });
});

// ─── Mobile ───────────────────────────────────────────────────────────────────

test.describe("Shortcode creation on mobile", { tag: ["@frontend", "@mobile"] }, () => {
  const { defaultBrowserType: _, ...iphone12 } = devices["iPhone 12"];
  test.use(iphone12);

  test("Key Takeaways shortcode renders correctly on mobile", async ({
    loginPage: _,
    shortcodePage,
    page,
  }) => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(500);

    await shortcodePage.createPageWithShortcode(
      "Shortcode Page " + Date.now(),
      renderKeyTakeaways(keyTakeawaysBasic),
    );

    await expect(page).toHaveURL(/shortcode-page|page_id=/i);

    await shortcodePage.expectContentVisible(keyTakeawaysBasic.title);
    for (const item of keyTakeawaysBasic.items) {
      await shortcodePage.expectContentVisible(item);
    }
  });
});
