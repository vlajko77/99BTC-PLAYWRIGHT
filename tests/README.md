# Tests directory

This folder contains Playwright specs, page objects (POMs), and small helpers used to drive UI tests for 99Bitcoins.

Structure
- `specs/` — Playwright test files (grouped by purpose: regression, general smoke)
- `pages/` — Page Object Models used by tests
- `helpers/` — small helpers and default credential constants

Specs overview
- `specs/login.spec.ts` — WP admin login smoke test (uses `tests/pages/loginPage.ts`).
- `specs/createPage.spec.ts` — Create a WP Page and verify published content on the public permalink.
- `specs/createPost.spec.ts` — Create a WP Post, assign category, publish, and verify the post content.
- `specs/createShortcode.spec.ts` — Create a Page containing the `key_takeaways` shortcode and verify its output. Runs under iPhone 12 emulation.
- `specs/regression/headerSection.spec.ts` — Header/Navigation regression (menu open, link navigation, header search).
- `specs/regression/headerSection.spec.ts` — Header/Navigation regression (menu open, link navigation, header search).
- `specs/regression/headerLogo.spec.ts` — Sanity test: clicking the site logo navigates to the homepage and shows the site heading.
- `specs/regression/headerSearchResults.spec.ts` — Verifies header search returns results for common queries (example: 'bitcoin').
- `specs/regression/bitcoinMenuNavigation.spec.ts` — Verifies the Bitcoin menu opens and the Historical Price page is reachable.

Page objects
- `tests/pages/loginPage.ts` — encapsulates WordPress admin login.
- `tests/pages/CreatePage.ts`, `CreatePost.ts`, `CreateShortcodePage.ts` — helpers for creating content via WP admin.
- `tests/pages/regression/HeaderSectionPage.ts` — header interactions (menu, search).

Running tests
- Full suite:

```
npx playwright test
```

- Single spec:

```
npx playwright test tests/specs/regression/headerSection.spec.ts
```

- Headed debugging:

```
npx playwright test --headed --project=chromium
```

Staging and Cloudflare notes
Some staging environments are protected by Cloudflare's JS challenge which blocks automated runs. To reliably run tests against staging:

1. Run the helper to open a headed browser and manually solve the Cloudflare challenge + login:

```
node scripts/saveStorageState.mjs
```

2. The script will save `auth/storageState.json`. Playwright is configured to auto-use this file when present. You can also set `PLAYWRIGHT_STORAGE_STATE=auth/storageState.json` to explicitly define it.

Environment variables
- `STAGING_HTTP_USER` / `STAGING_HTTP_PASS` — HTTP Basic Auth credentials (if required)
- `WP_USERNAME` / `WP_PASSWORD` — WordPress admin credentials
- `STAGING_WP_LOGIN_URL` — Override the URL used by the save-storage script
- `PLAYWRIGHT_STORAGE_STATE` — Explicit storage state file

Security
- `auth/storageState.json` contains cookies and local/session storage and should not be committed. `auth/` is ignored in `.gitignore`.

- Add unit tests or additional regression specs.
