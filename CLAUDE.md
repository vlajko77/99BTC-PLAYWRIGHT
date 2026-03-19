# QA Automation Project

This repository contains E2E tests for the 99Bitcoins WordPress site written in TypeScript.

# Tech Stack

- Playwright — E2E test runner
- TypeScript — strict mode
- Page Object Model — all UI logic lives in page objects
- Test Data Factories — separation of test data from logic

# Project Structure

```
tests/specs/           → test specs (organized by feature)
tests/specs/regression/→ regression test specs
pages/                 → page objects
pages/components/      → reusable UI components
pages/regression/      → page objects for regression tests
fixtures/              → shared test setup (test.fixture.ts)
data/                  → static test data
  data/shortcodes.ts   → all shortcode strings, test cases, and Key Takeaways data
  data/plugins.ts      → plugin configs (slug + name)
  data/languages.ts    → language configs for header regression tests
utils/                 → helpers (login, shortcode rendering, session management)
docs/                  → manual test plans and documentation
```

# Key Files

- `fixtures/test.fixture.ts` — all fixtures, including `screenshotOnFailure` (auto), `loginPage`, `shortcodePage`, `pluginPage`, `header`, `homePage`
- `pages/ShortcodePage.ts` — unified POM for shortcode tests (posts + pages + Key Takeaways)
- `data/shortcodes.ts` — single source of truth for all shortcode test data
- `utils/shortcode.ts` — `renderKeyTakeaways()` helper and `KeyTakeaways` type
- `utils/login.ts` — `WP_USERNAME`, `WP_PASSWORD` from env vars

# Testing Principles — Follow AAA pattern

Arrange → Act → Assert

```ts
test("user can create a page with shortcode", async ({ loginPage: _, shortcodePage, page }) => {
  await shortcodePage.createPageWithShortcode("Test Page", "[key_takeaways]...[/key_takeaways]");

  await expect(page).toHaveURL(/page_id=\d+/i);
  await shortcodePage.expectContentVisible("Key Takeaways");
});
```

# Fixtures

- `loginPage` — auto-authenticates via session before each test (assign to `_` when unused)
- `screenshotOnFailure` — auto fixture; attaches full-page screenshot on any test failure
- All fixtures registered in `fixtures/test.fixture.ts` using `base.extend<Fixtures>()`

# Page Object Rules

- Page objects must contain selectors and UI logic
- Tests must NOT contain raw CSS/XPath selectors
- Tests must only call page object methods
- All page objects extend `BasePage` from `pages/BasePage.ts`
- `ShortcodePage` extends `WordPressPostEditor` and adds page-specific navigation

# Locator Strategy (priority order)

1. `getByTestId()` — preferred for stable selectors
2. `getByRole()` — semantic and accessible
3. `getByLabel()` — for form inputs
4. `page.locator('#id')` — for WordPress-specific IDs (acceptable)

Avoid: XPath, nth-child, deeply nested CSS chains

# Test Data

- Shortcode strings and test cases → `data/shortcodes.ts`
- Plugin configs → `data/plugins.ts`
- Language configs → `data/languages.ts`
- Shortcode rendering helpers → `utils/shortcode.ts`
- Dynamic test data → generate inline using `Date.now()` or `crypto.randomUUID()`
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
- Posts URL pattern: `/?p=\d+`, Pages URL pattern: `/page_id=\d+`
