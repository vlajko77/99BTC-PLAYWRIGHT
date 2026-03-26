import { test, expect } from "../../fixtures/test.fixture";
import { LoginPage } from "../../pages/admin/LoginPage";

test.describe("WordPress Authentication & Authorization", { tag: "@admin" }, () => {
  test.describe("Unauthorized access", () => {
    test("accessing wp-admin without session redirects to login page", async ({ page }) => {
      // Clear cookies to simulate logged-out state
      await page.context().clearCookies();

      await page.goto("/wp-admin/");
      await page.waitForLoadState("domcontentloaded");

      await expect(page).toHaveURL(/wp-login\.php/);
      await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
    });

    test("accessing wp-admin posts without session redirects to login", async ({ page }) => {
      await page.context().clearCookies();

      await page.goto("/wp-admin/edit.php");
      await page.waitForLoadState("domcontentloaded");

      await expect(page).toHaveURL(/wp-login\.php/);
    });

    test("wp-login page shows username and password fields", async ({ page }) => {
      await page.goto("/wp-login.php");

      await expect(page.getByRole("textbox", { name: /username or email/i })).toBeVisible();
      await expect(page.getByRole("textbox", { name: /password/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
    });

    test("invalid credentials show an error message", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await page.goto("/wp-login.php");
      await page.getByRole("textbox", { name: /username or email/i }).fill("invalid_user");
      await page.getByRole("textbox", { name: /password/i }).fill("wrong_password");
      await page.getByRole("button", { name: /log in/i }).click();
      await page.waitForLoadState("domcontentloaded");

      await loginPage.verifyLoginFailure();
    });
  });

  test.describe("Authenticated access", () => {
    test("authenticated user can access wp-admin", async ({ loginPage: _, dashboardPage, page }) => {
      await page.goto("/wp-admin/");
      await expect(page).toHaveURL(/wp-admin\/?$/);
      await expect(dashboardPage.adminBar).toBeVisible();
    });

    test("authenticated user sees their name in admin bar", async ({ loginPage: _, dashboardPage, page }) => {
      await page.goto("/wp-admin/");
      await expect(dashboardPage.userGreeting).toBeVisible();
    });
  });
});
