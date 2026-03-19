import { test, expect } from "../../fixtures/test.fixture";
import {
  keyTakeawaysH3,
  keyTakeawaysDefault,
  keyTakeawaysH2,
} from "../../data/keyTakeaways";

test.describe("Key Takeaways Shortcode", () => {
  test("should render key_takeaways shortcode with h3 heading type", async ({
    loginPage: _,
    keyTakeawaysPage,
    page,
  }) => {
    await keyTakeawaysPage.createPageWithKeyTakeaways(
      "Key Takeaways Test " + Date.now(),
      keyTakeawaysH3,
    );
    await keyTakeawaysPage.navigateToPublishedPage();

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);
    await keyTakeawaysPage.verifyKeyTakeaways(keyTakeawaysH3);
    await expect(page.locator("h3", { hasText: keyTakeawaysH3.title })).toBeVisible();
  });

  test("should render key_takeaways shortcode without heading type", async ({
    loginPage: _,
    keyTakeawaysPage,
    page,
  }) => {
    await keyTakeawaysPage.createPageWithKeyTakeaways(
      "Key Takeaways Default " + Date.now(),
      keyTakeawaysDefault,
    );
    await keyTakeawaysPage.navigateToPublishedPage();

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);
    await keyTakeawaysPage.verifyKeyTakeaways(keyTakeawaysDefault);
  });

  test("should render key_takeaways shortcode with multiple items", async ({
    loginPage: _,
    keyTakeawaysPage,
    page,
  }) => {
    await keyTakeawaysPage.createPageWithKeyTakeaways(
      "Key Takeaways Multi " + Date.now(),
      keyTakeawaysH2,
    );
    await keyTakeawaysPage.navigateToPublishedPage();

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);
    await keyTakeawaysPage.verifyKeyTakeaways(keyTakeawaysH2);
    await expect(page.locator("h2", { hasText: keyTakeawaysH2.title })).toBeVisible();
    expect(keyTakeawaysH2.items.length).toBe(5);
  });
});
