import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { WP_USERNAME, WP_PASSWORD } from "../utils/login";

type AuthFixtures = {
  loginPage: LoginPage;
  authenticatedPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
