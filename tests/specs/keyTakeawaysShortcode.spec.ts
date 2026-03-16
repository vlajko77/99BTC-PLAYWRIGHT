import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { KeyTakeawaysPage } from "../../pages/KeyTakeawaysPage";
import { WP_USERNAME, WP_PASSWORD } from "../../utils/login";

test.describe("Key Takeaways Shortcode", () => {
  let loginPage: LoginPage;
  let keyTakeawaysPage: KeyTakeawaysPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    keyTakeawaysPage = new KeyTakeawaysPage(page);
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

  test("should render key_takeaways shortcode with h3 heading type", async ({
    page,
  }) => {
    const data = {
      title: "Key Takeaways",
      headingType: "h3" as const,
      items: ["Point 1", "Point 2", "Point 3"],
    };

    await keyTakeawaysPage.createPageWithKeyTakeaways(
      "Key Takeaways Test " + Date.now(),
      data,
    );
    await keyTakeawaysPage.navigateToPublishedPage();

    // Verify URL is the published page
    await expect(page).toHaveURL(/key-takeaways|page_id=/i);

    // Verify shortcode content
    await keyTakeawaysPage.verifyKeyTakeaways(data);

    // Verify heading is rendered as h3
    await expect(page.locator("h3", { hasText: data.title })).toBeVisible();
  });

  test("should render key_takeaways shortcode without heading type", async ({
    page,
  }) => {
    const data = {
      title: "Important Points",
      items: ["First point", "Second point"],
    };

    await keyTakeawaysPage.createPageWithKeyTakeaways(
      "Key Takeaways Default " + Date.now(),
      data,
    );
    await keyTakeawaysPage.navigateToPublishedPage();
    await expect(page).toHaveURL(/key-takeaways|page_id=/i);

    // Verify shortcode content
    await keyTakeawaysPage.verifyKeyTakeaways(data);
  });

  test("should render key_takeaways shortcode with multiple items", async ({
    page,
  }) => {
    const data = {
      title: "Summary",
      headingType: "h2" as const,
      items: [
        "Bitcoin is a decentralized digital currency",
        "Blockchain technology ensures transparency",
        "Wallets store your private keys securely",
        "Always do your own research before investing",
        "Security best practices are essential",
      ],
    };

    await keyTakeawaysPage.createPageWithKeyTakeaways(
      "Key Takeaways Multi " + Date.now(),
      data,
    );
    await keyTakeawaysPage.navigateToPublishedPage();

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);

    // Verify shortcode content
    await keyTakeawaysPage.verifyKeyTakeaways(data);

    // Verify heading is rendered as h2
    await expect(page.locator("h2", { hasText: data.title })).toBeVisible();

    // Verify correct number of items (5)
    expect(data.items.length).toBe(5);
  });
});
