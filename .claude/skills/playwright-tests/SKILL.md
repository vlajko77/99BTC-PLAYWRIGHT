---
name: playwright-tests
description: Generate Playwright E2E tests using TypeScript for the 99Bitcoins WordPress project
---

# Playwright Test Generation

When creating tests:

1. Use Playwright Test Runner (`@playwright/test`)
2. Follow AAA pattern (Arrange, Act, Assert)
3. Use Page Object Model — import page classes from `pages/`
4. Avoid inline selectors in test files
5. Use `loginWithSession()` for authenticated tests
6. Always add `afterEach` screenshot capture for failed tests

## File location

Tests go in `tests/specs/` (or `tests/specs/regression/` for regression tests).

## Example

```ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { WP_USERNAME, WP_PASSWORD } from "../../utils/login";

test.describe("Dashboard", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
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

  test("dashboard loads and displays heading", async () => {
    await dashboardPage.navigateToDashboard();
    await dashboardPage.verifyDashboardLoaded();
  });
});
```
