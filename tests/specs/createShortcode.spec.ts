import { test, expect, devices } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { ShortcodePage } from "../pages/CreateShortcodePage";
import { WP_USERNAME, WP_PASSWORD } from "../helpers/login";
import { renderKeyTakeaways } from "../helpers/shortcode";

// Run tests using mobile device emulation (iPhone 12)
test.use({ ...devices["iPhone 12"] });

test.describe("WordPress shortcode page creation", () => {
  let loginPage: LoginPage;
  let shortcodePage: ShortcodePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    shortcodePage = new ShortcodePage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Add a new page with key_takeaways shortcode and verify it is visible", async ({
    page,
  }) => {
    await shortcodePage.gotoNewPage();

    await expect(page).toHaveURL(/post-new\.php\?post_type=page/);

    // Verify mobile viewport is active
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(500);

    const randomTitle = "Shortcode Page " + Date.now();
    const data = {
      title: "Key Takeaways",
      items: [
        "First important point about the topic.",
        "Second important point to remember.",
        "Third key takeaway for readers.",
      ],
    };

    const shortcode = renderKeyTakeaways(data);

    await shortcodePage.fillShortcodeDetails(randomTitle, shortcode);
    await shortcodePage.publishPage();

    const permalink = await shortcodePage.getPermalink();
    expect(permalink).toBeTruthy();
    await shortcodePage.openPermalink(permalink!);

    // Verify URL is the published page
    await expect(page).toHaveURL(/shortcode-page|page_id=/i);

    // Verify shortcode title is visible
    await shortcodePage.expectContentVisible(data.title);

    // Verify all shortcode items are visible
    for (const item of data.items) {
      await shortcodePage.expectContentVisible(item);
    }
  });
});
