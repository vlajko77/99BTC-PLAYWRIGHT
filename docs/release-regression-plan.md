# Release Regression Test Plan — 99Bitcoins WordPress

## 1. Overview

**Purpose:** Execute the full automated + manual regression suite against the 99Bitcoins WordPress site before deploying a new release. This plan validates that core site functionality has not regressed across authentication, content creation, shortcode rendering, plugin management, media upload, presales toplists, multi-language header behavior, and visual appearance.

**Scope:** All test suites covered by the Playwright E2E automation project plus any manual-only scenarios identified in `docs/manual-test-plan.md`. Minor cosmetic UI changes with no functional impact may be excluded based on risk assessment.

**Automation coverage:** `npx playwright test` executes 34 spec files across 16 feature areas on Chromium, Firefox, and WebKit. Mobile emulation (375×812) is included for navigation and visual regression tests.

---

## 2. Release Details

| Field              | Value                        |
|--------------------|------------------------------|
| Release Version    | [X.Y.Z]                      |
| Release Date       | [DD-MM-YYYY]                 |
| Deploy Environment | [ ] Development  [ ] Staging  [ ] Production |
| Tester             | Vladimir Simsic               |
| Automation Branch  | [branch name]                |
| Base URL (staging) | https://staging.99bitcoins.com |
| Base URL (local)   | https://99bitcoins.local     |

---

## 3. Feature Summary & Changes

### New Features

- Feature A – [description]
- Feature B – [description]

### Bug Fixes / Enhancements

- Issue #[ID] – [description]
- Issue #[ID] – [description]

### Shortcodes Affected

List any shortcodes added, modified, or removed in this release:

| Shortcode         | Change Type | Notes |
|-------------------|-------------|-------|
| `[key_takeaways]` | [Added/Modified/Removed] | |
| `[cta_button]`    | [Added/Modified/Removed] | |

---

## 4. Regression Test Cases

### 4.1 Authentication

**Spec:** `tests/admin/auth.spec.ts`, `tests/admin/login.spec.ts`

| # | Test Case                          | Type       | Priority |
|---|------------------------------------|------------|----------|
| 1 | Login with valid credentials       | Automated  | Critical |
| 2 | Login with invalid credentials     | Automated  | High     |
| 3 | Session persistence across reloads | Automated  | High     |
| 4 | Unauthorized access redirects to login | Automated | High  |

---

### 4.2 Admin Dashboard

**Spec:** `tests/admin/dashboard.spec.ts`

| # | Test Case                                    | Type      | Priority |
|---|----------------------------------------------|-----------|----------|
| 1 | Dashboard loads and heading visible           | Automated | High     |
| 2 | Admin bar elements present                   | Automated | Medium   |
| 3 | All sidebar menu items visible               | Automated | Medium   |
| 4 | At a Glance widget (`#dashboard_right_now`)  | Automated | Medium   |
| 5 | Activity widget (`#dashboard_activity`)      | Automated | Medium   |
| 6 | Quick Draft – save draft post                | Automated | Medium   |
| 7 | Quick Draft – save button is `#save-post`    | Automated | Medium   |
| 8 | WordPress Events widget (`#dashboard_primary`)| Automated | Low      |
| 9 | Quiz Maker widget (`#quiz-maker`)            | Automated | Low      |
| 10 | Site Health widget (`#dashboard_site_health`)| Automated | Low      |
| 11 | Sidebar Comments link (badge count)          | Automated | Low      |

---

### 4.3 Post Creation & Editing

**Specs:** `tests/admin/createPost.spec.ts`, `tests/admin/editPost.spec.ts`

| # | Test Case                                      | Type      | Priority |
|---|------------------------------------------------|-----------|----------|
| 1 | Create and publish a new WordPress post        | Automated | Critical |
| 2 | Posts list loads with correct heading          | Automated | High     |
| 3 | Posts list contains entries                    | Automated | High     |
| 4 | Edit a post title and update successfully      | Automated | High     |
| 5 | Published post appears in list with correct status | Automated | Medium |
| 6 | Move a post to trash                           | Automated | Medium   |

---

### 4.4 Page Creation & Editing

**Specs:** `tests/admin/createPage.spec.ts`, `tests/admin/editPage.spec.ts`

| # | Test Case                                      | Type      | Priority |
|---|------------------------------------------------|-----------|----------|
| 1 | Create and publish a new WordPress page        | Automated | Critical |
| 2 | Pages list loads with correct heading          | Automated | High     |
| 3 | Pages list contains published pages            | Automated | High     |
| 4 | Edit a page and update successfully            | Automated | High     |
| 5 | Trash a page                                   | Automated | Medium   |

---

### 4.5 Plugin Management

**Spec:** `tests/admin/pluginManagement.spec.ts`

| # | Test Case                              | Type      | Priority |
|---|----------------------------------------|-----------|----------|
| 1 | Plugins page loads correctly           | Automated | High     |
| 2 | Classic Widgets plugin – activate      | Automated | High     |
| 3 | Classic Widgets plugin – deactivate    | Automated | High     |
| 4 | Health Check plugin – install          | Automated | Medium   |
| 5 | Health Check plugin – delete           | Automated | Medium   |

---

### 4.6 Media Library

**Spec:** `tests/admin/mediaLibrary.spec.ts`
**POM:** `pages/admin/MediaLibraryPage.ts`

| # | Test Case                                        | Type      | Priority |
|---|--------------------------------------------------|-----------|----------|
| 1 | Media library page loads correctly               | Automated | High     |
| 2 | Media library contains existing media items      | Automated | Medium   |
| 3 | Add New Media page loads correctly               | Automated | Medium   |
| 4 | File upload input is present on Add New page     | Automated | Medium   |
| 5 | Upload a PNG file and verify it appears          | Automated | High     |

**Notes:**
- Upload test uses a unique `test-upload-{timestamp}.png` filename per run to avoid filesystem collisions
- Cleanup via REST API (`DELETE /wp-json/wp/v2/media/{id}?force=true`) runs in `afterEach`

---

### 4.7 Shortcodes in Posts

**Spec:** `tests/frontend/shortcodes.spec.ts`

Parameterised cases (`SHORTCODE_TEST_CASES` — 11 entries):

| # | Shortcode             | Validates                          | Priority |
|---|-----------------------|------------------------------------|----------|
| 1 | `[key_takeaways]`     | Title + items render; raw tag hidden | High   |
| 2 | `[cta_button]`        | Link text visible                  | High     |
| 3 | `[step_by_step]`      | All step titles visible            | High     |
| 4 | `[countdown]`         | Expired message shown              | Medium   |
| 5 | `[green_checkmarks]`  | All checklist items visible        | Medium   |
| 6 | `[pros_and_cons]`     | Pros and cons sections render      | Medium   |
| 7 | `[verdict]`           | Verdict heading + CTA + items      | Medium   |
| 8 | `[star_rating]`       | Rating label visible               | Medium   |
| 9 | `[highlighted_para]`  | Title + body text visible          | Medium   |
| 10 | Combined shortcodes  | All sections render in one post    | High     |

---

### 4.8 Shortcodes in Pages

**Spec:** `tests/frontend/shortcodesInPages.spec.ts`

Same shortcode coverage as 4.7 but targeting WordPress **pages** (`page_id=\d+` URL pattern), plus:

| # | Test Case                                         | Priority |
|---|---------------------------------------------------|----------|
| 1 | Key Takeaways – h3 heading type                   | High     |
| 2 | Key Takeaways – default (no heading type)         | High     |
| 3 | Key Takeaways – h2 heading + 5 items              | High     |
| 4 | Multiple `[key_takeaways]` blocks on one page (≥3 sections) | High |
| 5 | Malformed shortcode – no 500 error, page loads    | High     |
| 6 | Missing shortcode parameters – degrades gracefully | Medium  |
| 7 | Key Takeaways on mobile (iPhone 12, 390×844)      | Medium   |

---

### 4.9 Homepage Sections Regression

**Spec:** `tests/regression/homepageSections.spec.ts`
**POM:** `pages/regression/HomePageSectionsPage.ts`

| # | Test Case                                    | Priority |
|---|----------------------------------------------|----------|
| 1 | Featured Articles – 3 cards with image/title | High     |
| 2 | Top Stories – label + 5 items visible        | High     |
| 3 | Crash Course – heading, name/email/submit    | Medium   |
| 4 | Bitcoin Guides – heading + 4 cards           | Medium   |
| 5 | News – all 3 columns + View All News         | High     |
| 6 | Editor's Picks – 4 tabs, default active      | Medium   |
| 7 | Trust Section – heading + stats + "Featured in:" | Medium |

---

### 4.10 Homepage Editor's Picks

**Spec:** `tests/regression/homepageEditorsPicks.spec.ts`

| # | Test Case                                    | Priority |
|---|----------------------------------------------|----------|
| 1 | Section heading is visible                   | Medium   |
| 2 | All 4 tab buttons visible                    | Medium   |
| 3 | Top Articles is default active tab           | Medium   |
| 4 | Clicking Guides tab activates it             | Medium   |
| 5 | Clicking Comparisons tab activates it        | Medium   |
| 6 | Clicking Reviews tab activates it            | Medium   |
| 7 | Active tab displays article cards            | Medium   |

---

### 4.11 Header Section Regression

**Spec:** `tests/regression/headerSection.spec.ts`
**POM:** `pages/regression/HeaderSectionPage.ts`
**Data:** `data/languages.ts` (de, fr, es, it, br, jp, ar, ru)

| # | Test Case                                    | Priority |
|---|----------------------------------------------|----------|
| 1 | Header renders on desktop                    | High     |
| 2 | Logo navigates to homepage                   | High     |
| 3 | Search returns results for "bitcoin"         | High     |
| 4 | Search with no results shows message         | Medium   |
| 5 | Best Wallet button visible + correct href    | Medium   |
| 6 | Nav menu and submenu work                    | High     |
| 7 | Language selector icon visible               | Medium   |
| 8 | Language dropdown contains all languages     | Medium   |
| 9–14 | Language switching (de, fr, es, jp, ar, ru) | High    |
| 15 | Switch back to English                       | Medium   |
| 16 | Language persists in URL                     | Medium   |
| 17 | Logo click from translated page              | Medium   |
| 18 | Header structure in German                   | Low      |
| 19 | Parameterized language switching (5 langs)   | Medium   |

---

### 4.12 Navigation Regression

**Spec:** `tests/regression/navigation.spec.ts`

| # | Test Case                                    | Priority |
|---|----------------------------------------------|----------|
| 1 | Primary navigation is visible                | High     |
| 2 | Bitcoin Casinos link is in the nav           | High     |
| 3 | Clicking a nav link navigates correctly      | High     |
| 4 | Article page shows breadcrumb                | Medium   |
| 5 | Homepage links open same-domain pages        | Medium   |

---

### 4.13 Crypto Presales Toplist

**Spec:** `tests/regression/presalesToplist.spec.ts`
**POM:** `pages/frontend/PresalesToplistPage.ts`

| # | Test Case                                        | Priority |
|---|--------------------------------------------------|----------|
| 1 | Crypto Presales nav item visible                 | High     |
| 2 | Hovering reveals all 6 submenu links             | High     |
| 3–8 | Clicking each submenu link navigates correctly | High     |
| 9–14 | Crypto Presales page: H1, toplist, offers, CTA, title | High |
| 15–20 | Next 1000x Crypto: same 6 checks            | High     |
| 21–26 | Best Crypto to Buy: same 6 checks           | High     |
| 27–32 | Best Solana Meme Coins: same 6 checks       | High     |
| 33–38 | Best Meme Coin ICOs: same 6 checks          | High     |
| 39–44 | Next Crypto to Hit $1: same 6 checks        | High     |

**Total: 44 automated tests** (8 navigation + 36 per-page)

---

### 4.14 Article Page Regression

**Spec:** `tests/regression/articlePage.spec.ts`

| # | Test Case                              | Priority |
|---|----------------------------------------|----------|
| 1 | Article page has main content area     | High     |
| 2 | Article page has H1 title              | High     |
| 3 | Article page has author information    | Medium   |
| 4 | Article page has readable content      | High     |
| 5 | Trust section is visible on article    | Medium   |

---

### 4.15 Category Page Regression

**Spec:** `tests/regression/categoryPage.spec.ts`

| # | Test Case                              | Priority |
|---|----------------------------------------|----------|
| 1 | Category page loads with main content  | High     |
| 2 | Category page has a heading            | High     |
| 3 | Category page shows article cards      | High     |
| 4 | Article cards are links with href      | High     |
| 5 | Each card link has a valid href        | Medium   |

---

### 4.16 Mobile Navigation

**Spec:** `tests/regression/mobileNav.spec.ts`

| # | Test Case                                | Priority |
|---|------------------------------------------|----------|
| 1 | Header visible on mobile viewport        | High     |
| 2 | Logo visible on mobile viewport          | High     |
| 3 | Hamburger menu button visible on mobile  | High     |
| 4 | Site title present on mobile             | Medium   |

---

### 4.17 Search Results Regression

**Spec:** `tests/regression/searchResults.spec.ts`

| # | Test Case                                  | Priority |
|---|--------------------------------------------|----------|
| 1 | Search returns results for "bitcoin"       | High     |
| 2 | Search results page has a content area     | High     |
| 3 | Search with no results shows message       | Medium   |
| 4 | Search results contain article cards       | High     |

---

### 4.18 Footer Regression

**Spec:** `tests/regression/footer.spec.ts`

| # | Test Case                                  | Priority |
|---|--------------------------------------------|----------|
| 1 | Footer is visible on homepage              | High     |
| 2 | Footer contains 99Bitcoins logo link       | Medium   |
| 3 | Footer contains navigation links           | Medium   |
| 4 | Footer links all have href attributes      | Medium   |
| 5 | Footer copyright text is visible           | Low      |

---

### 4.19 Utility Bar

**Spec:** `tests/regression/utilityBar.spec.ts`

| # | Test Case                                  | Priority |
|---|--------------------------------------------|----------|
| 1 | Utility bar section is visible             | Medium   |
| 2 | Follow Us social links are present         | Medium   |
| 3 | YouTube link is present in utility bar     | Medium   |
| 4 | Newsletter section is visible              | Medium   |

---

### 4.20 Visual Regression

**Spec:** `tests/regression/visualRegression.spec.ts`
**Baselines:** `tests/regression/visualRegression.spec.ts-snapshots/`

| # | Snapshot | Covers | Priority |
|---|----------|--------|----------|
| 1 | `homepage-full` | Full homepage (desktop) | High |
| 2 | `homepage-header` | `.btc-header` component | High |
| 3 | `homepage-footer` | `footer` component | Medium |
| 4 | `category-bitcoin-full` | Bitcoin category archive | High |
| 5 | `presales-toplist-full` | Crypto Presales full page | High |
| 6 | `presales-toplist-widget` | `.cbm-presale-toplist__wrapper` | High |
| 7 | `best-crypto-to-buy-full` | Best Crypto to Buy full page | High |
| 8 | `article-page-full` | Random article (via homepage link) | Medium |
| 9 | `search-results-bitcoin-full` | Search results page | Medium |
| 10 | `404-full` | 404 error page | Low |
| 11 | `homepage-mobile-full` | Full homepage at 375×812 | High |
| 12 | `homepage-mobile-header` | Header at 375×812 | High |

**To regenerate baselines after an intentional UI change:**
```bash
npx playwright test tests/regression/visualRegression.spec.ts --update-snapshots --project=chromium
```

**Masking strategy:** Live prices, percentage changes, dates, ads, iframes, presale countdown timers, and raised amounts are all masked to prevent false positives.

---

### 4.21 REST API

**Spec:** `tests/api/posts.api.spec.ts`

| # | Test Case                                         | Type      | Priority |
|---|---------------------------------------------------|-----------|----------|
| 1 | Session is valid and user is an administrator     | Automated | Critical |
| 2 | GET /posts returns published posts with fields    | Automated | High     |
| 3 | GET /posts/:id returns correct post               | Automated | High     |
| 4 | POST /posts creates a post; DELETE removes it     | Automated | High     |
| 5 | Key Takeaways shortcode via API renders in browser | Automated | High    |
| 6 | Green checkmarks shortcode via API renders         | Automated | Medium  |
| 7 | Pros and Cons shortcode via API renders            | Automated | Medium  |
| 8 | GET /pages returns published pages                | Automated | High     |
| 9 | Key Takeaways shortcode in a page via API         | Automated | High     |
| 10 | GET /plugins returns list with status             | Automated | Medium  |
| 11 | At least one plugin is active                     | Automated | Medium  |

---

### 4.22 Quiz Maker (Admin)

**Specs:** `tests/admin/quizMaker/`

| # | Spec | Tests | Priority |
|---|------|-------|----------|
| 1 | `dashboardWidget.spec.ts` | Widget visible, stats display, sidebar item | Medium |
| 2 | `generalSettings.spec.ts` | Page load, tabs, save | Medium |
| 3 | `questions.spec.ts` | List, create, filter | Medium |
| 4 | `quizCategories.spec.ts` | List, filters, create | Medium |
| 5 | `quizzes.spec.ts` | List, create, edit, delete, search, filter | Medium |
| 6 | `results.spec.ts` | Page load, tabs, sidebar badge | Low |

---

## 5. Test Data & Environment

### Accounts

| Role  | Username / Email           | Source              |
|-------|----------------------------|---------------------|
| Admin | `process.env.WP_USERNAME`  | `.env` / CI secrets |
| Admin | `process.env.WP_PASSWORD`  | `.env` / CI secrets |

Sessions are cached in `.auth/` (24-hour expiry). Delete `.auth/` to force re-authentication.

### Environments to Test

| Phase       | URL                                | Notes                         |
|-------------|-------------------------------------|-------------------------------|
| Primary     | https://staging.99bitcoins.com      | Full suite                    |
| Sanity check| https://99bitcoins.com (production) | Smoke tests only post-deploy  |

### Browser / Device Matrix

| Browser / Device    | Viewport      | How Covered              |
|---------------------|---------------|--------------------------|
| Chromium (default)  | 1280×720      | All specs (primary)      |
| Firefox             | 1280×720      | Automated (all specs)    |
| WebKit (Safari)     | 1280×720      | Automated (all specs)    |
| Mobile (375×812)    | 375×812       | `mobileNav.spec.ts`, `visualRegression.spec.ts` |
| iPhone 12 emulation | 390×844       | `shortcodesInPages.spec.ts` |

---

## 6. Execution Log

### 6.1 Automated Run Summary

Run with:
```bash
npx playwright test
npx playwright test --reporter=html   # generate HTML report
```

| Spec File                                      | Tests | Passed | Failed | Skipped | Notes |
|------------------------------------------------|-------|--------|--------|---------|-------|
| admin/auth.spec.ts                             |       |        |        |         |       |
| admin/login.spec.ts                            |       |        |        |         |       |
| admin/dashboard.spec.ts                        |       |        |        |         |       |
| admin/createPost.spec.ts                       |       |        |        |         |       |
| admin/editPost.spec.ts                         |       |        |        |         |       |
| admin/createPage.spec.ts                       |       |        |        |         |       |
| admin/editPage.spec.ts                         |       |        |        |         |       |
| admin/pluginManagement.spec.ts                 |       |        |        |         |       |
| admin/mediaLibrary.spec.ts                     |       |        |        |         |       |
| admin/categories.spec.ts                       |       |        |        |         |       |
| admin/siteSettings.spec.ts                     |       |        |        |         |       |
| admin/quizMaker/dashboardWidget.spec.ts        |       |        |        |         |       |
| admin/quizMaker/generalSettings.spec.ts        |       |        |        |         |       |
| admin/quizMaker/questions.spec.ts              |       |        |        |         |       |
| admin/quizMaker/quizCategories.spec.ts         |       |        |        |         |       |
| admin/quizMaker/quizzes.spec.ts                |       |        |        |         |       |
| admin/quizMaker/results.spec.ts                |       |        |        |         |       |
| frontend/shortcodes.spec.ts                    |       |        |        |         |       |
| frontend/shortcodesInPages.spec.ts             |       |        |        |         |       |
| frontend/404.spec.ts                           |       |        |        |         |       |
| frontend/quizRendering.spec.ts                 |       |        |        |         |       |
| api/posts.api.spec.ts                          |       |        |        |         |       |
| regression/homepageSections.spec.ts            |       |        |        |         |       |
| regression/homepageEditorsPicks.spec.ts        |       |        |        |         |       |
| regression/headerSection.spec.ts               |       |        |        |         |       |
| regression/navigation.spec.ts                  |       |        |        |         |       |
| regression/footer.spec.ts                      |       |        |        |         |       |
| regression/utilityBar.spec.ts                  |       |        |        |         |       |
| regression/articlePage.spec.ts                 |       |        |        |         |       |
| regression/categoryPage.spec.ts                |       |        |        |         |       |
| regression/mobileNav.spec.ts                   |       |        |        |         |       |
| regression/searchResults.spec.ts               |       |        |        |         |       |
| regression/presalesToplist.spec.ts             |       |        |        |         |       |
| regression/visualRegression.spec.ts            |       |        |        |         |       |
| **Total**                                      | **297** |      |        |         |       |

### 6.2 Manual Test Log

| Test Case                       | Executed by      | Status       | Notes |
|---------------------------------|------------------|--------------|-------|
| Login – invalid credentials     | Vladimir Simsic  | Pass / Fail  |       |
| Firefox cross-browser check     | Vladimir Simsic  | Pass / Fail  |       |
| Safari cross-browser check      | Vladimir Simsic  | Pass / Fail  |       |
| Production sanity check         | Vladimir Simsic  | Pass / Fail  |       |

### 6.3 Defect Reports

| ID     | Summary                        | Severity | Status | Spec / Area              |
|--------|--------------------------------|----------|--------|--------------------------|
| RG-001 |                                |          | Open   |                          |
| RG-002 |                                |          | Open   |                          |

---

## 7. Exit Criteria

### Mandatory Before Deploy

- [ ] All 297 automated tests pass (`0 failures`) across all 3 browsers
- [ ] All **Critical** and **High** priority test cases executed
- [ ] All Critical defects resolved and retested
- [ ] All High defects resolved or mitigated with stakeholder sign-off
- [ ] Playwright HTML report reviewed and attached
- [ ] No PHP fatal/parse errors surfaced during shortcode tests
- [ ] Mobile shortcode rendering verified (iPhone 12)
- [ ] Visual regression baselines confirmed or updated if intentional UI changes were made

### Approve Deployment

| Role          | Name             | Sign-off |
|---------------|------------------|----------|
| QA            | Vladimir Simsic  | ⬜       |
| Dev Lead      | [Name]           | ⬜       |
| Product Owner | [Name]           | ⬜       |
