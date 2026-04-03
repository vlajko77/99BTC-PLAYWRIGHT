import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/admin/LoginPage";
import { WP_USERNAME, WP_PASSWORD } from "../utils/login";

type AuthFixtures = {
  screenshotOnFailure: void;
  loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  screenshotOnFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach("screenshot", {
          body: screenshot,
          contentType: "image/png",
        });
      }
    },
    { auto: true },
  ],
  // Destructure as `loginPage: _` in tests that only need the side-effect (session auth) but not the page object itself.
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
    await use(loginPage);
  },
});

export { expect };
