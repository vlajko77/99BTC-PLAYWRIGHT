import { test, expect } from "../../fixtures/test.fixture";

test.describe("WordPress login", { tag: ["@admin", "@smoke"] }, () => {
  test("Login to 99Bitcoins", async ({ loginPage: _, page, dashboardPage }) => {
    await page.goto("/wp-admin/");
    await expect(page).toHaveURL(/wp-admin\/?$/);
    await expect(dashboardPage.userGreeting).toBeVisible();
  });
});
