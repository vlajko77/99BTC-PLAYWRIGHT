import { test } from "../../fixtures/test.fixture";

test.describe("WordPress login", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Login to 99Bitcoins", async ({ loginPage: _ }) => {});
});
