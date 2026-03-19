# Release Regression Test Plan — 99Bitcoins WordPress

## 1. Overview

**Purpose:** Execute the full automated + manual regression suite against the 99Bitcoins WordPress site before deploying a new release. This plan validates that core site functionality has not regressed across authentication, content creation, shortcode rendering, plugin management, and multi-language header behavior.

**Scope:** All test suites covered by the Playwright E2E automation project plus any manual-only scenarios identified in `docs/manual-test-plan.md`. Minor cosmetic UI changes with no functional impact may be excluded based on risk assessment.

**Automation coverage:** `npx playwright test` executes 7 spec files across 9 feature areas. Mobile emulation (iPhone 12) is included for shortcode rendering tests.

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

**Spec:** `tests/specs/login.spec.ts`

| # | Test Case                          | Type       | Priority |
|---|------------------------------------|------------|----------|
| 1 | Login with valid credentials       | Automated  | Critical |
| 2 | Login with invalid credentials     | Manual     | High     |
| 3 | Session persistence across reloads | Automated  | High     |

---

### 4.2 Admin Dashboard

**Spec:** `tests/specs/dashboard.spec.ts`

| # | Test Case                                    | Type      | Priority |
|---|----------------------------------------------|-----------|----------|
| 1 | All dashboard widgets visible on load         | Automated | High     |
| 2 | At a Glance widget (`#dashboard_right_now`)  | Automated | Medium   |
| 3 | Activity widget (`#dashboard_activity`)      | Automated | Medium   |
| 4 | Quick Draft – save draft post                | Automated | Medium   |
| 5 | Quick Draft – save button is `#save-post`    | Automated | Medium   |
| 6 | WordPress Events widget (`#dashboard_primary`)| Automated | Low      |
| 7 | Quiz Maker widget (`#quiz-maker`)            | Automated | Low      |
| 8 | Site Health widget (`#dashboard_site_health`)| Automated | Low      |
| 9 | Sidebar Comments link (badge count)          | Automated | Low      |

---

### 4.3 Post Creation

**Spec:** `tests/specs/createPost.spec.ts`

| # | Test Case                               | Type      | Priority |
|---|-----------------------------------------|-----------|----------|
| 1 | Create and publish a new WordPress post | Automated | High     |

---

### 4.4 Page Creation

**Spec:** `tests/specs/createPage.spec.ts`

| # | Test Case                               | Type      | Priority |
|---|-----------------------------------------|-----------|----------|
| 1 | Create and publish a new WordPress page | Automated | High     |

---

### 4.5 Plugin Management

**Spec:** `tests/specs/pluginManagement.spec.ts`

| # | Test Case                              | Type      | Priority |
|---|----------------------------------------|-----------|----------|
| 1 | Classic Widgets plugin – activate      | Automated | High     |
| 2 | Classic Widgets plugin – deactivate    | Automated | High     |
| 3 | Health Check plugin – activate         | Automated | Medium   |
| 4 | Health Check plugin – deactivate       | Automated | Medium   |
| 5 | Plugin state persists after navigation | Automated | Medium   |

---

### 4.6 Shortcodes in Posts

**Spec:** `tests/specs/shortcodes.spec.ts`

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

### 4.7 Shortcodes in Pages

**Spec:** `tests/specs/shortcodesInPages.spec.ts`

Same shortcode coverage as 4.6 but targeting WordPress **pages** (`page_id=\d+` URL pattern), plus:

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

### 4.8 Homepage Sections Regression

**Spec:** `tests/specs/regression/homepageSections.spec.ts`
**POM:** `pages/regression/HomePageSectionsPage.ts`

| # | Test Case                              | Priority |
|---|----------------------------------------|----------|
| 1 | Hero section renders correctly         | High     |
| 2 | Featured sections visible              | High     |
| 3 | Content sections render                | Medium   |
| 4 | Footer elements present                | Medium   |

---

### 4.9 Header Section Regression

**Spec:** `tests/specs/regression/headerSection.spec.ts`
**POM:** `pages/regression/HeaderSectionPage.ts`
**Data:** `data/languages.ts` (de, fr, es, it, br)

| # | Test Case                                    | Priority |
|---|----------------------------------------------|----------|
| 1 | Header renders on desktop                    | High     |
| 2 | Language switcher – Deutsch (`/de/`)         | High     |
| 3 | Language switcher – Français (`/fr/`)        | High     |
| 4 | Language switcher – Español (`/es/`)         | High     |
| 5 | Language switcher – Italiano (`/it/`)        | High     |
| 6 | Language switcher – Português (`/br/`)       | High     |
| 7 | Navigation links – all resolve without 404   | High     |

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

| Browser / Device    | Viewport      | Covered by       |
|---------------------|---------------|------------------|
| Chromium (default)  | 1280×720      | All specs        |
| iPhone 12 emulation | 390×844       | `shortcodesInPages.spec.ts` |
| Firefox             | 1280×720      | Manual           |
| Safari (macOS)      | 1280×720      | Manual           |

---

## 6. Execution Log

### 6.1 Automated Run Summary

Run with:
```bash
npx playwright test
npx playwright test --reporter=html   # generate HTML report
```

| Spec File                          | Tests | Passed | Failed | Skipped | Notes |
|------------------------------------|-------|--------|--------|---------|-------|
| login.spec.ts                      |       |        |        |         |       |
| dashboard.spec.ts                  |       |        |        |         |       |
| createPost.spec.ts                 |       |        |        |         |       |
| createPage.spec.ts                 |       |        |        |         |       |
| pluginManagement.spec.ts           |       |        |        |         |       |
| shortcodes.spec.ts                 |       |        |        |         |       |
| shortcodesInPages.spec.ts          |       |        |        |         |       |
| regression/homepageSections.spec.ts|       |        |        |         |       |
| regression/headerSection.spec.ts   |       |        |        |         |       |
| **Total**                          |       |        |        |         |       |

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

- [ ] All automated tests pass (`0 failures`)
- [ ] All **Critical** and **High** priority test cases executed
- [ ] All Critical defects resolved and retested
- [ ] All High defects resolved or mitigated with stakeholder sign-off
- [ ] Playwright HTML report reviewed and attached
- [ ] No PHP fatal/parse errors surfaced during shortcode tests
- [ ] Mobile shortcode rendering verified (iPhone 12)

### Approve Deployment

| Role          | Name             | Sign-off |
|---------------|------------------|----------|
| QA            | Vladimir Simsic  | ⬜       |
| Dev Lead      | [Name]           | ⬜       |
| Product Owner | [Name]           | ⬜       |
