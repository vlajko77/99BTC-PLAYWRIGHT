---
name: page-objects
description: Implement Page Object Model pattern for 99Bitcoins WordPress automation
---

# Page Object Rules

Page objects must:
- Extend `BasePage` from `pages/BasePage.ts`
- Contain all selectors as `Locator` properties
- Contain all UI interaction logic as methods
- Expose clean, reusable methods to tests
- NOT contain assertions (leave those to test specs)

## File location

All page objects go in `pages/`. Regression-specific pages go in `pages/regression/`.

## Example

```ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Dashboard" });
  }

  async navigateToDashboard() {
    await this.goto("/wp-admin/");
  }

  async verifyDashboardLoaded() {
    await this.heading.waitFor({ state: "visible" });
  }
}
```

## WordPress-specific locator patterns

- Prefer `#widget-id` for dashboard widget containers
- Use `getByRole()` for navigation links
- Use `getByLabel()` for form inputs
