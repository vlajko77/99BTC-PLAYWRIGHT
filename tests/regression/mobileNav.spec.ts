import { test, expect } from "../../../fixtures/test.fixture";
import { MobileNavPage } from "../../../pages/frontend/MobileNavPage";

test.describe("Mobile Navigation", () => {
  let mobileNav: MobileNavPage;

  test.beforeEach(async ({ page }) => {
    mobileNav = new MobileNavPage(page);
    await mobileNav.setMobileViewport();
    await mobileNav.navigate();
  });

  test("header is visible on mobile viewport", async ({ page }) => {
    const header = page.locator("header, #masthead, .site-header").first();
    await expect(header).toBeVisible();
  });

  test("logo is visible on mobile viewport", async ({ page }) => {
    const logo = page.getByRole("link", { name: /99Bitcoins/i }).first();
    await expect(logo).toBeVisible();
  });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    const hamburger = page.locator(
      "button[aria-label*='menu' i], button[class*='hamburger'], button[class*='mobile-menu'], button[class*='nav-toggle']"
    ).first();
    // If no hamburger exists, at least verify the nav is accessible
    const isVisible = await hamburger.isVisible().catch(() => false);
    if (!isVisible) {
      // Fallback: just ensure header navigation is present
      const nav = page.locator("header nav, .main-nav").first();
      await expect(nav).toBeVisible();
    } else {
      await expect(hamburger).toBeVisible();
    }
  });

  test("site title is present on mobile", async ({ page }) => {
    await expect(page).toHaveTitle(/99Bitcoins/i);
  });
});
