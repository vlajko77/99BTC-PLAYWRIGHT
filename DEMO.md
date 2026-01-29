# Demo instructions for stakeholders

This demo shows a simple, safe Playwright test that stakeholders can run locally to see the test runner, a browser session (headed), and a Playwright report.

What the demo does
- Opens https://example.com
- Verifies the main heading contains "Example Domain"
- Saves a screenshot into `playwright-report/demo-screenshot.png`

Run the demo (headed)

```bash
# install dependencies if you haven't already
npm install
npx playwright install

# run the demo in headed mode so stakeholders can watch
npm run demo:headed
```

Run the demo (headless)

```bash
npm run demo
```

Open the Playwright HTML report

```bash
# after a demo run, open the report in your browser
npm run demo:open-report
```

Notes for stakeholders
- This demo intentionally uses a public, stable site (`example.com`) so it never requires credentials or staging access.
- For a project-specific demo (staging workflows, WP admin flows, or custom pages) we can either:
  - Capture `auth/storageState.json` using `node scripts/saveStorageState.mjs` and then run the real tests, or
  - Provide a recorded video/gif of the tests running against staging if interactive demo time is limited.


