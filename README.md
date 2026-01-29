# 99BTC Playwright Tests

This repository contains Playwright end-to-end tests for the 99Bitcoins project.

Overview
- `playwright.config.ts` — Playwright configuration used by the tests.
- `tests/` — test source tree (specs, page objects, helpers). See `tests/README.md` for test-specific instructions.
- `scripts/saveStorageState.mjs` — helper to capture an authenticated browser storage state for staging.

Quick start

1. Install dependencies:

```bash
npm install
npx playwright install
```

2. Run the test suite:

```bash
npx playwright test
```

3. Run a single spec:

```bash
npx playwright test tests/specs/regression/headerSection.spec.ts
```

Headed debugging

Open a browser window while running tests:

```bash
npx playwright test --headed --project=chromium
```

Storage state (staging + Cloudflare)

Staging is sometimes protected by Cloudflare's JS challenge. To run tests reliably against staging you can capture a logged-in browser state and reuse it:

1. Run the provided helper and complete manual login (solve Cloudflare challenge and sign in):

```bash
node scripts/saveStorageState.mjs
```

2. The script saves `auth/storageState.json`. Playwright is configured to automatically use `auth/storageState.json` when present. You can also override it with:

```bash
PLAYWRIGHT_STORAGE_STATE=auth/storageState.json npx playwright test
```

Security

- `auth/storageState.json` may contain authentication cookies. Do NOT commit it to source control. Add `auth/` to `.gitignore` if you haven't already.
- Use CI secret storage for credentials and do not hardcode sensitive values.

Environment variables

- `STAGING_HTTP_USER` / `STAGING_HTTP_PASS` — HTTP Basic Auth credentials (if used)
- `WP_USERNAME` / `WP_PASSWORD` — WordPress admin credentials used by some tests
- `STAGING_WP_LOGIN_URL` — Override default staging login url used by the save-storage script
- `PLAYWRIGHT_STORAGE_STATE` — Explicit storage state file path to use (overrides automatic detection)

## Tests explained

This repository contains a set of Playwright specs under `tests/specs/`. Below is a short description of each spec and what it verifies.

- `tests/specs/login.spec.ts`
	- Purpose: Verifies WordPress admin login works using the `LoginPage` page object.

- `tests/specs/createPage.spec.ts`
	- Purpose: Creates a new WordPress Page via the admin UI and verifies the published content is visible on the public permalink.

- `tests/specs/createPost.spec.ts`
	- Purpose: Creates a new WordPress Post, assigns it to a category (example uses `News`), publishes it, and verifies the published content on the public permalink.

- `tests/specs/createShortcode.spec.ts`
	- Purpose: Creates a page containing the `key_takeaways` shortcode and verifies the rendered output on the public page. This spec demonstrates device emulation (iPhone 12).

- `tests/specs/regression/headerSection.spec.ts`
	- Purpose: Verifies header elements (logo, primary nav) are present, that the Bitcoin menu opens correctly, navigation to the "Bitcoin Historical Price" page works, and the header search returns expected results.

Page objects (POMs)
- `tests/pages/` contains the POMs used by the specs (LoginPage, CreatePage, CreatePost, CreateShortcodePage, etc.).

Helpers
- `tests/helpers/` contains credential defaults and small helper utilities used by the specs.

Running specific tests
- Run a single spec:

```bash
npx playwright test tests/specs/regression/headerSection.spec.ts
```

- Run tests headed (visible browser):

```bash
npx playwright test --headed --project=chromium
```

Environment variables referenced by tests:
- `STAGING_HTTP_USER` / `STAGING_HTTP_PASS` — HTTP Basic Auth credentials (if used)
- `WP_USERNAME` / `WP_PASSWORD` — WordPress admin credentials used by some tests
- `STAGING_WP_LOGIN_URL` — Override URL used by the save-storage script
- `PLAYWRIGHT_STORAGE_STATE` — Explicit storage state file path to use (overrides automatic detection)


