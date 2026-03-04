import { test, expect } from "@playwright/test";
import { HeaderSectionPage } from "../../pages/regression/HeaderSectionPage";
import { STAGING_URL } from "../../helpers/login";

test.describe("Header", () => {
  let header: HeaderSectionPage;

  test.beforeEach(async ({ page }) => {
    header = new HeaderSectionPage(page);
    await header.goto(STAGING_URL);
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

  test.describe("Logo", () => {
    test("clicking logo navigates to home and shows site title", async ({
      page,
    }) => {
      const logo = page.getByRole("link", { name: "99Bitcoins", exact: true });
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("href", /^(\/|https?:\/\/[^/]+\/?$)/);
      await logo.click();
      await expect(page).toHaveURL(/99bitcoins\.(com|local)\/?$/);
      await expect(page).toHaveTitle(/99Bitcoins/i);
      await expect(
        page.getByRole("heading", { name: /99Bitcoins/i }).first(),
      ).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("search returns results for bitcoin", async ({ page }) => {
      await expect(header.searchIcon).toBeVisible();
      await header.search("bitcoin");

      await expect(page).toHaveURL(/[?&]s=bitcoin/i);
      await expect(page.getByText(/You searched for bitcoin/i)).toBeVisible();
      await expect(page.locator("main, #content, .content")).toBeVisible();
    });

    test("search with no results shows appropriate message", async ({
      page,
    }) => {
      await header.search("xyznonexistent123");

      await expect(page).toHaveURL(/[?&]s=xyznonexistent123/i);
      await expect(
        page.getByText(/no results|nothing found|not found/i),
      ).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("verify header section elements are visible", async () => {
      await header.verifyHeaderElements();
    });

    test("verify navigation menu opens submenu on hover", async () => {
      await header.openBitcoinCasinosMenu();
      await expect(header.bitcoinSubMenuLink).toBeVisible();
    });

    test("verify submenu navigation works correctly", async ({ page }) => {
      await header.openBitcoinCasinosMenu();
      await header.clickBitcoinHistoricalPrice();
      await expect(page).toHaveURL(/historical-price/i);
      await expect(
        page.getByRole("heading", { name: "Bitcoin Historical Price &" }),
      ).toBeVisible();
    });
  });
});
