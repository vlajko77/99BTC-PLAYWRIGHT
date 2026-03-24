import { test, expect } from "../../fixtures/test.fixture";
import { FooterPage } from "../../pages/frontend/FooterPage";
import { STAGING_URL } from "../../utils/login";

test.describe("Footer", () => {
  let footerPage: FooterPage;

  test.beforeEach(async ({ page }) => {
    footerPage = new FooterPage(page);
    await page.goto(STAGING_URL);
    await footerPage.scrollToFooter();
  });

  test("footer is visible on homepage", { tag: "@smoke" }, async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test("footer contains 99Bitcoins logo link", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const logoLink = footer.getByRole("link", { name: /99Bitcoins/i }).first();
    await expect(logoLink).toBeVisible();
  });

  test("footer contains navigation links", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const links = footer.getByRole("link");
    const count = await links.count();
    expect(count).toBeGreaterThan(3);
  });

  test("footer links are not broken (all have href)", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const links = footer.getByRole("link");
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).not.toBeNull();
      expect(href).not.toBe("");
    }
  });

  test("footer copyright text is visible", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const copyrightText = await footer.textContent();
    expect(copyrightText).toMatch(/99Bitcoins|\d{4}/);
  });

  test.describe("Newsletter", () => {
    test.beforeEach(async ({ footerPage }) => {
      await footerPage.scrollToFooter();
    });

    test("newsletter heading is visible", async ({ footerPage }) => {
      await expect(footerPage.newsletterSection).toBeVisible();
    });

    test("email input is present", async ({ footerPage }) => {
      await expect(footerPage.newsletterEmailInput).toBeVisible();
    });

    test("subscribe button is present", async ({ footerPage }) => {
      await expect(footerPage.newsletterSubmitButton).toBeVisible();
    });

    test('"Sign up for bitcoin crash course" checkbox is present', async ({
      footerPage,
    }) => {
      await expect(footerPage.newsletterCrashCourseCheckbox).toBeVisible();
    });

    test("email input accepts a valid email address", async ({ footerPage }) => {
      await footerPage.newsletterEmailInput.fill("test@example.com");
      await expect(footerPage.newsletterEmailInput).toHaveValue(
        "test@example.com",
      );
    });

    test("crash course checkbox is unchecked by default", async ({
      footerPage,
    }) => {
      await expect(footerPage.newsletterCrashCourseCheckbox).not.toBeChecked();
    });

    test("crash course checkbox can be checked", async ({ footerPage }) => {
      await footerPage.newsletterCrashCourseCheckbox.click({ force: true });
      await expect(footerPage.newsletterCrashCourseCheckbox).toBeChecked();
    });
  });
});
