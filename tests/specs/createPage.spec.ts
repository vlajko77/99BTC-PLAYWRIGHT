import { test, expect } from "../../fixtures/test.fixture";

test.describe("WordPress page creation", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Add a new page and verify it is visible", async ({
    loginPage: _,
    pageEditor,
    page,
  }) => {
    await pageEditor.gotoNewPage();

    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const randomTitle = "Test Page " + Math.floor(Math.random() * 100000);
    const randomContent = "Playwright page content. Random: " + Math.random();

    await pageEditor.fillTitleAndContent(randomTitle, randomContent);
    await pageEditor.publish();

    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();

    await pageEditor.openPermalink(permalink!);

    await expect(page).toHaveURL(/test-page|page_id=/i);
    await pageEditor.expectContentVisible(randomTitle);
    await pageEditor.expectContentVisible(randomContent);
  });
});
