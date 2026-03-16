# QA Automation Project

You are a Senior QA Automation Engineer working with Playwright.
This repository contains E2E tests for the 99Bitcoins WordPress site written in TypeScript.

# Tech Stack

- Playwright — E2E test runner
- TypeScript — Component Object Pattern
- Page Object Model — Fixtures
- Test Data Factories — Separation of test data from logic

# Project Structure

```
tests/specs/       → test specs (organized by feature)
pages/             → page objects
pages/components/  → reusable UI components
pages/regression/  → page objects for regression tests
fixtures/          → shared test setup (auth fixtures)
data/              → static test data (credentials, URLs)
utils/             → helpers (SessionManager, cleanup, shortcode utilities)
```

# Testing Principles — Follow AAA pattern

Arrange → Act → Assert

```ts
test("user can create a page with shortcode", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);

  const editor = new WordPressPageEditor(page);
  await editor.gotoNewPage();
  await editor.fillPageDetails("Test Page", "[shortcode]content[/shortcode]");
  await editor.publishPage();

  await expect(page).toHaveURL(/post-new\.php/);
});
```

# Page Object Rules

- Page objects must contain selectors and UI logic
- Tests must NOT contain raw CSS/XPath selectors
- Tests must only call page object methods
- All page objects extend `BasePage` from `pages/BasePage.ts`

# Locator Strategy (priority order)

1. `getByTestId()` — preferred for stable selectors
2. `getByRole()` — semantic and accessible
3. `getByLabel()` — for form inputs
4. `page.locator('#id')` — for WordPress-specific IDs (acceptable)

Avoid: XPath, nth-child, deeply nested CSS chains

# Test Data

- Static credentials/URLs → `data/users.ts`
- Static shortcode helpers → `utils/shortcode.ts`
- Dynamic test data → generate inline in tests using `Date.now()` for uniqueness
- Never hardcode credentials directly in tests

# Authentication

- Use `LoginPage.loginWithSession()` for session-based auth (reuses saved sessions)
- Sessions are stored in `.auth/` directory
- Session expiry: 24 hours

# Forbidden Practices

- No `page.waitForTimeout()` — use proper wait conditions
- No hardcoded selectors in test files
- No duplicate selectors across page objects
- No credentials hardcoded in test specs

# Base URL

- Local: `https://99bitcoins.local`
- Staging: `https://staging.99bitcoins.com`

# WordPress-specific Notes

- Dashboard widget IDs: `#dashboard_right_now`, `#dashboard_activity`, `#dashboard_quick_press`, `#dashboard_primary`, `#quiz-maker`, `#dashboard_site_health`
- Quick Draft save button: `#save-post` (not `#publish`)
- Comments sidebar link includes a badge count — use partial `hasText` matching
