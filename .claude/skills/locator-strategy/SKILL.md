---
name: locator-strategy
description: Create stable Playwright locators for 99Bitcoins WordPress automation
---

# Locator Strategy

## Priority order

1. `getByTestId('data-testid')` — most stable, preferred when available
2. `getByRole('button', { name: 'Submit' })` — semantic and accessible
3. `getByLabel('Email address')` — for form inputs
4. `page.locator('#specific-id')` — acceptable for WordPress widget/element IDs
5. `page.locator('[data-slug="plugin-name"]')` — for WordPress plugin rows

## Avoid

- XPath expressions
- `nth-child` / `nth-of-type` selectors
- Long nested CSS chains (e.g., `.wrap > div > ul > li:first-child a`)
- Text-based selectors for dynamic content

## WordPress-specific patterns

```ts
// Dashboard widgets
page.locator("#dashboard_right_now")
page.locator("#dashboard_activity")
page.locator("#dashboard_quick_press")
page.locator("#quiz-maker")

// Admin sidebar navigation
page.getByRole("link", { name: "Pages" })
page.getByRole("link", { name: "Posts" })

// Plugin table rows
page.locator('tr[data-slug="plugin-name"]')

// WP Editor
page.getByRole("textbox", { name: "Add title" })
page.locator("#content")  // Classic editor content area
```

## Handling dynamic text (e.g., badge counts)

Use partial matching instead of exact text:
```ts
// BAD: exact match fails with badge count in text
page.getByRole("link", { name: "Comments" })

// GOOD: filter with hasText for partial match
page.locator("#adminmenu").getByText("Comments", { exact: false })
```
