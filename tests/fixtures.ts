import { test as base } from '@playwright/test';

// Extend the base test with custom fixtures and hooks
export const test = base.extend({
  // Add a custom fixture that runs for each test
  page: async ({ page }, use) => {
    // beforeEach hook: runs before each test
    console.log(`🎬 Starting test: ${test.info().title}`);
    
    // Make the page available to the test
    await use(page);
    
    // afterEach hook: runs after each test
    console.log(`✓ Completed test: ${test.info().title}`);
    
    // Take screenshot on failure
    // if (test.info().status !== test.info().expectedStatus) {
    //   const screenshotPath = test.info().outputPath(`failure-${Date.now()}.png`);
    //   await page.screenshot({ path: screenshotPath, fullPage: true });
    //   console.log(`📸 Screenshot saved: ${screenshotPath}`);
    // }
  },
});

export { expect } from '@playwright/test';
