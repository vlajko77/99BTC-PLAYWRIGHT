---
name: test-data
description: Managing test data in 99Bitcoins Playwright automation
---

# Test Data Guidelines

## Static data → `data/`

Credentials, URLs, and fixed configuration:

```ts
// data/users.ts
export const adminUser = {
  username: process.env.WP_USERNAME || "admin@example.com",
  password: process.env.WP_PASSWORD || "password",
};

export const urls = {
  local: "https://99bitcoins.local",
  staging: "https://staging.99bitcoins.com",
};
```

## Dynamic data → generate inline

Use `Date.now()` or timestamps for unique test content:

```ts
const title = `Test Page ${Date.now()}`;
const content = `Draft content created at ${new Date().toISOString()}`;
```

## Shortcode helpers → `utils/shortcode.ts`

```ts
import { renderKeyTakeaways } from "../../utils/shortcode";

const shortcode = renderKeyTakeaways({
  title: "Key Takeaways",
  items: ["First point", "Second point"],
});
```

## Rules

- Never hardcode credentials directly in test specs
- Import from `data/` for static values
- Import from `utils/` for helper functions
- Use environment variables for sensitive data (`process.env.WP_USERNAME`)
