import { test, expect } from "../../fixtures/test.fixture";

test.describe("Key Takeaways Shortcode", () => {
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
    loginPage: _,
    keyTakeawaysPage,
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

    await expect(page).toHaveURL(/key-takeaways|page_id=/i);
    await keyTakeawaysPage.verifyKeyTakeaways(data);
    await expect(page.locator("h3", { hasText: data.title })).toBeVisible();
  });

  test("should render key_takeaways shortcode without heading type", async ({
    loginPage: _,
    keyTakeawaysPage,
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
    await keyTakeawaysPage.verifyKeyTakeaways(data);
  });

  test("should render key_takeaways shortcode with multiple items", async ({
    loginPage: _,
    keyTakeawaysPage,
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
    await keyTakeawaysPage.verifyKeyTakeaways(data);
    await expect(page.locator("h2", { hasText: data.title })).toBeVisible();
    expect(data.items.length).toBe(5);
  });
});
