---
name: components
description: Implement reusable UI components in Playwright automation for 99Bitcoins
---

# Component Pattern

Components represent reusable UI elements that appear on multiple pages:
NavBar, AdminBar, SidebarMenu, Modal, Table, Pagination

## Location

`pages/components/`

## Rule

Page objects should compose components instead of duplicating selectors.

## Example

```ts
// pages/components/AdminBarComponent.ts
import { Page, Locator } from "@playwright/test";

export class AdminBarComponent {
  readonly siteNameLink: Locator;
  readonly newPostLink: Locator;

  constructor(private page: Page) {
    this.siteNameLink = page.locator("#wp-admin-bar-site-name");
    this.newPostLink = page.locator("#wp-admin-bar-new-post");
  }

  async visitSite() {
    await this.siteNameLink.hover();
    await this.page.getByRole("link", { name: "Visit Site" }).click();
  }
}
```

```ts
// pages/DashboardPage.ts
import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { AdminBarComponent } from "./components/AdminBarComponent";

export class DashboardPage extends BasePage {
  readonly adminBar: AdminBarComponent;

  constructor(page: Page) {
    super(page);
    this.adminBar = new AdminBarComponent(page);
  }
}
```

```ts
// Usage in test
test("visit site from admin bar", async ({ page }) => {
  await dashboardPage.adminBar.visitSite();
});
```
