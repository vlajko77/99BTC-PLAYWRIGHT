# Tests Directory

This folder contains Playwright specs, page objects (POMs), and helpers used to drive UI tests for 99Bitcoins.

## Structure

```
tests/
├── specs/                  # Playwright test files
│   ├── regression/         # Regression tests (header, navigation, search)
│   └── *.spec.ts           # Smoke tests (login, create content)
├── pages/                  # Page Object Models
│   ├── regression/         # Regression page objects
│   └── *.ts                # Core page objects
└── helpers/                # Utilities and constants
    ├── login.ts            # Credentials and URLs
    ├── SessionManager.ts   # Session storage management
    └── shortcode.ts        # Shortcode rendering helpers
```

## Specs Overview

### Smoke Tests

| Spec                            | Description                                                        |
| ------------------------------- | ------------------------------------------------------------------ |
| `login.spec.ts`                 | WP admin login smoke test                                          |
| `createPage.spec.ts`            | Create a WP Page and verify published content                      |
| `createPost.spec.ts`            | Create a WP Post, assign category, publish, and verify             |
| `createShortcode.spec.ts`       | Create a Page with `key_takeaways` shortcode (iPhone 12 emulation) |
| `keyTakeawaysShortcode.spec.ts` | Tests for key_takeaways shortcode with various configurations      |

### Regression Tests

| Spec                               | Description                                    |
| ---------------------------------- | ---------------------------------------------- |
| `regression/headerSection.spec.ts` | All header tests: logo, search, and navigation |

## Page Objects

| Page Object                       | Description                                                               |
| --------------------------------- | ------------------------------------------------------------------------- |
| `BasePage.ts`                     | Base class with shared functionality (publish, permalink, waitForElement) |
| `loginPage.ts`                    | WordPress admin login with session caching                                |
| `CreatePage.ts`                   | WordPressPageEditor for creating pages                                    |
| `CreatePost.ts`                   | WordPressPostEditor for creating posts with categories                    |
| `CreateShortcodePage.ts`          | ShortcodePage for shortcode content                                       |
| `KeyTakeawaysPage.ts`             | Key takeaways shortcode testing                                           |
| `regression/HeaderSectionPage.ts` | Header interactions (menu, search, navigation)                            |

## Helpers

| Helper              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `login.ts`          | WP credentials and staging URL constants       |
| `SessionManager.ts` | Manages session storage for login caching      |
| `shortcode.ts`      | Renders shortcode content (renderKeyTakeaways) |

## Running Tests

Full suite:

```bash
npx playwright test
```

Single spec:

```bash
npx playwright test tests/specs/login.spec.ts
```

Headed debugging:

```bash
npx playwright test --headed --project=chromium
```

Run with HTML report:

```bash
npx playwright test --reporter=html
npx playwright show-report
```

## Session Management

Tests use `SessionManager` for login session caching:

- Sessions are stored in `.auth/` directory
- Sessions expire after 24 hours
- `loginPage.loginWithSession()` handles login with automatic caching

## Environment Variables

| Variable      | Description              |
| ------------- | ------------------------ |
| `WP_USERNAME` | WordPress admin username |
| `WP_PASSWORD` | WordPress admin password |
| `STAGING_URL` | Staging environment URL  |

## Security

- `.auth/` directory contains session cookies and is ignored in `.gitignore`
- Never commit credentials or session files
