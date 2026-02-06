import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WordPressPageEditor } from '../pages/CreatePage';
import { WP_USERNAME, WP_PASSWORD } from '../helpers/login';

test.describe('Shortcode error handling in WordPress', () => {
  let loginPage: LoginPage;
  let pageEditor: WordPressPageEditor;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pageEditor = new WordPressPageEditor(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test('Page with malformed shortcode handles errors gracefully', async ({ page }) => {
    await pageEditor.gotoNewPage();

    // Verify we're on the new page editor
    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    const randomTitle = 'Malformed Shortcode Page ' + Date.now();

    // Malformed shortcodes - various error scenarios
    const malformedContent = `
<p>Valid content at the start of the page.</p>

[key_takeaways]
Missing title attribute
[/key_takeaways]

<p>Valid content at the end of the page.</p>

[nonexistent_shortcode_xyz]
This shortcode does not exist
[/nonexistent_shortcode_xyz]
    `.trim();

    // Fill page details with malformed shortcodes
    await pageEditor.fillPageDetails(randomTitle, malformedContent);

    // Publish the page
    await pageEditor.publishPage();

    // Get permalink and navigate to published page
    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await pageEditor.openPermalink(permalink!);

    // Verify page loads without crashing (no HTTP 500 error)
    await page.waitForLoadState('domcontentloaded');

    // Check page loaded successfully (not a server error page)
    const title = await page.title();
    expect(title).not.toMatch(/500|503|502|Internal Server Error/i);

    // Verify page title is visible (page rendered successfully)
    await pageEditor.expectContentVisible(randomTitle);

    // Verify valid content still displays correctly
    await pageEditor.expectContentVisible('Valid content at the start');
    await pageEditor.expectContentVisible('Valid content at the end');

    // Verify no PHP fatal errors are displayed on the page body
    const bodyText = await page.locator('body').textContent() || '';
    expect(bodyText).not.toMatch(/Fatal error:/i);
    expect(bodyText).not.toMatch(/Parse error:/i);
  });

  test('Page with missing shortcode parameters degrades gracefully', async ({ page }) => {
    await pageEditor.gotoNewPage();

    const randomTitle = 'Missing Params Page ' + Date.now();

    // Shortcode with missing required items
    const content = `
<p>Introduction paragraph with valid content.</p>

[key_takeaways title="Topics Without Items"]
  [key_takeaways_list]
  [/key_takeaways_list]
[/key_takeaways]

<p>Conclusion paragraph with valid content.</p>
    `.trim();

    await pageEditor.fillPageDetails(randomTitle, content);
    await pageEditor.publishPage();

    const permalink = await pageEditor.getPermalink();
    expect(permalink).toBeTruthy();
    await pageEditor.openPermalink(permalink!);

    // Verify page loads successfully
    await expect(page).not.toHaveURL(/error|500/i);

    // Verify surrounding content is still visible
    await pageEditor.expectContentVisible('Introduction paragraph with valid content');
    await pageEditor.expectContentVisible('Conclusion paragraph with valid content');

    // Verify no PHP errors are displayed
    const errorIndicators = page.locator('text=/error|exception|warning/i').first();
    const hasVisibleError = await errorIndicators.isVisible().catch(() => false);

    // If there's text with "error", make sure it's not a PHP error
    if (hasVisibleError) {
      const errorText = await errorIndicators.textContent();
      expect(errorText?.toLowerCase()).not.toContain('php');
      expect(errorText?.toLowerCase()).not.toContain('fatal');
      expect(errorText?.toLowerCase()).not.toContain('parse');
    }
  });
});
