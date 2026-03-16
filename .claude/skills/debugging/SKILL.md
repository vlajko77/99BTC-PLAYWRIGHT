---
name: debugging
description: Debug failing Playwright tests in the 99Bitcoins automation project
---

# Debugging Playbook

## Common failure patterns

### Authentication failures
- Check if `.auth/` session file is expired (>24 hours)
- Delete session file and let `loginWithSession()` create a new one
- Verify `WP_USERNAME` / `WP_PASSWORD` env vars are set correctly

### Selector not found
- Take a screenshot to see the current page state
- Check if the page is still loading (use `waitFor` instead of immediate assertion)
- WordPress dashboard widgets can take time to load — add `waitFor: 'visible'`
- Verify the locator strategy (see locator-strategy skill)

### Flaky tests
- Never use `page.waitForTimeout()` — replace with proper conditions
- Use `waitFor({ state: 'visible' })` for elements
- Use `waitForLoadState('networkidle')` after navigation

## Useful debugging commands

```bash
# Run a single test file
npx playwright test tests/specs/dashboard.spec.ts

# Run with headed browser (visible)
npx playwright test --headed

# Run with Playwright Inspector
npx playwright test --debug

# Generate HTML report
npx playwright show-report
```

## Screenshot on failure

All specs should have this `afterEach` block:

```ts
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  }
});
```

## WordPress-specific debugging

- WordPress admin redirects to login when session expires — check for `/wp-login.php` in the URL
- HTTPS errors on `.local` domains are expected — `ignoreHTTPSErrors: true` is set in config
- Plugin management tests may affect other tests if plugin state is not restored
