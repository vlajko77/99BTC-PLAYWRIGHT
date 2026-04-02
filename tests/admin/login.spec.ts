import { test, expect } from "../../fixtures/test.fixture";

test.describe("WordPress login", { tag: ["@admin", "@smoke"] }, () => {
  test("Login to 99Bitcoins", async ({ loginPage, page }) => {
    await expect(page).toHaveURL(/wp-admin\/?$/);
    await loginPage.verifyLoginSuccess();
  });
});
